/**
 * Dynamic OG Image Generator for News Sharing
 * Returns an SVG image (1200x630) - high-impact news intelligence card.
 */

export default function handler(req, res) {
    const urlParams = new URL(req.url, `https://${req.headers.host}`);
    const title = (urlParams.searchParams.get('title') || 'Intelligence Alert').toUpperCase();
    const source = urlParams.searchParams.get('source') || 'Verified Intelligence Source';
    const img = urlParams.searchParams.get('img'); // Optional background/thumbnail image

    const dateStr = new Date().toISOString().slice(0, 10);
    const accentColor = '#3b82f6'; // Intelligence blue

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0c18"/>
      <stop offset="100%" stop-color="#05050a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Left accent sidebar -->
  <rect x="0" y="0" width="10" height="630" fill="url(#accent)"/>

  <!-- Subtle grid -->
  <g opacity="0.03">
    ${Array.from({ length: 30 }, (_, i) => `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="630" stroke="#fff" stroke-width="1"/>`).join('\n    ')}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="1200" y2="${i * 40}" stroke="#fff" stroke-width="1"/>`).join('\n    ')}
  </g>

  <!-- WORLDMONITOR brand -->
  <text x="60" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${accentColor}" letter-spacing="6"
    >WORLDMONITOR</text>

  <!-- Status pill -->
  <rect x="290" y="38" width="160" height="26" rx="13" fill="${accentColor}" opacity="0.2"/>
  <text x="370" y="56" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${accentColor}" text-anchor="middle"
    >BREAKING NEWS</text>

  <!-- Date -->
  <text x="1140" y="56" font-family="system-ui, sans-serif" font-size="16" fill="#666" text-anchor="end"
    >${dateStr}</text>

  <!-- Separator -->
  <line x1="60" y1="76" x2="1140" y2="76" stroke="#222" stroke-width="1"/>

  <!-- Headline -->
  <foreignObject x="60" y="120" width="1080" height="300">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-family: system-ui, -apple-system, sans-serif; font-size: 64px; font-weight: 800; line-height: 1.1; letter-spacing: -2px;">
      ${escapeXml(title)}
    </div>
  </foreignObject>

  <!-- Source badge -->
  <g transform="translate(60, 420)">
    <rect x="0" y="0" width="${source.length * 15 + 40}" height="44" rx="8" fill="rgba(59, 130, 246, 0.1)" stroke="${accentColor}" stroke-width="1" stroke-opacity="0.3"/>
    <text x="20" y="30" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#aaa">
      Source: <tspan fill="#fff">${escapeXml(source)}</tspan>
    </text>
  </g>

  <!-- Subtitle -->
  <text x="60" y="500" font-family="system-ui, sans-serif" font-size="22" fill="#666" letter-spacing="3"
    >REAL-TIME INTELLIGENCE FEED</text>

  <!-- Bottom bar -->
  <rect x="0" y="530" width="1200" height="100" fill="#080810"/>
  <line x1="0" y1="530" x2="1200" y2="530" stroke="#222" stroke-width="1"/>

  <!-- Logo area -->
  <circle cx="92" cy="580" r="24" fill="none" stroke="${accentColor}" stroke-width="2"/>
  <text x="92" y="586" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${accentColor}" text-anchor="middle"
    >W</text>

  <text x="130" y="573" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ddd" letter-spacing="3"
    >WORLDMONITOR</text>
  <text x="130" y="597" font-family="system-ui, sans-serif" font-size="15" fill="#777"
    >Global News Aggregator &amp; Intelligence Platform</text>

  <!-- CTA -->
  <rect x="920" y="559" width="220" height="42" rx="21" fill="${accentColor}"/>
  <text x="1030" y="586" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle"
    >READ ARTICLE →</text>

  <!-- URL -->
  <text x="1030" y="618" font-family="system-ui, sans-serif" font-size="12" fill="#444" text-anchor="middle"
    >worldmonitor.app</text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
    res.status(200).send(svg);
}

function escapeXml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
