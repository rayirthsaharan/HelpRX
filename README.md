# HelpRX

**Turning caregiver panic into precision with Gemini 3.**

HelpRX is an AI safety net that identifies medications, verifies labels via multimodal vision, and calculates safe weight-based doses to prevent pediatric medication errors.

## The Problem
Every eight minutes, a child is rushed to the ER for a medication error. HelpRX addresses this by automating identification and dosing to remove human error during medical crises.

## Core Features
* **Medication Identification:** Recommends the right OTC drug based on symptoms.
* **Vision Verification:** Uses Gemini 3 to "read" physical bottles and verify concentration.
* **Precision Dosing:** Calculates exact mL doses based on specific user weight.
* **Safety Triage:** Automatically triggers 911 alerts for high-risk respiratory or emergency symptoms.

## Tech Stack
* **AI:** Gemini 3 API (Flash)
* **Frontend:** React + Tailwind CSS
* **Logic:** Structured JSON + Multimodal Vision

## Architecture
User Data/Image -> Gemini 3 (Triage + Math) -> Structured Care Plan



## Installation
1. Clone the repo:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/helprx.git](https://github.com/YOUR_USERNAME/helprx.git)
   npm install && npm run dev
   Add VITE_GEMINI_API_KEY=your_key to a .env file.
