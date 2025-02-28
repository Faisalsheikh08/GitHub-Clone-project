const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// const path = require("path");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");

// console.log(path.resolve(process.cwd(), "fss"));
// this is for reading command line commands
yargs(hideBin(process.argv))
  // ("command","This message will pop when empty command is pass" ,parameters ,what happen when this command call  )
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "push commit to repo", {}, pushRepo)
  .command("pull", "pull commit from repo", {}, pullRepo)
  .command(
    "revert <commitId>",
    "revert the specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Commit id to revert to",
        type: "string",
      });
    },
    revertRepo
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;
