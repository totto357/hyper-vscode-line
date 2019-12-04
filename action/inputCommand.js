const Dir = require("../module/dir");
const Git = require("../module/git");

const INPUT_COMMAND = "INPUT_COMMAND";

const inputCommand = async (store, action) => {
  const { data } = action;
  const keyupedEnter = data.indexOf('\n') > 0;

  if (!keyupedEnter) {
    // FIXME エラーか？
    throw new Error("Enter押されてない");
  }

  const state = store.getState().ui.sessionState;
  if (!state) {
    throw new Error("stateがまだない");
  }

  const pid = store.getState().ui.sessionState.pid;
  const cwd = await Dir.cwd(pid);
  const git = await Git.all(cwd);

  return {
    type: INPUT_COMMAND,
    payload: {
      pid,
      cwd,
      git,
    }
  };
}

module.exports = {
  INPUT_COMMAND,
  inputCommand,
};
