#!/usr/bin/env python3
"""Animated word-by-word captions as a transparent video (no libass or drawtext needed).

Reads a Whisper JSON (DeepInfra openai/whisper-large-v3, segments with start/end), draws one RGBA
frame per highlight step with Pillow (the current word is yellow, the rest white, black outline),
and joins the frames into captions.mov with ffmpeg (qtrle, alpha kept).

Usage:
  ~/venvs/captions/bin/python scripts/video/make_captions.py <whisper.json> <out-dir> \
      --start 139.0 --end 170.5 [--fix "Pro-I templates=We provide the templates"] [--width 1080 --height 1920]

Word times are spread across each segment by letter count, because the API returned segments only.
Output: <out-dir>/captions.mov (same length as --end minus --start), and the frames.
"""
import argparse
import json
import pathlib
import subprocess

from PIL import Image, ImageDraw, ImageFont

FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FPS = 30
YELLOW = (255, 214, 0, 255)
WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)


def load_words(path, start, end, fixes):
    data = json.load(open(path, encoding="utf-8"))
    words = []
    for seg in data["segments"]:
        if seg["end"] < start or seg["start"] > end:
            continue
        text = seg["text"].strip()
        for old, new in fixes:
            text = text.replace(old, new)
        toks = text.split()
        if not toks:
            continue
        s, e = max(seg["start"], start) - start, min(seg["end"], end) - start
        total = sum(len(t) for t in toks) or 1
        cur = s
        for t in toks:
            d = (e - s) * len(t) / total
            words.append([cur, cur + d, t])
            cur += d
    return words


def groups(words, max_words=4, max_chars=26):
    out, cur = [], []
    for w in words:
        if cur and (len(cur) >= max_words or sum(len(x[2]) + 1 for x in cur) + len(w[2]) > max_chars):
            out.append(cur)
            cur = []
        cur.append(w)
    if cur:
        out.append(cur)
    return out


def wrap(draw, font, group, max_w):
    """Split a group into lines that fit max_w, keeping each word's index."""
    lines, line, width = [], [], 0
    space = draw.textlength(" ", font=font)
    for i, w in enumerate(group):
        tw = draw.textlength(w[2], font=font)
        if line and width + space + tw > max_w:
            lines.append(line)
            line, width = [], 0
        width += (space if line else 0) + tw
        line.append((i, w[2]))
    if line:
        lines.append(line)
    return lines


def draw_state(size, font, group, active, path, ycenter):
    W, H = size
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    max_w = int(W * 0.86)
    lines = wrap(d, font, group, max_w)
    line_h = int(font.size * 1.18)
    top = int(H * ycenter) - line_h * len(lines) // 2
    space = d.textlength(" ", font=font)
    for li, line in enumerate(lines):
        total = sum(d.textlength(t, font=font) for _, t in line) + space * (len(line) - 1)
        x = (W - total) / 2
        y = top + li * line_h
        for idx, text in line:
            colour = YELLOW if idx == active else WHITE
            d.text((x, y), text, font=font, fill=colour, stroke_width=9, stroke_fill=BLACK)
            x += d.textlength(text, font=font) + space
    img.save(path)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("whisper")
    p.add_argument("outdir")
    p.add_argument("--start", type=float, required=True)
    p.add_argument("--end", type=float, required=True)
    p.add_argument("--fix", action="append", default=[], help="OLD=NEW text fix, after checking the audio")
    p.add_argument("--width", type=int, default=1080)
    p.add_argument("--height", type=int, default=1920)
    p.add_argument("--ycenter", type=float, default=0.36, help="caption centre as a fraction of height")
    a = p.parse_args()

    fixes = [tuple(f.split("=", 1)) for f in a.fix]
    words = load_words(a.whisper, a.start, a.end, fixes)
    dur = a.end - a.start
    out = pathlib.Path(a.outdir)
    frames = out / "frames"
    frames.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype(FONT, 88)
    blank = frames / "blank.png"
    Image.new("RGBA", (a.width, a.height), (0, 0, 0, 0)).save(blank)

    timeline = []  # (png, seconds)
    t = 0.0
    n = 0
    for g in groups(words):
        g_start = g[0][0]
        if g_start > t:
            timeline.append((blank, g_start - t))
            t = g_start
        for k, w in enumerate(g):
            step_end = g[k + 1][0] if k + 1 < len(g) else g[-1][1]
            png = frames / f"s{n:04d}.png"
            draw_state((a.width, a.height), font, g, k, png, a.ycenter)
            seg_len = max(step_end - w[0], 1 / FPS)
            timeline.append((png, seg_len))
            t = w[0] + seg_len
            n += 1
    if t < dur:
        timeline.append((blank, dur - t))

    listfile = out / "frames.txt"
    with open(listfile, "w") as f:
        for png, secs in timeline:
            f.write(f"file '{png.resolve()}'\nduration {secs:.3f}\n")
        f.write(f"file '{timeline[-1][0].resolve()}'\n")  # concat demuxer needs the last file repeated
    mov = out / "captions.mov"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0",
                    "-i", str(listfile), "-vf", f"fps={FPS},format=argb", "-c:v", "qtrle", str(mov)], check=True)
    print(f"{len(words)} words, {len(groups(words))} groups, {n} highlight frames -> {mov}")


if __name__ == "__main__":
    main()
