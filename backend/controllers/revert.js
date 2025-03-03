// const fs = require("fs");
// const path = require("path");
// const { promisify } = require("util");

// const readdir = promisify(fs.readdir);
// const copyFile = promisify(fs.copyFile);

// async function revertRepo(commitId) {
//   const repoPath = path.resolve(process.cwd(), ".gitClone");
//   const commitsPath = path.join(repoPath, "commits");

//   try {
//     const commitDir = path.join(commitsPath, commitId);
//     const files = await readdir(commitDir);
//     const parentDir = path.resolve(repoPath, "..");

//     for (const file of files) {
//       await copyFile(path.join(commitDir, file), path.join(parentDir, file));
//     }
//     console.log(Reverted to commit ${commitId});
//   } catch (e) {
//     console.error("Error while reverting the commit", e);
//   }
// }
// module.exports = { revertRepo };

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitId) {
  // console.log(commitId);
  // if (typeof commitId !== "string" || !commitId.trim()) {
  //   throw new TypeError("Invalid commit ID provided.");
  // }

  const repoPath = path.resolve(process.cwd(), ".gitClone");
  const commitsPath = path.join(repoPath, "commits");
  const commitDir = path.join(commitsPath, commitId);

  // if (!fs.existsSync(commitDir)) {
  //   throw new Error(`Commit directory does not exist: ${commitDir}`);
  // }

  try {
    const files = await readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }
    console.log(`Reverted to commit ${commitId}`);
  } catch (e) {
    throw new Error(`Error while reverting commit: ${e.message}`);
  }
}

module.exports = { revertRepo };
