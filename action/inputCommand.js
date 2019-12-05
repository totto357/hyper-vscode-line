const Dir = require("../module/dir");
const Git = require("../module/git");

const INPUT_COMMAND = "INPUT_COMMAND";

const inputCommand = async (store, action) => {
  const { data } = action;
  const keyupedEnter = data.indexOf("\n") > 0;

  if (!keyupedEnter) {
    return () => {};
  }

  const state = store.getState().ui.sessionState;
  if (!state) {
    // not initialized sessionState.
    return () => {};
  }

  const pid = store.getState().ui.sessionState.pid;
  const cwd = await Dir.cwd(pid);
  const git = await Git.all(cwd);

  return (dispatch) => {
    dispatch({
      type: INPUT_COMMAND,
      payload: {
        pid,
        cwd,
        git,
      }
    });
  };
}

module.exports = {
  INPUT_COMMAND,
  inputCommand,
};
