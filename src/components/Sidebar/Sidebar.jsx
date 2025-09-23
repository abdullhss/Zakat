import { PropTypes } from "prop-types";
function Sidebar() {
  return <div></div>;
}

Sidebar.propTypes = {
  rtl: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  toggled: PropTypes.bool.isRequired,
  handleToggleSidebar: PropTypes.func.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
