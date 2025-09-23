import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const { encodedToken } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (encodedToken) {
      navigate("/login");
    }
  }, [encodedToken, navigate]);

  // If the token is present, render the children
  return encodedToken ? children : null; // Render nothing if not authenticated
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
