import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

let apiKey = process.env.DEEPINFRA_API_KEY;
if (!apiKey && existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf8');
  const match = envContent.match(/DEEPINFRA_API_KEY=(.*)/);
  if (match) apiKey = match[1].trim();
}

if (!apiKey) {
  console.error("Error: DEEPINFRA_API_KEY missing");
  process.exit(1);
}

mkdirSync('seed/images', { recursive: true });
mkdirSync('assets/images', { recursive: true });

// Using Black Forest Labs FLUX-1-dev (flagship 12B model, superior photorealism & sharpness)
const MODEL = "black-forest-labs/FLUX-1-dev";

const SCENE_PROMPTS = [
  {
    name: 'scene_1_hook.jpg',
    prompt: 'Cinematic medium close-up of a charismatic tech creator in a sleek dark studio, looking directly into camera with confident smile, deep slate background #0B0F17 with glowing electric cyan geometric grid lines, floating glassmorphism UI holographic comparison card on the right displaying video timeline blueprint, award-winning commercial lighting, 8k resolution, razor sharp details, photorealistic'
  },
  {
    name: 'scene_2_old_vs_new.jpg',
    prompt: 'High-tech 50/50 vertical split screen comparison. Left half has dark red atmospheric rim light, showing chaotic scrolling terminal code, error icons, unsimplified raw JSON data with crimson glitch accents. Right half has emerald green clean holographic glow, showing perfectly structured AI blueprint document with glowing checkmarks, futuristic SaaS creator interface, 8k render, hyper-detailed'
  },
  {
    name: 'scene_3_verified.jpg',
    prompt: 'Cinematic shot of modern SaaS web application interface on sleek glass screen, showing a video file being analyzed with glowing progress bar and extraction pills, beside a prominent glowing emerald green verification stamp badge reading Checked & Used By Me, dark slate UI background #0B0F17 with cyan accents, photorealistic studio photography'
  },
  {
    name: 'scene_4_hyperframes.jpg',
    prompt: 'Hyper-detailed futuristic video editing software interface, multi-track editing timeline, glowing cyan and purple particle impact bursts across video tracks, dynamic motion graphic layers snapping into place, dark sleek creator workspace, crisp typography, 8k resolution'
  },
  {
    name: 'scene_5_pricing.jpg',
    prompt: 'Floating futuristic glassmorphism pricing card in dark modern tech studio, glowing 3D metallic gold and cyan credit coins with subtle reflection and physics bounce, bold modern typography display card $1 = 10 Video Credits, emerald green badge NO SUBSCRIPTIONS, sleek minimal SaaS design, 8k render'
  },
  {
    name: 'scene_6_cta.jpg',
    prompt: 'Charismatic tech founder in sleek dark creator studio pointing downwards with confidence, lower third displays glowing interactive electric cyan button Get Your Credits Now and emerald card Join Skool Community, subtle cyan rim lighting, cinematic depth of field, 8k commercial quality'
  }
];

async function generateImage(item) {
  console.log(`[FLUX-1-dev] Generating ${item.name}...`);
  const startTime = Date.now();
  const res = await fetch("https://api.deepinfra.com/v1/openai/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: item.prompt,
      n: 1
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepInfra error for ${item.name}: ${err}`);
  }

  const json = await res.json();
  const b64 = json.data[0].b64_json;
  const buffer = Buffer.from(b64, 'base64');

  const seedPath = `seed/images/${item.name}`;
  const assetPath = `assets/images/${item.name}`;

  writeFileSync(seedPath, buffer);
  writeFileSync(assetPath, buffer);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✓ Saved ${seedPath} (${(buffer.length / 1024).toFixed(0)} KB) in ${elapsed}s`);
}

function buildCompositeStoryboardGrid() {
  console.log("=== Building High-Resolution Master Storyboard Grid (1920x1080) ===");
  try {
    // Composite the 6 high-res scenes into a razor-sharp 3x2 grid with borders and badges
    const cmd = `ffmpeg -y \
      -i seed/images/scene_1_hook.jpg \
      -i seed/images/scene_2_old_vs_new.jpg \
      -i seed/images/scene_3_verified.jpg \
      -i seed/images/scene_4_hyperframes.jpg \
      -i seed/images/scene_5_pricing.jpg \
      -i seed/images/scene_6_cta.jpg \
      -filter_complex "
        [0:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#06B6D4@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 1: HOOK & PROMISE [0:00-0:08]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s1];
        [1:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#EF4444@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 2: OLD VS NEW [0:08-0:18]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s2];
        [2:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#10B981@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 3: VERIFIED OUTPUT [0:18-0:28]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s3];
        [3:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#06B6D4@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 4: HYPERFRAMES MAGIC [0:28-0:40]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s4];
        [4:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#F59E0B@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 5: CREDIT PRICING [0:40-0:52]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s5];
        [5:v]scale=620:340,drawbox=x=0:y=0:w=iw:h=ih:color=#10B981@0.6:t=2,drawbox=x=0:y=0:w=iw:h=40:color=#080C14@0.9:t=fill,drawtext=text='PANEL 6: CALL TO ACTION [0:52-1:00]':x=16:y=12:fontcolor=white:fontsize=18:font='Arial Bold'[s6];
        color=c=#070A10:s=1920x1080[bg];
        [bg]drawtext=text='REVERSE ANY VIDEO — MASTER STORYBOARD BREAKDOWN (FLUX-1-DEV)':x=(w-text_w)/2:y=30:fontcolor=#06B6D4:fontsize=28:font='Arial Black'[canvas];
        [canvas][s1]overlay=20:90[c1];
        [c1][s2]overlay=650:90[c2];
        [c2][s3]overlay=1280:90[c3];
        [c3][s4]overlay=20:450[c4];
        [c4][s5]overlay=650:450[c5];
        [c5][s6]overlay=1280:450[c6];
        [c6]drawtext=text='HeyGen HyperFrames Standard • 60.0s Timeline • DeepInfra FLUX-1-dev & Kokoro-82M Voiceover':x=(w-text_w)/2:y=1020:fontcolor=#94A3B8:fontsize=18:font='Arial'[out]
      " -map "[out]" -frames:v 1 -q:v 2 seed/images/storyboard_grid.jpg 2>/dev/null`;
    execSync(cmd);
    execSync("cp seed/images/storyboard_grid.jpg assets/images/storyboard_grid.jpg");
    console.log("✓ Successfully built high-resolution master storyboard grid: seed/images/storyboard_grid.jpg");
  } catch (err) {
    console.warn("Notice during composite grid build:", err.message);
  }
}

async function main() {
  console.log("=================================================================");
  console.log("🚀 Upgrading Image Quality to Black Forest Labs FLUX-1-dev");
  console.log("=================================================================");
  for (const item of SCENE_PROMPTS) {
    await generateImage(item);
  }
  buildCompositeStoryboardGrid();
  console.log("=================================================================");
  console.log("🎉 All high-resolution FLUX-1-dev images & storyboard grid ready!");
  console.log("=================================================================");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
