import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const clips = [
  {
    name: 'aroll_hook.mp4',
    duration: 8,
    // Dark mode SaaS creator studio backdrop with subtle animated gradient and vignette
    filter: `color=c=0x0B0F17:s=1920x1080:d=8,
             drawgrid=w=80:h=80:t=1:c=0x1E293B@0.4,
             geq=r='11 + 15*sin(2*PI*(X/1920 + T/4))':g='15 + 25*sin(2*PI*(Y/1080 + T/4))':b='23 + 40*cos(2*PI*(X/1920 + T/4))',
             vignette=PI/4`
  },
  {
    name: 'raw_logs_scroll.mp4',
    duration: 10,
    // Chaotic red-tinted scrolling terminal logs with glitch effect
    filter: `color=c=0x140608:s=1920x1080:d=10,
             drawgrid=w=40:h=40:t=1:c=0xEF4444@0.2,
             geq=r='20 + 40*sin(10*T + Y/20)':g='6 + 10*cos(5*T)':b='8 + 10*sin(5*T)'`
  },
  {
    name: 'app_upload_demo.mp4',
    duration: 10,
    // Sleek dark UI with animated upload zone and cyan radar/glow pulse
    filter: `color=c=0x0B0F17:s=1920x1080:d=10,
             drawgrid=w=64:h=64:t=1:c=0x06B6D4@0.2,
             geq=r='11':g='15 + 30*sin(2*PI*(hypot(X-960,Y-540)/300 - T*1.5))':b='23 + 60*sin(2*PI*(hypot(X-960,Y-540)/300 - T*1.5))'`
  },
  {
    name: 'aroll_review.mp4',
    duration: 10,
    // Emerald green inspected studio background with soft ambient breathing
    filter: `color=c=0x061811:s=1920x1080:d=10,
             drawgrid=w=96:h=96:t=1:c=0x10B981@0.25,
             geq=r='6':g='24 + 25*sin(2*PI*T/3)':b='17 + 20*cos(2*PI*T/3)',
             vignette=PI/3.5`
  },
  {
    name: 'hyperframes_build_demo.mp4',
    duration: 12,
    // Multi-track Hyperframes timeline assembly animation
    filter: `color=c=0x0B0F17:s=1920x1080:d=12,
             drawgrid=w=120:h=60:t=2:c=0x38BDF8@0.3,
             geq=r='11 + 30*sin(X/100 + T*4)':g='15 + 40*cos(Y/100 + T*3)':b='23 + 60*sin((X+Y)/150 + T*5)'`
  },
  {
    name: 'aroll_pricing.mp4',
    duration: 12,
    // Studio lighting with gold/cyan accent bokeh
    filter: `color=c=0x0B0F17:s=1920x1080:d=12,
             drawgrid=w=80:h=80:t=1:c=0xF59E0B@0.2,
             geq=r='15 + 35*sin(T*2 + X/400)':g='18 + 30*sin(T*2 + Y/400)':b='28 + 45*cos(T*2 + X/300)'`
  },
  {
    name: 'aroll_cta.mp4',
    duration: 8,
    // Final energetic CTA frame pointing downward
    filter: `color=c=0x0B0F17:s=1920x1080:d=8,
             drawgrid=w=100:h=100:t=1:c=0x06B6D4@0.35,
             geq=r='11 + 25*sin(T*3)':g='20 + 40*sin(T*3)':b='35 + 60*cos(T*3)'`
  }
];

console.log("Generating 1080p 60fps mock background videos for Hyperframes timeline...");

for (const clip of clips) {
  const outPath = `assets/videos/${clip.name}`;
  console.log(`Generating ${outPath} (${clip.duration}s @ 60fps)...`);
  const cmd = `ffmpeg -y -f lavfi -i "${clip.filter.replace(/\n\s*/g, '')}" -c:v libx264 -pix_fmt yuv420p -r 60 -t ${clip.duration} "${outPath}" 2>/dev/null`;
  execSync(cmd);
  // Also copy to root directory for any direct relative link compatibility
  execSync(`cp "${outPath}" "./${clip.name}"`);
}

console.log("All video assets generated successfully!");
