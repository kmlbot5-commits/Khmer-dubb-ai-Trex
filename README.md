# Trex Story AI 🦖

Starter website for turning foreign-language story videos into Khmer narration.

## What is included
- Mobile-friendly Khmer UI
- Video upload (up to 2GB)
- Language selector
- Narration style selector
- Backend upload API
- AI pipeline architecture
- Khmer script generation demo
- Ready place for Speech-to-Text, LLM, Khmer TTS and FFmpeg

## Run locally

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:

```bash
npm install
npm start
```

4. Open `http://localhost:3000`

## Production pipeline

Replace the demo `/api/generate` implementation with:

Video
→ FFmpeg extracts audio
→ Speech-to-Text
→ Scene segmentation
→ LLM creates Khmer recap script
→ Khmer TTS
→ FFmpeg mixes narration + original audio
→ MP4 export

For long movies, process the video in short segments instead of sending an entire movie to one AI request.

## Important

Only process videos you have permission to use. Copyrighted movies may have restrictions on copying, translating, or redistributing them.
