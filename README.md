# Cosmic Guru AI

Cosmic Guru AI is a specialized, calm, and intelligent web application designed specifically for students preparing for Indian entrance exams (NEET, CUET, JEE, CAT, GATE, UPSC). It leverages a Cosmic Guru persona powered by Google Gemini to help users maintain focus, reduce stress, and receive guidance in an incredibly soothing digital environment.

## 🌟 Key Features

*   **Soothing Aesthetics**: A highly custom, pastel-colored, clutter-free user interface built with Vanilla CSS. Features a deep-space Dark Mode and smooth glassmorphism effects.
*   **Cosmic AI Persona**: Powered by the **Gemini 1.5 Flash API**, the AI acts as a polite, calming Guru tailored to the student's selected entrance exams.
*   **Stress-Relief Integrations**: Uses keyword detection to spot stress or anxiety. When triggered, the UI dynamically displays an 8-second rhythmic "Breathing Circle" animation to help the user regain calm.
*   **Ambient Audio**: An integrated, looping background music player sets a tranquil mood.
*   **Secure Authentication**: Google OAuth integrated seamlessly via **Supabase**. 
*   **Personalized Onboarding**: Users select their preferred name and target exams on their first login. This data persists securely in the Supabase database.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), React, Vanilla CSS, Lucide React (Icons)
*   **Backend / API**: Next.js Serverless Route Handlers
*   **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
*   **Database & Auth**: Supabase (PostgreSQL & GoTrue)

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js v18+ installed.
*   A [Supabase](https://supabase.com/) account.
*   A [Google AI Studio](https://aistudio.google.com/) API Key for Gemini.

### 2. Environment Setup
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Rename the provided `.env.example` to `.env.local`.
4. Fill in the `.env.local` variables with your specific keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

### 3. Database Configuration
1. Navigate to your Supabase project dashboard.
2. Ensure **Google** is enabled as an Authentication Provider.
3. Go to the **SQL Editor** in Supabase.
4. Copy the contents of the `supabase-schema.sql` file provided in this repository and run it to create the `users` table and apply the proper Row Level Security (RLS) policies.

### 4. Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser. The app will automatically redirect you based on your authentication status.

---
*Developed with focus, serenity, and purpose.*
