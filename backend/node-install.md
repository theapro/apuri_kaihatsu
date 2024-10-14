# Node.js

Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. It's widely used for building server-side and networking applications.

## Installing Node.js

### Installation on Windows

To install Node.js on Windows, follow these steps:

1. **Download the Installer**:
   - Go to the [Node.js official website](https://nodejs.org/en/download/).
   - Click on the **Windows Installer** button to download the `.msi` file.

2. **Run the Installer**:
   - Double-click the downloaded `.msi` file to start the installation.
   - If prompted by User Account Control, click **Yes**.

3. **Setup Wizard**:
   - Click **Next** on the welcome screen.
   - Read and accept the license agreement.
   - Click **Next**.

4. **Choose Installation Location**:
   - Choose the destination folder or leave it as default.
   - Click **Next**.

5. **Custom Setup**:
   - Select the features you want to install (default selections are recommended).
   - Click **Next**.

6. **Tools for Native Modules** (Optional):
   - If you plan to compile native Node.js modules, check the option **Automatically install the necessary tools**.
   - This will install Python and Visual Studio Build Tools.

7. **Install**:
   - Click **Install** to begin the installation.
   - Click **Yes** if prompted by User Account Control.

8. **Complete Installation**:
   - Click **Finish** to exit the setup wizard.

#### Verify the Installation

1. **Open Command Prompt**:
   - Press `Win + R`, type `cmd`, and press **Enter**.

2. **Check Node.js Version**:
   ```bash
   node -v
   ```

3. **Check npm Version**:
   ```bash
   npm -v
   ```

### Installation on Linux

#### Using Package Manager on Debian/Ubuntu

1. **Update Package Index**:

   ```bash
   sudo apt update
   ```

2. **Install Node.js and npm**:

   ```bash
   sudo apt install nodejs npm
   ```

3. **Verify the Installation**:

   ```bash
   node -v
   npm -v
   ```

#### Using NodeSource PPA for Latest Version

1. **Install Curl** (if not already installed):

   ```bash
   sudo apt install curl
   ```

2. **Add NodeSource PPA**:

   - For Node.js 18.x (LTS):

     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     ```

   - For Node.js 20.x (Current):

     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     ```

3. **Install Node.js**:

   ```bash
   sudo apt install -y nodejs
   ```

4. **Verify the Installation**:

   ```bash
   node -v
   npm -v
   ```

#### Using nvm (Node Version Manager)

`nvm` allows you to install and manage multiple Node.js versions.

1. **Install nvm**:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
   ```

   - Load `nvm`:

     ```bash
     export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
     ```

2. **Install Node.js Using nvm**:

   - List available Node.js versions:

     ```bash
     nvm ls-remote
     ```

   - Install a specific version (e.g., 18.17.0):

     ```bash
     nvm install 18.17.0
     ```

   - Use the installed version:

     ```bash
     nvm use 18.17.0
     ```

3. **Verify the Installation**:

   ```bash
   node -v
   npm -v
   ```

### Post-Installation Steps

#### Configure npm Global Packages Path (Optional)

By default, global npm packages are installed in a system directory, which may require `sudo` privileges. You can configure npm to install global packages in your home directory:

1. **Create Directory for Global Packages**:

   ```bash
   mkdir "${HOME}/.npm-global"
   ```

2. **Configure npm to Use New Directory**:

   ```bash
   npm config set prefix "${HOME}/.npm-global"
   ```

3. **Update Environment Variables**:

   - Open `~/.profile` in a text editor and add:

     ```bash
     export PATH="$HOME/.npm-global/bin:$PATH"
     ```

   - Reload the profile:

     ```bash
     source ~/.profile
     ```

#### Install Common Global Packages (Optional)

- **npm-check-updates**:

  ```bash
  npm install -g npm-check-updates
  ```

- **Express Generator**:

  ```bash
  npm install -g express-generator
  ```

## Next Steps

After installing Node.js, proceed to the main [README](README.md) for further instructions on setting up your development environment and starting your Node.js applications.
