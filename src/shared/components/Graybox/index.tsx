import React from 'react'

const GrayBox = ({ title, subtitle, className }) => {
  return (
    <div
      className={`bg-[#F5F9FA] border rounded-xl flex flex-col items-center justify-center ${className}`}
    >
      <p className="text-2xl mb-2 text-[#191D21]">{title}</p>
      <p className="text-base text-[#495057]">{subtitle}</p>
    </div>
  )
}

export default GrayBox
