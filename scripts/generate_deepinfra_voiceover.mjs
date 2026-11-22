import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// Read API key from environment or .env file
let apiKey = process.env.DEEPINFRA_API_KEY;
if (!apiKey && existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf8');
  const match = envContent.match(/DEEPINFRA_API_KEY=(.*)/);
  if (match) apiKey = match[1].trim();
}

if (!apiKey) {
  console.error("Error: DEEPINFRA_API_KEY not found in environment or .env");
  process.exit(1);
}

const SCENES = [
  {
    index: 0,
    start: 0.2,
    maxDuration: 7.5,
    text: "What if you could take ANY viral video, reverse-engineer every cut, color, and pacing decision, and turn it into a perfect blueprint in seconds?"
  },
  {
    index: 1,
    start: 8.2,
    maxDuration: 9.3,
    text: "The old way was chaotic. Sifting through bloated logs and unsimplified raw data that breaks your workflow. The new way? Clean, structured, AI-ready blueprints."
  },
  {
    index: 2,
    start: 18.2,
    maxDuration: 9.3,
    text: "Just drag and drop your target video. The AI extracts the exact cut timing, color palette, and edit rhythm. Verified and checked in production."
  },
  {
    index: 3,
    start: 28.2,
    maxDuration: 11.2,
    text: "Then, drop that blueprint directly into Hyperframes. Watch your timeline auto-assemble with precision transitions, dynamic layers, and kinetic captions 10 times faster."
  },
  {
    index: 4,
    start: 40.2,
    maxDuration: 11.2,
    text: "Best of all: no recurring subscriptions. It’s simple credit pricing: just one dollar gives you ten full video credits."
  },
  {
    index: 5,
    start: 52.2,
    maxDuration: 7.0,
    text: "Grab your credits below, or join our Skool community to learn how we built this entire engine. Link is in the description!"
  }
];

async function generateTTS(text, outPath, speed = 1.15) {
  const res = await fetch("https://api.deepinfra.com/v1/openai/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "hexgrad/Kokoro-82M",
      input: text,
      voice: "am_adam",
      speed: speed
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepInfra API error (${res.status}): ${errText}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buffer);
}

async function main() {
  console.log("=== Generating Studio-Grade AI Voiceover via DeepInfra (Kokoro-82M) ===");

  const tempFiles = [];

  for (const scene of SCENES) {
    console.log(`Generating Scene ${scene.index + 1}...`);
    const rawMp3 = `/tmp/di_raw_${scene.index}.mp3`;
    const fittedWav = `/tmp/di_fitted_${scene.index}.wav`;

    await generateTTS(scene.text, rawMp3, 1.18);

    // Get duration
    const durStr = execSync(`ffprobe -i "${rawMp3}" -show_entries format=duration -v quiet -of csv="p=0"`).toString().trim();
    let dur = parseFloat(durStr);
    console.log(`  Raw speech duration: ${dur.toFixed(2)}s (Target max: ${scene.maxDuration}s)`);

    // Ensure audio fits within scene window using atempo if slightly long
    let tempoFilter = '';
    if (dur > scene.maxDuration) {
      const ratio = dur / scene.maxDuration;
      console.log(`  Adjusting tempo by ${ratio.toFixed(2)}x to fit scene window...`);
      tempoFilter = `,atempo=${ratio.toFixed(3)}`;
    }

    execSync(`ffmpeg -y -i "${rawMp3}" -af "volume=1.8,alimiter=limit=0.95${tempoFilter}" -ar 44100 -ac 2 "${fittedWav}" 2>/dev/null`);
    tempFiles.push({ wav: fittedWav, start: scene.start });
  }

  // Assemble full 60s voiceover track with precise adelay offsets
  console.log("Assembling into seamless 60.0s master voiceover track...");
  let filterInputs = '';
  let filterGraph = '';

  tempFiles.forEach((f, idx) => {
    filterInputs += ` -i "${f.wav}"`;
    const delayMs = Math.round(f.start * 1000);
    filterGraph += `[${idx + 1}:a]adelay=${delayMs}|${delayMs}[a${idx}];`;
  });

  const mixInputs = tempFiles.map((_, idx) => `[a${idx}]`).join('');
  filterGraph += `[0:a]${mixInputs}amix=inputs=${tempFiles.length + 1}:dropout_transition=0,volume=1.8,alimiter=limit=0.98[outa]`;

  const assembleCmd = `ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" ${filterInputs} -filter_complex "${filterGraph}" -map "[outa]" -t 60 -b:a 192k assets/audio/voiceover.mp3 2>/dev/null`;
  execSync(assembleCmd);

  // Copy to root voiceover.mp3 for backward compatibility
  execSync('cp assets/audio/voiceover.mp3 ./voiceover.mp3');

  console.log("=== Studio AI Voiceover generated successfully at assets/audio/voiceover.mp3! ===");
}

main().catch(err => {
  console.error("Voiceover generation failed:", err);
  process.exit(1);
});
