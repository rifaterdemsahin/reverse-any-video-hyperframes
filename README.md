# Your video analysis

Job: `639a35317eea`
Source: https://www.youtube.com/watch?v=KnqTiAXUH7M (analysed for structure and timing only)

## What is in this zip

- `metrics.json`: length, pace, cut rate, shot length and hook timing, as numbers.
- `hyperframes_prompt.md`: the style, the pacing and one prompt for each scene.
- `hyperframes_template.json`: the scene plan with {{placeholders}} for your own text, and a timeline.
- `edit_decision_list.edl`: one event per shot, for any video editor. Needs an uploaded video. (not in this job)
- `storyboard.md`: one panel per shot: what is on screen, camera, and whether there is speech. Needs an uploaded video. (not in this job)

## How to make your own video

1. Read `hyperframes_prompt.md` for the pace, the cut rhythm and the scene order.
2. Open `hyperframes_template.json` and fill in each placeholder with your own content.
3. Give the filled plan to HyperFrames, or hand the whole folder to an AI agent with `AGENTS.md`.
4. Check the timing against the `timeline` in the template before you render.

## Rules

- Every number here was measured. Nothing is guessed.
- The analysis describes structure. It does not contain the original script, frames or transcript.
- Write your own words. Do not copy sentences from the original video.
- Check that you have the rights to any image, music or clip you add.

## Placeholders

`{{body_1}}`, `{{body_2}}`, `{{body_3}}`, `{{body_4}}`, `{{body_5}}`, `{{body_6}}`, `{{body_7}}`, `{{body_8}}`, `{{headline_1}}`, `{{headline_2}}`, `{{headline_3}}`, `{{headline_4}}`, `{{headline_5}}`, `{{headline_6}}`, `{{headline_7}}`, `{{headline_8}}`, `{{logline}}`, `{{narration_1}}`, `{{narration_2}}`, `{{narration_3}}`, `{{narration_4}}`, `{{narration_5}}`, `{{narration_6}}`, `{{narration_7}}`, `{{narration_8}}`, `{{subtitle}}`, `{{title}}`
