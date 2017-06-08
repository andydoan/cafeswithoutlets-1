import classNames from 'classnames';

import ChevRightIcon from 'react-icons/lib/ti/chevron-right';
import ChevLeftIcon from 'react-icons/lib/ti/chevron-left';

const SidebarPanel = (props) => (
  <div style={{ width: "100%", height: "100%" }}>
    <div className="sidebar-contents">
    </div>
    <div className="sidebar-toggle" onClick={props.closeSidebarPanel}>
      <ChevLeftIcon color="#4D4D4D" />
    </div>
  </div>
)


const ExpandButton = (props) => (
  <div className="sidebar-toggle" onClick={props.onClick}>
    <ChevRightIcon color="#4D4D4D" />
  </div>
)

class SidebarLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };

    this.openSidebarPanel = this.openSidebarPanel.bind(this);
    this.closeSidebarPanel = this.closeSidebarPanel.bind(this);
  }

  openSidebarPanel() {
    this.setState({ expanded: true })
  }

  closeSidebarPanel() {
    this.setState({ closing: true })
    const t = setTimeout(() => {
      this.setState({ expanded: false, closing: false })
    }, 200) // should be same timeout as width transition for slideout
  }

  render() {

    const sidebarLayoutClasses = classNames({
      expanded: !this.state.closing && this.state.expanded
    })

    return (
      <div id="sidebarLayout" className={sidebarLayoutClasses}>
        { this.state.expanded ?
          <SidebarPanel closeSidebarPanel={this.closeSidebarPanel} />
        :
          <ExpandButton onClick={this.openSidebarPanel} />
        }
      </div>
    )
  }
};

export default SidebarLayout;
