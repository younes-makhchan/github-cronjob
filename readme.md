## Introduction

The purpose of this repository is to demonstrate the use of Azure Functions with a TimerTrigger to automate GitHub commits on a schedule. This project showcases how to set up a function that runs every 4 hours to commit and push changes into a private repository.

## Setup Instructions

1. **Create a GitHub Repository**
   - Create a **private** repository named `auto-github-commit`.

2. **Generate a GitHub Access Token**
   - Go to your GitHub account's Developer Settings -> Personal Access Tokens -> Generate Token.
   - Generate a token with permissions to update the repository (repo scope).
   - Save this token for use in your Azure Function.

3. **(Optional) Local Testing**
   - Update the `TimerTrigger/function.json` schedule to trigger every 10 seconds for testing:
     ```json
     {
       "schedule": "*/10 * * * * *"
     }
     ```
   - Install the Azure CLI and run the following commands:
     ```bash
     npm install
     func start --verbose
     ```

4. **Configure and Deploy Azure Function**
   - Clone this repository locally.
   - Update the `index.js` file with your GitHub token and username.
   - Deploy the function to Azure Functions using your preferred method (e.g., Azure VS Code extension).

5. **Environment Variables**
   - Store sensitive information like the GitHub token as environment variables in Azure:
     - `GITHUB_TOKEN`: Your GitHub token.
     - `GITHUB_USERNAME`: Your GitHub username.

6. **Run and Monitor**
   - Verify that the function triggers every 4 hours by checking the logs and your GitHub repository's commit history.

