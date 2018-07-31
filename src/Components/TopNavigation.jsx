import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    Collapse,
    NavbarToggler,
    NavItem,
    NavLink,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from 'reactstrap';
import '../App.css';

class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar className='nav-bar nav-bar-top' expand color='light' light>
                    {/* Left Nav Buttons */}
                    <Nav className='mr-auto' navbar>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav caret>
                                Quick Add
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name='attribute' value='href' title='' onClick={this.props.navButtonClick}>
                                        Hyperlink
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem name='property' value='background-color' title='' onClick={this.props.navButtonClick}>
                                        Background Color
                                    </DropdownItem>
                                    <DropdownItem name='property' value='font-weight' title='bold' onClick={this.props.navButtonClick}>
                                        Bold Font
                                    </DropdownItem>
                                    <DropdownItem name='property' value='font-size' title='' onClick={this.props.navButtonClick}>
                                        Font Size
                                    </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav caret>
                                Templates
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name='template' value='Completed/In Progress/Late' onClick={this.props.navButtonClick}>
                                        Completed/In Progress/Late
                                    </DropdownItem>
                                    <DropdownItem name='template' value='Data Bars' onClick={this.props.navButtonClick}>
                                        Data Bars
                                    </DropdownItem>
                                </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>

                    {/* Right Nav Buttons */}
                    <Nav className='ml-auto' navbar>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav caret>
                                Help
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem target='_blank' href='https://jsonlint.com'>
                                       JSON Lint    
                                    </DropdownItem>
                                    <DropdownItem target='_blank' href='https://www.youtube.com'>
                                        YouTube Tutorial
                                    </DropdownItem>
                                    <DropdownItem target='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/icons'>
                                        Fabric Icons
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