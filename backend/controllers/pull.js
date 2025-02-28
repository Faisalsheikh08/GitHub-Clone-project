// const fs = require("fs").promises;
// const path = require("path");
// const { s3, S3_BUCKET } = require("../config/aws-config");

// async function pullRepo() {
//   const repoPath = path.resolve(process.cwd(), ".gitClone");
//   const commitsPath = path.join(repoPath, "commits");
//   try {
//     const data = await s3
//       .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commit/" })
//       .promise();
//     const objects = data.Contents;

//     for (const object of objects) {
//       const key = object.Key;
//       const commitDir = path.join(
//         commitsPath,
//         path.dirname(key).split("/").pop()
//       );

//       await fs.mkdir(commitDir, { recursive: true });
//       const params = {
//         Bucket: S3_BUCKET,
//         Key: key,
//       };
//       const fileContent = await s3.getObject(params).promise();
//       await fs.writeFile(path.join(repoPath, key), fileContent.Body);
//     }
//     console.log("All comments pulled from s3");
//   } catch (err) {
//     console.error("Unable to pull : ", err);
//   }
// }
// module.exports = { pullRepo };

const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".gitClone");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commit/" })
      .promise();

    if (!data.Contents || data.Contents.length === 0) {
      console.log("No commits found in S3.");
      return;
    }

    for (const object of data.Contents) {
      const key = object.Key;
      const relativePath = key.replace("commit/", ""); // Remove commit prefix
      const filePath = path.join(commitsPath, relativePath);
      const commitDir = path.dirname(filePath);

      // ✅ Ensure the directory exists before writing the file
      await fs.mkdir(commitDir, { recursive: true });

      // ✅ Fetch object from S3
      const params = { Bucket: S3_BUCKET, Key: key };
      const fileContent = await s3.getObject(params).promise();

      if (!fileContent.Body) {
        console.warn(`Skipping empty file: ${key}`);
        continue;
      }

      // ✅ Write the file safely
      await fs.writeFile(filePath, fileContent.Body);
    }

    console.log(" All commits pulled successfully from S3!");
  } catch (err) {
    console.error("Unable to pull : ", err);
  }
}

module.exports = { pullRepo };
