const { changeSession } = require("../action/changeSession");
const { inputCommand } = require("../action/inputCommand");

module.exports = (store) => (next) => (action) => {
  switch (action.type) {
    case 'SESSION_SET_XTERM_TITLE':
    case 'SESSION_ADD':
    case 'SESSION_SET_ACTIVE':
      changeSession(store, action)
        .then(action => store.dispatch(action))
        .catch(_ => _); // FIXME
      break;

    case 'SESSION_ADD_DATA':
      inputCommand(store, action)
        .then(action => store.dispatch(action))
        .catch(_ => _); // FIXME
      break;
  }

  next(action);
};