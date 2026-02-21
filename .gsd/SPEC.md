# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Confidence Coach is a real-time, multimodal public speaking enhancement module within the PersonaAI platform. It integrates facial expression analysis, voice tone evaluation, body gesture recognition, and posture analysis to deliver holistic confidence coaching through a browser-based interface, equipped with hands-free voice command control.

## Goals
1. Implement real-time, browser-based multi-modal analysis (facial, voice, body, posture) using free APIs like MediaPipe and Web Audio API.
2. Enable hands-free voice command execution ("Start", "END This Speech") using the Web Speech API.
3. Dynamically differentiate and analyze body language based on auto-detected standing vs. sitting postures.
4. Generate a holistic confidence score (0-10) locally and persist the session data/statistics to the backend.

## Non-Goals (Out of Scope)
- Storing or transmitting actual video/audio recordings to the backend (only numerical scores and analytics are saved).
- Supporting languages other than English for the initial MVP.
- Developing custom heavy ML models on the backend (relying on optimized client-side libraries).

## Users
Individuals looking to improve their public speaking, presentation, or interview skills through interactive, AI-driven coaching and feedback.

## Constraints
- **Performance**: Multi-modal analysis is CPU-intensive; requires optimization for browser execution (e.g., Web Workers).
- **Free API Limits**: AI question generation (Gemini) and wake word detection (Porcupine) must operate within their respective free tier monthly limits.

## Success Criteria
- [ ] Users can start and end sessions autonomously using voice commands.
- [ ] Browser computes an accurate confidence score combining face, voice, and posture metrics.
- [ ] Completing a session successfully writes a `UserAttempt` and updates `User.confidenceCoachStats` via `POST /api/confidence-coach/session`.
- [ ] Stats reflect correctly in the Dashboard (ActivityChart, InsightsCard, ModuleProgressSection).
