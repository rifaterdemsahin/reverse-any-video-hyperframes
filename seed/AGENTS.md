# AGENTS.md: build a video from this analysis

You are helping a person make their own video in the structure measured in this folder.

## Inputs

- `metrics.json`: length, pace, cut rate, shot length and hook timing, as numbers.
- `hyperframes_prompt.md`: the style, the pacing and one prompt for each scene.
- `hyperframes_template.json`: the scene plan with {{placeholders}} for your own text, and a timeline.
- `plan.json`: the production configuration for the high-retention 60s tech promo video format.

## Steps

1. Read `hyperframes_template.json`. Note each scene's `kind`, `timeline` entry and `target_words`.
2. Ask the person for: the title, the logline, and for each scene a headline, a body/subtitle, and narration.
   Ask in one clean list or questionnaire, not one question at a time.
3. Write the filled plan as JSON in the same shape as the template. Keep each scene's `kind`.
   Keep the narration near `target_words` for its scene, so the timing still fits (at 216 WPM target pacing).
4. Build the HyperFrames project from the filled plan:
   - For the full 8-scene 306s explainer, build across the 8 timeline blocks.
   - For the high-retention 60s promo format, map onto the 6 scenes defined in `plan.json` and `compositions/`.
5. Check that the total length is within 10% of the target duration.
6. Verify audio ducking (background music lowered by 12–16dB during speech) and SFX placement.
7. Report what was filled, what placeholders remain open, and any scene that needs timing calibration.

## Rules

- Do not invent facts, figures or quotes. Use only what the person gives you.
- Do not copy sentences from the original reference video. Write new narration.
- Do not change the scene order or the pacing unless the person asks.
- If a placeholder has no content, leave it visibly empty and say so. Never fill it with filler text.
- Always verify that the composition can be previewed in browser (`index.html`) and rendered via `scripts/render_video.mjs`.

## Placeholders to fill

`{{title}}`, `{{logline}}`, `{{subtitle}}`,
`{{headline_1}}` through `{{headline_8}}`,
`{{body_1}}` through `{{body_8}}`,
`{{narration_1}}` through `{{narration_8}}`
