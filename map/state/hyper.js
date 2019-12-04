module.exports = (state, map) => Object.assign(map, {
  sessionState: state.ui.sessionState,
});
