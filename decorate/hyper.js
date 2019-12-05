const FrameBorderFactory = require("../components/FrameBorder");
const FooterFactory = require("../components/Footer");

module.exports = (Hyper, { React }) => {
  const FrameBorder = FrameBorderFactory(React);
  const Footer = FooterFactory(React);

  return class extends React.PureComponent {
    constructor(props) {
      super(props);
    }

    render() {
      const h = React.createElement;

      const { customChildren } = this.props
      const existingChildren = customChildren ? [...customChildren] : []

      return h(Hyper, Object.assign({}, this.props, {
        customInnerChildren: existingChildren.concat(
          h(Footer, Object.assign({}, this.props)),
          h(FrameBorder),
        )
      }));
    }
  };
};
