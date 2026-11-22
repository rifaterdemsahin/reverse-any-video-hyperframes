# 💰 Production & Infrastructure Cost Breakdown

**Project:** Reverse Any Video — HyperFrames 60s Tech Promo (1080p 60fps)  
**Last Updated:** 2026-11-22  
**Currency:** USD ($)  

---

## 📊 Summary of Costs

| Service / Resource | Provider | Units / Usage | Unit Rate | Total Cost |
|---|---|---|---|---|
| **AI Voiceover (Kokoro-82M)** | DeepInfra | ~135 Words (60s speech) | $0.0001 / 1k chars | **$0.0001** |
| **Draft Images (FLUX-1-schnell)** | DeepInfra | 7 Generations | $0.0005 / image | **$0.0035** |
| **High-Quality Plates (FLUX-1-dev)** | DeepInfra | 7 Generations (12B 28-step) | $0.0250 / image | **$0.1750** |
| **Cloud Hosting (Machines)** | Fly.io (LHR) | 2 × shared-cpu-1x (256MB) | $0.0000022 / sec | **$0.0080** |
| **Local Render & FFmpeg** | Local CPU | 60s @ 60fps 1080p | $0.00 | **$0.0000** |
| **Total Production Cost** | — | — | — | **$0.1866 (~$0.19)** |

---

## 🔍 Detailed Breakdown by Item

### 1. 🎙️ DeepInfra Text-to-Speech (TTS)
- **Model:** `hexgrad/Kokoro-82M`
- **Voice Character:** `am_adam`
- **Script Length:** 135 words (approx. 780 characters across 6 scenes)
- **Rate:** $0.0001 per 1,000 characters
- **Total TTS Cost:** **$0.00008**

### 2. 🎨 DeepInfra Image Generation (Fast Draft)
- **Model:** `black-forest-labs/FLUX-1-schnell`
- **Generations:**
  - `scene_1_hook.jpg`
  - `scene_2_old_vs_new.jpg`
  - `scene_3_verified.jpg`
  - `scene_4_hyperframes.jpg`
  - `scene_5_pricing.jpg`
  - `scene_6_cta.jpg`
  - `storyboard_grid.jpg` (initial draft)
- **Rate:** $0.0005 per image (4 inference steps)
- **Total Schnell Cost:** 7 × $0.0005 = **$0.0035**

### 3. 🖼️ DeepInfra Image Generation (High-Fidelity Upgrade)
- **Model:** `black-forest-labs/FLUX-1-dev` (12B parameter flagship model)
- **Inference Steps:** 28 guidance-distilled steps for photorealism and crisp UI textures
- **Generations:**
  - 1 × Benchmark test generation
  - 6 × High-detail scene plates (`scene_1_hook.jpg` through `scene_6_cta.jpg`)
- **Rate:** $0.025 per image
- **Total FLUX-1-dev Cost:** 7 × $0.025 = **$0.1750**

### 4. ☁️ Fly.io Cloud Edge Hosting
- **Application:** `reverse-any-video-hyperframes`
- **Region:** London (`lhr`)
- **Configuration:** 2 Machines, `shared-cpu-1x`, 256 MB RAM
- **Uptime:** Active during development & deployment
- **Rate:** Included in Fly.io free allowance ($5/mo tier) / pay-as-you-go ~$0.0000022/sec
- **Estimated Session Cost:** **<$0.01**

### 5. ⚙️ Local Compute & Processing
- **Tools:** Node.js, Python 3, FFmpeg (x264/AAC), Pango
- **Cost:** **$0.00**

---

## 📈 Projected Cost Per Video Production

Based on this architecture, producing a new 60-second video with custom script and AI visuals costs:
- **TTS Generation:** ~$0.0001
- **6 FLUX-1-dev Scene Plates:** ~$0.1500
- **FFmpeg Composite & Muxing:** $0.00
- **Total per video:** **~$0.15 USD** (Under 15 cents per 60s high-retention video!)
