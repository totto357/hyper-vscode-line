const stylis = require("stylis");

module.exports = (Terms, { React }) => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);
    }

    render() {
      const h = React.createElement;

      const style = h("style", {}, stylis("#hyper", this.css));

      return (
        h(Terms, Object.assign({}, this.props, {
          customChildren: [style],
        }))
      );
    }

    get css() {
      return `
        .terms_terms {
          margin-top: 56px;
          margin-bottom: 30px;
        }
      `
    }
  };
};
