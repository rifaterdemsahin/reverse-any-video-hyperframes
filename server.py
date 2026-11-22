#!/usr/bin/env python3
"""
HyperFrames Local Python Server
Supports HTTP Range requests for video/audio scrubbing and routing for /nav, /watch, /health.
"""

import os
import sys
import json
import time
import mimetypes
from urllib.parse import urlparse, unquote
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8000))
ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
START_TIME = time.time()

# Ensure comprehensive MIME types
MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/plain; charset=utf-8",
}

for ext, mime in MIME_TYPES.items():
    mimetypes.add_type(mime, ext)


class HyperFramesHandler(BaseHTTPRequestHandler):
    server_version = "HyperFramesPython/1.0"

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_HEAD(self):
        self.handle_request(send_body=False)

    def do_GET(self):
        self.handle_request(send_body=True)

    def handle_request(self, send_body=True):
        parsed = urlparse(self.path)
        pathname = unquote(parsed.path)

        # Health endpoint
        if pathname in ("/health", "/healthz"):
            body = json.dumps({
                "status": "ok",
                "engine": "HyperFrames Local Python Server",
                "uptime_seconds": round(time.time() - START_TIME, 2),
                "port": PORT,
                "root": ROOT_DIR,
            }, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            if send_body:
                self.wfile.write(body)
            return

        # Watch / Draft video route
        if pathname in ("/watch", "/draft"):
            watch_file = os.path.join(ROOT_DIR, "output", "reverse_any_video_promo.mp4")
            has_video = os.path.exists(watch_file)
            video_html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reverse Any Video — Local Video Watch Player</title>
  <style>
    body {{
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
    }}
    .container {{
      max-width: 1200px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 16px;
    }}
    .badge {{
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
    }}
    .video-wrap {{
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #020617;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 80px rgba(0,0,0,0.8), 0 0 50px rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
    }}
    video {{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }}
    .actions {{
      display: flex;
      gap: 14px;
      align-items: center;
      flex-wrap: wrap;
    }}
    .btn {{
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 800;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      cursor: pointer;
      transition: transform 0.15s, background 0.15s;
    }}
    .btn:hover {{ transform: translateY(-2px); }}
    .btn-primary {{ background: #06B6D4; color: #0B0F17; }}
    .btn-secondary {{ background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); color: #F8FAFC; }}
    .storyboard-section {{
      margin-top: 36px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 28px;
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
      margin-top: 18px;
    }}
    .card {{
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
    }}
    .card img {{ width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }}
    .card-body {{ padding: 14px; }}
    .card-tag {{ font-size: 11px; font-weight: 700; color: #06B6D4; text-transform: uppercase; }}
    .card-title {{ font-size: 15px; font-weight: 700; margin: 4px 0 6px 0; }}
    .card-desc {{ font-size: 12.5px; color: #94A3B8; line-height: 1.4; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="badge">● Local Python Server • Port {PORT}</div>
        <h1 style="margin: 8px 0 0 0; font-size: 26px;">Reverse Any Video — 60s Tech Promo</h1>
      </div>
      <div style="font-size: 14px; color: #94A3B8;">1080p • 60 FPS • Multi-Track Audio</div>
    </div>
    <div class="video-wrap">
      <video controls autoplay loop playsinline src="/output/reverse_any_video_promo.mp4"></video>
    </div>
    <div class="actions">
      <a href="/output/reverse_any_video_promo.mp4" download class="btn btn-primary">⬇ Download Promo MP4 (30 MB)</a>
      <a href="/nav" class="btn btn-secondary">🧭 Master Navigation Hub</a>
      <a href="/" class="btn btn-secondary">⚡ Interactive Studio</a>
      <a href="/seed/storyboard.md" class="btn btn-secondary">📋 Storyboard</a>
      <a href="/plan.json" class="btn btn-secondary">📐 plan.json</a>
    </div>

    <div class="storyboard-section">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 6px;">🎨 AI Storyboard & Scene Breakdown (FLUX-1)</h2>
      <p style="color: #94A3B8; font-size: 13px;">6 AI-generated visual plates matching the exact timeline and kinetic subtitles.</p>
      <div class="grid">
        <div class="card">
          <img src="/seed/images/scene_1_hook.jpg" alt="Scene 1" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:00 – 0:08 • Scene 1</span>
            <div class="card-title">Hook & The Promise</div>
            <div class="card-desc">"What if you could take ANY viral video, reverse-engineer every cut, color, and pacing decision..."</div>
          </div>
        </div>
        <div class="card">
          <img src="/seed/images/scene_2_old_vs_new.jpg" alt="Scene 2" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:08 – 0:18 • Scene 2</span>
            <div class="card-title">The Old Way vs. The New Way</div>
            <div class="card-desc">"The old way was chaotic. Sifting through bloated logs... The new way? Clean, structured blueprints."</div>
          </div>
        </div>
        <div class="card">
          <img src="/seed/images/scene_3_verified.jpg" alt="Scene 3" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:18 – 0:28 • Scene 3</span>
            <div class="card-title">Verified Output</div>
            <div class="card-desc">"Just drag and drop your target video. The AI extracts the exact cut timing, color palette, and edit rhythm."</div>
          </div>
        </div>
        <div class="card">
          <img src="/seed/images/scene_4_hyperframes.jpg" alt="Scene 4" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:28 – 0:40 • Scene 4</span>
            <div class="card-title">The Hyperframes Magic</div>
            <div class="card-desc">"Then, drop that blueprint directly into Hyperframes. Watch your timeline auto-assemble 10x faster."</div>
          </div>
        </div>
        <div class="card">
          <img src="/seed/images/scene_5_pricing.jpg" alt="Scene 5" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:40 – 0:52 • Scene 5</span>
            <div class="card-title">Simple Credit Pricing</div>
            <div class="card-desc">"Best of all: no recurring subscriptions. It’s simple credit pricing: just one dollar gives you ten full video credits."</div>
          </div>
        </div>
        <div class="card">
          <img src="/seed/images/scene_6_cta.jpg" alt="Scene 6" loading="lazy">
          <div class="card-body">
            <span class="card-tag">0:52 – 1:00 • Scene 6</span>
            <div class="card-title">Call To Action & Skool Community</div>
            <div class="card-desc">"Grab your credits below, or join our Skool community to learn how we built this entire engine!"</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>""".encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(video_html)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            if send_body:
                self.wfile.write(video_html)
            return

        # Route aliases
        if pathname in ("/nav", "/links", "/hub"):
            pathname = "/nav.html"
        elif pathname in ("/", ""):
            pathname = "/index.html"

        # Sanitize path to prevent directory traversal
        rel_path = pathname.lstrip("/")
        full_path = os.path.abspath(os.path.join(ROOT_DIR, rel_path))

        if not full_path.startswith(ROOT_DIR):
            self.send_error(403, "Forbidden")
            return

        if not os.path.exists(full_path) or os.path.isdir(full_path):
            self.send_error(404, "File Not Found")
            return

        file_size = os.path.getsize(full_path)
        _, ext = os.path.splitext(full_path)
        content_type = MIME_TYPES.get(ext.lower(), "application/octet-stream")

        # Range Request handling for smooth media streaming
        range_header = self.headers.get("Range")
        if range_header and ext.lower() in (".mp4", ".mp3"):
            try:
                range_match = range_header.replace("bytes=", "").strip()
                parts = range_match.split("-")
                start = int(parts[0]) if parts[0] else 0
                end = int(parts[1]) if len(parts) > 1 and parts[1] else file_size - 1
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                if send_body:
                    with open(full_path, "rb") as f:
                        f.seek(start)
                        remaining = length
                        chunk_size = 64 * 1024
                        while remaining > 0:
                            read_bytes = min(remaining, chunk_size)
                            data = f.read(read_bytes)
                            if not data:
                                break
                            self.wfile.write(data)
                            remaining -= len(data)
                return
            except (ValueError, IOError):
                # Fallback to standard 200 response on range parse error
                pass

        # Standard 200 response
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

        if send_body:
            with open(full_path, "rb") as f:
                chunk_size = 64 * 1024
                while True:
                    data = f.read(chunk_size)
                    if not data:
                        break
                    self.wfile.write(data)

    def log_message(self, format, *args):
        # Concise colored logging
        timestamp = time.strftime("%H:%M:%S")
        sys.stderr.write(f"[{timestamp}] {args[0]} {args[1]} -> {args[2]}\n")


def run_server():
    server_address = ("127.0.0.1", PORT)
    httpd = HTTPServer(server_address, HyperFramesHandler)
    print("=" * 65)
    print(f"🚀 HyperFrames Local Python Server running on PORT {PORT}")
    print("=" * 65)
    print(f"🧭 Master Hub:        http://localhost:{PORT}/nav")
    print(f"🎬 Watch Video:       http://localhost:{PORT}/watch")
    print(f"⚡ Interactive Stage: http://localhost:{PORT}/")
    print(f"⬇️ Direct MP4:        http://localhost:{PORT}/output/reverse_any_video_promo.mp4")
    print(f"📋 Storyboard:        http://localhost:{PORT}/seed/storyboard.md")
    print(f"📝 Script:            http://localhost:{PORT}/seed/script.md")
    print(f"📐 Production Plan:   http://localhost:{PORT}/plan.json")
    print(f"🩺 Health Status:     http://localhost:{PORT}/health")
    print("=" * 65)
    sys.stdout.flush()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
