import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('output', { recursive: true });
mkdirSync('/tmp/hf_scenes', { recursive: true });

console.log("=== HyperFrames Video Compiler v2: 60s 1080p 60fps (AI Plates + Animated Subtitles) ===");

// 1. Scene 1 (0:00 - 0:08, 8s)
console.log("Compiling Scene 1: Hook & The Promise...");
execSync(`ffmpeg -y \
  -loop 1 -t 8 -i assets/images/scene_1_hook.jpg \
  -i assets/videos/aroll_hook.mp4 \
  -i assets/overlays/s1_title.png \
  -i assets/overlays/s1_comparison.png \
  -i assets/overlays/subtitles/sub_1a.png \
  -i assets/overlays/subtitles/sub_1b.png \
  -i assets/overlays/subtitles/sub_1c.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,zoompan=z='min(zoom+0.00015,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=480:s=1920x1080:fps=60,setsar=1[img_bg];
    [1:v]scale=1920:1080,fps=60,format=rgba,colorchannelmixer=aa=0.3[vid_overlay];
    [img_bg][vid_overlay]overlay=0:0[base];
    [2:v]format=rgba,fade=t=in:st=0.3:d=0.5:alpha=1,fade=t=out:st=7.6:d=0.3:alpha=1[title];
    [3:v]format=rgba,fade=t=in:st=2.0:d=0.6:alpha=1,fade=t=out:st=7.6:d=0.3:alpha=1[comp];
    [4:v]format=rgba,fade=t=in:st=0.3:d=0.3:alpha=1,fade=t=out:st=2.7:d=0.2:alpha=1[sub1];
    [5:v]format=rgba,fade=t=in:st=2.8:d=0.3:alpha=1,fade=t=out:st=5.3:d=0.2:alpha=1[sub2];
    [6:v]format=rgba,fade=t=in:st=5.4:d=0.3:alpha=1,fade=t=out:st=7.7:d=0.2:alpha=1[sub3];
    [base][title]overlay=100:200:enable='between(t,0.3,7.9)'[v1];
    [v1][comp]overlay=1060:200:enable='between(t,2.0,7.9)'[v2];
    [v2][sub1]overlay=(W-w)/2:940:enable='between(t,0.3,2.8)'[v3];
    [v3][sub2]overlay=(W-w)/2:940:enable='between(t,2.8,5.4)'[v4];
    [v4][sub3]overlay=(W-w)/2:940:enable='between(t,5.4,7.8)'[outv]
  " -map "[outv]" -t 8 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_1.mp4 2>/dev/null`);

// 2. Scene 2 (0:08 - 0:18, 10s)
console.log("Compiling Scene 2: The Old Way vs The New Way...");
execSync(`ffmpeg -y \
  -loop 1 -t 10 -i assets/images/scene_2_old_vs_new.jpg \
  -i assets/videos/raw_logs_scroll.mp4 \
  -i assets/overlays/s2_left.png \
  -i assets/overlays/s2_right.png \
  -i assets/overlays/subtitles/sub_2a.png \
  -i assets/overlays/subtitles/sub_2b.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,setsar=1[img_bg];
    [1:v]scale=1920:1080,fps=60,format=rgba,colorchannelmixer=aa=0.25[vid_overlay];
    [img_bg][vid_overlay]overlay=0:0[base];
    [2:v]format=rgba,fade=t=in:st=0:d=0.4:alpha=1[left];
    [3:v]format=rgba,fade=t=in:st=5.0:d=0.5:alpha=1[right];
    [4:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st=4.8:d=0.2:alpha=1[sub1];
    [5:v]format=rgba,fade=t=in:st=4.9:d=0.3:alpha=1,fade=t=out:st=9.7:d=0.2:alpha=1[sub2];
    [base][left]overlay=100:260[v1];
    [v1][right]overlay=1040:260:enable='gte(t,5.0)'[v2];
    [v2][sub1]overlay=(W-w)/2:940:enable='between(t,0.2,4.8)'[v3];
    [v3][sub2]overlay=(W-w)/2:940:enable='between(t,4.9,9.8)'[outv]
  " -map "[outv]" -t 10 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_2.mp4 2>/dev/null`);

