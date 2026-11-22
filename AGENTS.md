# AGENTS.md: build a video from this analysis

You are helping a person make their own video in the structure measured in this folder.

## Inputs

- `metrics.json`: length, pace, cut rate, shot length and hook timing, as numbers.
- `hyperframes_prompt.md`: the style, the pacing and one prompt for each scene.
- `hyperframes_template.json`: the scene plan with {{placeholders}} for your own text, and a timeline.

## Steps

1. Read `hyperframes_template.json`. Note each scene's `kind`, `timeline` entry and `target_words`.
2. Ask the person for: the title, the logline, and for each scene a headline, a body and narration.
   Ask in one list, not one question at a time.
3. Write the filled plan as JSON in the same shape as the template. Keep each scene's `kind`.
   Keep the narration near `target_words` for its scene, so the timing still fits.
4. Build the HyperFrames project from the filled plan. Keep the scene durations from `timeline`.
5. Check that the total length is within 10% of `style.duration_s`.
6. Report what you filled, what you could not fill, and any scene that does not fit its time.

## Rules

- Do not invent facts, figures or quotes. Use only what the person gives you.
- Do not copy sentences from the original video. Write new narration.
- Do not change the scene order or the pacing unless the person asks.
- If a placeholder has no content, leave it visibly empty and say so. Never fill it with filler text.

## Placeholders to fill

`{{body_1}}`, `{{body_2}}`, `{{body_3}}`, `{{body_4}}`, `{{body_5}}`, `{{body_6}}`, `{{body_7}}`, `{{body_8}}`, `{{headline_1}}`, `{{headline_2}}`, `{{headline_3}}`, `{{headline_4}}`, `{{headline_5}}`, `{{headline_6}}`, `{{headline_7}}`, `{{headline_8}}`, `{{logline}}`, `{{narration_1}}`, `{{narration_2}}`, `{{narration_3}}`, `{{narration_4}}`, `{{narration_5}}`, `{{narration_6}}`, `{{narration_7}}`, `{{narration_8}}`, `{{subtitle}}`, `{{title}}`
