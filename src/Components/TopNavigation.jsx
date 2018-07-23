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
                    <Nav className='mr-auto' navbar>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav caret>
                                Quick Add
                            </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name='property' value='background-color' title='' onClick={this.props.navButtonClick}>
                                        Background Color
                                    </DropdownItem>
                                    <DropdownItem name='property' value='font-weight' title='bold' onClick={this.props.navButtonClick}>
                                        Bold Font
                                    </DropdownItem>
                                    <DropdownItem name='property' value='font-size' title='' onClick={this.props.navButtonClick}>
                                        Font Size
                                    </DropdownItem>
                                    <DropdownItem name='attribute' value='href' title='' onClick={this.props.navButtonClick}>
                                        Hyperlink
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
                    
                    <NavbarToggler className='mr-auto' onClick={this.toggleNavbar} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className='ml-auto' navbar> {/*
                            <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" data-size='large' className="twitter-share-button" data-url="https://sharepoint-json-formatter.herokuapp.com" data-show-count="false">Tweet</a> 
                            &nbsp;
                            <div className="fb-share-button" data-size='large' data-href="https://sharepoint-json-formatter.herokuapp.com" data-layout="button" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsharepoint-json-formatter.herokuapp.com%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">Share</a></div>
                            &nbsp;
                            <script type="IN/Share" data-url="https://sharepoint-json-formatter.herokuapp.com" data-format='inline' data-width='400'></script>
                        */}
                        </Nav>
                    </Collapse>
                    
                </Navbar>

            </div>
        )
    }

}

export default TopNavigation;