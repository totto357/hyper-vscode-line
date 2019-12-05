module.exports = (Tabs, { React }) => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.handleTabContainerClick = this.handleTabContainerClick.bind(this);
    }

    handleTabContainerClick(e) {
      e.stopPropagation();
      window.rpc.emit("command", "tab:new", window);
    }

    render() {
      const h = React.createElement;

      const tabContainer = h("div", {
        style: {
          position: "absolute",
          width: "100%",
          height: "100%",
        },
        onDoubleClick: this.handleTabContainerClick,
      });

      return (
        h(Tabs, Object.assign({}, this.props, {
          customChildrenBefore: [tabContainer],
        }))
      );
    }
  };
};
