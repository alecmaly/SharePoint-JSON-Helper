import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Button
} from 'reactstrap';
import '../App.css';

class BotttomNavigation extends Component {
    render() {
        return (
            <div>
                <Navbar className='nav-bar nav-bar-bottom justify-content-center' expand color='light' fixed='bottom' light>
                    <Nav navbar>
                        <NavItem>
                            <NavLink className='icon nav-button copy' name='copy to clipboard' onClick={ this.props.navButtonClick }>Copy to Clipboard</NavLink>                             
                        </NavItem>
                        <NavbarBrand></NavbarBrand>
                        <NavItem>
                            <NavLink className='icon nav-button reset' name='reset' onClick={ this.props.navButtonClick }>Reset</NavLink>                             
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        )
    }

}

export default BotttomNavigation;