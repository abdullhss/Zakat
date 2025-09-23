import React from 'react'
import Diamond from '../../../components/Diamond'
import CharityCard from '../../../components/CharityCard'
const Charity = () => {
  return (
        <div className="flex flex-col gap-6 mt-8">
            {/* donation header */}
            <div className=" flex items-center justify-between pl-12 ">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl   text-white text-2xl px-8 py-2">
                    <Diamond
                        className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4"
                    />
                احسانكم لعام 2025
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:pr-8 overflow-hidden bg-[#18383D] px-6 py-12">
                <CharityCard
                    title={"عدد المستفدين"}
                    description={"213.7 ألف مستفيد"}
                    className="py-8 w-96 h-40"
                />
                <CharityCard
                    title={"عدد المستفدين"}
                    description={"213.7 ألف مستفيد"}
                    className="py-8 w-96 h-40"
                />
                <CharityCard
                    title={"عدد المستفدين"}
                    description={"213.7 ألف مستفيد"}
                    className="py-8 w-96 h-40"
                />
            </div>
        </div>
    )
}

export default Charity