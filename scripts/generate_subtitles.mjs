import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('assets/overlays/subtitles', { recursive: true });

const SUBTITLES = [
  // Scene 1 (0:00 - 0:08)
  {
    name: 'sub_1a.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">WHAT IF YOU COULD TAKE </span><span font_desc="Arial Black 28" foreground="#06B6D4">ANY VIRAL VIDEO?</span>`
  },
  {
    name: 'sub_1b.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">REVERSE-ENGINEER EVERY </span><span font_desc="Arial Black 28" foreground="#FACC15">CUT, COLOR &amp; PACING...</span>`
  },
  {
    name: 'sub_1c.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">INTO A </span><span font_desc="Arial Black 28" foreground="#10B981">PERFECT BLUEPRINT</span><span font_desc="Arial Black 28" foreground="#FFFFFF"> IN SECONDS?</span>`
  },

  // Scene 2 (0:08 - 0:18)
  {
    name: 'sub_2a.png',
    text: `<span font_desc="Arial Black 28" foreground="#EF4444">THE OLD WAY: </span><span font_desc="Arial Black 28" foreground="#F87171">CHAOTIC, BLOATED RAW LOGS...</span>`
  },
  {
    name: 'sub_2b.png',
    text: `<span font_desc="Arial Black 28" foreground="#10B981">THE NEW WAY: </span><span font_desc="Arial Black 28" foreground="#FFFFFF">CLEAN, STRUCTURED, </span><span font_desc="Arial Black 28" foreground="#06B6D4">AI-READY BLUEPRINTS</span>`
  },

  // Scene 3 (0:18 - 0:28)
  {
    name: 'sub_3a.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">JUST </span><span font_desc="Arial Black 28" foreground="#06B6D4">DRAG &amp; DROP</span><span font_desc="Arial Black 28" foreground="#FFFFFF"> YOUR TARGET VIDEO</span>`
  },
  {
    name: 'sub_3b.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">EXTRACTS EXACT </span><span font_desc="Arial Black 28" foreground="#38BDF8">CUT TIMING, COLORS &amp; RHYTHM</span>`
  },
  {
    name: 'sub_3c.png',
    text: `<span font_desc="Arial Black 28" foreground="#10B981">✓ VERIFIED &amp; USED IN PRODUCTION</span>`
  },

  // Scene 4 (0:28 - 0:40)
  {
    name: 'sub_4a.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">DROP BLUEPRINT DIRECTLY INTO </span><span font_desc="Arial Black 28" foreground="#06B6D4">HYPERFRAMES</span>`
  },
  {
    name: 'sub_4b.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">WATCH TIMELINE AUTO-ASSEMBLE </span><span font_desc="Arial Black 28" foreground="#FACC15">10X FASTER!</span>`
  },

  // Scene 5 (0:40 - 0:52)
  {
    name: 'sub_5a.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">BEST OF ALL: </span><span font_desc="Arial Black 28" foreground="#10B981">NO RECURRING SUBSCRIPTIONS</span>`
  },
  {
    name: 'sub_5b.png',
    text: `<span font_desc="Arial Black 28" foreground="#FACC15">$1 = 10 FULL VIDEO CREDITS</span><span font_desc="Arial Black 28" foreground="#FFFFFF"> THAT NEVER EXPIRE</span>`
  },

  // Scene 6 (0:52 - 1:00)
  {
    name: 'sub_6a.png',
    text: `<span font_desc="Arial Black 28" foreground="#06B6D4">GRAB YOUR CREDITS BELOW </span><span font_desc="Arial Black 28" foreground="#FFFFFF">— LINK IN DESCRIPTION!</span>`
  },
  {
    name: 'sub_6b.png',
    text: `<span font_desc="Arial Black 28" foreground="#FFFFFF">OR JOIN OUR </span><span font_desc="Arial Black 28" foreground="#10B981">SKOOL COMMUNITY</span><span font_desc="Arial Black 28" foreground="#FFFFFF"> TO LEARN MORE!</span>`
  }
];

console.log("Generating high-retention viral animated subtitle cards...");
for (const sub of SUBTITLES) {
  const cmd = `pango-view -q -o "assets/overlays/subtitles/${sub.name}" --background="#060910F0" --markup --margin=16 --text="${sub.text.replace(/"/g, '\\"')}"`;
  execSync(cmd);
}
console.log("All high-retention kinetic subtitle cards successfully generated!");
