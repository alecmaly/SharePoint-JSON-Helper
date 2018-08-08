import React, { Component } from 'react';

import '../App.css';
import TopNavigation from './TopNavigation.jsx';
import BottomNavigation from './BottomNavigation.jsx';
import CurrentRules from './CurrentRules.jsx';
import Property from './Property.jsx';
import Attribute from './Attribute.jsx';
import CustomRowAction from './CustomRowAction.jsx';
import Condition from './Condition.jsx';
import MyModal from './MyModal.jsx';


// polyfill for .repeat function in IE11
import '../pollyfills.js';

// data
import data from '../data.js';

import { 
  Container,
  Jumbotron,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Row,
  Col,
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';

class Children extends Component {
  
  constructor(props) {
    super(props);
    this.newKey = this.newKey.bind(this);
    this.updateKey = this.updateKey.bind(this);
    this.buildKey = this.buildKey.bind(this);
    this.deleteKey = this.deleteKey.bind(this);
    this.clearAllKeys = this.clearAllKeys.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.buildJSON = this.buildJSON.bind(this);
    // helper functions for buildJSON()
    this.buildValue = this.buildValue.bind(this);
    this.parseString = this.parseString.bind(this);
    this.parseFunctions = this.parseFunctions.bind(this);
    this.parseMathOperations = this.parseMathOperations.bind(this);
    this.validParen = this.validParen.bind(this);
    
    //temp
    this.updateAttribute = this.updateAttribute.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.updateCRA = this.updateCRA.bind(this);
    // end temp

    this.state = {
      attributes: this.props.children[this.props.index].name.attributes || [],
      properties: this.props.children[this.props.index].name.properties || [],
      customRowActions: this.props.children[this.props.index].name.customRowActions || [],
      JSON: this.props.children[this.props.index].name.JSON || '{}',
      elmType: this.props.children[this.props.index].name.elmType || 'span',
      fieldType: this.props.children[this.props.index].name.fieldType || 'Choice',
      textContent: this.props.children[this.props.index].name.textContent,
      resetChildren: this.props.resetChildren,
      modal: false,
      modalHeader: '',
      modalBody: '',
      modalTab: '1',
      attributeChoices: data.Attributes,
      propertyChoices: data.CSSProperties,
      customRowActionChoices: data.customRowActions,
      colors: data.customColors,
      prevIndex: this.props.index
    };
  }

  // FIX - Children not moving up and down - textContent not resetting properly

  componentDidMount() {
    this.buildJSON();
  }


  componentDidUpdate() {
    // build JSON for updated children
    if (this.props.children[this.props.index].name.length === 0) 
      this.buildJSON();
      
    
      if (this.state.JSON !== this.props.children[this.props.index].value) {
        this.setState({
          attributes: this.props.children[this.props.index].name.attributes || [],
          properties: this.props.children[this.props.index].name.properties || [],
          customRowActions: this.props.children[this.props.index].name.customRowActions || [],
          JSON: this.props.children[this.props.index].name.JSON || '{}',
          elmType: this.props.children[this.props.index].name.elmType || 'span',
          fieldType: this.props.children[this.props.index].name.fieldType || 'Choice',
          textContent: this.props.children[this.props.index].name.textContent || (this.props.children[this.props.index].name.textContent === undefined ? '@currentField' : ''),
  
          prevIndex: this.props.index
        }, () => { this.props.buildJSON();});
      }
    

  }

 

  newKey(key) {
    var arr = this.state[key].slice();

    arr.splice(0,0, {'name': '', 'value':[]});
    this.buildKey(key, arr);
  }

  updateKey(key, index, name, value) {
    var arr = this.state[key].slice();
    arr[index] = ({'name': name, 'value': value});
    this.setState({
      [key]: arr
    }, () => { this.buildJSON() });
  }

  clearAllKeys(key) {
    this.setState({
      [key]: []
    }, () => { this.buildJSON() } );
  }

  // This function builds properties from arr input. 
  // Needed to build this way for state to reset properly.
  updateAttribute(index, key, value) {
    this.updateKey('attributes', index, key, value);
  }

  updateProperty(index, key, value) {
    this.updateKey('properties', index, key, value);
  }

  updateCRA(index, prop, value) {
    this.updateKey('customRowActions', index, prop, value);
  }

  
  buildKey(key, arr) {
    this.setState({
      [key]: []
    }, () => {
      this.setState({
        [key]: arr
      }, () => { this.buildJSON() })
    });
  }

  deleteKey(key, index) {
    var arr = this.state[key].slice();

    var deleteAtt = arr[index];
    arr.splice(index, 1);
    this.setState({
      [key]: []
    }, () => { 
      this.setState({
        [key]: arr
      }, () => { this.buildJSON() });
     });
  }

  resetForm() {
    this.setState({
      elmType: 'div',
      fieldType: 'Choice',
      textContent: '@currentField'
    });
    this.clearAllKeys('attributes');
    this.clearAllKeys('properties');
    this.clearAllKeys('customRowActions');
    window.scrollTo(0, 0);  // scroll to top of screen
  }


  parseMathOperations(operator, str, indent) {
    let value = str;
    switch (operator) {
      case '//':
        if (str.includes('https://') || str.includes('http://')) 
          break;
      default:
        if (str.toString().includes(operator))  {
          let temp_value = '\t'.repeat(++indent) + '"operator": "' + operator.charAt(1) + '",\n' + '\t'.repeat(++indent) + ' "operands": [\n';
          indent++;
          str.split(operator).forEach((val, i) => { temp_value = temp_value + (this.state.fieldType !== 'Number' ? '\t'.repeat(indent) + this.parseString(val, indent) : this.parseString(val, indent).slice(1, -1)) + ',\n' });
          indent--;
                        // remove , from last item in list and add closing brackets
          value = '{\n' + temp_value.slice(0,-2) + (str.toString().split(operator.charAt(1)).length === 1 ? ',\n' + '\t'.repeat(indent + 1) + '""' : '') + '\n' + '\t'.repeat(indent) +  ']\n}'; 
        } 
    }
  
    return value;
  }

  parseFunctions(str, indent) {
    let f = '';
    let value = str;
    let acceptedFunctions = ['toString', 'Number', 'Date', 'cos', 'sin', 'toLocaleString', 'toLocaleDateString', 'toLocaleTimeString']; 
    
    // set index to innermost '('
    let index = str.lastIndexOf('(');
    
    // before(inner)after
    let before = str.substring(0, index - f.length + 1);
    let inner = str.substring(index + 1, str.indexOf(')', index));
    let after = str.substring(str.indexOf(')', index) + 1, str.length);

    // check what function is being called, remove function name from 'before' variable
    for (var i = 0; i < acceptedFunctions.length; i++) {
      if (before.slice(-acceptedFunctions[i].length - 1, -1) === acceptedFunctions[i]) {
        f = acceptedFunctions[i];
        before = before.slice(0, -acceptedFunctions[i].length - 1);
        break;
      }      
    }
    
    // check what function is being called - f === '' is no funciton - () order of operations
    if (f === '') {
      before = before.slice(0, -1);
      str =  this.parseString(inner, indent);//this.parseString(inner, index) + after;   
    
      value = this.parseString(before + '~' + after, indent).replace('~', str);
      //value = value.slice(1, -1);
    } else { // order of operations w/ () - not a function call
      let prefix = '\t'.repeat(++indent) + '"operator": "' + f + '()",\n' + '\t'.repeat(++indent) + ' "operands": [\n';
      
      str =  this.parseString(inner, indent);//this.parseString(inner, index) + after;   
      str = prefix + str;
      
      value = '{\n' + '\t'.repeat(++indent) + str + '\n' + '\t'.repeat(indent) +  ']\n}';
      value = this.parseString(before + '~' + after, indent).replace('~', value);
    }

    return value;
  }

  // validate proper function (prevents stack overflow)
  validParen(str) {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) === '(')
        arr.push('(');
      else if (str.charAt(i) === ')')
        arr.pop();
    }
    return (arr.length === 0 ? true : false);
  }

  parseString(str, indent) {
    if (str === undefined)
      str = '';
    // replace '%5F' with '_' inside variable names
    str = str.replace(/\[\$(.*?)%5F(.*?)\]/g, (match) => 
      { 
        return match.replace(/%5F/g, '_') 
      });
    
      

    let value = '"' + str + '"';

    // parses functions and () order of operations
    if (this.validParen(str) && str.indexOf('(') >= 0) { 
      value = value.replace(str, this.parseFunctions(str, indent));
    }
    value = value.replace(str, this.parseMathOperations('--', str, indent));
    value = value.replace(str, this.parseMathOperations('++', str, indent));
    value = value.replace(str, this.parseMathOperations('//', str, indent));
    value = value.replace(str, this.parseMathOperations('**', str, indent));
 

    // backslashes for Flow actionParameters command
    if ( value.charAt(1) === '{' || value === '"~"') {
        value = value.slice(1, -1);
    }


    // add " back to Flow Parameters
    if (value.includes("{\\\"id\\\": \\\""))
      value = '"' + value + '"';

    return value;
  }

  buildValue(type, obj, indent) {
    let output = '';
    let key = '';
    switch (type) {
      case 'attribute':
        output = '\t'.repeat(indent) + '"attributes": {';
        break;
      case 'property':
        output = '\t'.repeat(indent)  + '"style": {';
        break;
      case 'customRowActions':
        output = output = '\t'.repeat(indent) + '"customRowAction": {';
        break;
    }

    obj.forEach((ele, i) => {
      // NEED TO CHECK IF RULES/CONDITIONS ARE APPLIED OR NOT (FIX HERE)
      // craft value
      let value = '';
      
      // FIX: CHANGE ele.attribute => ele.name when changing
      if (typeof ele.value === 'string') {
        if (!(ele.name === 'class' || ele.name === 'iconName')) {
          value = this.parseString(ele.value, indent);
        } else {
          value = '"' + ele.value + '"';
        }
      }
      // craft value
      output = output + `
      "` + ele.name + '": ' + value;
      
      if (typeof ele.value === 'object') {   
        // false
        ele.value.forEach( (condition) => {
          output = output + `\n
        {
          "operator": "?",
          "operands": [
          {
              "operator": "` + condition.operator + `",
              "operands": [
                  ` + (this.state.fieldType !== 'Number' ? this.parseString(condition.operand, indent) : this.parseString(condition.operand, indent).slice(1, -1)) + `,
                  ` + (this.state.fieldType !== 'Number' ? this.parseString(condition.operand2, indent) : this.parseString(condition.operand2, indent).slice(1, -1)) + `
              ]
          },
          ` + this.parseString(condition.value, indent) + `, `
        })
        // end false
      }
      
      // 
      output = output + '""'.repeat( (typeof ele.value === 'object' ? 1 : 0) );
      
      // add closing brackets based on number of properties being evaluated
      output = output + `\n\t]
      }`.repeat( (typeof ele.value === 'string' ? 0 : ele.value.length) );

      // add commas for all properties until the last one
      output = output + ','.repeat( (i !== obj.length - 1 ? 1 : 0) );
    });

    output = output + '\n' + '\t'.repeat(indent) + '}';
    
    return output;
  }  


  buildJSON() {
    let indent = 0;
    var JSON_Body = ``;
    var JSON_Header = 
    `{
      "elmType": "` + this.state.elmType + `",
      "txtContent": ` + this.parseString(this.state.textContent, indent) + `,
      `;
    var JSON_Footer = ``;
    var JSON_Properties = '';
    var JSON_Attributes = '';
    var JSON_CustomRowActions = '';
    
    
    // BUILD JSON HERE in forEach loop for ATTRIBUTES
    indent++;
    
    JSON_Properties = JSON_Properties + this.buildValue('property', this.state.properties, indent);
    JSON_Attributes = JSON_Attributes + this.buildValue('attribute', this.state.attributes, indent);
    JSON_CustomRowActions = JSON_CustomRowActions + this.buildValue('customRowActions', this.state.customRowActions, indent);

    // JSON Footer 
    JSON_Footer = `\n}`; 

    // build body of properties and attributes
    JSON_Body = JSON_Attributes + ",\n" + JSON_Properties + ",\n" + JSON_CustomRowActions ;

    // Set Output
    this.setState({
      JSON: JSON_Header + JSON_Body + JSON_Footer
    }, () => { this.props.updateChildren(this.props.index, this.state, this.state.JSON); this.props.buildJSON() });

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => { this.buildJSON() });
  }


  

  render() {
    return (
      
      <Container className="App">  
        <br />
        <Row>   
          <div className="side-info children-color">
            <span>Child {this.props.index + 1}</span>
          </div>
          <Col>
            <Row>
              <Col className='align-self-center' sm='1' md='1' lg='1' xl='1'>
                <div className='text-center center-input'> 
                    <span className='icon delete-property mx-auto' onClick={() => this.props.deleteKey('children', this.props.index)}>X</span>
                </div>  
              </Col>
              <Col className='align-self-center' sm='2' md='2' lg='2' xl='2'>
                <div className='icon child-nav mx-auto'>
                  <span value='top' onClick={(ele) => this.props.moveChild(ele, this.props.index, this) }>To Top</span>
                </div>
              </Col>
              <Col className='align-self-center' sm='2' md='2' lg='2' xl='2'>
              <div className='icon child-nav mx-auto'>
                  <span value='up' onClick={(ele) => this.props.moveChild(ele, this.props.index, this)}>Move Up</span>
                </div>
              </Col>
              <Col className='align-self-center' sm='2' md='2' lg='2' xl='2'>
                <h3 className='mx-auto'>Child {this.props.index + 1}</h3>
              </Col>
              <Col className='align-self-center' sm='2' md='2' lg='2' xl='2'>
                <div className='icon child-nav mx-auto'>
                  <span value='down' onClick={(ele) => this.props.moveChild(ele, this.props.index, this)}>Move Down</span>
                </div>
              </Col>
              <Col className='align-self-center' sm='2' md='2' lg='2' xl='2'>
                <div className='icon child-nav mx-auto'>
                  <span value='bottom' onClick={(ele) => this.props.moveChild(ele, this.props.index, this)}>To Bottom</span>
                </div>
              </Col>
              <Col sm='1' md='1' lg='1' xl='1' />
            </Row>
            <br />

            <Row>
              {/* <Col sm='4' md='4' lg='4' xl='4'> */}
              <Col sm='6' md='5' lg='5' xl='5'>
                <Label className='label center-input remove-text-highlighting'>Element Type</Label>
                <Input className='field-type center-input' type='select' name='elmType' value={this.state.elmType} onChange={this.handleInputChange}>
                  <option>div</option>
                  <option>span</option>
                  <option>a</option>
                  <option>img</option>
                  <option>svg</option>
                  <option>path</option>
                  <option>button</option>
                </Input>
              </Col>

                {/* <Col sm='4' md='4' lg='4' xl='4'> */}
              <Col sm='6' md='6' lg='6' xl='6'>
                <Label className='label center-input remove-text-highlighting'>Text Content <span class='help-link' value="text content help" onClick={this.props.displayModal}>(help)</span></Label>
                <Input className='text-content center-input' type='text' name='textContent' value={this.state.textContent} onChange={this.handleInputChange} />
              </Col>
            </Row>
            <br />

            {/* Attributes */}
            <Row>
            <div className="side-info attributes-color">
                    <span>Attributes</span>
              </div>
              <Col>
                <Row className='padded-row'>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('attributes')}>New Attribute</Button>
                  </div>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.attributes.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('attributes')}>Clear All Attributes</Button>
                  </div>
                
                </Row>
                <Row>
                  {Object.keys(this.state.attributes).map((key, i) => {
                    return (<Attribute key={i} index={i} name='' colors={this.state.colors} attributes={this.state.attributes} attributeChoices={this.state.attributeChoices} updateAttribute={this.updateAttribute} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.props.displayModal } />)
                  })}
                </Row>
                
              </Col>
            </Row>

            {/* Properties */}
            <Row>
              <div className="side-info properties-color">
                    <span>Properties</span>
              </div>

              <Col>
                <Row className='padded-row'>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('properties')}>New CSS Property</Button>
                  </div>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.properties.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('properties')}>Clear All CSS Properties</Button>
                  </div>
                
                </Row>
                <Row>
                  {Object.keys(this.state.properties).map((key, i) => {
                    return (<Property key={i} index={i} name='' colors={this.state.colors} properties={this.state.properties} nameChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.props.displayModal } />)
                  })}
                </Row>
                
              </Col>
            </Row>

            {/* Custom Row Action */}
            <Row>
              <div className="side-info customRowActions-color">
                    <span>Row Actions</span>
              </div>
              <Col>
                <Row className='padded-row'>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('customRowActions')}>New Custom Row Action</Button>
                  </div>
                  <div className='center-input'>
                    <Button type='button' className='mx-auto remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.customRowActions.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('customRowActions')}>Clear All Custom Row Actions</Button>
                  </div>
                
                </Row>
                <Row>
                  {Object.keys(this.state.customRowActions).map((key, i) => {
                    return (<CustomRowAction key={i} index={i} name='' colors={this.state.colors} customRowActions={this.state.customRowActions} customRowActionChoices={this.state.customRowActionChoices} updateCRA={this.updateCRA} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.props.displayModal } />)
                  })}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
       
    );
  }
}

export default Children;
