# Parent Notification Mobile App 📱

Welcome to the **Parent Notification** mobile application! This open-source project is built using [Expo](https://expo.dev) and aims to help parents stay informed about their children's activities and notifications.

**We welcome contributions!** If you'd like to contribute, please fork the repository and submit a pull request.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
  - [Install Node.js and npm](#install-nodejs-and-npm)
    - [Install Node.js and npm on Windows](#install-nodejs-and-npm-on-windows)
    - [Install Node.js and npm on macOS](#install-nodejs-and-npm-on-macos)
    - [Install Node.js and npm on Linux](#install-nodejs-and-npm-on-linux)
  - [Install Git](#install-git)
    - [Install Git on Windows](#install-git-on-windows)
    - [Install Git on macOS](#install-git-on-macos)
    - [Install Git on Linux](#install-git-on-linux)
  - [Install Expo CLI](#install-expo-cli)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Building the App](#building-the-app)
  - [Install EAS CLI](#install-eas-cli)
  - [Create an Expo Account](#create-an-expo-account)
  - [Login to Expo](#login-to-expo)
  - [Build Locally (Android Only)](#build-locally-android-only)
    - [Install Android SDK](#install-android-sdk)
      - [Install Android SDK on Windows](#install-android-sdk-on-windows)
      - [Install Android SDK on macOS](#install-android-sdk-on-macos)
      - [Install Android SDK on Linux](#install-android-sdk-on-linux)
  - [Build with EAS (Online)](#build-with-eas-online)
- [Contributing](#contributing)
- [Additional Resources](#additional-resources)
- [Community](#community)

## Introduction

The Parent Notification app allows schools and organizations to send important notifications directly to parents' mobile devices. Built with React Native and Expo, it supports both Android and iOS platforms.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 14 or later)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **Expo CLI** (installed globally)

### Install Node.js and npm

<details>
<summary>Click to expand instructions for installing Node.js and npm.</summary>

#### Install Node.js and npm on Windows

1. **Download Node.js Installer**

   Visit the [Node.js official website](https://nodejs.org/en/download/) and download the **Windows Installer** (`.msi`) for the **LTS** version.

2. **Run the Installer**

   - Double-click the downloaded `.msi` file.
   - Follow the prompts in the setup wizard.
   - Accept the license agreement.
   - Ensure that the **"Add to PATH"** option is selected.
   - Complete the installation.

3. **Verify Installation**

   Open **Command Prompt** and run:

   ```bash
   node -v
   npm -v
   ```

   You should see the installed versions of Node.js and npm.

#### Install Node.js and npm on macOS

1. **Download Node.js Installer**

   Visit the [Node.js official website](https://nodejs.org/en/download/) and download the **macOS Installer** (`.pkg`) for the **LTS** version.

2. **Run the Installer**

   - Double-click the downloaded `.pkg` file.
   - Follow the prompts in the setup wizard.
   - Accept the license agreement.
   - Complete the installation.

3. **Verify Installation**

   Open **Terminal** and run:

   ```bash
   node -v
   npm -v
   ```

#### Install Node.js and npm on Linux

**Using Node Version Manager (nvm):**

1. **Install nvm**

   Open **Terminal** and run:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
   ```

   Then, activate nvm:

   ```bash
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

2. **Install Node.js**

   ```bash
   nvm install --lts
   ```

3. **Verify Installation**

   ```bash
   node -v
   npm -v
   ```

</details>

### Install Git

<details>
<summary>Click to expand instructions for installing Git.</summary>

#### Install Git on Windows

1. **Download Git Installer**

   Visit the [Git for Windows](https://git-scm.com/download/win) website and download the latest installer.

2. **Run the Installer**

   - Double-click the downloaded `.exe` file.
   - Follow the prompts in the setup wizard.
   - Choose the default options unless you have specific needs.
   - Complete the installation.

3. **Verify Installation**

   Open **Command Prompt** and run:

   ```bash
   git --version
   ```

#### Install Git on macOS

**Using Homebrew:**

1. **Install Homebrew** (if not already installed)

   Open **Terminal** and run:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Git**

   ```bash
   brew install git
   ```

3. **Verify Installation**

   ```bash
   git --version
   ```

#### Install Git on Linux

**For Debian/Ubuntu-based systems:**

1. **Update Package List**

   ```bash
   sudo apt update
   ```

2. **Install Git**

   ```bash
   sudo apt install git
   ```

**For Fedora:**

```bash
sudo dnf install git
```

**For Arch Linux:**

```bash
sudo pacman -S git
```

3. **Verify Installation**

   ```bash
   git --version
   ```

</details>

### Install Expo CLI

Install the Expo CLI globally using npm:

```bash
npm install -g expo-cli
```

Verify the installation:

```bash
expo --version
```

## Installation

1. **Fork the Repository**

   - Go to the [repository page](https://github.com/jdu211171/apuri_kaihatsu).
   - Click the **Fork** button at the top right of the page.
   - This will create a copy of the repository under your GitHub account.

2. **Clone Your Fork**

   Replace `your-github-username` with your actual GitHub username:

   ```bash
   git clone https://github.com/your-github-username/apuri_kaihatsu.git
   cd apuri_kaihatsu/mobile/parent-notification
   ```

3. **Add Upstream Remote (Optional but Recommended)**

   This allows you to keep your fork up-to-date with the original repository.

   ```bash
   git remote add upstream https://github.com/jdu211171/apuri_kaihatsu.git
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

## Configuration

The app requires a backend server URL to function correctly. You'll need to set your computer's IP address in the `.env` file.

1. **Copy the Example Environment File**

   ```bash
   cp .env.example .env
   ```

2. **Find Your Computer's IP Address**

   <details>
   <summary>Instructions for finding your IP address.</summary>

   - **Windows**

     Open **Command Prompt** and run:

     ```bash
     ipconfig
     ```

     Look for the `IPv4 Address` under the active network connection.

   - **macOS**

     Open **Terminal** and run:

     ```bash
     ifconfig
     ```

     Look for `inet` under `en0` or `en1` (depending on your active network interface).

   - **Linux**

     Open **Terminal** and run:

     ```bash
     ifconfig
     ```

     Or, if `ifconfig` is not available:

     ```bash
     ip addr show
     ```

     Look for `inet` under the active network interface (e.g., `eth0`, `wlan0`).

   </details>

3. **Update the `.env` File**

   Open the `.env` file and replace `<your-ip-address>` with your actual IP address:

   ```env
   EXPO_PUBLIC_API_URL=http://<your-ip-address>:8080
   ```

## Running the App

Start the development server:

```bash
npx expo start
```

You'll see options to run the app:

- **Development build**
- **Android emulator**
- **iOS simulator**
- **Expo Go app** on your physical device

Use the following credentials to log in to the mobile app:

  - **Email**: `parent@gmail.com`
  - **Password**: `password`


## Building the App

You can build the app locally for Android or use Expo Application Services (EAS) to build it online.

### Install EAS CLI

Install the EAS CLI globally:

```bash
npm install -g eas-cli
```

### Create an Expo Account

If you don't have an Expo account, create one:

```bash
eas register
```

### Login to Expo

Log in to your Expo account:

```bash
eas login
```

### Build Locally (Android Only)

<details>
<summary>Click to expand instructions for building locally.</summary>

#### Install Android SDK

To build the app locally for Android, you need to install the Android SDK.

##### Install Android SDK on Windows

1. **Download Android Studio**

   Visit the [Android Studio download page](https://developer.android.com/studio) and download the installer.

2. **Install Android Studio**

   - Run the downloaded `.exe` file.
   - Follow the setup wizard.
   - During installation, select **Standard** installation.
   - Ensure the **Android SDK**, **SDK Platform**, and **Virtual Device** are selected.

3. **Set Environment Variables**

   - Open **Control Panel** > **System and Security** > **System** > **Advanced system settings**.
   - Click **Environment Variables**.
   - Under **System Variables**, click **New**.
     - **Variable name**: `ANDROID_HOME`
     - **Variable value**: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - Add `%ANDROID_HOME%\platform-tools` to your `PATH` variable.

##### Install Android SDK on macOS

1. **Download Android Studio**

   Visit the [Android Studio download page](https://developer.android.com/studio) and download the `.dmg` file.

2. **Install Android Studio**

   - Open the downloaded `.dmg` file.
   - Drag and drop **Android Studio** into the **Applications** folder.

3. **Set Environment Variables**

   Add the following to your `~/.bash_profile`, `~/.zshrc`, or `~/.bashrc`:

   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   Apply the changes:

   ```bash
   source ~/.bash_profile  # or source ~/.zshrc
   ```

##### Install Android SDK on Linux

1. **Download Android Studio**

   Visit the [Android Studio download page](https://developer.android.com/studio) and download the `.zip` file.

2. **Install Android Studio**

   - Extract the `.zip` file.
   - Move the extracted folder to a directory of your choice.

     ```bash
     sudo unzip android-studio-ide-*-linux.zip -d /opt
     ```

   - Run the Android Studio installer:

     ```bash
     /opt/android-studio/bin/studio.sh
     ```

3. **Set Environment Variables**

   Add the following to your `~/.bashrc` or `~/.zshrc`:

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   Apply the changes:

   ```bash
   source ~/.bashrc  # or source ~/.zshrc
   ```

#### Build the App Locally

```bash
npm run build
```

This runs:

```bash
eas build --platform android --local
```

</details>

### Build with EAS (Online)

1. **Configure EAS Project**

   ```bash
   eas build:configure
   ```

2. **Start the Build**

   - **Android**

     ```bash
     eas build --platform android
     ```

   - **iOS**

     ```bash
     eas build --platform ios
     ```

   - **Both Platforms**

     ```bash
     eas build --platform all
     ```

3. **Monitor the Build**

   You can monitor the build process in your Expo dashboard or directly in the terminal.

4. **Download the Build**

   Once the build is complete, you'll receive a URL to download the APK (Android) or IPA (iOS) file.

## Contributing

We welcome contributions from the community! To contribute, please follow these steps:

1. **Fork the Repository**

   - Click the **Fork** button at the top right of the [repository page](https://github.com/jdu211171/apuri_kaihatsu).

2. **Clone Your Fork**

   Replace `your-github-username` with your actual GitHub username:

   ```bash
   git clone https://github.com/your-github-username/apuri_kaihatsu.git
   cd apuri_kaihatsu
   ```

3. **Set Upstream Remote**

   This allows you to keep your fork up-to-date with the original repository:

   ```bash
   git remote add upstream https://github.com/jdu211171/apuri_kaihatsu.git
   ```

4. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make Changes**

   - Implement your feature or fix.
   - Commit your changes:

     ```bash
     git add .
     git commit -m "Add your descriptive commit message"
     ```

6. **Push Changes to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**

   - Go to your fork on GitHub.
   - Click on the **Compare & pull request** button.
   - Describe your changes and submit the pull request.

8. **Review Process**

   - Your pull request will be reviewed by the maintainers.
   - Please address any feedback or comments.
   - Once approved, your changes will be merged.

**Note:** Keep your fork updated with the latest changes from the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Additional Resources

- **Expo Documentation**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **React Native Documentation**: [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
- **EAS Build Documentation**: [https://docs.expo.dev/build/introduction/](https://docs.expo.dev/build/introduction/)
- **Node.js Documentation**: [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **Git Documentation**: [https://git-scm.com/doc](https://git-scm.com/doc)
