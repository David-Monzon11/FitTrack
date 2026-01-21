# GitHub Setup Instructions

## Connect to Existing GitHub Repository

Run these commands in your terminal (replace `YOUR_USERNAME` and `YOUR_REPO_NAME`):

```bash
cd "C:\Users\niceo\OneDrive\Desktop\FitTrack"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Or if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Create New Repository on GitHub

If you haven't created the repository yet:

1. Go to https://github.com/new
2. Enter repository name (e.g., "FitTrack")
3. Choose public or private
4. **DO NOT** check "Initialize with README"
5. Click "Create repository"
6. Then run the commands above with your repository URL
