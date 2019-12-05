const stylis = require("stylis");

module.exports = React => {
  return class extends React.PureComponent {
    render() {
      const h = React.createElement;
      const style = h("style", {}, stylis("#hyper", this.css));

      return h("div", {
        style: {
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          backgroundColor: "transparent",
          border: "1px solid rgba(255, 255, 255, .2)",
          borderTopColor: "transparent",
          borderRadius: "4px",
          zIndex: "1000000",
        }
      }, [style]);
    }

    get css() {
      return `
        div.hyper_main {
          border-width: 0 !important;
        }
      `
    }
  }
}
