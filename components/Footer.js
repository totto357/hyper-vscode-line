const { shell } = require("electron");
const tildify = require("tildify");
const stylis = require("stylis");
const VsCode = require("../modules/vscode");

module.exports = React => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.handleCodeClick = this.handleCodeClick.bind(this);
      this.handleCwdClick = this.handleCwdClick.bind(this);
      this.handleBranchClick = this.handleBranchClick.bind(this);
    }

    handleCodeClick() {
      const state = this.props.sessionState || {};
      VsCode.open(state.cwd).catch(console.error);
    }

    handleCwdClick() {
      const state = this.props.sessionState || {};
      shell.openExternal("file://" + state.cwd);
    }

    handleBranchClick() {
      const state = this.props.sessionState || {};
      shell.openExternal(state.git.remote);
    }

    render() {
      const state = this.props.sessionState || {};
      const h = React.createElement;

      const footerChildren = [];

      const leftItems = [];
      if (state.cwd) {
        const codeItem =
          h("div", { className: "component_component component_code" }, [
            h("div", {
              className: "component_item item_icon item_code item_clickable",
              title: "Open in vscode",
              onClick: this.handleCodeClick,
            }),
          ]);
        leftItems.push(codeItem);

        const cwdItem =
          h("div", { className: "component_component component_cwd" }, [
            h("div", {
              className: "component_item item_icon item_cwd item_clickable",
              title: state.cwd,
              onClick: this.handleCwdClick,
            }, tildify(state.cwd)),
          ]);
        leftItems.push(cwdItem);
      }
      footerChildren.push(h("div", { className: "footer_group group_left" }, leftItems));

      const rightItems = [];
      if (state.git) {
        const git = state.git;
        const gitItem =
          h("div", { className: "component_component component_git" }, [
            h("div", {
              className: `component_item item_icon item_branch ${git.remote ? "item_clickable" : ""}`,
              title: git.remote,
              onClick: this.handleBranchClick,
            }, git.branch + (git.dirty ? "*" : "")),

            h("div", {
              className: "component_item item_icon item_number item_dirty",
              title: `${git.dirty} dirty file${git.dirty > 1 ? "s" : ""}`,
            }, git.dirty),

            h("div", {
              className: "component_item item_icon item_number item_ahead",
              title: `${git.ahead} commit${git.ahead > 1 ? "s" : ""} ahead`,
            }, git.ahead),
          ]);
        rightItems.push(gitItem);
      }
      footerChildren.push(h("div", { className: "footer_group group_right" }, rightItems));

      footerChildren.push(h("style", {}, stylis("#hyper-vscode-line", this.css)));

      return h("footer", {
        id: "hyper-vscode-line",
        className: "footer_footer"
      }, footerChildren);
    }

    get css() {
      return `
        &.footer_footer {
          height: 22px;
          display: flex;
          justify-content: space-between;
          position: absolute;
          bottom: 0;
          z-index: 100;
          left: 0;
          right: 0;
          font-size: 12px;
          opacity: 1,
          cursor: default;
          -webkit-user-select: none;
          color: var(--hvl-foreground-color);
          background-color: var(--hvl-background-color);
        }
        .footer_group {
          display: flex;
          white-space: nowrap;
          overflow: hidden;
        }
        .group_left {
          flex-grow: 1;
        }
        .group_right {
          flex-grow: 0;
        }
        .component_component {
          display: inline-block;
          line-height: 22px;
          height: 100%;
          vertical-align: top;
        }
        .component_item {
          position: relative;
          display: inline-block;
          height: 100%;
          margin: 0 3px;
          padding: 0 5px;
          white-space: pre;

          &.item_code {
            padding: 0 10px;
          }
        }
        .item_number {
          font-size: 11px;
        }
        .item_clickable {
          &:hover {
            background-color: rgba(255, 255, 255, 0.12);
            cursor: pointer;
          }
        }
        .item_icon {
          &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 5px;
            width: 22px;
            height: 100%;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: 0 center;
            background-color: var(--hvl-foreground-color);
          }
        }
        .item_code {
          width: 36px;
          margin: 0;

          &:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8bWFzayBpZD0ibWFzazAiIG1hc2stdHlwZT0iYWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2Ij4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTgxLjUzNCAyNTQuMjUyQzE4NS41NjYgMjU1LjgyMyAxOTAuMTY0IDI1NS43MjIgMTk0LjIzNCAyNTMuNzY0TDI0Ni45NCAyMjguNDAzQzI1Mi40NzggMjI1LjczOCAyNTYgMjIwLjEzMiAyNTYgMjEzLjk4M1Y0Mi4wMTgxQzI1NiAzNS44Njg5IDI1Mi40NzggMzAuMjYzOCAyNDYuOTQgMjcuNTk4OEwxOTQuMjM0IDIuMjM2ODFDMTg4Ljg5MyAtMC4zMzMxMzIgMTgyLjY0MiAwLjI5NjM0NCAxNzcuOTU1IDMuNzA0MThDMTc3LjI4NSA0LjE5MSAxNzYuNjQ3IDQuNzM0NTQgMTc2LjA0OSA1LjMzMzU0TDc1LjE0OSA5Ny4zODYyTDMxLjE5OTIgNjQuMDI0N0MyNy4xMDc5IDYwLjkxOTEgMjEuMzg1MyA2MS4xNzM1IDE3LjU4NTUgNjQuNjNMMy40ODkzNiA3Ny40NTI1Qy0xLjE1ODUzIDgxLjY4MDUgLTEuMTYzODYgODguOTkyNiAzLjQ3Nzg1IDkzLjIyNzRMNDEuNTkyNiAxMjhMMy40Nzc4NSAxNjIuNzczQy0xLjE2Mzg2IDE2Ny4wMDggLTEuMTU4NTMgMTc0LjMyIDMuNDg5MzYgMTc4LjU0OEwxNy41ODU1IDE5MS4zN0MyMS4zODUzIDE5NC44MjcgMjcuMTA3OSAxOTUuMDgxIDMxLjE5OTIgMTkxLjk3Nkw3NS4xNDkgMTU4LjYxNEwxNzYuMDQ5IDI1MC42NjdDMTc3LjY0NSAyNTIuMjY0IDE3OS41MTkgMjUzLjQ2NyAxODEuNTM0IDI1NC4yNTJaTTE5Mi4wMzkgNjkuODg1M0wxMTUuNDc5IDEyOEwxOTIuMDM5IDE4Ni4xMTVWNjkuODg1M1oiIGZpbGw9IndoaXRlIi8+DQo8L21hc2s+DQo8ZyBtYXNrPSJ1cmwoI21hc2swKSI+DQo8cGF0aCBkPSJNMjQ2Ljk0IDI3LjYzODNMMTk0LjE5MyAyLjI0MTM4QzE4OC4wODggLTAuNjk4MzAyIDE4MC43OTEgMC41NDE3MjEgMTc1Ljk5OSA1LjMzMzMyTDMuMzIzNzEgMTYyLjc3M0MtMS4zMjA4MiAxNjcuMDA4IC0xLjMxNTQ4IDE3NC4zMiAzLjMzNTIzIDE3OC41NDhMMTcuNDM5OSAxOTEuMzdDMjEuMjQyMSAxOTQuODI3IDI2Ljk2ODIgMTk1LjA4MSAzMS4wNjE5IDE5MS45NzZMMjM5LjAwMyAzNC4yMjY5QzI0NS45NzkgMjguOTM0NyAyNTUuOTk5IDMzLjkxMDMgMjU1Ljk5OSA0Mi42NjY3VjQyLjA1NDNDMjU1Ljk5OSAzNS45MDc4IDI1Mi40NzggMzAuMzA0NyAyNDYuOTQgMjcuNjM4M1oiIGZpbGw9IiMwMDY1QTkiLz4NCjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2QpIj4NCjxwYXRoIGQ9Ik0yNDYuOTQgMjI4LjM2MkwxOTQuMTkzIDI1My43NTlDMTg4LjA4OCAyNTYuNjk4IDE4MC43OTEgMjU1LjQ1OCAxNzUuOTk5IDI1MC42NjdMMy4zMjM3MSA5My4yMjcyQy0xLjMyMDgyIDg4Ljk5MjUgLTEuMzE1NDggODEuNjgwMiAzLjMzNTIzIDc3LjQ1MjNMMTcuNDM5OSA2NC42Mjk4QzIxLjI0MjEgNjEuMTczMyAyNi45NjgyIDYwLjkxODggMzEuMDYxOSA2NC4wMjQ1TDIzOS4wMDMgMjIxLjc3M0MyNDUuOTc5IDIyNy4wNjUgMjU1Ljk5OSAyMjIuMDkgMjU1Ljk5OSAyMTMuMzMzVjIxMy45NDZDMjU1Ljk5OSAyMjAuMDkyIDI1Mi40NzggMjI1LjY5NSAyNDYuOTQgMjI4LjM2MloiIGZpbGw9IiMwMDdBQ0MiLz4NCjwvZz4NCjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2QpIj4NCjxwYXRoIGQ9Ik0xOTQuMTk2IDI1My43NjNDMTg4LjA4OSAyNTYuNyAxODAuNzkyIDI1NS40NTkgMTc2IDI1MC42NjdDMTgxLjkwNCAyNTYuNTcxIDE5MiAyNTIuMzg5IDE5MiAyNDQuMDM5VjExLjk2MDZDMTkyIDMuNjEwNTcgMTgxLjkwNCAtMC41NzExNzUgMTc2IDUuMzMzMjFDMTgwLjc5MiAwLjU0MTE2NiAxODguMDg5IC0wLjcwMDYwNyAxOTQuMTk2IDIuMjM2NDhMMjQ2LjkzNCAyNy41OTg1QzI1Mi40NzYgMzAuMjYzNSAyNTYgMzUuODY4NiAyNTYgNDIuMDE3OFYyMTMuOTgzQzI1NiAyMjAuMTMyIDI1Mi40NzYgMjI1LjczNyAyNDYuOTM0IDIyOC40MDJMMTk0LjE5NiAyNTMuNzYzWiIgZmlsbD0iIzFGOUNGMCIvPg0KPC9nPg0KPGcgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm92ZXJsYXkiIG9wYWNpdHk9IjAuMjUiPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xODEuMzc4IDI1NC4yNTJDMTg1LjQxIDI1NS44MjIgMTkwLjAwOCAyNTUuNzIyIDE5NC4wNzcgMjUzLjc2NEwyNDYuNzgzIDIyOC40MDJDMjUyLjMyMiAyMjUuNzM3IDI1NS44NDQgMjIwLjEzMiAyNTUuODQ0IDIxMy45ODNWNDIuMDE3OUMyNTUuODQ0IDM1Ljg2ODcgMjUyLjMyMiAzMC4yNjM2IDI0Ni43ODQgMjcuNTk4NkwxOTQuMDc3IDIuMjM2NjVDMTg4LjczNyAtMC4zMzMyOTkgMTgyLjQ4NiAwLjI5NjE3NyAxNzcuNzk4IDMuNzA0MDFDMTc3LjEyOSA0LjE5MDgzIDE3Ni40OTEgNC43MzQzNyAxNzUuODkyIDUuMzMzMzdMNzQuOTkyNyA5Ny4zODZMMzEuMDQyOSA2NC4wMjQ1QzI2Ljk1MTcgNjAuOTE4OSAyMS4yMjkgNjEuMTczNCAxNy40MjkyIDY0LjYyOThMMy4zMzMxMSA3Ny40NTIzQy0xLjMxNDc4IDgxLjY4MDMgLTEuMzIwMTEgODguOTkyNSAzLjMyMTYgOTMuMjI3M0w0MS40MzY0IDEyOEwzLjMyMTYgMTYyLjc3M0MtMS4zMjAxMSAxNjcuMDA4IC0xLjMxNDc4IDE3NC4zMiAzLjMzMzExIDE3OC41NDhMMTcuNDI5MiAxOTEuMzdDMjEuMjI5IDE5NC44MjcgMjYuOTUxNyAxOTUuMDgxIDMxLjA0MjkgMTkxLjk3Nkw3NC45OTI3IDE1OC42MTRMMTc1Ljg5MiAyNTAuNjY3QzE3Ny40ODggMjUyLjI2NCAxNzkuMzYzIDI1My40NjcgMTgxLjM3OCAyNTQuMjUyWk0xOTEuODgzIDY5Ljg4NTFMMTE1LjMyMyAxMjhMMTkxLjg4MyAxODYuMTE1VjY5Ljg4NTFaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+DQo8L2c+DQo8L2c+DQo8ZGVmcz4NCjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZCIgeD0iLTIxLjQ4OTYiIHk9IjQwLjUyMjUiIHdpZHRoPSIyOTguODIyIiBoZWlnaHQ9IjIzNi4xNDkiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4NCjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+DQo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIvPg0KPGZlT2Zmc2V0Lz4NCjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwLjY2NjciLz4NCjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4NCjxmZUJsZW5kIG1vZGU9Im92ZXJsYXkiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvdyIvPg0KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4NCjwvZmlsdGVyPg0KPGZpbHRlciBpZD0iZmlsdGVyMV9kIiB4PSIxNTQuNjY3IiB5PSItMjAuNjczNSIgd2lkdGg9IjEyMi42NjciIGhlaWdodD0iMjk3LjM0NyIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPg0KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4NCjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIi8+DQo8ZmVPZmZzZXQvPg0KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTAuNjY2NyIvPg0KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPg0KPGZlQmxlbmQgbW9kZT0ib3ZlcmxheSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93Ii8+DQo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvdyIgcmVzdWx0PSJzaGFwZSIvPg0KPC9maWx0ZXI+DQo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIxMjcuODQ0IiB5MT0iMC42NTk5ODgiIHgyPSIxMjcuODQ0IiB5Mj0iMjU1LjM0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+DQo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPg0KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPC9kZWZzPg0KPC9zdmc+DQo=');
            -webkit-mask-size: 14px;
            left: 10px;
          }
        }
        .item_cwd {
          padding-left: 23px;

          &:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE0IDEyIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMywyIEw3LDIgTDcsMSBDNywwLjM0IDYuNjksMCA2LDAgTDEsMCBDMC40NSwwIDAsMC40NSAwLDEgTDAsMTEgQzAsMTEuNTUgMC40NSwxMiAxLDEyIEwxMywxMiBDMTMuNTUsMTIgMTQsMTEuNTUgMTQsMTEgTDE0LDMgQzE0LDIuNDUgMTMuNTUsMiAxMywyIEwxMywyIFogTTYsMiBMMSwyIEwxLDEgTDYsMSBMNiwyIEw2LDIgWiIvPjwvc3ZnPg==');
            -webkit-mask-size: 14px;
          }
        }
        .item_branch {
          padding-left: 20px;

          &:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgOSAxMiI+PHBhdGggZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOSwzLjQyODU3NzQ2IEM5LDIuNDc3MTQ4ODggOC4xOTksMS43MTQyOTE3NCA3LjIsMS43MTQyOTE3NCBDNi4zODY5NDE5NCwxLjcxMjI0NTc4IDUuNjc0MTI3NDksMi4yMzEzMDI2NCA1LjQ2MzA1NjAyLDIuOTc5MDk4NzEgQzUuMjUxOTg0NTQsMy43MjY4OTQ3OCA1LjU5NTQ1MzE3LDQuNTE2Mzc3NDEgNi4zLDQuOTAyODYzMTcgTDYuMyw1LjE2MDAwNjAzIEM2LjI4Miw1LjYwNTcyMDMxIDYuMDkzLDYuMDAwMDA2MDMgNS43MzMsNi4zNDI4NjMxNyBDNS4zNzMsNi42ODU3MjAzMSA0Ljk1OSw2Ljg2NTcyMDMxIDQuNDkxLDYuODgyODYzMTcgQzMuNzQ0LDYuOTAwMDA2MDMgMy4xNTksNy4wMjAwMDYwMyAyLjY5MSw3LjI2ODU3NzQ2IEwyLjY5MSwzLjE4ODU3NzQ2IEMzLjM5NTU0NjgzLDIuODAyMDkxNyAzLjczOTAxNTQ2LDIuMDEyNjA5MDcgMy41Mjc5NDM5OCwxLjI2NDgxMjk5IEMzLjMxNjg3MjUxLDAuNTE3MDE2OTIzIDIuNjA0MDU4MDYsLTAuMDAyMDM5OTM0MTUgMS43OTEsNi4wMjY4NzM4NWUtMDYgQzAuNzkyLDYuMDI2ODczODVlLTA2IDkuOTkyMDA3MjJlLTE3LDAuNzYyODYzMTcgOS45OTIwMDcyMmUtMTcsMS43MTQyOTE3NCBDMC4wMDM4NTgyMzAyNiwyLjMyMzA1MzU2IDAuMzQ2NDE5ODM1LDIuODg0MjAyMDkgMC45LDMuMTg4NTc3NDYgTDAuOSw4LjgxMTQzNDYgQzAuMzY5LDkuMTExNDM0NiAwLDkuNjYwMDA2MDMgMCwxMC4yODU3MjAzIEMwLDExLjIzNzE0ODkgMC44MDEsMTIuMDAwMDA2IDEuOCwxMi4wMDAwMDYgQzIuNzk5LDEyLjAwMDAwNiAzLjYsMTEuMjM3MTQ4OSAzLjYsMTAuMjg1NzIwMyBDMy42LDkuODMxNDM0NiAzLjQyLDkuNDI4NTc3NDYgMy4xMjMsOS4xMjAwMDYwMyBDMy4yMDQsOS4wNjg1Nzc0NiAzLjU1NSw4Ljc2ODU3NzQ2IDMuNjU0LDguNzE3MTQ4ODggQzMuODc5LDguNjIyODYzMTcgNC4xNTgsOC41NzE0MzQ2IDQuNSw4LjU3MTQzNDYgQzUuNDQ1LDguNTI4NTc3NDYgNi4yNTUsOC4xODU3MjAzMSA2Ljk3NSw3LjUwMDAwNjAzIEM3LjY5NSw2LjgxNDI5MTc0IDguMDU1LDUuODAyODYzMTcgOC4xLDQuOTExNDM0NiBMOC4wODIsNC45MTE0MzQ2IEM4LjYzMSw0LjYwMjg2MzE3IDksNC4wNTQyOTE3NCA5LDMuNDI4NTc3NDYgTDksMy40Mjg1Nzc0NiBaIE0xLjgsMC42ODU3MjAzMTMgQzIuMzk0LDAuNjg1NzIwMzEzIDIuODgsMS4xNTcxNDg4OCAyLjg4LDEuNzE0MjkxNzQgQzIuODgsMi4yNzE0MzQ2IDIuMzg1LDIuNzQyODYzMTcgMS44LDIuNzQyODYzMTcgQzEuMjE1LDIuNzQyODYzMTcgMC43MiwyLjI3MTQzNDYgMC43MiwxLjcxNDI5MTc0IEMwLjcyLDEuMTU3MTQ4ODggMS4yMTUsMC42ODU3MjAzMTMgMS44LDAuNjg1NzIwMzEzIEwxLjgsMC42ODU3MjAzMTMgWiBNMS44LDExLjMyMjg2MzIgQzEuMjA2LDExLjMyMjg2MzIgMC43MiwxMC44NTE0MzQ2IDAuNzIsMTAuMjk0MjkxNyBDMC43Miw5LjczNzE0ODg4IDEuMjE1LDkuMjY1NzIwMzEgMS44LDkuMjY1NzIwMzEgQzIuMzg1LDkuMjY1NzIwMzEgMi44OCw5LjczNzE0ODg4IDIuODgsMTAuMjk0MjkxNyBDMi44OCwxMC44NTE0MzQ2IDIuMzg1LDExLjMyMjg2MzIgMS44LDExLjMyMjg2MzIgTDEuOCwxMS4zMjI4NjMyIFogTTcuMiw0LjQ2NTcyMDMxIEM2LjYwNiw0LjQ2NTcyMDMxIDYuMTIsMy45OTQyOTE3NCA2LjEyLDMuNDM3MTQ4ODggQzYuMTIsMi44ODAwMDYwMyA2LjYxNSwyLjQwODU3NzQ2IDcuMiwyLjQwODU3NzQ2IEM3Ljc4NSwyLjQwODU3NzQ2IDguMjgsMi44ODAwMDYwMyA4LjI4LDMuNDM3MTQ4ODggQzguMjgsMy45OTQyOTE3NCA3Ljc4NSw0LjQ2NTcyMDMxIDcuMiw0LjQ2NTcyMDMxIEw3LjIsNC40NjU3MjAzMSBaIi8+PC9zdmc+');
            -webkit-mask-size: 10px
          }
        }
        .item_dirty {
          color: var(--hvl-dirty-color);
          padding-left: 22px;
          padding-right: 0px;

          &:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4xNDI4NTcxLDAgTDAuODU3MTQyODU3LDAgQzAuMzg1NzE0Mjg2LDAgMCwwLjM4NTcxNDI4NiAwLDAuODU3MTQyODU3IEwwLDExLjE0Mjg1NzEgQzAsMTEuNjE0Mjg1NyAwLjM4NTcxNDI4NiwxMiAwLjg1NzE0Mjg1NywxMiBMMTEuMTQyODU3MSwxMiBDMTEuNjE0Mjg1NywxMiAxMiwxMS42MTQyODU3IDEyLDExLjE0Mjg1NzEgTDEyLDAuODU3MTQyODU3IEMxMiwwLjM4NTcxNDI4NiAxMS42MTQyODU3LDAgMTEuMTQyODU3MSwwIEwxMS4xNDI4NTcxLDAgWiBNMTEuMTQyODU3MSwxMS4xNDI4NTcxIEwwLjg1NzE0Mjg1NywxMS4xNDI4NTcxIEwwLjg1NzE0Mjg1NywwLjg1NzE0Mjg1NyBMMTEuMTQyODU3MSwwLjg1NzE0Mjg1NyBMMTEuMTQyODU3MSwxMS4xNDI4NTcxIEwxMS4xNDI4NTcxLDExLjE0Mjg1NzEgWiBNMy40Mjg1NzE0Myw2IEMzLjQyODU3MTQzLDQuNTc3MTQyODYgNC41NzcxNDI4NiwzLjQyODU3MTQzIDYsMy40Mjg1NzE0MyBDNy40MjI4NTcxNCwzLjQyODU3MTQzIDguNTcxNDI4NTcsNC41NzcxNDI4NiA4LjU3MTQyODU3LDYgQzguNTcxNDI4NTcsNy40MjI4NTcxNCA3LjQyMjg1NzE0LDguNTcxNDI4NTcgNiw4LjU3MTQyODU3IEM0LjU3NzE0Mjg2LDguNTcxNDI4NTcgMy40Mjg1NzE0Myw3LjQyMjg1NzE0IDMuNDI4NTcxNDMsNiBMMy40Mjg1NzE0Myw2IFoiLz48L3N2Zz4=');
            -webkit-mask-size: 12px 12px;
            background-color: var(--hvl-dirty-color);
          }
        }
        .item_ahead {
          color: var(--hvl-ahead-color);
          padding-left: 22px;

          &:before {
            -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjE0Mjg1NzE0LDYuODU3MTQyODYgTDIuNTcxNDI4NTcsNi44NTcxNDI4NiBMMi41NzE0Mjg1Nyw1LjE0Mjg1NzE0IEw1LjE0Mjg1NzE0LDUuMTQyODU3MTQgTDUuMTQyODU3MTQsMi41NzE0Mjg1NyBMOS40Mjg1NzE0Myw2IEw1LjE0Mjg1NzE0LDkuNDI4NTcxNDMgTDUuMTQyODU3MTQsNi44NTcxNDI4NiBMNS4xNDI4NTcxNCw2Ljg1NzE0Mjg2IFogTTEyLDAuODU3MTQyODU3IEwxMiwxMS4xNDI4NTcxIEMxMiwxMS42MTQyODU3IDExLjYxNDI4NTcsMTIgMTEuMTQyODU3MSwxMiBMMC44NTcxNDI4NTcsMTIgQzAuMzg1NzE0Mjg2LDEyIDAsMTEuNjE0Mjg1NyAwLDExLjE0Mjg1NzEgTDAsMC44NTcxNDI4NTcgQzAsMC4zODU3MTQyODYgMC4zODU3MTQyODYsMCAwLjg1NzE0Mjg1NywwIEwxMS4xNDI4NTcxLDAgQzExLjYxNDI4NTcsMCAxMiwwLjM4NTcxNDI4NiAxMiwwLjg1NzE0Mjg1NyBMMTIsMC44NTcxNDI4NTcgWiBNMTEuMTQyODU3MSwwLjg1NzE0Mjg1NyBMMC44NTcxNDI4NTcsMC44NTcxNDI4NTcgTDAuODU3MTQyODU3LDExLjE0Mjg1NzEgTDExLjE0Mjg1NzEsMTEuMTQyODU3MSBMMTEuMTQyODU3MSwwLjg1NzE0Mjg1NyBMMTEuMTQyODU3MSwwLjg1NzE0Mjg1NyBaIiB0cmFuc2Zvcm09Im1hdHJpeCgwIC0xIC0xIDAgMTIgMTIpIi8+PC9zdmc+');
            -webkit-mask-size: 12px 12px;
            background-color: var(--hvl-ahead-color);
          }
        }
      `;
    }

  };
};
