import React from 'react';
import 'tachyons';
import {
  Navbar,
  NavbarBrand
} from 'reactstrap';

const Header = (props) => {
  return (
    <div>
      <Navbar className='pa3 ba b--green bg-lightest-blue'>
        <NavbarBrand href="./"><font color="purple"><h3 >Sorting Visualizer</h3></font></NavbarBrand>
      </Navbar>
    </div>
  );
}

export default Header;
