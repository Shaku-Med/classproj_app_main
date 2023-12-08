import React from 'react'
import Ch from './Ch'
import Cb from './Cb'
import Cf from './Cf'

function Container() {
  return (
    <div className="containerbox flex items-start justify-between flex-col h-full overflow-hidden">
        <Ch/>
        <Cb/>
        <Cf/>
    </div>
  )
}

export default Container