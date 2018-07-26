import React, { Component } from 'react';

import './App.css';
import TopNavigation from './Components/TopNavigation.jsx';
import BottomNavigation from './Components/BottomNavigation.jsx';
import CurrentRules from './Components/CurrentRules.jsx';
import Property from './Components/Property.jsx';
import Attribute from './Components/Attribute.jsx';
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

class App extends Component {
  
  constructor(props) {
    super(props);
    this.navButtonClick = this.navButtonClick.bind(this);
    this.newKey = this.newKey.bind(this);
    this.updateKey = this.updateKey.bind(this);
    this.buildKey = this.buildKey.bind(this);
    this.deleteKey = this.deleteKey.bind(this);
    this.clearAllKeys = this.clearAllKeys.bind(this);
    this.newAttribute = this.newAttribute.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.deleteAttribute = this.deleteAttribute.bind(this);
    this.buildAttributes = this.buildAttributes.bind(this);
    this.clearAllAttributes = this.clearAllAttributes.bind(this);
    this.newProperty = this.newProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.buildProperties = this.buildProperties.bind(this);
    this.clearAllProperties = this.clearAllProperties.bind(this);
    this.parseString = this.parseString.bind(this);
    this.buildValue = this.buildValue.bind(this);
    this.buildJSON = this.buildJSON.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.displayModal = this.displayModal.bind(this);

    //temp
    this.updateCRA = this.updateCRA.bind(this);
    // end temp


    this.state = {
      rules: [],
      attributes: [],
      properties: [],
      customRowActions: [],
      JSON: '',
      elmType: 'div',
      fieldType: 'Choice',
      textContent: '@currentField',
      modal: false,
      modalHeader: '',
      modalBody: '',
      attributeChoices: data.Attributes,
      propertyChoices: data.CSSProperties,
      customRowActionChoices: data.customRowActions,
      colors: data.customColors
    };
  }

  componentDidMount() {
    this.buildJSON();
  }

  newKey(key) {
    var arr = this.state[key].slice();

    arr.splice(0,0, {[key]: '', 'value':[]});
    this.buildKey(key, arr);
  }

  updateKey(key, index, prop, value) {
    var arr = this.state[key].slice();
    arr[index] = ({[key]: prop, 'value': value});

    this.setState({
      [key]: arr
    }, () => { this.buildJSON() });
  }

