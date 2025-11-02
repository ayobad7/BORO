# BORO - Borrowing & Storage Management

**BORO** (sounds like "Borrow") is a visual storage management web app that helps you catalog physical items and share them with friends. Users can create storage inventories with photos, categorize items, and allow others to borrow them through a simple sharing system.

## Features

- 📦 **Storage Management**: Organize items by category (Tools, Electronics, Office, Home, Sports, Books, etc.)
- 📸 **Visual Inventory**: Upload up to 3 photos per item (auto-compressed)
- 🔗 **Shareable Storage**: Share your storage via link; others can add you to their "friend storage" list
- 🤝 **Two Borrow Modes**:
  - **Free Borrow**: Anyone can pick up the item immediately
  - **Request Borrow**: Owner approval required before transfer
- 🔄 **Item Tracking**: Track who's borrowing what and when items should be returned
- 🔐 **Google Authentication**: Secure sign-in via Firebase Auth
- ☁️ **Cloud Storage**: User data in Firebase Firestore, images in Cloudinary (free tier)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router v6
- **State & Data**: TanStack Query (React Query)
- **Authentication**: Firebase Auth (Google OAuth)
- **Database**: Firebase Firestore
- **Image Hosting**: Cloudinary
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns + MUI Date Pickers

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase project (free tier)
- Cloudinary account (free tier)

### 1. Install Dependencies

```powershell
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Authentication**:
   - Authentication → Sign-in method → Google → Enable
4. Create a **Firestore Database**:
   - Firestore Database → Create database → Start in test mode
5. Get your config:
   - Project settings → Your apps → Web app → Copy config values

### 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/) and sign up
2. In your dashboard, note your **Cloud Name**
3. Create an **unsigned upload preset**:
   - Settings → Upload → Upload presets → Add upload preset
   - Signing Mode: **Unsigned**
   - Copy the preset name

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```powershell
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and Cloudinary values.

### 5. Run Development Server

```powershell
npm run dev
```

Visit `http://localhost:5173`

### Cloudinary upload troubleshooting

If you see a 401 Unauthorized or "Upload failed" when saving an item:

- Ensure you created an Upload Preset with Signing Mode set to "Unsigned" (Cloudinary Console → Settings → Upload → Upload presets → Add/Edit).
- Make sure `.env.local` includes:
  - `VITE_CLOUDINARY_CLOUD_NAME` exactly as shown in your Cloudinary dashboard.
  - `VITE_CLOUDINARY_UPLOAD_PRESET` set to the name of your unsigned preset.
- Optionally set `VITE_CLOUDINARY_FOLDER` to group uploads (e.g., `boro/dev`).
- Restart the dev server after changing `.env.local`.
- The app now shows the exact Cloudinary error message to help diagnose preset/permission issues.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   └── ImageUploader.tsx
├── context/         # React context providers
│   └── AuthContext.tsx
├── lib/             # External service configs
│   └── firebase.ts
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── Storage.tsx
│   └── ItemForm.tsx
├── types.ts         # TypeScript types
└── main.tsx         # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How It Works

### Borrow Request Flow

1. **Request Mode Items**:

   - Non-owner clicks "Request borrow" on an available item
   - Fills in optional dates (from/to) and a message
   - Owner sees pending request with requester details
   - Owner approves → item transfers to borrower with `borrowed` status
   - Owner rejects → item stays available

2. **Free Mode Items**:
   - Non-owner clicks "Borrow now" → item immediately transfers

### Extend Return Date

- **Free Mode**: Borrower can extend the return date anytime; owner gets updated automatically
- **Request Mode**: Borrower requests an extension with a new date; owner must approve

### Shareable Storage

- Click "Share Storage" on your storage page to copy a public link
- Share the link with anyone (e.g., `https://boro.app/storage/your-user-id`)
- Visitors can browse your items and borrow free items or request to borrow request-mode items
- No "friend" system needed—access control is via the link

## Roadmap

- [x] Item detail page with image gallery
- [x] Borrow request flow (approve/reject)
- [x] Shareable storage links
- [x] Return date reminders (Due soon section on Home)
- [ ] Notifications for owners (new requests, due items)
- [ ] Search and filter items
- [ ] Mobile-responsive improvements

## License

MIT

---

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
