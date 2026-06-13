# Developer Testing Guide: Cosmic Guru AI

Welcome to the Cosmic Guru AI project! This guide is tailored for developers who are completely new to this codebase. It will walk you through the core features of the application, how they work under the hood, and the step-by-step processes to test them locally.

## 🏗️ Architecture Overview

The app is built on **Next.js 15 (App Router)**. Here is a quick map of the key areas:
- `src/app/page.tsx`: The root logic that checks active Supabase sessions and routes users accordingly.
- `src/app/login/page.tsx`: Handles Google OAuth using `@supabase/supabase-js`.
- `src/app/onboarding/page.tsx`: Collects the user's preferred name and exam list after their first login.
- `src/app/chat/page.tsx`: The primary interface where the user chats with the AI.
- `src/app/api/chat/route.ts`: A backend API endpoint that communicates securely with the Gemini API to stream responses.
- `src/app/globals.css`: Contains all visual aesthetics including variables for light/dark mode and the CSS animations for stress relief.

---

## 🧪 Feature Testing Steps

### 1. The Global Aesthetics & Music Player
**What it does:** The app uses a highly customized vanilla CSS setup (`globals.css`) that provides a soothing glassmorphic UI. The `AudioPlayer` component floats globally across the app.

**How to test:**
1. Start the app via `npm run dev` and navigate to `http://localhost:3000`.
2. Notice the initial calm background colors.
3. Click the **Sun/Moon icon** (located either on the login screen or top right of the chat header). The application should smoothly transition into a "Deep Space" dark mode with animated CSS starry particles.
4. Click the **Speaker icon** (top right corner). A soothing ambient audio track should begin playing (and loop indefinitely). Click it again to pause.

### 2. Google OAuth Authentication (Supabase)
**What it does:** Uses Supabase's `signInWithOAuth` function to authenticate users without handling manual passwords.

**How to test:**
1. Ensure your `.env.local` is set up with valid Supabase URLs and Keys.
2. Ensure you have run the `supabase-schema.sql` code in your Supabase project's SQL editor.
3. Navigate to `http://localhost:3000`. If you aren't logged in, you should be redirected to `/login`.
4. Click **Sign in with Google**. Follow the Google popup. 
5. Upon successful login, you will be redirected to the `/onboarding` page.

### 3. The Onboarding Flow
**What it does:** Grabs the user's preferred name and target exams. This allows the AI Guru to formulate personalized responses.

**How to test:**
1. On the `/onboarding` page, you will see a text input and a list of pill-shaped buttons for exams (NEET, CUET, JEE, etc.).
2. **Validation Test**: Try to click the "Begin Journey" button without entering a name or selecting an exam. It should be disabled.
3. **Success Test**: Enter a name (e.g., "Arjun") and click a few exams (e.g., "JEE", "GATE"). The buttons will highlight.
4. Click **Begin Journey**. The app upserts this data into the `users` table in Supabase and redirects you to `/chat`. 
5. *(Optional Debugging)*: Look at your Supabase `users` table to verify the data was actually written.

### 4. The Cosmic Guru AI Chat
**What it does:** Connects to the `/api/chat` route, querying the Gemini 1.5 Flash model with a strict system prompt to act as a cosmic, calming guide.

**How to test:**
1. Once on the `/chat` page, wait for the app to fetch your profile.
2. **Context Test**: Type: *"Hello Guru, can you remind me what exams I am studying for and what my name is?"*
3. The AI should reply with the exact name and exams you selected during onboarding, maintaining a serene and wise persona.
4. **Streaming Test**: Ensure that the text appears progressively (streaming) rather than stalling and appearing all at once.

### 5. Stress Detection & Breathing Animation
**What it does:** The frontend monitors user input. If the user mentions words indicating panic or stress, the UI gracefully renders an animated breathing circle to help them calm down.

**How to test:**
1. In the chat input, type: *"I am feeling so stressed and overwhelmed about my upcoming exam."*
2. Press send.
3. **Observation 1 (UI)**: Instantly, a pulsing, rhythmic "Breathing Circle" should appear below the chat messages. It expands and contracts on an 8-second loop.
4. **Observation 2 (AI)**: The Guru's textual response should acknowledge your stress and gently ask you to breathe along with the visualizer before addressing your study queries.
5. Wait ~24 seconds. The visualizer is programmed to disappear automatically after 3 breathing cycles.
