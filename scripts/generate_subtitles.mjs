import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('assets/overlays/subtitles', { recursive: true });

const SUBTITLES = [
  // Scene 1 (0:00 - 0:08)
  {
    name: 'sub_1a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">What if you could take </span><span font_desc="Helvetica Bold 26" foreground="#06B6D4">ANY viral video</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF">...</span>`
  },
  {
    name: 'sub_1b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">reverse-engineer every </span><span font_desc="Helvetica Bold 26" foreground="#38BDF8">cut, color, and pacing</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF"> decision...</span>`
  },
  {
    name: 'sub_1c.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">and turn it into a </span><span font_desc="Helvetica Bold 26" foreground="#10B981">perfect blueprint in seconds?</span>`
  },

  // Scene 2 (0:08 - 0:18)
  {
    name: 'sub_2a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#EF4444">The old way was chaotic. </span><span font_desc="Helvetica Bold 26" foreground="#FCA5A5">Sifting through bloated raw logs...</span>`
  },
  {
    name: 'sub_2b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">The new way? </span><span font_desc="Helvetica Bold 26" foreground="#10B981">Clean, structured, AI-ready blueprints.</span>`
  },

  // Scene 3 (0:18 - 0:28)
  {
    name: 'sub_3a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">Just </span><span font_desc="Helvetica Bold 26" foreground="#06B6D4">drag and drop</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF"> your target video...</span>`
  },
  {
    name: 'sub_3b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">The AI extracts exact </span><span font_desc="Helvetica Bold 26" foreground="#38BDF8">cut timing, colors, and rhythm.</span>`
  },
  {
    name: 'sub_3c.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#10B981">✓ Verified and checked in production.</span>`
  },

  // Scene 4 (0:28 - 0:40)
  {
    name: 'sub_4a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">Drop that blueprint directly into </span><span font_desc="Helvetica Bold 26" foreground="#06B6D4">Hyperframes</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF">.</span>`
  },
  {
    name: 'sub_4b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">Watch your timeline </span><span font_desc="Helvetica Bold 26" foreground="#38BDF8">auto-assemble 10 times faster!</span>`
  },

  // Scene 5 (0:40 - 0:52)
  {
    name: 'sub_5a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">Best of all: </span><span font_desc="Helvetica Bold 26" foreground="#10B981">NO recurring subscriptions.</span>`
  },
  {
    name: 'sub_5b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#F59E0B">Just $1 gives you 10 full video credits</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF"> that never expire.</span>`
  },

  // Scene 6 (0:52 - 1:00)
  {
    name: 'sub_6a.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#FFFFFF">Grab your credits below, </span><span font_desc="Helvetica Bold 26" foreground="#06B6D4">link is in the description!</span>`
  },
  {
    name: 'sub_6b.png',
    text: `<span font_desc="Helvetica Bold 26" foreground="#10B981">Join our Skool community</span><span font_desc="Helvetica Bold 26" foreground="#FFFFFF"> to learn how to build it!</span>`
  }
];

console.log("Generating kinetic animated subtitle cards...");
for (const sub of SUBTITLES) {
  const cmd = `pango-view -q -o "assets/overlays/subtitles/${sub.name}" --background="#0B0F17E6" --markup --margin=14 --text="${sub.text.replace(/"/g, '\\"')}"`;
  execSync(cmd);
}
console.log("All kinetic subtitle cards generated!");
