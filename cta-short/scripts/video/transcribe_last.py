#!/usr/bin/env python3
"""Stage 4: transcribe a clip and print its last sentences with timestamps.

Usage: python3 scripts/video/transcribe_last.py <clip> [--last 5] [--model small] [--out transcript.txt]
Needs faster-whisper (pip install faster-whisper). Runs on the CPU, int8.
"""
import argparse
import sys

from faster_whisper import WhisperModel


def fmt(t):
    return f"{int(t // 60):02d}:{t % 60:05.2f}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("clip")
    p.add_argument("--last", type=int, default=5, help="how many final segments to keep")
    p.add_argument("--model", default="small")
    p.add_argument("--out")
    a = p.parse_args()

    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(a.clip, vad_filter=True, language="en")
    rows = [(s.start, s.end, s.text.strip()) for s in segments if s.text.strip()]
    if not rows:
        sys.exit("No speech found. Check the playback copy and the channel levels.")
    tail = rows[-a.last:]
    lines = [f"[{fmt(s)} - {fmt(e)}] {t}" for s, e, t in tail]
    text = "\n".join(lines)
    print(text)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(text + "\n")


if __name__ == "__main__":
    main()
