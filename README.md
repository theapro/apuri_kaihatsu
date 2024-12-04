## How to Contribute to `apuri_kaihatsu`

### Setting up Your Local Development Environment

1. **Fork the Repository**
   ```sh
   git fork https://github.com/jdu211171/apuri_kaihatsu.git
   ```

2. **Clone the Forked Repository**
   ```sh
   git clone https://github.com/YOUR-USERNAME/apuri_kaihatsu.git
   ```

3. **Navigate to the Project Directory**
   ```sh
   cd apuri_kaihatsu
   ```
### Getting Latest Code Changes From original Repository to Your Repository
   Fetching the latest changes from the original repository (upstream) into your forked repository is a common task in version control. Here are the steps to achieve that using Git:

1. **Add the original repository as a remote:**
   - First, navigate to your local repository.
   - Add the upstream repository URL.
   ```sh
   git remote add upstream https://github.com/jdu211171/apuri_kaihatsu.git
   ```

2. **Fetch the latest changes from the upstream repository:**
   - This command will fetch all the branches from the upstream repository but won't merge any changes.
   ```sh
   git fetch upstream
   ```

3. **Merge the changes into your local branch:**
   - Checkout the branch you want to update (usually `main` or `master`).
   ```sh
   git checkout main
   ```
   - Merge the changes from the upstream branch into your local branch.
   ```sh
   git merge upstream/main
   ```

4. **Push the changes to your forked repository:**
   - Finally, push the updated branch to your forked repository on GitHub.
   ```sh
   git push origin main
   ```

That's it! Your forked repository should now be up-to-date with the latest changes from the original repository.

### Making Changes

1. **Create a New Branch**
   ```sh
   git checkout -b feature-branch-name
   ```

2. **Make Your Changes and Commit**
   ```sh
   git add .
   git commit -m "Describe your changes"
   ```

### Submitting a Pull Request

1. **Push to Your Forked Repository**
   ```sh
   git push origin feature-branch-name
   ```

2. **Create a Pull Request**
   - Go to your repository on GitHub.
   - Click on the "Compare & pull request" button.
   - Provide a clear title and description for your pull request.

### Checklist Before Submitting a Pull Request

1. **Run Tests and Lint the Code**
   ```sh
   npm run test
   npm run lint
   ```

2. **Ensure Commit Messages are Meaningful**
   - Use clear and descriptive commit messages.

By following these steps, you can contribute effectively to the `jdu211171/apuri_kaihatsu` repository.
