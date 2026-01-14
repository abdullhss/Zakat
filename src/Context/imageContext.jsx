import { createContext, useContext } from "react";

export const ImageContext = createContext(null);

export const useImageContext = () => {
  return useContext(ImageContext);
};
