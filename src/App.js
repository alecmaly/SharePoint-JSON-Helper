import React, { Component } from 'react';

import './App.css';
import TopNavigation from './Components/TopNavigation.jsx';
import BottomNavigation from './Components/BottomNavigation.jsx';
import CurrentRules from './Components/CurrentRules.jsx';
import Attribute from './Components/Attribute.jsx';
import Property from './Components/Property.jsx';
import Children from './Components/Children.jsx';
import CustomRowAction from './Components/CustomRowAction.jsx';
import Condition from './Components/Condition.jsx';
import MyModal from './Components/MyModal.jsx';


// polyfill for .repeat function in IE11
import './pollyfills.js';

// data
import data from './data.js';

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

class App extends Component {
  
  constructor(props) {
    super(props);
    this.navButtonClick = this.navButtonClick.bind(this);
    this.newKey = this.newKey.bind(this);
    this.updateKey = this.updateKey.bind(this);
    this.buildKey = this.buildKey.bind(this);
    this.deleteKey = this.deleteKey.bind(this);
    this.clearAllKeys = this.clearAllKeys.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.moveChild = this.moveChild.bind(this);

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
    this.updateChildren = this.updateChildren.bind(this);
    // end temp


    this.state = {
      attributes: [],
      properties: [],
      customRowActions: [],
      children: [],
      JSON: '',
      elmType: 'div',
      fieldType: 'Choice',
      textContent: '@currentField',
      modal: false,
      modalHeader: '',
      modalBody: '',
      modalTab: '1',
      attributeChoices: data.Attributes,
      propertyChoices: data.CSSProperties,
      customRowActionChoices: data.customRowActions,
      colors: data.customColors
    };
  }

  componentDidMount() {
    this.buildJSON();
  }


  moveChild(ele, index, obj) {
    let arr = this.state.children.slice();
    let temp = arr[index];
    

    switch (ele.target.attributes.value.value) {
      case 'top':
        arr.splice(index, 1);    
        arr.splice(0, 0, temp);
        break;
      case 'up':
        arr.splice(index, 1);    
        arr.splice((index === 0 ? 0 : index-1), 0, temp);
        break;
      case 'down':
        arr.splice(index, 1);    
        arr.splice(index+1, 0, temp);
        break;
      case 'bottom':
        arr.splice(index, 1);    
        arr.splice(arr.length, 0, temp);
        break;
    }
    //arr.splice(index, 0, temp);

    this.setState({
      children: arr
    }, this.buildJSON())

  }

  newKey(key) {
    let arr = [];
    if (key === 'addChildren') {
      key = 'children';
      arr = this.state[key].slice();
      arr.push({'name':'', 'value':[]});
    }
    else { 
      arr = this.state[key].slice();
      console.log(arr);
      arr.splice(0,0, {'name': '', 'value':[]});
    }

    if (key === 'children')
      this.setState({ textContent: '' });

    this.buildKey(key, arr);
  }

