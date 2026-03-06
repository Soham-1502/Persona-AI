# ROADMAP.md

> **Current Phase**: Phase 4 (Execution)
> **Milestone**: v1.0 (Confidence Coach Module)

## Must-Haves (from SPEC)
- [x] Real-time browser-based multi-modal analysis (face, voice, body)
- [x] Hands-free voice commands ("Start", "END This Speech")
- [x] Backend integration for persisting session stats
- [x] Dashboard integration for displaying progress

## Phases

### Phase 1: MVP - Core Multi-modal Analysis & Voice Commands
**Status**: ✅ Complete
**Objective**: Basic facial/voice analysis, simple voice commands ("Start", "End"), baseline confidence scoring, and pre-written scenario questions.
**Requirements**: REQ-01, REQ-02

### Phase 2: Enhanced - Auto-detection & AI Questions
**Status**: ✅ Complete
**Objective**: Standing/sitting auto-detection, wake word integration, AI-generated questions (within free limits), and advanced body language analysis.
**Requirements**: REQ-03

### Phase 3: Advanced - Analytics & Adaptation
**Status**: ✅ Complete
**Objective**: Difficulty level adaptation, comprehensive emotion detection, advanced scenario variety, and detailed post-session analytics.
**Requirements**: REQ-04

### Phase 4: Backend API & Dashboard Integration
**Status**: ✅ Complete
**Objective**: Create the `POST /api/confidence-coach/session` endpoint, update `confidenceCoachStats` in the `User` model, and hook data into Dashboard components.
**Requirements**: REQ-05
