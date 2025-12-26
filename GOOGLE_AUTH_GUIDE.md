# 🔑 Google OAuth Setup Guide

To test the Cedra Account Abstraction SDK in this example project, you need to configure a Google OAuth Client ID.

## 1. Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown and select **"New Project"**.
3. Give it a name like "Cedra Test" and click **Create**.

## 2. Configure Consent Screen
1. Search for **"OAuth consent screen"** in the top search bar.
2. Select **External** user type and click **Create**.
3. Fill in the required app information (App name, User support email, Developer contact).
4. For Scopes, click **Add or Remove Scopes**.
5. Add `openid`, `.../auth/userinfo.email`, and `.../auth/userinfo.profile`.
6. Continue to the end of the summary.

## 3. Create Credentials
1. Click **"Credentials"** in the left sidebar.
2. Click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**.
3. Select **"Web application"** as the Application type.
4. Name it "Local Development".
5. **Authorized JavaScript origins**:
   - `http://localhost:5173`
6. **Authorized redirect URIs**:
   - `http://localhost:5173/callback`
7. Click **Create**.

## 4. Update the Example
1. Copy the **Client ID** from the popup.
2. Open `src/config/cedra.ts` in this project.
3. Paste your Client ID into the `googleClientId` field.

## 5. Run the App
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and click **Connect Wallet**!
