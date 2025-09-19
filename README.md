# Firebase Studio

This is a Next.js starter project built in Firebase Studio.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Admin Dashboard

The admin dashboard is located at `/admin`. To log in, use the following credentials:
- **Username:** user
- **Password:** password

## Moving to GitHub & VS Code

To manage your project with Git, host it on GitHub, and ensure it works on any system with VS Code, follow these steps:

### 1. Initialize a Git Repository

If you haven't already, initialize a Git repository in your project's root directory:

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create a GitHub Repository

Go to [GitHub](https://github.com/new) and create a new repository. Do **not** initialize it with a README or .gitignore, as we have already created those.

### 3. Push to GitHub

Link your local repository to the one on GitHub and push your code. Replace `<YOUR_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your details.

```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git branch -M main
git push -u origin main
```

### 4. Use the VS Code Dev Container

This project includes a pre-configured Dev Container. When you open this project in VS Code, it should prompt you to "Reopen in Container". Click that button.

This will build a Docker container with all the necessary dependencies (like Node.js) already installed, ensuring a consistent development environment on any machine. All you need to have installed is Docker and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in VS Code.
