const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".gitClone");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    // this loop for multiple folder
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const commitFiles = await fs.readdir(commitPath);
      // this will run for each file in particular folder
      for (const commitFile of commitFiles) {
        const filePath = path.join(commitPath, commitFile);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `commit/${commitDir}/${commitFile}`,
          Body: fileContent,
        };
        await s3.upload(params).promise();
      }
    }
    console.log(`All commit pushed to s3 `);
  } catch (e) {
    console.error("Error while pushing in s3 bucket", e);
  }
}
module.exports = { pushRepo };
