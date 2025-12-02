# Firebase Ads Setup Guide for Kreds App

Follow these steps to complete the Firebase integration for your ads system.

## ✅ Step 1: Get Your Firebase Credentials

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project (AdsManagerApp or similar)
3. Click **Project Settings** (gear icon) → **Service Accounts** tab
4. Under Firebase Admin SDK, click **Generate New Private Key**
5. Copy the JSON content

## ✅ Step 2: Update Firebase Configuration

1. Open `/app/config/firebase.ts`
2. Replace the placeholder values with your Firebase credentials:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

You can find these values in:

- Firebase Console → Project Settings → General tab → Copy Web API Key section

## ✅ Step 3: Update Android Configuration for Expo

Since you're using Expo, the Firebase setup is simplified:

1. **Place your `google-services.json` in the project root** (alongside app.json)
2. **Update `app.json`** to include Firebase plugin:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        { ... }
      ],
      [
        "expo-firebase-messaging",
        {
          "googleServicesFile": "./google-services.json"
        }
      ]
    ]
  }
}
```

## ✅ Step 4: Create Firestore Database (Already Done)

Your Firestore structure should look like this:

```
ads/ (collection)
  ├── home_banner (document)
  │   ├── type: "image"
  │   ├── url: "gs://your-bucket/ads/banner.png"
  │   ├── active: true
  │   └── version: 1
  │
  ├── promo_video (document)
  │   ├── type: "video"
  │   ├── url: "gs://your-bucket/ads/promo.mp4"
  │   ├── active: false
  │   └── version: 1
```

## ✅ Step 5: Set Up Firebase Storage

1. Go to Firebase Console → **Storage** tab
2. Click **Create Bucket**
3. Choose your region (us-central1 recommended)
4. Start in **Test mode** for development

## ✅ Step 6: Upload Your Ad Files

1. In Firebase Storage, create folders: `gs://your-bucket/ads/`
2. Upload your images, GIFs, or videos
3. Copy the file URLs and update them in Firestore

## ✅ Step 7: Configure Firestore Security Rules (Optional)

For production, update your Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ads/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## ✅ How the App Works

1. **On App Load**: `AdvertisementSection` component fetches the active ad from Firestore
2. **Download & Cache**: The ad file is downloaded from Firebase Storage and cached locally
3. **Offline Support**: Cached ads work offline automatically
4. **Dynamic Updates**: Change ads in Firestore anytime without app update

## 📝 How to Use in Your App

The ad service is already integrated into the `AdvertisementSection` component.

To fetch a specific ad:

```typescript
import { fetchActiveAd } from "../services/adService";

const ad = await fetchActiveAd("home_banner");
```

To fetch all active ads:

```typescript
import { fetchAllActiveAds } from "../services/adService";

const ads = await fetchAllActiveAds();
```

To get a cached ad for offline use:

```typescript
import { getCachedAd } from "../services/adService";

const cachedPath = await getCachedAd("home_banner");
```

## 🔧 Troubleshooting

**Firebase not initializing?**

- Check your credentials in `firebase.ts`
- Ensure your API key is correct

**Ads not displaying?**

- Verify the ad document exists in Firestore with `active: true`
- Check Firebase Storage bucket permissions
- Ensure the file URL is correct (gs:// format)

**Offline ads not working?**

- Ad must be fetched at least once online to cache
- Check device storage permissions

## 🚀 Next Steps

1. Update your Firebase credentials
2. Create your ad documents in Firestore
3. Upload ad files to Firebase Storage
4. Test the app - ads should display in the Advertisement section
5. Deploy and enjoy dynamic ads!
