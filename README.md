# AI Avatar Video Publisher

REST API that generates AI talking-head videos from a photo (HeyGen), voices them
with ElevenLabs, and automatically publishes them to Instagram.
Stack: Node.js + Express; external services — **HeyGen** (photo avatars, rendering)
and **ElevenLabs** (TTS and voice cloning).

## Demo

[Watch the demo video](https://app.heygen.com/embeds/896a8a202f1e4a9db78979ce4e6ae8b6)

## Pipeline

```
upload-images → create-avatar → add-motion → clone-voice → generate-video → video-status
```

1. `upload-images` — uploads the photo to HeyGen (assets) → photo `image_key`.
2. `create-avatar` — creates a photo-avatar group (`POST /v2/photo_avatar/avatar_group/create`) → `group_id`.
3. `add-motion` — optional motion prompt for the avatar (`POST /v2/photo_avatar/add_motion`).
4. `clone-voice` — voice clone in **ElevenLabs** (IVC) → `voiceId`.
5. `generate-video` — **ElevenLabs** synthesizes speech (TTS) → audio is uploaded to HeyGen
     (`POST /v1/asset`) → a video is created (`POST /v2/video/generate` with `talking_photo_id`) → `video_id`.
6. `video-status` — video status (`GET /v1/video_status.get`) → `status`, `video_url`.

## Requirements

- Node.js 18+
- ffmpeg in PATH (audio chunking for voice cloning)
- HeyGen API key
- ElevenLabs API key

## Install & Run

```bash
npm install
cp .env.example .env   # set HEYGEN_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, PORT
npm start              # http://localhost:3000
```

## Project Structure

```
src/
├── index.js                    # express app + entry point
├── config/env.js               # env loading and validation
├── middleware/
│   ├── upload.middleware.js    # multer: audio (disk) and images (memory)
│   └── error.middleware.js     # unified error handler
├── routes/                     # /api/* routes
├── controllers/                # HTTP layer: validation, statuses
└── services/
        ├── heygen/             # client, image/avatar/motion/video (HeyGen)
        ├── elevenlabs/         # client, voice (clone), tts
        ├── providers/          # provider factory (heygen)
        └── instagram.service.js    # publishes reels via meta-lib
```

## API

### 1. Upload images

```bash
curl --location 'http://localhost:3000/api/upload-images' \
    --form 'images=@photo.png'
```

Response: `{ success, summary: { total, successful, failed }, results: [{ originalName, success, data: { id, url } }] }`.

### 2. Create avatar

```bash
curl --location 'http://localhost:3000/api/create-avatar' \
    --header 'Content-Type: application/json' \
    --data '{"images": ["<image_key>"], "name": "Test"}'
```

Response: `{ group_id, ... }`.

### 3. Add motion

```bash
curl --location 'http://localhost:3000/api/add-motion' \
    --header 'Content-Type: application/json' \
    --data '{"motion_type": "consistent", "id": "avatar_id"}'
```

### 4. Clone voice (ElevenLabs)

```bash
curl --location 'http://localhost:3000/api/clone-voice' \
    --form 'audio=@voice.mp3' \
    --form 'voiceName="My Voice"'
```

Audio up to 50MB (.mp3/.ogg). The audio is split into 30s chunks (ffmpeg), minimum 3 chunks —
a recording of ≥90s is required. Response: `{ message, voice }`; use `voice.voice_id` as `voiceId` downstream.

### 5. Generate video

```bash
curl --location 'http://localhost:3000/api/generate-video' \
    --header 'Content-Type: application/json' \
    --data '{"avatarId": "<avatar_id>", "voiceId": "<elevenlabs_voice_id>", "text": "text"}'
```

ElevenLabs synthesizes speech, the audio is uploaded to HeyGen, a video is created.
`voiceId` is optional — defaults to `ELEVENLABS_VOICE_ID`.
Response: `{ video_id, status, ... }`.

### 6. Video status

```bash
curl --location 'http://localhost:3000/api/video-status?videoId=id'
```

Response: `{ status, video_url, ... }` — `video_url` appears when `status: "completed"`.

### 7. Publish to Instagram (Reels)

```bash
curl --location 'http://localhost:3000/api/publish-instagram' \
    --header 'Content-Type: application/json' \
    --data '{"videoUrl": "<https_url_from_video-status>", "caption": "My story"}'
```

Publishes a reel via `meta-lib` (Instagram Graph API). Response: `{ id }` (post id).

## Environment Variables

| Variable | Required |
|---|---|
| `PORT` | yes |
| `HEYGEN_API_KEY` | yes |
| `ELEVENLABS_API_KEY` (or `ELEVEN_LABS_KEY`) | yes |
| `ELEVENLABS_VOICE_ID` | yes |
| `HEYGEN_FOLDER_ID` | no |
| `INSTAGRAM_ACCESS_TOKEN` | for publishing |
| `IG_USER_ID` | for publishing |

## Tests

```bash
npm test
```

Route smoke tests (`node:test`): request validation and multer filters.
