const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".gitClone");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // created a new commit directory with uuid name
    const commitId = uuidv4();
    const commitDir = path.join(commitsPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    // get all the files from staging area
    const files = await fs.readdir(stagingPath);

    // move all the files from staging to commit directory
    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitDir, file)
      );
    }

    // clear the staging area

    // json file to track the message
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ msg: message, date: new Date().toISOString() })
    );
    console.log(`Commit ${commitId} created with message: ${message}`);
  } catch (err) {
    console.error("Error while committing the files", err);
  }
}
module.exports = { commitRepo };
