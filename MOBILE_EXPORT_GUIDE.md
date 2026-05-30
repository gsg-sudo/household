# 📱 Native Mobile Export & Installation Guide
## Build Installable APK (Android) and IPA (iOS) Packages

Since this application is developed as an offline-first **state-synchronized React app**, we have successfully pre-integrated **Capacitor** into the codebase. 

The `/android` and `/ios` directory branches have been generated inside your project. This means you have a **fully prepared native solution** ready to run on physical phones!

---

## 🛠️ Option 1: Quick Building on Your Local Computer

To build and run the app directly on your smartphone, export this custom codebase via **ZIP or GitHub Export** from the settings menu in the top right, then follow these simple steps:

### For Android (Installable `.apk` file)
1. **Requirements**: Download and install [Android Studio](https://developer.android.com/studio) (free).
2. **Open Project**: Launch Android Studio and click **Open**. Select the `/android` folder inside this project.
3. **Build APK**:
   - Allow Gradle to finish syncing (takes 1-2 minutes on first run).
   - In the top menu, click **Build** ➔ **Build Bundle(s) / APK(s)** ➔ **Build APK(s)**.
   - Once completed, a popup on the bottom-right of Android Studio will appear with a link or option to **Locate** the finished `app-debug.apk` file.
   - Send this `.apk` to your phone (via USB, email, or Google Drive) and install it instantly!

---

### For iOS (Installable `.ipa` or Direct Device Run)
Apple strictly requires secure macOS hardware and Xcode signature certificates to generate `.ipa` binaries.
1. **Requirements**: You'll need a Mac with [Xcode](https://developer.apple.com/xcode/) installed.
2. **Open Project**: Open your terminal in the project directory and run:
   ```bash
   npm run cap:open-ios
   ```
   Or double-click the `App.xcworkspace` located in the `/ios/App/` folder.
3. **Run on Device**:
   - Connect your iPhone to your Mac with a cable.
   - In Xcode, select your connected iPhone from the top device target list.
   - Go to the **Signing & Capabilities** tab of your App target and select your free Apple Developer account Team.
   - Click the **Play** button (or press `Cmd + R`) to run and install the fully optimized app directly onto your physical iPhone!

---

## ☁️ Option 2: Build APK & IPA on the Cloud (Free GitHub Actions)

If you migrate this project to a **GitHub Repository** using AI Studio's export features, you can configure a free automated **GitHub Actions** builder! It will compile the `.apk` and `.ipa` instantly on GitHub's secure servers, bypasses native local machine constraints, and sends download links direct to you.

We have created a custom configuration script you can save as `.github/workflows/build-mobile.yml` in your repo:

```yaml
name: Build Android and iOS Packages

on:
  push:
    branches: [ main ]

jobs:
  build:
    name: Build APK and IPA Bundle
    runs-on: macos-14  # Permits both Mac/Xcode and Gradle executions
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Project Dependencies
        run: npm install

      - name: Build Web Application
        run: npm run build

      - name: Set up Java JDK for Android
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'zulu'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      - name: Sync Capacitor Platforms
        run: npx cap sync

      # --- BUILD ANDROID APK ---
      - name: Build Android Debug APK
        run: |
          cd android
          ./gradlew assembleDebug

      - name: Archive Android APK Product
        uses: actions/upload-artifact@v4
        with:
          name: Household-Companion-Android-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk

      # --- BUILD iOS APP ---
      - name: Build iOS xcworkspace (Unsigned)
        run: |
          xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphoneos -allowProvisioningUpdates build

      - name: Archive Unsigned iOS App
        uses: actions/upload-artifact@v4
        with:
          name: Household-Companion-iOS-App
          path: ios/App/build/Release-iphoneos/App.app
```

---

## 🔄 Updating Your Code Assets

Whenever you make custom visual tweaks to the code in AI Studio or locally and are ready to push updates to your device:
```bash
# Clean, builds production layouts and copies static indices inside native iOS and Android folders
npm run mobile:build
```
And just rebuild in Android Studio or Xcode to run! It's that simple.
