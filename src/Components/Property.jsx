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



class Property extends Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.togglePropertyDropdownOpen = this.togglePropertyDropdownOpen.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.toggleConditionals = this.toggleConditionals.bind(this);
        this.state = {
            property: this.props.properties[this.props.index].property,
            value: this.props.properties[this.props.index].value,
            conditionalFlag: (typeof this.props.properties[this.props.index].value === 'object' && this.props.properties[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
            propertyDropdownOpen: false,
            valueDropdownOpen: false,
            prevIndex: this.props.index
        };
    }

    componentDidUpdate() {
        if (this.state.prevIndex !== this.props.index) {
            this.setState({
                property: this.props.properties[this.props.index].property,
                value: this.props.properties[this.props.index].value,
                conditionalFlag: (typeof this.props.properties[this.props.index].value === 'object' && this.props.properties[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
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
        }, () => { this.props.updateProperty(this.props.index, this.state.property, this.state.value) });
    }

    handleInputChange(event) {
        const target = event.target;
        let value = target.type === 'button' ? ( this.state.property === 'background-color' ? this.props.colors[target.innerHTML] : target.innerHTML) : target.value;
        const name = target.name;
        let resetValue = '';

        if (name === 'property') {
            resetValue = [];
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateProperty(this.props.index, value, '') }) 
              
        } else {
            resetValue = value;
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateProperty(this.props.index, this.state.property, this.state.value) })       
        }


        console.log(this.props.properties[this.props.index].value);
        
    }

    setConditionalValue(eleValue) {
        this.setState({
            value: eleValue
        });
    }

    togglePropertyDropdownOpen() {
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
                <Col>
                    <Label className='label remove-text-highlighting'>Property <a href={'https://www.google.com/search?btnI=1&q=' + this.state.property + ' site:https://www.w3schools.com/cssref/'} target='_blank'>(help)</a></Label>
                    <InputGroup>   
                        <Input className='center-input' type='text' name='property' value={this.state.property} onChange={this.handleInputChange} />
                        <InputGroupButtonDropdown addonType='append' isOpen={this.state.propertyDropdownOpen} toggle={this.togglePropertyDropdownOpen}>
                            <DropdownToggle color='primary' caret></DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(this.props.propertyChoices).map((key, i) => {
                                    return (<DropdownItem name='property' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                })}
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                    </InputGroup>
                </Col>
                <Col>
                    {!this.state.conditionalFlag ? 
                        <div>
                            <Label className='label remove-text-highlighting'>Value<span style={{'visibility': (this.state.property === 'background-color' || this.state.property ==='color') ? 'visible' : 'hidden' }}> (<a target='_blank' href='https://www.w3schools.com/colors/colors_picker.asp'>help</a>)</span></Label>
                            <InputGroup>   
                                <Input className='center-input' type='text' name='value' style={ { [this.state.property] : this.state.value} } placeholder={  this.props.propertyChoices[this.state.property] !== undefined && this.props.propertyChoices[this.state.property].placeholder !== undefined ? this.props.propertyChoices[this.state.property].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                                <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                                style={{ 'visibility': ((this.props.propertyChoices[this.state.property] === undefined || this.props.propertyChoices[this.state.property].options === undefined) && this.state.property !== 'background-color' ?  'hidden' : 'visible') }}>
                                    <DropdownToggle color='primary' caret></DropdownToggle>
                                    <DropdownMenu>
                                        { (this.props.propertyChoices[this.state.property] !== undefined && this.props.propertyChoices[this.state.property].options !== undefined
                                            ? this.props.propertyChoices[this.state.property].options.split(',').map((key, i) => {
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
                <div className='text-center center-input'> 
                    <span className='icon delete-property' onClick={() => this.props.deleteProperty(this.props.index)}>X</span>
                </div>
            </Row>
            <Row>
                <div className='center-input padded-row'>
                    <Button className='remove-text-highlighting' onClick={this.toggleConditionals}>{!this.state.conditionalFlag ? 'Add Condition' : 'Remove Conditions'}</Button>
                </div>
            </Row>
        
            {this.state.conditionalFlag ? <Condition index={this.props.index} rules={this.state.value} property={this.state.property} propertyChoices={this.props.propertyChoices} updateProperty={this.props.updateProperty} setValue={this.setValue} buildJSON={this.props.buildJSON} colors={this.props.colors} /> : ''}
   
            </Container>
        )
    }
}

export default Property;