  updateKey(key, index, name, value) {
    let arr = this.state[key].slice();
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

  updateCRA(index, key, value) {
    this.updateKey('customRowActions', index, key, value);
  }

  updateChildren(index, key, value) {
    this.updateKey('children', index, key, value);
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


  navButtonClick(event) {
    let arr = [];
    switch (event.target.name) {
      case 'copy to clipboard':
        var copyText = document.querySelector(".output");
        copyText.select();
        document.execCommand("copy");
        this.setState({
          modalHeader: 'Copy to Clipboard',
          modalBody: '<br>JSON has been copied to the clipboard!'
        })
        this.toggleModal();
        break;
      case 'reset': 
        this.resetForm();
        break;
      case 'attribute':
         arr = this.state.attributes.slice();
        arr.splice(0, 0, {'name': event.target.value, 'value': event.target.title});
        this.buildKey('attributes', arr);
        break;
      case 'property':
        arr = this.state.properties.slice();
        arr.splice(0, 0, {'name': event.target.value, 'value': event.target.title});
        this.buildKey('properties', arr);
        break;
      case 'CRA':
        arr = this.state.customRowActions.slice();
        arr.splice(0, 0, {'name': "actionParams", 'value': "{\\\"id\\\": \\\"FLOW_ID\\\"}"});
        arr.splice(0, 0, {'name': "action", 'value': "executeFlow"});
        this.buildKey('customRowActions', arr);
        break;



      case 'template':
        switch (event.target.value) {
          case 'Completed/In Progress/Late':
            this.resetForm();
            arr = data.template_completedInProgressLate;
            this.buildKey('properties', arr.properties);
            break;
          case 'Data Bars 1':
              this.resetForm();
              arr = data.template_dataBars_one;

              this.buildKey('properties', arr.properties);
              this.buildKey('attributes', arr.attributes);
              break;
          case 'Data Bars 100':
            this.resetForm();
            arr = data.template_dataBars_hundred;

            this.buildKey('properties', arr.properties);
            this.buildKey('attributes', arr.attributes);
            break;
          case 'Button with link + icon':
            this.resetForm();
            arr = data.template_buttonWithLinkandIcon;

            this.setState({'elmType': 'button', textContent: ''})
            this.buildKey('properties', arr.properties);
            this.buildKey('children', arr.children)
            break;
        }
    }
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
    this.clearAllKeys('children');
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

    // replace '%5F' with '_' inside variable names
    if (str !== undefined) {
      str = str.replace(/\[\$(.*?)%5F(.*?)\]/g, (match) => 
        { 
          return match.replace(/%5F/g, '_') 
        });
    }

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
      case 'children':
        output = output = '\t'.repeat(indent) + '"children": [';
        this.state[type].forEach((obj) => {
          output = output + obj.value + ', ';
        });
        if (this.state[type].length > 0)
          output = output.slice(0, -2);
        output = output + ']';
        break;
    }
    
    if (type !== 'children') {

      obj.forEach((ele, i) => {
        // NEED TO CHECK IF RULES/CONDITIONS ARE APPLIED OR NOT (FIX HERE)
        // craft value
        let value = '';
        
      
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
    }
    
    return output;
  }  


  buildJSON() {
    // console.log(this.state)
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
    var JSON_Children = '';
    
    // BUILD JSON HERE in forEach loop for ATTRIBUTES
    indent++;
    
    JSON_Properties = JSON_Properties + this.buildValue('property', this.state.properties, indent);
    JSON_Attributes = JSON_Attributes + this.buildValue('attribute', this.state.attributes, indent);
    JSON_CustomRowActions = JSON_CustomRowActions + this.buildValue('customRowActions', this.state.customRowActions, indent);
    JSON_Children = JSON_Children + this.buildValue('children', this.state.children, indent);

    // JSON Footer 
    JSON_Footer = `\n}`; 

    // build body of properties and attributes
    JSON_Body = JSON_Attributes + ",\n" + JSON_Properties + ",\n" + JSON_CustomRowActions + ",\n" + JSON_Children ;

    // Set Output
    this.setState({
      JSON: JSON_Header + JSON_Body + JSON_Footer
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => { this.buildJSON() });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  displayModal(event) {
    switch(event.target.attributes.value.value) {
      case 'text content help':
        this.setState({
          modalHeader: 'Text Context Help',
          modalBody: '<br>This value will be displayed in each cell',
          modalTab: '1'
        }, () => { this.toggleModal() } )
        break;
        case 'iconName':
          this.setState({
            modalHeader: 'iconName Help',
            modalBody: `<br>
                        Use SharePoint Fabric <a style='font-size: 115%' target='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/icons'>Icons</a>.</span><br>
                        <br>
                        Don't forget to check the left nav for more icons!<br>
                        <a target='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/brand-icons'><b>Brand icons</b></a><br>
                        <a targt='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/localization'><b>Localization</b></a>`,
            modalTab: '1'
          }, () => { this.toggleModal() } )
          break;
        case 'class':
          this.setState({
            modalHeader: 'class Help',
            modalBody: `<br>
                        Here you can use SharePoint Framework classes.<br>
                        Don't forget about <a style='font-size: 115%' target='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/animations'>Animations</a> and 
                          <a style='font-size: 115%' target='_blank' href='https://developer.microsoft.com/en-us/fabric#/styles/typography'>Typography</a>!</span><br>
                        <br>`,
            modalTab: '1'
          }, () => { this.toggleModal() } )
          break;
        case 'Operand':
          this.setState({
            modalHeader: 'Operand Help',
            modalBody: '<br>This value will be compared with Operand2, uses Value when true.',
            modalTab: '1'
          }, () => { this.toggleModal() } )
          break;
        case 'Operand2':
          this.setState({
            modalHeader: 'Operand Help',
            modalBody: '<br>This value will be compared with Operand, uses Value when true.',
            modalTab: '1'
          }, () => { this.toggleModal() } )
          break;

        default:
          this.setState({
              modalHeader: 'Value Help',
              modalBody: `<br>Enter the value to use.`,
              modalTab: '1'
            }, () => { this.toggleModal() } )
          break;

    }
  }

  render() {
    return (
      <Container className="App">
        <header>  
          <Jumbotron className='banner' color='red'>
            
            <Row>  
              <Col>
                <h1>SharePoint Helper</h1>
                <p>Used for building conditional formatting JSON - <a target='_blank' href='https://www.youtube.com/watch?v=6vT4oGr2ZKU'>YouTube Tutorial</a> <br />
                Note: Rules are read from top to bottom.
                </p>
              </Col>
              <Col sm='2' md='2' lg='2' xl='2'>
                <div class='share-container'>
                  <span style={{'font-size': '15pt'}}>Share</span><br />
                  <a target='_blank' href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsharepoint-json-helper.alecmaly.com" class="fa fa-facebook"></a>
                  <a target='_blank' href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsharepoint-json-helper.alecmaly.com" class="fa fa-twitter"></a>
                  <a target='_blank' href='https://www.linkedin.com/cws/share?url=https%3A%2F%2Fsharepoint-json-formatter%2Eherokuapp%2Ecom&lang=en_US' class='fa fa-linkedin'></a>
                </div>
              </Col>
            </Row>
          </Jumbotron>
        </header>
        
        
        <TopNavigation navButtonClick={this.navButtonClick} />

        <MyModal toggleModal={this.toggleModal} isOpen={this.state.modal} modalHeader={this.state.modalHeader} modalBody={this.state.modalBody} modalTab={this.state.modalTab} />

        <Row>
        
        {/* <Col sm='4' md='4' lg='4' xl='4'> */}
        <Col sm='6' md='6' lg='6' xl='6'>
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

          {/*
          <Col sm='4' md='4' lg='4' xl='4'>
            <Label className='label center-input remove-text-highlighting'>Field Type</Label>
            <Input className='field-type center-input' type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
              <option>Choice</option>
              <option>Text</option>
              <option>Number</option>
              <option>Date</option>
            </Input>
          </Col>
          */}

          {/* <Col sm='4' md='4' lg='4' xl='4'> */}
          <Col sm='6' md='6' lg='6' xl='6'>
            <Label className='label center-input remove-text-highlighting'>Text Content <span class='help-link' value="text content help" onClick={this.displayModal}>(help)</span></Label>
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
            <Row className='padded-row mx-auto'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('attributes')}>New Attribute</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.attributes.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('attributes')}>Clear All Attributes</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.attributes).map((key, i) => {
                return (<Attribute key={i} index={i} name='' colors={this.state.colors} attributes={this.state.attributes} attributeChoices={this.state.attributeChoices} updateAttribute={this.updateAttribute} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
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
            <Row className='padded-row mx-auto'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('properties')}>New CSS Property</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.properties.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('properties')}>Clear All CSS Properties</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.properties).map((key, i) => {
                return (<Property key={i} index={i} name='' colors={this.state.colors} properties={this.state.properties} nameChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
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
            <Row className='padded-row mx-auto'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('customRowActions')}>New Custom Row Action</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.customRowActions.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('customRowActions')}>Clear All Custom Row Actions</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.customRowActions).map((key, i) => {
                return (
                  <CustomRowAction key={i} index={i} name='' colors={this.state.colors} customRowActions={this.state.customRowActions} customRowActionChoices={this.state.customRowActionChoices} updateCRA={this.updateCRA} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
              })}
            </Row>
          </Col>
        </Row>

        
        {/* Children */}
        <Row>
          <Col>
          {this.state.children.length !== 0 ? 
            <Row className='padded-row mx-auto'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('children')}>Insert Child</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.children.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('children')}>Clear All Children</Button>
              </div>
            
            </Row>
            : '' }


            <Row>
              {Object.keys(this.state.children).map((key, i) => {
                return (<Children key={i} index={i} name='' colors={this.state.colors} children={this.state.children} updateChildren={this.updateChildren} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.displayModal} toggleModal={this.toggleModal} moveChild={this.moveChild} />)
              })}
            </Row>
           

            <Row className='padded-row mx-auto'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('addChildren')}>New Child</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.children.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('children')}>Clear All Children</Button>
              </div>
            </Row>
            
          </Col>
        </Row>


        <Row className='padded-row'> 
          <Col>
            <Input className='output center-input' type='textarea' value={this.state.JSON} />
          </Col>
        </Row>

        <BottomNavigation navButtonClick={this.navButtonClick} />
      </Container>
       
    );
  }
}

export default App;
