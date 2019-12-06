const { exec } = require("child_process");

const open = (dir) => {
  return new Promise((resolve, reject) => {
    exec(`/usr/local/bin/code ${dir}`, {}, (err) => {
      if (!!err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  open,
};