// 3. Scene 3 (0:18 - 0:28, 10s: 5s demo + 5s review)
console.log("Compiling Scene 3: Verified Output...");
execSync(`ffmpeg -y \
  -i assets/videos/app_upload_demo.mp4 \
  -loop 1 -t 5 -i assets/images/scene_3_verified.jpg \
  -i assets/overlays/s3_pills.png \
  -i assets/overlays/s3_badge.png \
  -i assets/overlays/subtitles/sub_3a.png \
  -i assets/overlays/subtitles/sub_3b.png \
  -i assets/overlays/subtitles/sub_3c.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,setsar=1[demo];
    [1:v]scale=1920:1080,fps=60,zoompan=z='min(zoom+0.0002,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=300:s=1920x1080:fps=60,setsar=1[review];
    [2:v]format=rgba,fade=t=in:st=0.8:d=0.4:alpha=1[pills];
    [3:v]format=rgba,fade=t=in:st=1.0:d=0.3:alpha=1[badge];
    [4:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st=2.6:d=0.2:alpha=1[sub1];
    [5:v]format=rgba,fade=t=in:st=2.7:d=0.3:alpha=1,fade=t=out:st=4.8:d=0.2:alpha=1[sub2];
    [6:v]format=rgba,fade=t=in:st=1.0:d=0.3:alpha=1,fade=t=out:st=4.8:d=0.2:alpha=1[sub3];
    [demo][pills]overlay=360:860[d1];
    [d1][sub1]overlay=(W-w)/2:940:enable='between(t,0.2,2.6)'[d2];
    [d2][sub2]overlay=(W-w)/2:940:enable='between(t,2.7,4.9)'[partA];
    [review][badge]overlay=120:700:enable='gte(t,1.0)'[r1];
    [r1][sub3]overlay=(W-w)/2:940:enable='gte(t,1.0)'[partB];
    [partA]trim=duration=5,setpts=PTS-STARTPTS[a];
    [partB]trim=duration=5,setpts=PTS-STARTPTS[b];
    [a][b]concat=n=2:v=1:a=0[outv]
  " -map "[outv]" -t 10 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_3.mp4 2>/dev/null`);

// 4. Scene 4 (0:28 - 0:40, 12s)
console.log("Compiling Scene 4: The Hyperframes Magic...");
execSync(`ffmpeg -y \
  -loop 1 -t 12 -i assets/images/scene_4_hyperframes.jpg \
  -i assets/videos/hyperframes_build_demo.mp4 \
  -i assets/overlays/s4_top.png \
  -i assets/overlays/s4_lower.png \
  -i assets/overlays/subtitles/sub_4a.png \
  -i assets/overlays/subtitles/sub_4b.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,setsar=1[img_bg];
    [1:v]scale=1920:1080,fps=60,format=rgba,colorchannelmixer=aa=0.3[vid_overlay];
    [img_bg][vid_overlay]overlay=0:0[base];
    [2:v]format=rgba,fade=t=in:st=0.3:d=0.4:alpha=1[top];
    [3:v]format=rgba,fade=t=in:st=3.6:d=0.4:alpha=1[lower];
    [4:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st=5.4:d=0.2:alpha=1[sub1];
    [5:v]format=rgba,fade=t=in:st=5.5:d=0.3:alpha=1,fade=t=out:st=11.6:d=0.2:alpha=1[sub2];
    [base][top]overlay=680:80[v1];
    [v1][lower]overlay=640:840:enable='gte(t,3.6)'[v2];
    [v2][sub1]overlay=(W-w)/2:940:enable='between(t,0.2,5.4)'[v3];
    [v3][sub2]overlay=(W-w)/2:940:enable='between(t,5.5,11.6)'[outv]
  " -map "[outv]" -t 12 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_4.mp4 2>/dev/null`);

// 5. Scene 5 (0:40 - 0:52, 12s)
console.log("Compiling Scene 5: Simple Credit Pricing...");
execSync(`ffmpeg -y \
  -loop 1 -t 12 -i assets/images/scene_5_pricing.jpg \
  -i assets/videos/aroll_pricing.mp4 \
  -i assets/overlays/s5_card.png \
  -i assets/overlays/subtitles/sub_5a.png \
  -i assets/overlays/subtitles/sub_5b.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,setsar=1[img_bg];
    [1:v]scale=1920:1080,fps=60,format=rgba,colorchannelmixer=aa=0.2[vid_overlay];
    [img_bg][vid_overlay]overlay=0:0[base];
    [2:v]format=rgba,fade=t=in:st=3.0:d=0.5:alpha=1[card];
    [3:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st=4.7:d=0.2:alpha=1[sub1];
    [4:v]format=rgba,fade=t=in:st=4.8:d=0.3:alpha=1,fade=t=out:st=11.6:d=0.2:alpha=1[sub2];
    [base][card]overlay=1100:220:enable='gte(t,3.0)'[v1];
    [v1][sub1]overlay=(W-w)/2:940:enable='between(t,0.2,4.7)'[v2];
    [v2][sub2]overlay=(W-w)/2:940:enable='between(t,4.8,11.6)'[outv]
  " -map "[outv]" -t 12 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_5.mp4 2>/dev/null`);

