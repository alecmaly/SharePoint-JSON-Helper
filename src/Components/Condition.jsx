import React, { Component } from 'react';
import {
    Container,
    Col,
    Row,
    Button,
    Input,
    Label,
    InputGroup,
    DropdownMenu,
    InputGroupButtonDropdown,
    DropdownToggle,
    DropdownItem
} from 'reactstrap';
import CurrentRules from './CurrentRules.jsx';


class Condition extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.newRule = this.newRule.bind(this);
        this.editRule = this.editRule.bind(this);
        this.selectRule = this.selectRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.clearRules = this.clearRules.bind(this);
        this.toggleValueDropdownOpen = this.toggleValueDropdownOpen.bind(this);
        this.state = {
            operator: '==',
            operand: '',
            value: '',
            selectedRule: '',
            rules: this.props.rules,
            valueDropdownOpen: false
        };
    }

    componentDidUpdate() {
        if (this.props.resetRules)
            this.setState({
                rules: this.props.rules
            })
    }


    newRule() {
        var arr = this.state.rules.slice();
        arr.length > 0 ? '' : arr = [];
        arr.push({operator: this.state.operator, operand: this.state.operand, value: this.state.value});
        this.setState({
          rules: arr,
          value: '',
          operand: ''
        }, () => { this.props.updateProperty(this.props.index, this.props.property, this.state.rules) });    
        this.props.setValue(arr);
    }
    
      selectRule(index) {
        switch (index) {
          case this.state.selectedRule:
            this.setState({
              selectedRule: '',
              operand: ''
            });
            break;
    
          default:
            var rule = this.state.rules[index];
            this.setState({
                selectedRule: index,
                operator: rule.operator,
                operand: rule.operand,
                value: rule.value
            });
            
        } 
        
      }
    
    editRule() {
        var arr = this.state.rules.slice();
        arr[this.state.selectedRule].operator = this.state.operator;
        arr[this.state.selectedRule].operand = this.state.operand;
        arr[this.state.selectedRule].value = this.state.value;
        this.props.setValue(arr);
        this.setState({
          rules: arr
        }, () => { this.props.updateProperty(this.props.index, this.props.property, this.state.rules) });    

    }

      deleteRule() {
        if (this.state.selectedRule !==  '') {
          var arr = this.state.rules;
          var deleted_Value = arr[this.state.selectedRule].value;
          arr.splice(this.state.selectedRule, 1);
          this.props.setValue(arr);
          this.setState({
            rules: arr,
            operand: '',
            value: deleted_Value,
            selectedRule: ''
          }, () => { this.props.updateProperty(this.props.index, this.props.property, this.state.rules) });
        }
      }

    clearRules() {
        this.props.setValue([]);
        this.setState({
            rules: [],
            operand: '',
            selectedRule: ''
        }, () => { this.props.updateProperty(this.props.index, this.props.property, this.state.rules) });
    }

    handleInputChange(event) {
        const target = event.target;
        let value = target.type === 'button' ? ( this.props.property === 'background-color' ? this.props.colors[target.innerHTML] : target.innerHTML) : target.value;
        const name = target.name;
        this.setState({
          [name]: value,
        });

        
    }

    toggleValueDropdownOpen() {
        this.setState({
            valueDropdownOpen: !this.state.valueDropdownOpen
        });
    }

    render() {
        return (
            <Col>
                <Row>
                    <Col sm='2'>
                        <Label className='label remove-text-highlighting'>Operator</Label>
                        <Input className='operator center-input' type='select' name='operator' value={this.state.operator} onChange={this.handleInputChange}>
                            <option>==</option>
                            <option>!=</option> 
                            <option>&lt;</option>
                            <option>&gt;</option>
                            <option>&lt;=</option>
                            <option>&gt;=</option>
                        </Input>  
                    </Col>
                    <Col sm='4'>
                        <Label className='label remove-text-highlighting'>Operand</Label>
                        <Input className='operand center-input' type='text' name='operand' placeholder='Compare to' value={this.state.operand} onChange={this.handleInputChange} />
                    </Col>
                    <Col>
                        <Label className='label remove-text-highlighting'>Value</Label>
                        <InputGroup>   
                            <Input className='center-input' type='text' name='value' style={ { [this.props.property] : this.state.value} } 
                                placeholder={  this.props.propertyChoices[this.props.property] !== undefined && this.props.propertyChoices[this.props.property].placeholder !== undefined ? this.props.propertyChoices[this.props.property].placeholder : '' } value={this.state.value} onChange={this.handleInputChange} />
                            <InputGroupButtonDropdown addonType='append' isOpen={this.state.valueDropdownOpen} toggle={this.toggleValueDropdownOpen}
                            style={{ 'visibility': ((this.props.propertyChoices[this.props.property] === undefined || this.props.propertyChoices[this.props.property].options === undefined) && this.props.property !== 'background-color' ?  'hidden' : 'visible') }}>
                                <DropdownToggle color='primary' caret></DropdownToggle>
                                <DropdownMenu>
                                    
                                    { (this.props.propertyChoices[this.props.property] !== undefined && this.props.propertyChoices[this.props.property].options !== undefined
                                        ? this.props.propertyChoices[this.props.property].options.split(',').map((key, i) => {
                                            return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                    }) : (this.props.property === 'background-color' ? Object.keys(this.props.colors).map((key, i) => {
                                        return (<DropdownItem name='value' onClick={ this.handleInputChange } key={i}>{key}</DropdownItem>);
                                    })
                                    : '') )}
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                        </InputGroup>    
                    </Col>
                </Row>
                <br />

                <Row className='padded-row'>
                    <Col>
                        <Button className='center-input'color={this.state.selectedRule === '' ? 'success' : 'info'} onClick={this.state.selectedRule === '' ? this.newRule : this.editRule}>{this.state.selectedRule === '' ? 'New Condition' : 'Edit Condition'}</Button>
                    </Col>
                    <Col>
                        <Button className='center-input' color='danger' onClick={this.clearRules}>Clear All Conditions</Button>
                    </Col>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Label className='label remove-text-highlighting'>Condtions ({this.props.property})<br />{this.state.selectedRule === '' ? '*Click to Select*' : '*Click to Deselect*'}</Label>
                                <CurrentRules className='center-input' property={this.props.property} rules={this.props.rules} selectRule={this.selectRule} selectedRule={this.state.selectedRule} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='padded-row'>
                                <Button className='center-input' color='danger' style={this.state.selectedRule === '' ? {'visibility': 'hidden'} : {}} onClick={this.deleteRule}>Delete Condition</Button>
                            </Col>
                        </Row>
                    </Container>
                </Row> 
            </Col>
        );
    }
}

export default Condition;