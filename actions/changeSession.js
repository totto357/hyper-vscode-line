const Dir = require("../modules/dir");
const Git = require("../modules/git");

const CHANGE_SESSION = "CHANGE_SESSION";

const changeSession = async (store, action) => {
  const pid = getPid(store, action);
  const cwd = await Dir.cwd(pid);
  const git = await Git.all(cwd);

  return (dispatch) => {
    dispatch({
      type: CHANGE_SESSION,
      payload: {
        pid,
        cwd,
        git,
      }
    });
  };
};

const getPid = (store, action) => {
  if (action.pid) {
    return action.pid;
  }
  const uids = store.getState().sessions.sessions;
  return uids[action.uid].pid;
}

module.exports = {
  CHANGE_SESSION,
  changeSession,
};
