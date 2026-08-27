# DreamTalk Frontend Setup & Development Guide

Welcome to the **DreamTalk Frontend** repository. This project is a Next.js application that serves as the primary user interface for DreamTalk. It interfaces with various backend modules to provide real-time chat with custom avatars, voice-cloning setup, visual model integration, and emotional tone display.

---

## 1. System Architecture Overview

The DreamTalk system is split into multiple modules:
- **DreamTalk Frontend (This Repo)**: User registration, dashboard, avatar config manager, and the chat UI.
- **Node Backend / Bridge**: Relays messages and authentication validations.
- **Brain Module**: Custom LLM orchestration, memory, and emotional state generation.
- **Voice Module**: Voice training, voice cloning, and text-to-speech audio rendering.
- **Avatar Module**: Lip-syncing and facial/visual animation generation.

---

## 2. Prerequisites
- **Node.js**: `v18+` or `v20+` (LTS recommended)
- **npm**: Installed automatically with Node.js

---

## 3. Setup Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in the values:
   - **`NEXT_PUBLIC_SUPABASE_URL`** & **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Obtain from the Supabase dashboard → **Project Settings** → **API**.
   - **`BRAIN_MODULE_URL`**, **`VOICE_MODULE_URL`**, & **`AVATAR_MODULE_URL`**: Set to the HTTP endpoints where your local/hosted backend service instances are running.

---

## 4. How to Run

To run the Next.js development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Folder Structure
- **`src/pages/`**: File-system based router.
  - **`api/`**: Next.js API route proxies to bypass CORS when communicating with backend modules.
  - **`avatar/`**: Setup steps (`voice`, `face`, `config`) and chat room interface.
- **`src/components/`**: Reusable React UI components (e.g., `ChatInterface`, `ProtectedRoute`).
- **`src/context/`**: Global state providers (e.g., Supabase `AuthContext`).
- **`src/lib/`**: Client helpers, such as the Supabase client instance and api call wrapper functions.
- **`src/styles/`**: Custom styling rules and global CSS variables.

---

## 6. Important Schema Policies

> **IMPORTANT**
> The database schema in **`schema.sql`** (specifically the `avatar_config` table) is shared with the **Brain Module** backend. Do not alter fields or add constraints without coordinating updates in the backend repositories.

---

## 7. Switching Supabase Projects

If you need to migrate or switch the application to a new Supabase organization/project:
1. Update **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** in your `.env.local` with the keys from the new project.
2. Open the **SQL Editor** in the new Supabase dashboard.
3. Copy the contents of schema.sql and execute them to provision the tables, indexes, and RLS policies before running the frontend.
