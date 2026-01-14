import { useState } from "react";
import { ImageContext } from "./imageContext";
import PropTypes from "prop-types";

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState(null);

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
};

ImageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};