import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setShowPopup, setPopupComponent} from "../features/PaySlice/PaySlice";

export default function Popup({ title, bodyComponent }) {
  const {showPayPopup,  popupComponent} = useSelector((state) => state.pay);
  const dispatch = useDispatch();

  return (
    <div
      className="bg-white rounded-lg flex flex-col w-full p-4 mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">{title}</h1>
        <button
          onClick={()=>{dispatch(setShowPopup(false))}}
          className="w-8 h-8 flex items-center justify-center text-white"
        >
          <span className="text-xl bg-gradient-to-l p-1 from-[#17343B] via-[#18383D] to-[#24645E] rounded-md">
            <X size={20} />
          </span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 overflow-y-auto">{bodyComponent}</div>
    </div>
  );
}

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  bodyComponent: PropTypes.node.isRequired,
};
