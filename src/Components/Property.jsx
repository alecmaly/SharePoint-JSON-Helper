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
    Container
} from 'reactstrap';



class Property extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.togglePropertyDropdownOpen = this.togglePropertyDropdownOpen.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.state ={
            property: 'text-align',
            value: '',
            propertyDropdownOpen: false,
            valueDropdownOpen: false,
            
        }
    }

    

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'button' ? target.innerHTML : target.value;
        const name = target.name;
        let resetValue = '';

        if (name === 'property') {
            resetValue = '';
        } else {
            resetValue = value;
        }

        
        this.setState({
          [name]: value,
          value: resetValue,
        }, () => { this.props.updateProperty(this.props.index, this.state.property, this.state.value) }) ;

    }

    togglePropertyDropdownOpen() {
        this.setState({
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
            <Container fluid>
            <Row>
                <Col>
                    <Label className='label remove-text-highlighting'>Property</Label>
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
                    <Label className='label remove-text-highlighting'>Value</Label>
                    <InputGroup>   
                        <Input className='center-input' type='text' name='value' placeholder={  this.props.propertyChoices[this.state.property] !== undefined && this.props.propertyChoices[this.state.property].placeholder !== undefined ? this.props.propertyChoices[this.state.property].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                        <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                        style={{ 'visibility': (this.props.propertyChoices[this.state.property] === undefined || this.props.propertyChoices[this.state.property].options === undefined ?  'hidden' : 'visible') }}>
                            <DropdownToggle color='primary' caret></DropdownToggle>
                            <DropdownMenu>
                                
                                { (this.props.propertyChoices[this.state.property] !== undefined && this.props.propertyChoices[this.state.property].options !== undefined
                                    ? this.props.propertyChoices[this.state.property].options.split(',').map((key, i) => {
                                        return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                }) : <DropdownItem>test</DropdownItem> )}
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                    </InputGroup>
                </Col>
                         
                <div> 
                    <br />
                    <span className='icon remove-property' onClick={() => this.props.deleteProperty(this.props.index)}>X</span>
                </div>
            </Row>
   
            </Container>
        )
    }
}

export default Property;