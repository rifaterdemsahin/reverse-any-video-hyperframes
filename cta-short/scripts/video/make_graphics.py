#!/usr/bin/env python3
"""Draw timed graphics (cards, text, badges, buttons) from a JSON spec, as a transparent video.

Usage: ~/venvs/captions/bin/python scripts/video/make_graphics.py <spec.json> <out.mov> --duration 32.07
Uses Pillow for drawing and ffmpeg (qtrle) for the alpha video. Each change of what is on screen
becomes one frame, so the output stays small.
"""
import argparse
import json
import pathlib
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FPS = 30


def font(path, size):
    return ImageFont.truetype(path, size)


def draw_element(d, el):
    kind = el["kind"]
    if kind == "card":
        x, y, w, h = el["x"], el["y"], el["w"], el["h"]
        d.rounded_rectangle([x, y, x + w, y + h], radius=26, fill=(15, 23, 42, 235), outline=tuple(el["colour"]) + (255,), width=6)
        ft = font(BOLD, 44)
        tw = d.textlength(el["title"], font=ft)
        if el.get("sub"):
            d.text((x + w / 2 - tw / 2, y + 26), el["title"], font=ft, fill=(255, 255, 255, 255))
            fs = font(REG, 30)
            sw = d.textlength(el["sub"], font=fs)
            d.text((x + w / 2 - sw / 2, y + 96), el["sub"], font=fs, fill=(203, 213, 225, 255))
        else:
            d.text((x + w / 2 - tw / 2, y + h / 2 - 27), el["title"], font=ft, fill=(255, 255, 255, 255))
    elif kind == "text":
        ft = font(BOLD, el["size"])
        tw = d.textlength(el["text"], font=ft)
        d.text((el["x"] - tw / 2, el["y"] - el["size"] * 0.6), el["text"], font=ft, fill=tuple(el["colour"]) + (255,),
               stroke_width=6, stroke_fill=(0, 0, 0, 255))
    elif kind == "badge":
        x, y, r = el["x"], el["y"], el["r"]
        d.ellipse([x - r, y - r, x + r, y + r], fill=(15, 23, 42, 240), outline=(99, 102, 241, 255), width=10)
        ft = font(BOLD, 40)
        words = el["title"].split(" ")
        for i, wd in enumerate(words):
            tw = d.textlength(wd, font=ft)
            d.text((x - tw / 2, y - 60 + i * 52), wd, font=ft, fill=(255, 255, 255, 255))
    elif kind == "button":
        x, y, w, h = el["x"], el["y"], el["w"], el["h"]
        d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=tuple(el["colour"]) + (255,))
        ft = font(BOLD, 52)
        tw = d.textlength(el["text"], font=ft)
        d.text((x + w / 2 - tw / 2, y + h / 2 - 32), el["text"], font=ft, fill=(255, 255, 255, 255))
    else:
        raise ValueError(f"unknown kind {kind}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("spec")
    p.add_argument("out")
    p.add_argument("--duration", type=float, required=True)
    a = p.parse_args()

    spec = json.load(open(a.spec, encoding="utf-8"))
    W, H = spec["canvas"]
    els = spec["elements"]
    cuts = sorted({0.0, a.duration} | {e["start"] for e in els} | {e["end"] for e in els if e["end"] < a.duration})
    cuts = [c for c in cuts if 0 <= c <= a.duration]
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="graphics-"))
    timeline = []
    for i in range(len(cuts) - 1):
        t0, t1 = cuts[i], cuts[i + 1]
        mid = (t0 + t1) / 2
        active = [e for e in els if e["start"] <= mid < e["end"]]
        png = tmp / f"g{i:03d}.png"
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        for e in active:
            draw_element(d, e)
        img.save(png)
        timeline.append((png, t1 - t0))
    listfile = tmp / "frames.txt"
    with open(listfile, "w") as f:
        for png, secs in timeline:
            f.write(f"file '{png}'\nduration {secs:.3f}\n")
        f.write(f"file '{timeline[-1][0]}'\n")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0",
                    "-i", str(listfile), "-vf", f"fps={FPS},format=argb", "-c:v", "qtrle", a.out], check=True)
    print(f"{len(timeline)} states, {len(els)} elements -> {a.out}")


if __name__ == "__main__":
    main()
