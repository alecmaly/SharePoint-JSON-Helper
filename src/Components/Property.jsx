import React, { Component } from 'react';
import {
    Row,
    Col,
    Label,
    Input,
    InputGroup,
    InputGroupButtonDropdown,
    InputGroupAddon,
    InputGroupText,
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
        this.togglekeyDropdownOpen = this.togglekeyDropdownOpen.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.toggleConditionals = this.toggleConditionals.bind(this);
        this.moveRule = this.moveRule.bind(this);
        this.state = {
            key: this.props.properties[this.props.index].name,
            value: this.props.properties[this.props.index].value,
            conditionalFlag: (typeof this.props.properties[this.props.index].value === 'object' && this.props.properties[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
            keyDropdownOpen: false,
            valueDropdownOpen: false,
            prevIndex: this.props.index,
            reset: false
        };
    }

    componentDidUpdate() {
        if (this.state.prevIndex !== this.props.index) {
            this.setState({
                key: this.props.properties[this.props.index].name,
                value: this.props.properties[this.props.index].value,
                conditionalFlag: (typeof this.props.properties[this.props.index].value === 'object' && this.props.properties[this.props.index].value.length ? true : false), // True if rules have been defined, otherwise false
                keyDropdownOpen: false,
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
    
    // called inside Condition component
    moveRule(ele, index) {
        let arr = this.state.value.slice();
        let temp = arr[index];
    
        console.log(arr);
        switch(ele.target.attributes.value.value) {
            case 'up':
                arr.splice(index, 1);    
                arr.splice((index === 0 ? 0 : index-1), 0, temp);
                break;
            case 'down':
                arr.splice(index, 1);    
                arr.splice(index+1, 0, temp);
                break;
        }


        this.setState({
            value: arr
        }, () => { this.props.updateProperty(this.props.index, this.state.key, this.state.value); });
    }



    toggleConditionals() {
        this.setState({
            conditionalFlag: !this.state.conditionalFlag,
            value: []
        }, () => { this.props.updateProperty( this.props.index, this.state.key, this.state.value) });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        
        let resetValue = '';

        if (name === 'key') {
            let value = target.type === 'button' ? target.innerHTML : target.value;
            resetValue = [];
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateProperty( this.props.index, value, '') }) 
              
        } else {
            let value = target.type === 'button' ? ( this.state.key === 'background-color' ? this.props.colors[target.innerHTML] : target.innerHTML) : target.value;
            resetValue = value;
            this.setState({
                [name]: value,
                value: resetValue
              }, () => { this.props.updateProperty( this.props.index, this.state.key, this.state.value) })       
        }


        console.log(this.props.properties[this.props.index].value);
        
    }

    setConditionalValue(eleValue) {
        this.setState({
            value: eleValue
        });
    }

    togglekeyDropdownOpen() {
        this.setState({
            value: '',
            keyDropdownOpen: !this.state.keyDropdownOpen
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
                        <span className='icon delete-property' onClick={() => this.props.deleteKey('properties', this.props.index)}>X</span>
                    </div>  
                </Col>
                <Col sm='12' md='5'>
                    <Label className='label remove-text-highlighting'>Property <a href={'https://www.google.com/search?btnI=1&q=' + this.state.key + ' site:https://www.w3schools.com/cssref/'} target='_blank'>(help)</a></Label>
                    <InputGroup>   
                        <Input className='center-input' type='text' name='key' value={this.state.key} onChange={this.handleInputChange} />
                        <InputGroupButtonDropdown addonType='append' isOpen={this.state.keyDropdownOpen} toggle={this.togglekeyDropdownOpen}>
                            <DropdownToggle color='primary' caret></DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(this.props.nameChoices).map((key, i) => {
                                    return (<DropdownItem name='key' style={{'backgroundColor': (this.state.key !== '' && key.includes(this.state.key) ? '#FFFBCC' : 'transparent')}} onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                })}
                            </DropdownMenu>
                        </InputGroupButtonDropdown>
                    </InputGroup>
                </Col>

                <Col sm='12' md='5'>
                    {!this.state.conditionalFlag ? 
                        <div>
                            <Label className='label remove-text-highlighting'>Value<span style={{'visibility': (this.state.key === 'background-color' || this.state.key ==='color') ? 'visible' : 'hidden' }}> (<a target='_blank' href='https://www.w3schools.com/colors/colors_picker.asp'>help</a>)</span></Label>
                            <InputGroup>   
                                <Input className='center-input' type='text' name='value' style={ { [this.state.key] : this.state.value} } placeholder={  this.props.nameChoices[this.state.key] !== undefined && this.props.nameChoices[this.state.key].placeholder !== undefined ? this.props.nameChoices[this.state.key].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                                <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                                style={{ 'visibility': ((this.props.nameChoices[this.state.key] === undefined || this.props.nameChoices[this.state.key].options === undefined) && this.state.key !== 'background-color' ?  'hidden' : 'visible') }}>
                                    <DropdownToggle color='primary' caret></DropdownToggle>
                                    <DropdownMenu>
                                        { (this.props.nameChoices[this.state.key] !== undefined && this.props.nameChoices[this.state.key].options !== undefined
                                            ? this.props.nameChoices[this.state.key].options.split(',').map((key, i) => {
                                                return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                        }) : (this.state.key === 'background-color' ? Object.keys(this.props.colors).map((key, i) => {
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
        
            {this.state.conditionalFlag ? <Condition index={this.props.index} rules={this.state.value} moveRule={this.moveRule} name={this.state.key} nameChoices={this.props.nameChoices} updateKey={this.props.updateProperty} setValue={this.setValue} buildJSON={this.props.buildJSON} colors={this.props.colors} displayModal={this.props.displayModal} reset={this.state.reset} /> : ''}
   
            </Container>
        )
    }
}

export default Property;