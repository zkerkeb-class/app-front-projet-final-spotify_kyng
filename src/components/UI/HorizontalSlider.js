import React from 'react'

const HorizontalSlider = ({children}) => {
  return (
    <div className="overflow-hidden">
    <div className="overflow-y-auto no-scrollbar p-8">
      <ul className="flex flex-nowrap gap-6">
      {children}
      </ul>
    </div>
  </div>
  )
}

export default HorizontalSlider