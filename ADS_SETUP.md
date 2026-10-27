# Advertisements: one-time Firebase setup

The website has popup ads, a scrolling banner strip, and an admin page at **`/admineeeservices12`**
where authorised staff manage them. Ads are stored in Firebase, so changes made in the
admin page appear on the live website without redeploying.

Until the steps below are done the site behaves exactly as before: no ads are shown and
`/admineeeservices12` says that Firebase has not been set up.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and create a project (Analytics is not needed).
2. **Build → Firestore Database → Create database.** Pick a region near your visitors and
   start in *production mode* (the rules in step 4 replace the defaults).
3. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
4. *(Optional, for image uploads)* **Build → Storage → Get started.**
   Google now requires the **Blaze (pay-as-you-go) plan** to create a new Storage bucket;
   usage for a handful of banner images stays inside the free allowance.
   Skip this if you prefer: leave `VITE_FIREBASE_STORAGE_BUCKET` empty and the admin form
   lets you paste an image address instead of uploading.

## 2. Connect the website to Firebase

In **Project settings → General → Your apps**, add a **Web app** and copy its config values
into environment variables (see `.env.example`):

| Variable | Firebase config field |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` (leave empty if you skipped Storage) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

- **Local:** copy `.env.example` to `.env.local` and fill it in.
- **Vercel / Netlify / Replit:** add the same names as environment variables (Replit: *Secrets*) and **redeploy once** so the build picks them up.

These values identify the project; they are not passwords. What visitors and admins can
actually do is decided by the security rules in step 4.

## 3. Create the administrator account(s)

1. **Authentication → Users → Add user.** Enter the admin's email and a strong password.
2. Copy that user's **User UID**.
3. **Firestore Database → Start collection** named `admins` → Document ID = the **User UID**
   → add any field (for example `email` = their email) → Save.

A person can use `/admin` only if they can sign in **and** have a document in `admins`.
Anyone else who signs in (or who somehow registers) is refused by the server, not only by
the page. To remove an admin, delete their `admins` document (and disable their user).
There is no sign-up on the website; accounts exist only if you create them here.

## 4. Publish the security rules

Either paste the files into the console (**Firestore → Rules** and **Storage → Rules**, then *Publish*):

- `firestore.rules`
- `storage.rules`

or, with the Firebase CLI (`npm i -g firebase-tools`, `firebase login`, `firebase use <project-id>`):

```
firebase deploy --only firestore:rules,storage
```

What the rules enforce:

- Anyone may **read** ads that are marked active. Inactive/draft ads are readable only by admins.
- Only admins may **create, edit or delete** ads, and every saved ad must have the expected fields, types and lengths.
- Only admins may **upload or delete** images (JPG/PNG/WebP/GIF, under 3 MB). Images are publicly readable so they can be shown on the site.
- The `admins` collection cannot be written from the website at all, only from the Firebase console.

After publishing, open **Firestore → Rules → Rules Playground** and try a read of `ads/x` as an
unauthenticated user (allowed only if the document is active) and a write as an unauthenticated
user (must be denied).

## 5. Authorise your domain and harden sign-in

- **Authentication → Settings → Authorized domains:** add your live domain (for example `www.example.com`). `localhost` is there by default.
- **Authentication → Settings → User actions:** keep *Email enumeration protection* on.
- *(Optional)* In Google Cloud Console → APIs & Services → Credentials, restrict the browser API key to your website's address.

## Using the admin page

Open `https://<your-site>/admineeeservices12` and sign in.

- **Add advertisement:** choose *Popup* or *Scrolling banner*, add a title, optional description, image, link and button label.
- **Popup options:** *Show after (seconds)* and *How often a visitor sees it* (every page load, once per visit, once a day, once a week, or only once per visitor). Only one popup is shown per page load; if several are eligible, the lowest *Display order* number wins.
- **Schedule:** optional start and end date/time (in the device's time zone). Outside that window the ad is hidden automatically.
- **Active switch:** turns an ad on or off immediately without deleting it.
- **Edit / delete:** from the list. Saving changes to a popup shows it again to visitors who already saw it.
- **Image tips:** banners look best at about 2:1 (for example 1200 × 560); popups at least 800 px wide. Large photos are shrunk automatically.

Open pages pick up changes within a few minutes; new page loads see them straight away.
Signed-in admins are signed out automatically after 30 minutes of inactivity.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `/admineeeservices12` says Firebase is not set up | The `VITE_FIREBASE_*` variables are missing at build time. Add them and redeploy. |
| Signed in but "not authorised" | No `admins/<UID>` document for that user (step 3). |
| Saving fails with a "refused" message | Rules from step 4 not published yet, or the account is not in `admins`. |
| Image upload refused | Storage rules not published, Storage not enabled, or file is not JPG/PNG/WebP/GIF. Use the image-address box as a fallback. |
| Sign-in fails on the live site only | The live domain is missing from Authorized domains (step 5). |
| An ad does not appear | It is switched off, outside its schedule, a popup that this browser has already seen (frequency), or the page was opened before the change; reload. |
