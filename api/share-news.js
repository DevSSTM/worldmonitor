/**
 * News Share Proxy for Social Crawlers
 * Returns HTML with proper og:image and twitter:card meta tags.
 * Redirects real users to the source news link.
 */

const BOT_UA = /twitterbot|facebookexternalhit|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|redditbot|googlebot/i;

export default function handler(req, res) {
    const urlParams = new URL(req.url, `https://${req.headers.host}`);
    const targetUrl = urlParams.searchParams.get('url') || 'https://worldmonitor.app';
    const title = urlParams.searchParams.get('title') || 'Breaking News';
    const source = urlParams.searchParams.get('source') || 'Intelligence Feed';
    const img = urlParams.searchParams.get('img') || '';

    const ua = req.headers['user-agent'] || '';
    const isBot = BOT_UA.test(ua);

    // Real users → redirect to the source news article
    if (!isBot) {
        res.writeHead(302, { Location: targetUrl });
        res.end();
        return;
    }

    // Bots → serve meta tags for FB/Twitter
    const baseUrl = `https://${req.headers.host}`;
    const displayTitle = `${title} | World Monitor Intelligence`;
    const description = `Reported by ${source}. Real-time global intelligence monitoring, signal convergence, and threat analysis.`;

    // Use our dynamic news OG image generator
    const imageParams = new URLSearchParams({ title, source });
    if (img) imageParams.set('img', img);
    const imageUrl = `${baseUrl}/api/og-news?${imageParams.toString()}`;
    const shareUrl = `${baseUrl}/api/share-news?${urlParams.searchParams.toString()}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${esc(displayTitle)}</title>
  <meta name="description" content="${esc(description)}"/>

  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${esc(displayTitle)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:image" content="${esc(imageUrl)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${esc(shareUrl)}"/>
  <meta property="og:site_name" content="World Monitor"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@WorldMonitorApp"/>
  <meta name="twitter:title" content="${esc(displayTitle)}"/>
  <meta name="twitter:description" content="${esc(description)}"/>
  <meta name="twitter:image" content="${esc(imageUrl)}"/>

  <link rel="canonical" href="${esc(targetUrl)}"/>
</head>
<body>
  <h1>${esc(displayTitle)}</h1>
  <p>${esc(description)}</p>
  <p><a href="${esc(targetUrl)}">Read full article at ${esc(source)}</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
    res.status(200).send(html);
}

function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
