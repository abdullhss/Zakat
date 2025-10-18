/* eslint-disable react/prop-types */
import React from 'react'
import cardWave from "../public/SVGs/cardWave.svg";
import { Link } from 'react-router-dom';

const OfficeCard = ({ office }) => {
    const imageUrl = office.OfficePhotoName;

    return (
        <div
            className="relative flex flex-col justify-between p-6 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r from-[#FCFCFC] to-[#D5D5D5] transition-transform duration-300 hover:scale-[1.02]"
        >
            {/* Decorative Wave */}
            <img
                src={cardWave}
                alt="wave background"
                className="absolute left-0 top-0 h-full opacity-10 select-none pointer-events-none"
            />

            {/* Main Content */}
            <div className="flex items-start gap-6 relative z-10">
                {/* Office Image */}
                <img
                    src={`https://framework.md-license.com:8093/ZakatImages/${imageUrl}.jpg`}
                    alt={office.OfficeName}
                    className="h-32 w-32 rounded-xl object-cover shadow-md border border-gray-200"
                />

                {/* Office Info */}
                <div className="flex flex-col flex-1 gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {office.OfficeName}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div className="text-gray-500 font-medium">العنوان:</div>
                        <div className="text-gray-700 text-right">{office.Address}</div>

                        <div className="text-gray-500 font-medium">المدينة:</div>
                        <div className="text-gray-700 text-right">{office.CityName}</div>

                        <div className="text-gray-500 font-medium">هاتف:</div>
                        <div className="text-gray-700 text-right">{office.PhoneNum}</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300 my-4 opacity-50" />

            {/* Action Button */}
            <Link
                to={`/office?data=${encodeURIComponent(JSON.stringify(office))}`}
                className="font-semibold text-center text-white text-base py-3 rounded-xl w-full bg-gradient-to-b from-[#2B7C73] to-[#18383D] hover:brightness-110 transition-all relative z-10"
            >
                عرض التفاصيل
            </Link>
        </div>
    );
};

export default OfficeCard;
