import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

const PORT = process.env.PORT || 8080;
const ROOT = resolve('.');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8'
};

const server = createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // Health checks
  if (pathname === '/health' || pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', app: 'reverse-any-video-hyperframes', uptime: process.uptime() }));
    return;
  }

  // Quick route to watch rendered draft video directly
  if (pathname === '/watch' || pathname === '/draft') {
    const videoHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reverse Any Video — Rendered Initial Draft</title>
  <style>
    body {
      margin: 0;
      background: #0B0F17;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      box-sizing: border-box;
    }
    .container {
      max-width: 1280px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 16px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #06B6D4;
      font-weight: 700;
      font-size: 13px;
    }
    .video-wrap {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #020617;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 50px rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .actions {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 800;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      cursor: pointer;
      transition: transform 0.15s, background 0.15s;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .btn-primary {
      background: #06B6D4;
      color: #0B0F17;
    }
    .btn-primary:hover {
      background: #22D3EE;
    }
    .btn-secondary {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #F8FAFC;
    }
    .btn-secondary:hover {
      background: rgba(30, 41, 59, 0.9);
    }
    .storyboard-section {
      margin-top: 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 32px;
    }
    .storyboard-title {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      color: #F8FAFC;
    }
    .storyboard-sub {
      color: #94A3B8;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 20px;
    }
    .card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      display: block;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card-tag {
      font-size: 12px;
      font-weight: 700;
      color: #06B6D4;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0;
    }
    .card-narration {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.4;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="badge">● Rendered Initial Draft</div>
        <h1 style="margin: 8px 0 0 0; font-size: 28px;">Reverse Any Video — 60s Tech Promo</h1>
      </div>
      <div style="font-size: 14px; color: #94A3B8;">1080p • 60 FPS • Multi-Track Ducked Audio • AI Visual Plates</div>
    </div>
    <div class="video-wrap">
      <video controls autoplay loop playsinline src="/output/reverse_any_video_promo.mp4"></video>
    </div>
    <div class="actions">
      <a href="/output/reverse_any_video_promo.mp4" download class="btn btn-primary">⬇ Download Promo Video MP4 (30 MB)</a>
      <a href="/nav" class="btn btn-secondary">🧭 Master Navigation Hub</a>
      <a href="/" class="btn btn-secondary">⚡ Interactive Studio</a>
      <a href="/seed/storyboard.md" class="btn btn-secondary">📋 Storyboard</a>
      <a href="/plan.json" class="btn btn-secondary">📐 plan.json</a>
    </div>

    <div class="storyboard-section">
      <div class="storyboard-title">🎨 AI Storyboard & Scene Breakdown (FLUX-1-schnell)</div>
      <div class="storyboard-sub">6 AI-generated visual plates matching the exact timeline, pacing, and kinetic subtitle overlays.</div>
      <div class="grid">
        <div class="card">
          <img src="/seed/images/scene_1_hook.jpg" alt="Scene 1: Hook & The Promise" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:00 – 0:08 • Scene 1</span>
            <h3 class="card-title">Hook & The Promise</h3>
            <p class="card-narration">"What if you could take ANY viral video, reverse-engineer every cut, color, and pacing decision, and turn it into a perfect blueprint in seconds?"</p>
          </div>
        </div>

        <div class="card">
          <img src="/seed/images/scene_2_old_vs_new.jpg" alt="Scene 2: The Old Way vs The New Way" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:08 – 0:18 • Scene 2</span>
            <h3 class="card-title">The Old Way vs. The New Way</h3>
            <p class="card-narration">"The old way was chaotic. Sifting through bloated logs and unsimplified raw data that breaks your workflow. The new way? Clean, structured, AI-ready blueprints."</p>
          </div>
        </div>

        <div class="card">
          <img src="/seed/images/scene_3_verified.jpg" alt="Scene 3: Verified Output" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:18 – 0:28 • Scene 3</span>
            <h3 class="card-title">Verified Output</h3>
            <p class="card-narration">"Just drag and drop your target video. The AI extracts the exact cut timing, color palette, and edit rhythm. Verified and checked in production."</p>
          </div>
        </div>

        <div class="card">
          <img src="/seed/images/scene_4_hyperframes.jpg" alt="Scene 4: The Hyperframes Magic" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:28 – 0:40 • Scene 4</span>
            <h3 class="card-title">The Hyperframes Magic</h3>
            <p class="card-narration">"Then, drop that blueprint directly into Hyperframes. Watch your timeline auto-assemble with precision transitions, dynamic layers, and kinetic captions 10 times faster."</p>
          </div>
        </div>

        <div class="card">
          <img src="/seed/images/scene_5_pricing.jpg" alt="Scene 5: Simple Credit Pricing" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:40 – 0:52 • Scene 5</span>
            <h3 class="card-title">Simple Credit Pricing</h3>
            <p class="card-narration">"Best of all: no recurring subscriptions. It’s simple credit pricing: just one dollar gives you ten full video credits."</p>
          </div>
        </div>

        <div class="card">
          <img src="/seed/images/scene_6_cta.jpg" alt="Scene 6: Call To Action & Skool" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:52 – 1:00 • Scene 6</span>
            <h3 class="card-title">Call To Action & Skool Community</h3>
            <p class="card-narration">"Grab your credits below, or join our Skool community to learn how we built this entire engine. Link is in the description!"</p>
          </div>
        </div>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <a href="/seed/images/storyboard_grid.jpg" target="_blank" class="btn btn-secondary">🖼️ Open High-Res Master Storyboard Grid</a>
      </div>
    </div>
  </div>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(videoHtml);
    return;
  }

  // Master navigation hub routes
  if (pathname === '/nav' || pathname === '/links' || pathname === '/hub') {
    pathname = '/nav.html';
  }

  // Default to index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = join(ROOT, pathname.replace(/^\//, ''));

  // Security check: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File Not Found');
    return;
  }

  const stat = statSync(filePath);
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // HTTP Range request support (essential for video & audio scrubbing)
  const range = req.headers.range;
  if (range && (ext === '.mp4' || ext === '.mp3')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType
    });
    createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    });
    createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
