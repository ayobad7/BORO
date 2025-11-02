# BORO Project - Copilot Instructions

## Project Overview

BORO (sounds like "Borrow") is a visual storage management web app for cataloging physical items and sharing them with friends.

## Tech Stack

- React 19 + TypeScript + Vite
- Material-UI (MUI)
- React Router v6
- Firebase (Auth + Firestore)
- Cloudinary (image hosting)
- TanStack Query

## Project Setup Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project (Custom BORO features implemented)
- [x] Install Required Extensions (No additional extensions needed)
- [x] Compile the Project (Build successful)
- [x] Create and Run Task (Tasks.json created for dev server)
- [x] Launch the Project (See instructions below)
- [x] Ensure Documentation is Complete (README.md updated with full setup instructions)

## Development Workflow

### To start the dev server:

```powershell
cd e:\BORO\BORO
npm run dev
```

### Before first run:

1. Copy `.env.example` to `.env.local`
2. Fill in Firebase credentials (see README.md for setup)
3. Fill in Cloudinary credentials (see README.md for setup)

## Key Features Implemented

- Home page with category-based item creation
- Storage management page (view user's items)
- Item creation form with image upload (max 3, auto-compressed)
- Firebase Auth with Google sign-in
- Firestore integration for data persistence
- Two borrow modes: free borrow and request borrow

## Next Steps (Roadmap)

- Item detail page with image gallery
- Borrow request approval flow
- Friend storage list and shareable links
- Search and filter functionality
