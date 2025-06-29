import React from 'react'
import ModelViewer from '../advance/ModelViewer'
import Iridescence from '../advance/Iridescence'

const BookStyle = {
  margin: '0px auto 20px auto',
  // backdropFilter: 'blur(2px)',
  // backdropShadow: '20px',
  // background: 'rgba(255, 255, 255, 0.01)',
  // WebkitBackdropFilter: 'blur(12px)',
  // boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.20)',
  // borderTopLeftRadius: '60px',
  // borderTopRightRadius: '60px',
  // borderBottomLeftRadius: '60px',
  // borderBottomRightRadius: '60px',

  // border: '1px dashed black',
  overflow: "hidden",
}

const Book = () => {
  return (
    <div style={{ ...BookStyle, width: "90%", height: "fit-content", position: "relative" }}>
      {/* <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
        style={{
          width: "100%",
          height: "100%",
          display: "absolute",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1000,
          margin: "auto",
          background: "red",
          opacity: 0,
        }}
      /> */}
      <ModelViewer
        url="/assets/book2.glb"
        modelXOffset={0}
        modelYOffset={0}
      />
    </div>
  )
}

export default Book