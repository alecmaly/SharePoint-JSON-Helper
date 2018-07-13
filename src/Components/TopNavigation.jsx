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
    UncontrolledDropdown
} from 'reactstrap';
import '../App.css';

class TopNavigation extends Component {
    render() {
        return (
            <div>
                <Navbar className='nav-bar' color='light' expand light>
                    <Nav navbar>

                        <NavbarBrand></NavbarBrand>

                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Quick Add
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name='quick add' value='font-weight' onClick={this.props.navButtonClick}>
                                        Bold
                                    </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Templates
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name='template' onClick={this.props.navButtonClick}>
                                        Completed/In Progress/Late
                                    </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Navbar>

            </div>
        )
    }

}

export default TopNavigation;