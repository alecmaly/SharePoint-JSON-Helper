import React, { Component } from 'react';
import {
    Row,
    Col,
    Label,
    Input,
    InputGroup,
    InputGroupButtonDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Container,
    Button
} from 'reactstrap';
import Condition from './Condition.jsx';



class customRowAction extends Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleAttributeDropdownOpen = this.toggleAttributeDropdownOpen.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.toggleConditionals = this.toggleConditionals.bind(this);
        this.state = {
            property: this.props.customRowActions[this.props.index].customRowActions,
            value: this.props.customRowActions[this.props.index].value,
            conditionalFlag: (typeof this.props.customRowActions[this.props.index].value === 'object' && this.props.customRowActions[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
            propertyDropdownOpen: false,
            valueDropdownOpen: false,
            prevIndex: this.props.index
        };
    }

    componentDidUpdate() {
        if (this.state.prevIndex !== this.props.index) {
            this.setState({
                property: this.props.customRowActions[this.props.index].customRowActions,
                value: this.props.customRowActions[this.props.index].value,
                conditionalFlag: (typeof this.props.customRowActions[this.props.index].value === 'object' && this.props.customRowActions[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
                propertyDropdownOpen: false,
                valueDropdownOpen: false,
                prevIndex: this.props.index
            }, () => { this.props.buildJSON() });
        }

     
    }


    setValue(obj) {
        this.setState({
            value: obj
        })
    }


    toggleConditionals() {
        this.setState({
            conditionalFlag: !this.state.conditionalFlag,
            value: []
        }, () => { this.props.updateCRA(this.props.index, this.state.property, this.state.value) });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        
        let resetValue = '';
        if (name === 'property') {
            let value = target.type === 'button' ? target.innerHTML : target.value;
            resetValue = [];
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateCRA(this.props.index, value, '') }) 
              
        } else {
            let value = target.type === 'button' ? ( this.state.property === 'background-color' ? this.props.colors[target.innerHTML] : target.innerHTML) : target.value;
            resetValue = value;
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateCRA(this.props.index, this.state.property, this.state.value) })       
        }

    }

    setConditionalValue(eleValue) {
        this.setState({
            value: eleValue
        });
    }

    toggleAttributeDropdownOpen() {
        this.setState({
            value: '',
            propertyDropdownOpen: !this.state.propertyDropdownOpen
        });
    }

    toggleValueDropdownOpen() {
        this.setState({
            valueDropdownOpen: !this.state.valueDropdownOpen
        });
    }

    render() { 
        return (
            <Container className='property' fluid>      
            
            <Row>
                <Col sm='12' md='1'>
                    <div className='text-center center-input'> 
                        <span className='icon delete-property' onClick={() => this.props.deleteKey('customRowActions', this.props.index)}>X</span>
                    </div>  
                </Col>
                <Col sm='12' md='5'>
                    <Label className='label remove-text-highlighting'>Custom Row Action</Label>
                    <InputGroup>   
                        <Input className='center-input' type='text' name='property' value={this.state.property} onChange={this.handleInputChange} />
                        <InputGroupButtonDropdown addonType='append' isOpen={this.state.propertyDropdownOpen} toggle={this.toggleAttributeDropdownOpen}>
                            <DropdownToggle color='primary' caret></DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(this.props.customRowActionChoices).map((key, i) => {
                                    return (<DropdownItem name='property' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                })}
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                    </InputGroup>
                </Col>

                <Col sm='12' md='5'>
                    {!this.state.conditionalFlag ? 
                        <div>
                            <Label className='label remove-text-highlighting'>Value<span style={{'visibility': (this.state.property === 'background-color' || this.state.property ==='color') ? 'visible' : 'hidden' }}> (<a target='_blank' href='https://www.w3schools.com/colors/colors_picker.asp'>help</a>)</span></Label>
                            <InputGroup>   
                                <Input className='center-input wrap-value' type='textarea' name='value' placeholder={  this.props.customRowActionChoices[this.state.property] !== undefined && this.props.customRowActionChoices[this.state.property].placeholder !== undefined ? this.props.customRowActionChoices[this.state.property].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                                <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                                style={{ 'visibility': ((this.props.customRowActionChoices[this.state.property] === undefined || this.props.customRowActionChoices[this.state.property].options === undefined) && this.state.property !== 'background-color' ?  'hidden' : 'visible') }}>
                                    <DropdownToggle color='primary' caret></DropdownToggle>
                                    <DropdownMenu>
                                        { (this.props.customRowActionChoices[this.state.property] !== undefined && this.props.customRowActionChoices[this.state.property].options !== undefined
                                            ? this.props.customRowActionChoices[this.state.property].options.split(',').map((key, i) => {
                                                return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                        }) : (this.state.property === 'background-color' ? Object.keys(this.props.colors).map((key, i) => {
                                            return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                        })
                                        : '') )}
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>
                            </InputGroup>  
                        </div>
                    : ''}
                </Col>            
            </Row>
            <Row>
                <div className='center-input padded-row'>
                    <Button className='remove-text-highlighting' onClick={this.toggleConditionals}>{!this.state.conditionalFlag ? 'Add Condition' : 'Remove Conditions'}</Button>
                </div>
            </Row>
        
            {this.state.conditionalFlag ? <Condition index={this.props.index} rules={this.state.value} property={this.state.property} propertyChoices={this.props.customRowActionChoices} updateProperty={this.props.updateCRA} setValue={this.setValue} buildJSON={this.props.buildJSON} colors={this.props.colors} displayModal={this.props.displayModal} /> : ''}
   
            </Container>
        )
    }
}

export default customRowAction;