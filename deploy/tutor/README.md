# CyberLearn Open edX Tutor Plugin & CTFd Bridge

This directory contains the Open edX Tutor plugin (`tutor-cyberlearn`) and Docker configuration for running Open edX LMS / Studio alongside CyberLearn Kenya and the CTFd challenge sidecar.

## Architecture

```
┌─────────────────────────────────┐
│     Open edX LMS & Studio       │
│  (Course Navigation / Grading)  │
└───────▲─────────────────┬───────┘
        │                 │
    LTI 1.3 Advantage     │ LTI Deep Linking 2.0
   Grade Passback (AGS)   │ Resource Launches
        │                 ▼
┌───────┴─────────────────┴───────┐
│       CyberLearn Kenya API      │
│  (Auth, XP Engine, Badge Mint)  │
└───────▲─────────────────────────┘
        │
   Webhook on Flag Solve
   (POST /api/v1/ctfd/webhook)
        │
┌───────┴─────────────────────────┐
│       CTFd Challenge Sidecar    │
│  (Hands-on Linux & Web Labs)    │
└─────────────────────────────────┘
```

## Features

1. **LTI 1.3 Advantage Single Sign-On**: Seamless student handoff from Open edX to CyberLearn PWA.
2. **Deep Linking 2.0**: Browse and embed CyberLearn lessons, REBUILD-000 capstone assessment, and CTFd challenges directly into Open edX course units.
3. **Assignment and Grades Service (AGS)**: Automatic grade passback when learners complete exercises or solve CTF flags.
4. **CTFd Bridge**: Webhook receiver parses solved flags, awards XP events (`source='ctf_flag'`), issues the `ctf_flag` badge, and pushes grades to Open edX.

## Quickstart

### 1. Install Plugin in Tutor Environment

```bash
pip install -e ./deploy/tutor
tutor plugins enable cyberlearn
tutor config save
```

### 2. Launch Local Open edX Dev Stack

```bash
tutor dev launch
```

### 3. Standalone CTFd Sidecar (Optional Dev Mode)

To run CTFd standalone with redis without a full Open edX stack:

```bash
docker compose -f deploy/tutor/docker-compose.ctfd.yml up -d
```

CTFd will be accessible at `http://localhost:8000`.

### 4. CTFd Webhook Configuration

In CTFd Admin Settings -> Webhooks, set:
- **Webhook Target**: `http://<CYBERLEARN_API_HOST>:8000/api/v1/ctfd/webhook`
- **Secret Header**: `X-CTFd-Secret: ctfd_whsec_dev_2031`
- **Events**: Flag Submissions (`submission_type = 'correct'`)
