import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
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

const SCENE_PROMPTS = [
  {
    name: 'scene_1_hook.jpg',
    prompt: 'A professional tech video creator in modern dark studio, presenting confidently, deep slate background #0B0F17, subtle electric cyan rim lighting and glowing grid lines, glassmorphism UI card overlay, ultra high resolution 4k cinematic photorealistic'
  },
  {
    name: 'scene_2_old_vs_new.jpg',
    prompt: 'Split screen concept art, left half shows red chaotic glowing terminal code and unformatted raw json errors, right half shows emerald green clean structured holographic AI document blueprint with checkmarks, sleek SaaS dark mode, cinematic'
  },
  {
    name: 'scene_3_verified.jpg',
    prompt: 'Tech founder in dark studio holding transparent glass tablet inspecting video blueprint, glowing emerald green shield verification badge stamp Checked And Used By Me, electric cyan accents, photorealistic'
  },
  {
    name: 'scene_4_hyperframes.jpg',
    prompt: 'Futuristic video editing multi-track timeline UI, Hyperframes software interface, glowing cyan and purple particle burst on track, clips snapping together, dark slate sleek UI 4k'
  },
  {
    name: 'scene_5_pricing.jpg',
    prompt: 'Clean glassmorphism card floating in dark studio, glowing 3D gold and cyan digital coins dropping, text 1 Dollar 10 Credits, emerald green NO SUBSCRIPTIONS badge, minimal SaaS aesthetic 4k'
  },
  {
    name: 'scene_6_cta.jpg',
    prompt: 'Tech creator pointing downward towards bottom frame, glowing electric cyan button Get Your Credits Now and emerald card Join Skool Community, sleek dark slate studio background, cinematic lighting'
  },
  {
    name: 'storyboard_grid.jpg',
    prompt: 'A neat 6-panel storyboard sheet showing 6 scenes of a tech promo video in 3x2 grid layout, dark mode aesthetic, electric cyan and emerald green color accents, professional video pre-production storyboard concept art'
  }
];

async function generateImage(item) {
  console.log(`Generating ${item.name} with DeepInfra FLUX-1-schnell...`);
  const res = await fetch("https://api.deepinfra.com/v1/openai/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "black-forest-labs/FLUX-1-schnell",
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
  console.log(`Saved ${seedPath} and ${assetPath}`);
}

async function main() {
  console.log("=== Generating Scene Images & Storyboard via DeepInfra ===");
  for (const item of SCENE_PROMPTS) {
    await generateImage(item);
  }
  console.log("=== All scene images generated successfully! ===");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
