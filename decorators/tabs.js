const stylis = require("stylis");

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

      const style = h("style", {}, css);

      return (
        h(Tabs, Object.assign({}, this.props, {
          customChildrenBefore: [tabContainer],
          customChildren: [style],
        }))
      );
    }
  };
};

const css = stylis("#hyper", `
/* Header */
header.header_header {
  -webkit-app-region: drag;
  height: 20px;
}

/* Single Tab */
.tabs_title {
  text-align: left;
  margin-right: auto;
  padding: 0 12px;
  height: 36px;
  min-width: 100px;
  width: min-content;
  background-color: #393939;
  border-left: 1px solid transparent;
}

/* Multiple Tabs */
nav.tabs_nav {
  background-color: #252526;
  height: 36px;
  margin-top: 20px;
  -webkit-app-region: no-drag;
}
nav.tabs_nav ul.tabs_list {
  max-height: 36px;
  height: 36px;
  margin-left: 0;
}
nav.tabs_nav li.tab_tab {
  flex: 0 1 auto;
  min-width: 100px;
  background-color: #2d2d2d;
}
nav.tabs_nav li.tab_tab.tab_active {
  background-color: #393939;
}
nav.tabs_nav li.tab_tab i.tab_icon {
  top: 12px;
}
nav.tabs_nav li.tab_tab.tab_active i.tab_icon {
  opacity: 1;
  transform: none;
  pointer-events: all;
}
nav.tabs_nav li.tab_tab span.tab_text span.tab_textInner {
  position: relative !important;
  left: 0 !important;
  margin 0 28px 0 12px !important;
}
div.splitpane_divider {
  background-color: #444 !important;
}
`);