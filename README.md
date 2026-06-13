# Cosmic Guru AI

Cosmic Guru AI is a personalized, serene dashboard designed to help Indian students manage entrance exam stress (NEET, JEE, GATE, etc.) while providing cosmic, thoughtful guidance.

## 🌟 Core Features

- **Personalized AI Guide**: A beautiful, embedded AI chatbot powered by Google Gemini that knows exactly what exams you are studying for. It acts as a polite, calming cosmic guru.
- **Dynamic Image Generation**: The AI Guru can generate images inside the chat on-the-fly to help visually explain concepts or lighten your mood.
- **15-Day Consistency Tracker**: A vertical, scrollable UI tracker on the dashboard that monitors your daily check-ins with the Sanctuary.
- **Cosmic Reward System**: Hitting a 5-day continuous streak unlocks a golden glowing gift box that rewards students with real-world perks (like 5% off stationary supplies from Faber-Castell).
- **Continuous Soothing Music**: A serene, non-intrusive background audio player that provides a calming atmosphere throughout your entire session.
- **Interactive Mind Control Exercises**: Direct UI elements to help you calm down during panic attacks or high stress.
  - **4-7-8 Breathing Timer**: An animated visual timer that guides your breathing.
  - **5-4-3-2-1 Grounding**: An interactive checklist for moments of severe anxiety.
- **Live Mental Health Wisdom**: The dashboard automatically scrapes reputable Mental Health and Mindfulness blogs to provide you with fresh, clickable articles to read when you need a break.
- **Serene "Sanctuary" Dashboard**: A fully customized, pastel glassmorphic UI featuring a calming landscape and a wise Avatar-style mascot.

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A valid Google AI Studio Gemini API Key (`AIzaSy...`).

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Open `.env` (or `.env.local`) and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="AIzaSy...your-key-here"
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Login**
   Navigate to `http://localhost:3000`. We currently use a local mocked database for demonstration:
   - **Medical Student**: Username: `med` | Password: `med`
   - **Engineering Student**: Username: `eng` | Password: `eng`

## 🧠 AI Personality & Training
The Cosmic Guru is prompt-engineered to be concise, helpful, and calming. If you mention feeling "stressed" or "anxious", the Guru is programmed to detect this and direct you to the Interactive Mind Control exercises embedded in your sanctuary. It will also provide internet resources and complete thoughts to guide you effectively.