  clearAllKeys(key) {
    this.setState({
      [key]: []
    }, () => { this.buildJSON() } );
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

  newAttribute() {
    var arr = this.state.attributes.slice();
    arr.splice(0,0, {'attribute': '', 'value':[]});
    this.buildAttributes(arr);
  }
  
  buildAttributes(arr) {
    this.setState({
      attributes: []
    }, () => { 
      this.setState({
        attributes: arr
      }, () => { this.buildJSON() });
     });
  }

  updateAttribute(index, prop, value) {
    var arr = this.state.attributes.slice();
    arr[index] = ({'attribute': prop, 'value': value});

    this.setState({
      attributes: arr
    }, () => { this.buildJSON() });
  }

  deleteAttribute(index) {
    var arr = this.state.attributes.slice();
    var deleteAtt = arr[index];
    arr.splice(index, 1);
    this.setState({
      attributes: []
    }, () => { 
      this.setState({
        attributes: arr
      }, () => { this.buildJSON() });
     });
  }

  clearAllAttributes() {
    this.setState({
      attributes: []
    }, () => { this.buildJSON() } );
  }

  

  // This function builds properties from arr input. 
  // Needed to build this way for state to reset properly.
  buildProperties(arr) {
    this.setState({
      properties: []
    }, () => { 
      this.setState({
        properties: arr
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
          modalHeader: 'JSON has been copied to the clipboard',
          modalBody: ''
        })
        this.toggleModal();
        break;
      case 'reset': 
        this.resetForm();
        break;
      case 'attribute':
         arr = this.state.attributes.slice();
        arr.splice(0, 0, {'attribute': event.target.value, 'value': event.target.title});
        this.buildAttributes(arr);
        break;
      case 'property':
        arr = this.state.properties.slice();
        arr.splice(0, 0, {'property': event.target.value, 'value': event.target.title});
        this.buildProperties(arr);
        break;
        
      case 'template':
        switch (event.target.value) {
          case 'Completed/In Progress/Late':
            this.resetForm();
            arr = data.template_completedInProgressLate;
            this.buildProperties(arr);
            break;
          case 'Data Bars':
            this.resetForm();
            arr = data.template_dataBars;
            
            this.buildProperties(arr.properties);
            this.buildAttributes(arr.attributes);
            break;
        }

    }
  }

  resetForm() {
    this.setState({
      fieldType: 'Choice',
      textContent: '@currentField'
    });
    this.clearAllProperties();
    this.clearAllAttributes();
  }

  newProperty() {
    var arr = this.state.properties.slice();
    arr.splice(0,0,{'property': '', 'value':[]});
    this.buildProperties(arr);
  }

  updateProperty(index, prop, value) {
    var arr = this.state.properties.slice();
    arr[index] = ({'property': prop, 'value': value});

    this.setState({
      properties: arr
    }, () => { this.buildJSON() });
  }

  deleteProperty(index) {
    var arr = this.state.properties.slice();
    var deleteProp = arr[index];
    arr.splice(index, 1);
    this.setState({
      properties: []
    }, () => { 
      this.setState({
        properties: arr
      }, () => { this.buildJSON() });
     });
  }

  clearAllProperties() {
    this.setState({
      properties: []
    }, () => { this.buildJSON() } );
  }

  parseString(str, indent) {
    let value = '"' + str + '"';
    if (str.toString().includes('++')) {
      value = '\t'.repeat(++indent) + '"operator": "+",\n' + '\t'.repeat(++indent) + ' "operands": [\n';
      indent++;
      str.split('++').forEach((val, i) => { value = value + (this.state.fieldType !== 'Number' ? '\t'.repeat(indent) + `"` + val + `"` : val) + ',\n' });
      indent--;
      value = '{\n' + value.slice(0,-2) + (str.toString().split('++').length === 1 ? ',\n' + '\t'.repeat(indent + 1) + '""' : '') + '\n' + '\t'.repeat(indent) +  ']\n}';
    } 
    return value;
  }

  buildValue(type, obj, indent) {
    let output = '';
    let key = '';
    switch (type) {
      case 'property':
        output = '\t'.repeat(indent)  + '"style": {';
        break;
      case 'attribute':
        output = '\t'.repeat(indent) + '"attributes": {';
        break;
      case 'customRowActions':
        output = output = '\t'.repeat(indent) + '"customRowAction": {';
        break;
    }

    obj.forEach((ele, i) => {
      // NEED TO CHECK IF RULES/CONDITIONS ARE APPLIED OR NOT (FIX HERE)
      // craft value
      let value = '';
      
      if (typeof ele.value === 'string') {
        value = this.parseString(ele.value, indent);
      }
      // craft value
      console.log(ele);
      output = output + `
      "` + ele[type] + '": ' + value;
      
      if (typeof ele.value === 'object') {   
        // false
        ele.value.forEach( (condition) => {
          value = '"' + condition.value + '"';
          if (condition.value.toString().includes('++')) {
            value = '\t'.repeat(++indent) + '"operator": "+",\n' + '\t'.repeat(++indent) + ' "operands": [\n';
            indent++;
            condition.value.split('++').forEach((val, i) => { value = value + (this.state.fieldType !== 'Number' ? '\t'.repeat(indent) + `"` + val + `"` : val) + ',\n' });
            indent--;
            value = '{\n' + value.slice(0,-2) + (condition.value.toString().split('++').length === 1 ? ',\n' + '\t'.repeat(indent + 1) + '""' : '') + '\n' + '\t'.repeat(indent) +  ']\n}';
          } 

          // ADD VALUE CREATION HERE FOR EACH RULE
          output = output + `\n
        {
          "operator": "?",
          "operands": [
          {
              "operator": "` + condition.operator + `",
              "operands": [
                  ` + (this.state.fieldType !== 'Number' ? `"` + condition.operand + `"` : condition.operand) + `,
                  ` + (this.state.fieldType !== 'Number' ? `"` + condition.operand2 + `"` : condition.operand2) + `
              ]
          },
          ` + value + `, `
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
    JSON_Body = JSON_Properties + ",\n" + JSON_Attributes + ",\n" + JSON_CustomRowActions ;

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
    console.log(event.target);
    switch(event.target.attributes.value.value) {
      case 'text content help':
        this.setState({
          modalHeader: 'Text Context Help',
          modalBody: `
          <b onClick={this.props.newProperty}>@currentField</b> - refers to text in current field. <br>
          <b>@currentField.title</b> - Person fields are represented in the system as objects, and a person’s display name is contained within that object’s title property <br>
          <b>@currentField.lookupValue</b> -  Lookup fields are also represented as objects; the display text is stored in the lookupValue property <br>
          <b>@now</b> - current date/time <br>
          <b>@me</b> - current user's email <br>
          <b>[$FieldName]</b> - refers to value in field on same row <br>
          <b>[$PeoplePicker.email]</b> - refers to email of the person in a people picker field 
          <br><br>

          Note: If you have spaces in the field name, those are defined as _x0020_. For example, a field named "Due Date" should be referenced as $Due_x0020_Date.<br><br>
          Note2: Use <b>++</b> to concatenate
          `
        })

        this.toggleModal();
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
                <p>Used for building conditional formatting JSON - <a target='_blank' href='https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/column-formatting'>Microsoft Docs</a> <br />
                Note: Rules are read from top to bottom.
                </p>
              </Col>
              <Col sm='2' md='2' lg='2' xl='2'>
                <div class='share-container'>
                  <span style={{'font-size': '15pt'}}>Share</span><br />
                  <a target='_blank' href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsharepoint-json-formatter.herokuapp.com" class="fa fa-facebook"></a>
                  <a target='_blank' href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsharepoint-json-formatter.herokuapp.com" class="fa fa-twitter"></a>
                  <a target='_blank' href='https://www.linkedin.com/cws/share?url=https%3A%2F%2Fsharepoint-json-formatter%2Eherokuapp%2Ecom&lang=en_US' class='fa fa-linkedin'></a>
                </div>
              </Col>
            </Row>
          </Jumbotron>
        </header>

        <TopNavigation navButtonClick={this.navButtonClick} />

        <MyModal toggleModal={this.toggleModal} isOpen={this.state.modal} modalHeader={this.state.modalHeader} modalBody={this.state.modalBody} />

        <Row>
        <Col sm='4' md='4' lg='4' xl='4'>
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
          <Col sm='4' md='4' lg='4' xl='4'>
            <Label className='label center-input remove-text-highlighting'>Field Type</Label>
            <Input className='field-type center-input' type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
              <option>Choice</option>
              <option>Text</option>
              <option>Number</option>
            </Input>
          </Col>
          <Col sm='4' md='4' lg='4' xl='4'>
            <Label className='label center-input remove-text-highlighting'>Text Content (<span class='help-link' value="text content help" onClick={this.displayModal}>help</span>)</Label>
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
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={this.newAttribute}>New Attribute</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.attributes.length > 0 ? 'Visible' : 'hidden'}} onClick={this.clearAllAttributes}>Clear All Attributes</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.attributes).map((key, i) => {
                return (<Attribute key={i} index={i} name='' colors={this.state.colors} attributes={this.state.attributes} attributeChoices={this.state.attributeChoices} updateAttribute={this.updateAttribute} deleteAttribute={this.deleteAttribute} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
              })}
            </Row>
            
          </Col>
        </Row>

        {/* Properties */}
        <Row>
          <div className="side-info properties-color">
                <span>Properties</span>
          </div>

          
{/*           
          <div class='side-info'>
              <div>Properties</div>
          </div> */}

          <Col>
            <Row className='padded-row'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={this.newProperty}>New CSS Property</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.properties.length > 0 ? 'Visible' : 'hidden'}} onClick={this.clearAllProperties}>Clear All CSS Properties</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.properties).map((key, i) => {
                return (<Property key={i} index={i} name='' colors={this.state.colors} properties={this.state.properties} propertyChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteProperty={this.deleteProperty} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
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
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={() => this.newKey('customRowActions')}>New Custom Row Action</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.customRowActions.length > 0 ? 'Visible' : 'hidden'}} onClick={() => this.clearAllKeys('customRowActions')}>Clear All Custom Row Actions</Button>
              </div>
            
            </Row>
            <Row>
              {Object.keys(this.state.customRowActions).map((key, i) => {
                return (<CustomRowAction key={i} index={i} name='' colors={this.state.colors} customRowActions={this.state.customRowActions} customRowActionChoices={this.state.customRowActionChoices} updateCRA={this.updateCRA} deleteKey={this.deleteKey} buildJSON={this.buildJSON} displayModal={this.displayModal} />)
              })}
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
