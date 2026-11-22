import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SCRIPT_SCENES = [
  {
    start: 0.2,
    text: "What if you could take ANY viral video, reverse-engineer every cut, color, and pacing decision, and turn it into a perfect blueprint in seconds?"
  },
  {
    start: 8.2,
    text: "The old way was chaotic. Sifting through bloated logs and unsimplified raw data that breaks your workflow. The new way? Clean, structured, AI-ready blueprints."
  },
  {
    start: 18.2,
    text: "Just drag and drop your target video. The AI extracts the exact cut timing, color palette, and edit rhythm. Verified and checked in production."
  },
  {
    start: 28.2,
    text: "Then, drop that blueprint directly into Hyperframes. Watch your timeline auto-assemble with precision transitions, dynamic layers, and kinetic captions 10 times faster."
  },
  {
    start: 40.2,
    text: "Best of all: no recurring subscriptions. It’s simple credit pricing: just one dollar gives you ten full video credits."
  },
  {
    start: 52.2,
    text: "Grab your credits below, or join our Skool community to learn how we built this entire engine. Link is in the description!"
  }
];

console.log("Generating voiceover audio segments...");

const tempFiles = [];
for (let i = 0; i < SCRIPT_SCENES.length; i++) {
  const scene = SCRIPT_SCENES[i];
  const aiffPath = `/tmp/vo_scene_${i}.aiff`;
  const wavPath = `/tmp/vo_scene_${i}.wav`;
  // Using Samantha or Daniel voice with speech rate
  execSync(`say -v Daniel -r 175 -o "${aiffPath}" "${scene.text}"`);
  execSync(`ffmpeg -y -i "${aiffPath}" -ar 44100 -ac 2 "${wavPath}" 2>/dev/null`);
  tempFiles.push({ wav: wavPath, start: scene.start });
}

// Assemble into 60s voiceover track
let filterInputs = '';
let filterGraph = '';
tempFiles.forEach((f, idx) => {
  filterInputs += ` -i "${f.wav}"`;
  const delayMs = Math.round(f.start * 1000);
  filterGraph += `[${idx + 1}:a]adelay=${delayMs}|${delayMs}[a${idx}];`;
});
const mixInputs = tempFiles.map((_, idx) => `[a${idx}]`).join('');
filterGraph += `[0:a]${mixInputs}amix=inputs=${tempFiles.length + 1}:dropout_transition=0,volume=3.0,alimiter=limit=0.95[outa]`;

console.log("Assembling full 60s voiceover track...");
// 0:a is 60s silence
execSync(`ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" ${filterInputs} -filter_complex "${filterGraph}" -map "[outa]" -t 60 -b:a 192k assets/audio/voiceover.mp3`);

console.log("Voiceover generated at assets/audio/voiceover.mp3");

// Generate upbeat, modern electronic background beat
console.log("Synthesizing upbeat modern electronic background beat (128 BPM, 60s)...");
// 128 BPM synth bassline + kick + hihat rhythm + synth chord arps
const musicCommand = `ffmpeg -y -f lavfi -i "sine=frequency=130:duration=60" \
  -f lavfi -i "sine=frequency=65:duration=60" \
  -f lavfi -i "anoisesrc=d=60:c=white:r=44100:a=0.08" \
  -filter_complex "
    [0:a]tremolo=f=4.266:d=0.85,lowpass=f=400,volume=1.8[bass];
    [1:a]tremolo=f=2.133:d=0.95,lowpass=f=120,volume=2.2[kick];
    [2:a]highpass=f=8000,tremolo=f=8.533:d=0.9,volume=0.4[hihat];
    [bass][kick][hihat]amix=inputs=3:dropout_transition=0,aecho=0.8:0.7:40:0.3,volume=1.5,alimiter=limit=0.9[beat]
  " -map "[beat]" -t 60 -b:a 192k assets/audio/bg_music.mp3`;

execSync(musicCommand);
console.log("Modern electronic beat generated at assets/audio/bg_music.mp3");

// Create root symlinks / copies for convenience
execSync('cp assets/audio/voiceover.mp3 ./voiceover.mp3');
execSync('cp assets/audio/bg_music.mp3 ./bg_music.mp3');
console.log("Audio generation complete!");
