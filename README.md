# HelpRX

**Turning caregiver panic into precision with Gemini 3.**

HelpRX is an AI-powered safety net designed to prevent medication errors. By utilizing the Gemini 3 API, the app identifies appropriate over-the-counter medications, verifies physical labels via multimodal vision, and calculates precise, weight-based dosages to ensure every dose is safe and accurate.

## The Problem
Every eight minutes in the U.S., a child is rushed to the ER due to a medication error at home. This leads to over 60,000 pediatric ER visits annually caused by dosing mistakes, confusing labels, or incorrect medication choices during high-stress moments.

## Features
* **Medication Identification:** Recommends the correct active ingredients based on symptoms, age, and weight.
* **Multimodal Label Verification:** Utilizes Gemini 3 Vision to scan medication bottles, verifying the drug name and concentration to ensure it matches the user's hand.
* **Precision Dosing:** Performs calculations to provide exact mL doses based on the child's specific weight.
* **Safety Triage:** Automatically scans for red-flag symptoms and triggers immediate emergency alerts to call 911.
* **High-Trust UI:** A clean interface designed for clarity and ease of use during emergencies.

## Tech Stack
* **AI:** Gemini 3 API (Gemini 3 Flash)
* **Frontend:** React, Tailwind CSS
* **Logic:** Structured JSON Output, Multimodal Vision Processing
* **Deployment:** Google Cloud Run

## Architecture
1. **Input Layer:** User enters profile data and symptoms or uploads a label image.
2. **Reasoning Layer:** Gemini 3 performs a safety triage check, identifies the medication, and calculates the dose.
3. **Output Layer:** Data is delivered via Structured JSON to ensure UI stability and accuracy.



## Installation and Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/helprx.git](https://github.com/YOUR_USERNAME/helprx.git)
   cd helprx
   npm install
   VITE_GEMINI_API_KEY=your_api_key_here
   npm run dev