// 6. Scene 6 (0:52 - 1:00, 8s)
console.log("Compiling Scene 6: Call to Action & Skool Community...");
execSync(`ffmpeg -y \
  -loop 1 -t 8 -i assets/images/scene_6_cta.jpg \
  -i assets/videos/aroll_cta.mp4 \
  -i assets/overlays/s6_cta.png \
  -i assets/overlays/subtitles/sub_6a.png \
  -i assets/overlays/subtitles/sub_6b.png \
  -filter_complex "
    [0:v]scale=1920:1080,fps=60,setsar=1[img_bg];
    [1:v]scale=1920:1080,fps=60,format=rgba,colorchannelmixer=aa=0.25[vid_overlay];
    [img_bg][vid_overlay]overlay=0:0[base];
    [2:v]format=rgba,fade=t=in:st=1.0:d=0.4:alpha=1[cta];
    [3:v]format=rgba,fade=t=in:st=0.2:d=0.3:alpha=1,fade=t=out:st=3.9:d=0.2:alpha=1[sub1];
    [4:v]format=rgba,fade=t=in:st=4.0:d=0.3:alpha=1,fade=t=out:st=7.7:d=0.2:alpha=1[sub2];
    [base][cta]overlay=260:840:enable='gte(t,1.0)'[v1];
    [v1][sub1]overlay=(W-w)/2:940:enable='between(t,0.2,3.9)'[v2];
    [v2][sub2]overlay=(W-w)/2:940:enable='between(t,4.0,7.8)'[outv]
  " -map "[outv]" -t 8 -c:v libx264 -pix_fmt yuv420p -r 60 /tmp/hf_scenes/scene_6.mp4 2>/dev/null`);

// Concatenate all 6 video scenes
console.log("Concatenating video timeline...");
const concatList = `
file '/tmp/hf_scenes/scene_1.mp4'
file '/tmp/hf_scenes/scene_2.mp4'
file '/tmp/hf_scenes/scene_3.mp4'
file '/tmp/hf_scenes/scene_4.mp4'
file '/tmp/hf_scenes/scene_5.mp4'
file '/tmp/hf_scenes/scene_6.mp4'
`.trim();
writeFileSync('/tmp/hf_scenes/concat.txt', concatList);
execSync(`ffmpeg -y -f concat -safe 0 -i /tmp/hf_scenes/concat.txt -c copy /tmp/hf_scenes/full_video.mp4 2>/dev/null`);

// Assemble Master Audio Graph (Voiceover + Ducked Beat + 7 SFX)
console.log("Mastering synced multi-track audio with ducking and SFX triggers...");
const sfxInputs = [
  `-i assets/audio/voiceover.mp3`,         // 0: voiceover
  `-i assets/audio/bg_music.mp3`,          // 1: bg beat
  `-i assets/audio/sfx/whoosh.mp3`,        // 2: 0:02 whoosh
  `-i assets/audio/sfx/error.mp3`,         // 3: 0:08 error thud
  `-i assets/audio/sfx/chime.mp3`,         // 4: 0:13 chime
  `-i assets/audio/sfx/notification.mp3`,  // 5: 0:24 stamp
  `-i assets/audio/sfx/impact-bass-1.mp3`, // 6: 0:28 sub-bass impact
  `-i assets/audio/sfx/ping.mp3`,          // 7: 0:43 coin clink
  `-i assets/audio/sfx/click.mp3`          // 8: 0:53 cta click
].join(' ');

const audioFilter = `
  [0:a]volume=1.0[vo];
  [1:a]volume=0.22,afade=t=out:st=59.5:d=0.5[bg];
  [2:a]adelay=2000|2000,volume=1.2[sfx1];
  [3:a]adelay=8000|8000,volume=1.0[sfx2];
  [4:a]adelay=13000|13000,volume=1.1[sfx3];
  [5:a]adelay=24000|24000,volume=1.2[sfx4];
  [6:a]adelay=28000|28000,volume=1.4[sfx5];
  [7:a]adelay=43000|43000,volume=1.2[sfx6];
  [8:a]adelay=53000|53000,volume=1.3[sfx7];
  [vo][bg][sfx1][sfx2][sfx3][sfx4][sfx5][sfx6][sfx7]amix=inputs=9:dropout_transition=0,volume=1.8,alimiter=limit=0.98[master_audio]
`.replace(/\n\s*/g, '');

execSync(`ffmpeg -y ${sfxInputs} -filter_complex "${audioFilter}" -map "[master_audio]" -t 60 -c:a aac -b:a 256k /tmp/hf_scenes/master_audio.m4a 2>/dev/null`);

// Final Mux: Video + Master Audio -> output/reverse_any_video_promo.mp4
console.log("Muxing final 60s 1080p 60fps MP4 export...");
const finalCmd = `ffmpeg -y -i /tmp/hf_scenes/full_video.mp4 -i /tmp/hf_scenes/master_audio.m4a \
  -c:v copy -c:a copy -t 60 -movflags +faststart output/reverse_any_video_promo.mp4 2>/dev/null`;
execSync(finalCmd);

console.log("=== EXPORT SUCCESSFUL: output/reverse_any_video_promo.mp4 ===");
