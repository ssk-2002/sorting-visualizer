import React from 'react';
import 'tachyons';

const Header = (props) => {
  return (
    <div className='tc grow pa2 ba bg-dark-gray dib bw2 shadow-5' style={{fontFamily: "jasmine", fontStyle: "bold", fontSize: "7em"}}>
      <h3 style={{color:"silver"}}> Sorting Visualizer </h3>
    </div>
  );
}

export default Header;
