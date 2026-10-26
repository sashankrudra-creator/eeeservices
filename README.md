# Triple E Services website

Front-end only React (Vite) site. No backend, database or auth. All content is static data in `src/data/`.

## Run in Replit
Import this folder (or upload the zip) and press **Run**. The `.replit` file runs `npm install && npm run dev` on port 5173.

Locally: `npm install && npm run dev`. Production build: `npm run build`.

## Packages
| Package | Used for |
|---|---|
| react, react-dom | UI |
| vite, @vitejs/plugin-react | dev server and build |
| react-router-dom | routing, hash links, 404 |
| framer-motion | page transitions, scroll reveals, stepper, tabs, modal and lightbox animations |
| lucide-react | all icons (mapped by name in `src/components/ui/Icon.jsx`) |

## Where to edit
- Copy and numbers: `src/data/*.js` (company, services, contracts, electricalProjects, manpower, team, clients, gallery).
- Photos: `public/images/` (filenames are listed in `src/data/gallery.js`; a placeholder tile shows if a file is missing).
- Client logos: add an image to `public/images/` and set `logo` in `src/data/clients.js`.
- Colours and fonts: `src/styles/variables.css`.

## Advertisements
- Public: `src/components/ads/` (popup, scrolling banners). Admin page: `src/pages/admin/` (route `/admin`). Data access: `src/services/`, `src/lib/firebase.js`.
- Firebase settings come from `VITE_FIREBASE_*` environment variables (`.env.example`); security rules are in `firestore.rules` and `storage.rules`.
- Setup, admin accounts and usage: [ADS_SETUP.md](ADS_SETUP.md).

## Notes
- Forms (quote and contact) validate on the client and simulate sending. Nothing is transmitted.
- Manpower figures are shown exactly as in the company profile; the state rows do not sum exactly to the stated totals. Please verify with the client (`src/data/manpower.js`).
