import React from 'react'
import PayZakat from '../components/Zakat page/PayZakat'

const Zakat = () => {
  return (
        <section>
            <div className="relative overflow-hidden">
                <div
                className="min-h-screen z-10 mx-auto px-4 flex flex-col gap-4"
                style={{
                    backgroundImage: "url('/background pattern.png')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto",
                }}
                >
                    <PayZakat/>
                </div>

                <div className="rightBow"></div>
                <div className="leftBow"></div>
            </div>
        </section>
  )
}

export default Zakat