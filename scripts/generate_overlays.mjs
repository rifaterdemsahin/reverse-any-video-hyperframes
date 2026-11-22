import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('assets/overlays', { recursive: true });

const overlays = [
  {
    name: 's1_title.png',
    bg: 'transparent',
    font: 'Helvetica 32',
    markup: `<span font_desc="Helvetica Bold 16" foreground="#06B6D4">AI VIDEO REVERSE ENGINEERING</span>\n<span font_desc="Helvetica Bold 56" foreground="#FFFFFF">REVERSE-ENGINEER\nANY EDIT</span>\n\n<span font_desc="Helvetica Bold 24" foreground="#CBD5E1">Target Video </span><span font_desc="Helvetica Bold 24" foreground="#06B6D4">→</span><span font_desc="Helvetica Bold 24" foreground="#06B6D4"> Perfect Blueprint</span>`
  },
  {
    name: 's1_comparison.png',
    bg: '#0F172ACC',
    font: 'Helvetica 20',
    markup: `<span font_desc="Helvetica Bold 20" foreground="#06B6D4">⚡ REAL-TIME STYLE EXTRACTION</span>\n<span font_desc="Helvetica 14" foreground="#10B981">● Active Sync</span>\n\n<span font_desc="Helvetica Bold 16" foreground="#F87171">1. VIRAL REFERENCE EDIT</span>\n<span font_desc="Helvetica 14" foreground="#94A3B8">Pacing: 1.8s cuts • Fast Retention Hook</span>\n\n<span font_desc="Helvetica Bold 20" foreground="#06B6D4">        ↓ [SNAPPING CUTS &amp; COLOR]</span>\n\n<span font_desc="Helvetica Bold 16" foreground="#34D399">2. GENERATED BLUEPRINT</span>\n<span font_desc="Helvetica 14" foreground="#A7F3D0">Matched Blueprint snappable to Hyperframes</span>`
  },
  {
    name: 's2_left.png',
    bg: '#140608E6',
    font: 'Helvetica 20',
    markup: `<span font_desc="Helvetica Bold 16" foreground="#EF4444">⚠️ FRICTION &amp; CONFUSION</span>\n<span font_desc="Helvetica Bold 32" foreground="#F87171">The Old Way:\nRaw &amp; Unsimplified</span>\n\n<span font_desc="Courier 14" foreground="#FCA5A5">[ERR] Unparsed raw blob: 4,291 lines\nWARN: Missing audio sync markers\nERR: Format unusable by downstream editors</span>`
  },
  {
    name: 's2_right.png',
    bg: '#061811E6',
    font: 'Helvetica 20',
    markup: `<span font_desc="Helvetica Bold 16" foreground="#10B981">✨ AI-READY STRUCTURE</span>\n<span font_desc="Helvetica Bold 32" foreground="#34D399">The New Way:\nAI-Ready Format</span>\n\n<span font_desc="Helvetica Bold 16" foreground="#A7F3D0">✓ Frame-Accurate Cut Rhythm (1.8s)\n✓ Extracted SaaS Color Palette (#0B0F17 / #06B6D4)\n✓ Native HyperFrames Timeline JSON</span>`
  },
  {
    name: 's3_pills.png',
    bg: 'transparent',
    font: 'Helvetica 20',
    markup: `<span font_desc="Helvetica Bold 20" foreground="#06B6D4">✂️ Extracting Cuts...</span>     <span font_desc="Helvetica Bold 20" foreground="#10B981">🎨 Extracting Colors...</span>     <span font_desc="Helvetica Bold 20" foreground="#F59E0B">⚡ Extracting Pacing...</span>`
  },
  {
    name: 's3_badge.png',
    bg: '#061811F0',
    font: 'Helvetica 24',
    markup: `<span font_desc="Helvetica Bold 38" foreground="#34D399">✓ CHECKED &amp; USED BY ME</span>\n<span font_desc="Helvetica Bold 18" foreground="#A7F3D0">Battle-Tested Production Output</span>`
  },
  {
    name: 's4_top.png',
    bg: '#0F172AE6',
    font: 'Helvetica 22',
    markup: `<span font_desc="Helvetica Bold 22" foreground="#FFFFFF">AI-Ready Output </span><span font_desc="Helvetica Bold 22" foreground="#06B6D4">→</span><span font_desc="Helvetica Bold 22" foreground="#38BDF8"> Hyperframes Engine</span>`
  },
  {
    name: 's4_lower.png',
    bg: '#06B6D4',
    font: 'Helvetica 26',
    markup: `<span font_desc="Helvetica Bold 28" foreground="#0B0F17">  ⚡ BUILD VIDEOS MUCH FASTER  </span>`
  },
  {
    name: 's5_card.png',
    bg: '#0F172AF2',
    font: 'Helvetica 22',
    markup: `<span font_desc="Helvetica Bold 16" foreground="#F59E0B">TRANSPARENT PRICING</span>\n\n<span font_desc="Helvetica Bold 56" foreground="#FFFFFF">$1 = 10 Credits</span>\n<span font_desc="Helvetica Bold 20" foreground="#94A3B8">Reverse 10 Full Videos</span>\n\n<span font_desc="Helvetica Bold 24" foreground="#34D399">✓ NO SUBSCRIPTIONS</span>\n\n<span font_desc="Helvetica 16" foreground="#CBD5E1">• Credits never expire\n• Instant AI blueprint download</span>`
  },
  {
    name: 's6_cta.png',
    bg: 'transparent',
    font: 'Helvetica 22',
    markup: `<span font_desc="Helvetica Bold 26" foreground="#082F49" background="#06B6D4">  Get Your Credits Now ↓  </span>          <span font_desc="Helvetica Bold 22" foreground="#34D399" background="#0F172A">  🎓 Join the Skool Community  </span>\n                                                        <span font_desc="Helvetica 14" foreground="#94A3B8">Learn How to Build It Step-by-Step</span>`
  }
];

console.log("Generating high-resolution Pango overlay cards...");
for (const o of overlays) {
  const cmd = `pango-view -q -o "assets/overlays/${o.name}" --background="${o.bg}" --markup --font="${o.font}" --margin=24 --text="${o.markup.replace(/"/g, '\\"')}"`;
  execSync(cmd);
  console.log(`Generated assets/overlays/${o.name}`);
}
