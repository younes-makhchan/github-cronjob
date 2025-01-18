const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

module.exports = async function (context, myTimer) {
    const token = ''; // your GitHub Access Token and better use the azure fnction env variable
    const githubUsername='' // your github username
    const timeStamp = new Date().toISOString();
    const repoUrl = `https://${token}@github.com/${githubUsername}/auto-github-commit.git`;
    const fileToUpdate = "update.txt";
    const localRepoPath = path.join("/home", "gits"); // Local repository path relative to function directory

    if (myTimer.isPastDue) {
        context.log('JavaScript timer is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);

    try {
        // Check if the local repository directory exists; if not, clone the repository
        if (!fs.existsSync(localRepoPath)) {
            context.log("Local repository not found. Cloning repository...");
            // Ensure the parent directory exists
            const parentDir = path.dirname(localRepoPath);
            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, { recursive: true });
            }
            // Clone into the specified localRepoPath
            await simpleGit(parentDir).clone(repoUrl, path.basename(localRepoPath));
        }

        // Initialize simple-git with the local repository path
        const git = simpleGit(localRepoPath);

        // Ensure the local directory is a Git repository
        try{
            await git.init(); // Ensure repository is initialized

        }catch(error){
            console.log("catch error when init",error)
        }
        // Ensure the remote 'origin' is configured
        const remotes = await git.getRemotes(true);
        const originExists = remotes.some(remote => remote.name === 'origin');
        if (!originExists) {
            context.log("Adding remote repository 'origin'...");
            await git.addRemote('origin', repoUrl);
        }

        // Append timestamp to update.txt
        const updateFilePath = path.join(localRepoPath, fileToUpdate);
        fs.appendFileSync(updateFilePath, `Update at: ${new Date().toString()}\n`, 'utf8');
        context.log(`Appended timestamp to ${fileToUpdate}`);

        // Stage changes
        await git.add(fileToUpdate);

        // Commit changes
        const commitMessage = `Automated update at ${new Date().toString()}`;
        await git.commit(commitMessage);
        context.log("Committed changes");

        // Force push changes to the remote repository
        await git.push('origin', 'master', { '--force': null });
        context.log("Force pushed changes to remote repository");
    } catch (error) {
        context.log.error("Error during Git operations:", error);
    }
};
