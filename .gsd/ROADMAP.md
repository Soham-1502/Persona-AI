# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 (Confidence Coach Module)

## Must-Haves (from SPEC)
- [ ] Real-time browser-based multi-modal analysis (face, voice, body)
- [ ] Hands-free voice commands ("Start", "END This Speech")
- [ ] Backend integration for persisting session stats
- [ ] Dashboard integration for displaying progress

## Phases

### Phase 1: MVP - Core Multi-modal Analysis & Voice Commands
**Status**: ⬜ Not Started
**Objective**: Basic facial/voice analysis, simple voice commands ("Start", "End"), baseline confidence scoring, and pre-written scenario questions.
**Requirements**: REQ-01, REQ-02

### Phase 2: Enhanced - Auto-detection & AI Questions
**Status**: ⬜ Not Started
**Objective**: Standing/sitting auto-detection, wake word integration, AI-generated questions (within free limits), and advanced body language analysis.
**Requirements**: REQ-03

### Phase 3: Advanced - Analytics & Adaptation
**Status**: ⬜ Not Started
**Objective**: Difficulty level adaptation, comprehensive emotion detection, advanced scenario variety, and detailed post-session analytics.
**Requirements**: REQ-04

### Phase 4: Backend API & Dashboard Integration
**Status**: ⬜ Not Started
**Objective**: Create the `POST /api/confidence-coach/session` endpoint, update `confidenceCoachStats` in the `User` model, and hook data into Dashboard components.
**Requirements**: REQ-05
