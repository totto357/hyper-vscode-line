const { shell } = require('electron');
const tildify = require('tildify');

module.exports = (Hyper, { React }) => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.handleCwdClick = this.handleCwdClick.bind(this);
      this.handleBranchClick = this.handleBranchClick.bind(this);
    }

    handleCwdClick() {
      const state = this.props.sessionState || {};
      shell.openExternal('file://' + state.cwd);
    }

    handleBranchClick() {
      const state = this.props.sessionState || {};
      shell.openExternal(state.git.remote);
    }

    render() {
      const state = this.props.sessionState || {};
      const h = React.createElement;

      const footerChildren = [];
      if (state.cwd) {
        const cwdElement =
          h('div', { className: 'footer_group group_overflow' }, [
            h('div', { className: 'component_component component_cwd' }, [
              h('div', {
                className: 'component_item item_icon item_cwd item_clickable',
                title: state.cwd,
                onClick: this.handleCwdClick,
              }, tildify(String(state.cwd))),
            ]),
          ]);

        footerChildren.push(cwdElement);
      }

      if (state.git) {
        const git = state.git;
        const gitElement =
          h('div', { className: 'footer_group' }, [
            h('div', { className: 'component_component component_git' }, [
              h('div', {
                className: `component_item item_icon item_branch ${git.remote ? 'item_clickable' : ''}`,
                title: git.remote,
                onClick: this.handleBranchClick,
              }, git.branch),

              h('div', {
                className: 'component_item item_icon item_number item_dirty',
                title: `${git.dirty} dirty file${git.dirty > 1 ? 's' : ''}`,
              }, git.dirty),

              h('div', {
                className: 'component_item item_icon item_number item_ahead',
                title: `${git.ahead} commit${git.ahead > 1 ? 's' : ''} ahead`,
              }, git.ahead),
            ]),
          ]);

        footerChildren.push(gitElement);
      }

      const footer = h('footer', { className: 'footer_footer' }, footerChildren);

      const { customChildren } = this.props
      const existingChildren = customChildren ? [...customChildren] : []

      return (
        h(Hyper, Object.assign({}, this.props, {
          customInnerChildren: existingChildren.concat(footer)
        }))
      );
    }
  };
};
