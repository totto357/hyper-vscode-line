const { CHANGE_SESSION } = require("../action/changeSession");
const { INPUT_COMMAND } = require("../action/inputCommand");

module.exports = (state, action) => {
  switch (action.type) {
    case CHANGE_SESSION:
    case INPUT_COMMAND:
      const { payload: { pid, cwd, git } } = action;
      return state.set("sessionState", { pid, cwd, git });

    default:
      return state;
  }
};
