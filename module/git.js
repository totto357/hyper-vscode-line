const { exec } = require('child_process');

const isGitDir = (dir) => {
  return new Promise((resolve) => {
    exec(`git rev-parse --is-inside-work-tree`, { cwd: dir }, (err) => {
      resolve(!err);
    });
  });
}

const branch = (repo) => {
  return new Promise((resolve, reject) => {
    exec(`git symbolic-ref --short HEAD || git rev-parse --short HEAD`, { cwd: repo }, (err, stdout) => {
      err ? reject(err) : resolve(stdout.trim());
    });
  });
}

const remote = (repo) => {
  return new Promise((resolve, reject) => {
    exec(`git ls-remote --get-url`, { cwd: repo }, (err, stdout) => {
      const _remote = stdout.trim()
        .replace(/^git@(.*?):/, 'https://$1/')
        .replace(/[A-z0-9\-]+@/, '')
        .replace(/\.git$/, '');
      return resolve(_remote);
    });
  });
}

const dirty = (repo) => {
  return new Promise((resolve, reject) => {
    exec(`git status --porcelain --ignore-submodules -uno`, { cwd: repo }, (err, stdout) => {
      err
        ? reject(err)
        : resolve(!stdout ? 0 : parseInt(stdout.trim().split('\n').length, 10));
    });
  });
}

const ahead = (repo) => {
  return new Promise((resolve, reject) => {
    exec(`git rev-list --left-only --count HEAD...@'{u}' 2>/dev/null`, { cwd: repo }, (err, stdout) => {
      resolve(parseInt(stdout, 10) || 0);
    });
  });
}

const all = async (repo) => {
  if (!(await isGitDir(repo))) {
    return null;
  }

  const [_branch, _remote, _dirty, _ahead] = await Promise.all([
    branch(repo),
    remote(repo),
    dirty(repo),
    ahead(repo)
  ]);
  return {
    branch: _branch,
    remote: _remote,
    dirty: _dirty,
    ahead: _ahead,
  };
}

module.exports = {
  isGitDir,
  branch,
  remote,
  dirty,
  ahead,
  all,
};
