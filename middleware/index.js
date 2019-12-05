const { changeSession } = require("../action/changeSession");
const { inputCommand } = require("../action/inputCommand");

module.exports = (store) => (next) => (action) => {
  switch (action.type) {
    case "SESSION_SET_XTERM_TITLE":
    case "SESSION_ADD":
    case "SESSION_SET_ACTIVE":
      changeSession(store, action).then(store.dispatch);
      break;

    case "SESSION_ADD_DATA":
      inputCommand(store, action).then(store.dispatch);
      break;
  }

  next(action);
};