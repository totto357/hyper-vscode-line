const { exec } = require("child_process");

const cwd = (pid) => {
  return new Promise((resolve, reject) => {
    exec(`lsof -p ${pid} | awk '$4=="cwd"' | tr -s ' ' | cut -d ' ' -f9-`, (err, stdout) => {
      if (err) {
        return reject(err);
      }
      return resolve(stdout.trim());
    });
  });
}

module.exports = {
  cwd,
};
