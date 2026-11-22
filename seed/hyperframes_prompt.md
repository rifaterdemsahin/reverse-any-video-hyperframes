# HyperFrames template prompt

Built from the measured structure of the analysed video. It contains no words from that video.
Replace each `{{placeholder}}` with your own content, then render with the template JSON.

## Style and pacing

- Length: about 306 seconds in 8 scenes (or 60 seconds in 6 scenes for high-retention promo cut).
- Speaking pace: about 216 words per minute of narration.
- Cut rhythm: 2.0 – 3.5s shot duration (approx. 20 – 28 cuts per minute for kinetic SaaS/creator reels).
- Hook: the first 17.6 seconds carry the opening promise.
- Questions asked to the viewer: 5.
- Keep one punch-in on every beat and a clean cut between scenes, as measured.

## One prompt for the whole video

```
Make a 16:9 explainer with 8 scenes. Open with a hook of about 18 seconds that states the promise in one line. Then keep the body scenes short, one idea each, with a cut every few seconds. End with a call to action. Use the pace and cut rhythm above. Title: {{title}}. Logline: {{logline}}. Subtitle: {{subtitle}}.
```

## Scene prompts

### Scene 1: hook, 45.8 s from 0.2 s

```
Kind: title. Duration 45.8 seconds. About 165 words of narration. Headline: {{headline_1}}. Subtitle: {{subtitle}}. Body: {{body_1}}. Narration: {{narration_1}}.
```

### Scene 2: body, 36.4 s from 43.8 s

```
Kind: point. Duration 36.4 seconds. About 131 words of narration. Headline: {{headline_2}}. Body: {{body_2}}. Narration: {{narration_2}}.
```

### Scene 3: body, 31.6 s from 78.9 s

```
Kind: point. Duration 31.6 seconds. About 114 words of narration. Headline: {{headline_3}}. Body: {{body_3}}. Narration: {{narration_3}}.
```

### Scene 4: body, 40.7 s from 108.9 s

```
Kind: point. Duration 40.7 seconds. About 147 words of narration. Headline: {{headline_4}}. Body: {{body_4}}. Narration: {{narration_4}}.
```

### Scene 5: body, 33.5 s from 147.1 s

```
Kind: point. Duration 33.5 seconds. About 121 words of narration. Headline: {{headline_5}}. Body: {{body_5}}. Narration: {{narration_5}}.
```

### Scene 6: body, 56.8 s from 179.2 s

```
Kind: point. Duration 56.8 seconds. About 204 words of narration. Headline: {{headline_6}}. Body: {{body_6}}. Narration: {{narration_6}}.
```

### Scene 7: body, 26.5 s from 234.1 s

```
Kind: point. Duration 26.5 seconds. About 95 words of narration. Headline: {{headline_7}}. Body: {{body_7}}. Narration: {{narration_7}}.
```

### Scene 8: cta, 41.2 s from 259.2 s

```
Kind: cta. Duration 41.2 seconds. About 148 words of narration. Headline: {{headline_8}}. Body: {{body_8}}. Narration: {{narration_8}}.
```

## Placeholders

`{{title}}`, `{{logline}}`, `{{subtitle}}`,
`{{headline_1}}`, `{{headline_2}}`, `{{headline_3}}`, `{{headline_4}}`, `{{headline_5}}`, `{{headline_6}}`, `{{headline_7}}`, `{{headline_8}}`,
`{{body_1}}`, `{{body_2}}`, `{{body_3}}`, `{{body_4}}`, `{{body_5}}`, `{{body_6}}`, `{{body_7}}`, `{{body_8}}`,
`{{narration_1}}`, `{{narration_2}}`, `{{narration_3}}`, `{{narration_4}}`, `{{narration_5}}`, `{{narration_6}}`, `{{narration_7}}`, `{{narration_8}}`
