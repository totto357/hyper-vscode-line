const { CHANGE_SESSION } = require("../actions/changeSession");
const { INPUT_COMMAND } = require("../actions/inputCommand");

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
