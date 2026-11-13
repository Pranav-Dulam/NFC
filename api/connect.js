// Vercel serverless function: POST /api/connect
// - type "connect": saves the recruiter to Notion + sends a phone push (ntfy)
// - type "tap":     optional heads-up push when someone picks a role (NOTIFY_TAPS=true)
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   NOTION_TOKEN        secret from your Notion integration
//   NOTION_DATABASE_ID  the "Recruiters Met" database id
//   NTFY_TOPIC          your private ntfy topic name (long + random)
//   NTFY_SERVER         optional, default https://ntfy.sh
//   NTFY_TOKEN          optional, only if your ntfy topic is protected
//   NOTIFY_TAPS         optional, "true" to get a push when someone starts the experience

const LIMITS = { name: 80, company: 100, linkedin: 200, email: 120, note: 500, lens: 40, event: 60, device: 20 };
// Trim, cap length, and turn control characters (newlines, tabs, …) into spaces
const clip = (v, n) => [...String(v ?? '')].map(c => (c.charCodeAt(0) < 32 ? ' ' : c)).join('').trim().slice(0, n);
const LINKEDIN_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)?linkedin\.com\/\S*$/i;

// Recruiters can type their LinkedIn name OR paste a URL.
// A name becomes a LinkedIn people-search link, so one tap finds them.
function linkedinLink(d) {
  if (LINKEDIN_URL_RE.test(d.linkedin)) {
    return /^https?:\/\//i.test(d.linkedin) ? d.linkedin : `https://${d.linkedin}`;
  }
  const keywords = (d.linkedin || `${d.name} ${d.company}`).trim();
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}`;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (body.website) return res.status(200).json({ ok: true });

  const d = {
    name: clip(body.name, LIMITS.name),
    company: clip(body.company, LIMITS.company),
    linkedin: clip(body.linkedin, LIMITS.linkedin),
    email: clip(body.email, LIMITS.email),
    note: clip(body.note, LIMITS.note),
    lens: clip(body.lens, LIMITS.lens).replace(/,/g, ' ') || 'Not sure yet',
    explored: Array.isArray(body.explored) ? body.explored.slice(0, 6).map(x => clip(x, LIMITS.lens).replace(/,/g, ' ')).filter(Boolean) : [],
    event: clip(body.event, LIMITS.event),
    device: clip(body.device, LIMITS.device),
    seconds: Math.max(0, Math.min(3600, parseInt(body.seconds, 10) || 0)),
  };

  // ---- quick heads-up when someone starts tapping ----
  if (body.type === 'tap') {
    if (process.env.NOTIFY_TAPS === 'true') {
      await push({
        title: 'Someone tapped your card',
        message: `${d.device || 'A phone'} is exploring: ${d.lens}${d.event ? ` · ${d.event}` : ''}`,
        tags: ['eyes'],
        priority: 3,
      }).catch(() => {});
    }
    return res.status(200).json({ ok: true });
  }

  // ---- full connect ----
  if (!d.name) return res.status(400).json({ ok: false, error: 'name' });
  if (d.email && !EMAIL_RE.test(d.email)) return res.status(400).json({ ok: false, error: 'email' });

  d.linkedinUrl = linkedinLink(d);

  const [notion, alert] = await Promise.allSettled([
    saveToNotion(d),
    push({
      title: `${d.name}${d.company ? ` · ${d.company}` : ''}`,
      message: [
        `Hiring for: ${d.lens}`,
        d.explored.length ? `Tried: ${d.explored.join(', ')}` : null,
        d.note ? `Note: ${d.note}` : null,
        d.linkedin ? `LinkedIn: ${d.linkedin}` : 'LinkedIn: tap to search',
        d.email ? `Email: ${d.email}` : null,
        `${d.seconds}s on your card${d.event ? ` · ${d.event}` : ''}`,
      ].filter(Boolean).join('\n'),
      tags: ['tada'],
      priority: 5,
      click: d.linkedinUrl,
    }),
  ]);

  if (notion.status === 'rejected') console.error('notion:', notion.reason?.message || notion.reason);
  if (alert.status === 'rejected') console.error('ntfy:', alert.reason?.message || alert.reason);

  // Success if at least one destination recorded it.
  if (notion.status === 'fulfilled' || alert.status === 'fulfilled') return res.status(200).json({ ok: true });
  return res.status(502).json({ ok: false });
}

async function saveToNotion(d) {
  const token = process.env.NOTION_TOKEN;
  const db = process.env.NOTION_DATABASE_ID;
  if (!token || !db) throw new Error('Notion not configured');

  const text = s => (s ? [{ type: 'text', text: { content: s } }] : []);
  const properties = {
    'Name': { title: text(d.name) },
    'Company': { rich_text: text(d.company) },
    'LinkedIn': { url: d.linkedinUrl },
    'Email': { email: d.email || null },
    'Hiring For': { select: { name: d.lens } },
    'Explored': { multi_select: d.explored.map(name => ({ name })) },
    'Note': { rich_text: text(d.note) },
    'Event': { rich_text: text(d.event) },
    'Met On': { date: { start: new Date().toISOString() } },
    'Status': { select: { name: 'To reach out' } },
  };

  const r = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parent: { database_id: db }, properties }),
  });
  if (!r.ok) throw new Error(`Notion ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return true;
}

async function push({ title, message, tags, priority, click }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) throw new Error('ntfy not configured');
  const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/+$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.NTFY_TOKEN) headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;

  // JSON publishing (POST to server root) handles names with accents/emoji safely.
  const r = await fetch(server, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic, title, message, tags, priority, ...(click ? { click } : {}) }),
  });
  if (!r.ok) throw new Error(`ntfy ${r.status}`);
  return true;
}
