import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink

} from 'reactstrap';

import classnames from 'classnames';

class MyModal extends Component {  
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: this.props.modalTab
        }
    }

    componentWillReceiveProps() {
        this.setState({
            activeTab: this.props.modalTab
        });
    }

    handleKeyDown(key) {
        if (key.keyCode === 13 || key.keyCode === 27) {
            this.props.toggleModal();
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }


    render() {
        return (
            <div onKeyDown={this.handleKeyDown} tabIndex='0'>
                <Modal isOpen={this.props.isOpen}>
                    <ModalHeader>
                        {this.props.modalHeader}                  
                    </ModalHeader>
                    <ModalBody>
                        <Nav tabs>  
                            <NavItem className='icon'>
                                <NavLink className={classnames({ active: this.state.activeTab === '1'})} onClick={() => this.toggle('1') }>
                                    Help
                                </NavLink>
                            </NavItem>
                            <NavItem className='icon'>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => this.toggle('2') }>
                                    Variables
                                </NavLink>
                            </NavItem>
                            <NavItem className='icon'>
                                <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => this.toggle('3') }>
                                    Functions
                                </NavLink>
                            </NavItem>
                            <NavItem className='icon'>
                                <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => this.toggle('4') }>
                                    Math
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId='1'>
                                <div dangerouslySetInnerHTML={ { __html: this.props.modalBody } } />
                            </TabPane>
                            <TabPane tabId='2'>
                                <div>
                                    <br />
                                    <b>@currentField</b> - refers to text in current field. <br />
                                    <b>@currentField.title</b> - Person fields are represented in the system as objects, and a person’s display name is contained within that object’s title property <br />
                                    <b>@currentField.lookupValue</b> -  Lookup fields are also represented as objects; the display text is stored in the lookupValue property <br />
                                    <b>@now</b> - current date/time <br />
                                    <b>@me</b> - current user's email <br />
                                    <b>[$FieldName]</b> - refers to value in field on same row <br />
                                    <b>[$PeoplePicker.email]</b> - refers to email of the person in a people picker field<br />
                                    <br />
                                    People picker field properties: <b>id</b>, <b>title</b>, <b>email</b>, <b>sip</b>, <b>picture</b>

                                    <br />
                                </div>
                            </TabPane>
                            <TabPane tabId='3'>
                                <div>
                                    <br />
                                    <b>toString()</b> - Convert value to string<br />
                                    <b>Number()</b> - Convert value to number<br />
                                    <b>Date()</b> - Convert value to date<br />
                                    <b>cos()</b> - Trig cos function<br />
                                    <b>sin()</b> - Trig sin function<br />
                                    <b>toLocaleString()</b> - Displays a date type fully expanded with date and time<br />
                                    <b>toLocaleDateString()</b> - Displays a date type with just the date<br />
                                    <b>toLocaleTimeString()</b> - Displays a date type with just the time
                                    <br />
                                    
                                </div>
                            </TabPane>
                            <TabPane tabId='4'>
                                <div>
                                    <br />
                                    <b>**</b> - multiply<br />
                                    <b>//</b> - divide<br />
                                    <b>++</b> - add / concatenate strings<br />
                                    <b>--</b> - subtract<br />
                                    <br />
                                    <b>()</b> - parentheses are also supported to specify order of operations<br />

                                </div>
                            </TabPane>
                        </TabContent>


                        
                    </ModalBody>
                        
                    
                    <ModalFooter>
                        <Button className='modal-ok-button center-input' type='button' color='info' onClick={this.props.toggleModal}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default MyModal;


