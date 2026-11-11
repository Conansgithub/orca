#!/bin/sh
# Fork tooling (Conansgithub/orca): build a sideload release APK on macOS.
# Official Android releases are signed with the public Expo debug key, so this APK installs over them
# and keeps the app's pairing data. Toolchain: brew openjdk@17, Android SDK on the DevCache volume.
set -eu
cd "$(dirname "$0")/.."
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17}"
export ANDROID_HOME="${ANDROID_HOME:-/Volumes/DevCache/android-sdk}"
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-/Volumes/DevCache/gradle}"
export PATH="$JAVA_HOME/bin:$PATH"
OUT="${OUT:-$HOME/Downloads/orca-mobile-fork.apk}"

pnpm install --frozen-lockfile
pnpm exec vitest run src/navigation/open-links.test.ts
npx expo prebuild --platform android --no-install --clean
(cd android && ./gradlew assembleRelease)
cp android/app/build/outputs/apk/release/app-release.apk "$OUT"
"$ANDROID_HOME"/build-tools/*/apksigner verify --print-certs "$OUT" | grep 'SHA-256'
echo "built $OUT"
