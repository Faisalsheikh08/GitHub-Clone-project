const path = require("path");
const fs = require("fs").promises;

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".gitClone");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "fss" })
    );
    console.log("git initilized successfully");
  } catch (err) {
    console.error("Error while creating initilizing git", err);
  }
}
module.exports = { initRepo };
