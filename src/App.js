import React, { Component } from 'react';

import './App.css';
import TopNavigation from './Components/TopNavigation.jsx';
import BottomNavigation from './Components/BottomNavigation.jsx';
import CurrentRules from './Components/CurrentRules.jsx';
import BuildRule from './Components/BuildRule.jsx';
import Property from './Components/Property.jsx';
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
    this.newProperty = this.newProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.buildProperties = this.buildProperties.bind(this);
    this.clearAllProperties = this.clearAllProperties.bind(this);
    this.buildJSON = this.buildJSON.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      rules: [],
      properties: [],
      JSON: '',
      operator: '==',
      operand: '',
      fieldType: 'Choice',
      textContent: '@currentField',
      selectedRule: '',
      modal: false,
      modalHeader: '',
      modalBody: '',
      propertyChoices: data.CSSProperties,
        colors: data.customColors
    };
  }

  componentDidMount() {
    this.buildJSON();
  }

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
      case 'quick add':
        var arr = this.state.properties.slice();
        arr.splice(0, 0, {'property': event.target.value, 'value': event.target.title});
        this.buildProperties(arr);
        break;
      case 'template':

        switch (event.target.value) {
          case 'Completed/In Progress/Late':
            this.resetForm();
            const arr = data.template_completedInProgressLate;
            this.buildProperties(arr);
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

  buildJSON() {
    var JSON_Body = ``;
    var JSON_Header = 
    `{
      "elmType": "div",
      "txtContent": "` + this.state.textContent + `",
      "style": {`;
    var JSON_Footer = ``;
    var JSON_Properties = '';
    var JSON_Properties_Footer = '';

    // BUILD JSON HERE in forEach loop for PROPERTIES
    this.state.properties.forEach((ele, i) => {
      JSON_Properties = JSON_Properties + `
      "` + ele.property + '": ' + (typeof ele.value === 'string' ? '"' + ele.value + '"' : '');
      
      (typeof ele.value === 'string' ? ele.value : 

        ele.value.forEach( (condition) => {
          JSON_Properties = JSON_Properties + `
        {
          "operator": "?",
          "operands": [
          {
              "operator": "` + condition.operator + `",
              "operands": [
                  "@currentField",
                  ` + (this.state.fieldType !== 'Number' ? `"` + condition.operand + `"` : condition.operand) + `
              ]
          },
          "` + condition.value + `", `
      })
    )

    // 
    JSON_Properties = JSON_Properties + '""'.repeat( (typeof ele.value === 'object' ? 1 : 0) );
    
    // add closing brackets based on number of properties being evaluated
    JSON_Properties = JSON_Properties + `
      ]
    }`.repeat( (typeof ele.value === 'string' ? 0 : ele.value.length) );

    // add commas for all properties until the last one
    JSON_Properties = JSON_Properties + ','.repeat( (i !== this.state.properties.length - 1 ? 1 : 0) );
    });

    // JSON Footer 
    var JSON_Footer_Base = `"#FFFFFF00"`;
    var JSON_Footer_Base = ``;
    
    JSON_Footer =
    ` }
    }`; 

    // Set Output
    this.setState({
      JSON: JSON_Header + JSON_Properties + JSON_Body + JSON_Footer
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
          <Col sm='6' md='6' lg='6' xl='6'>
            <Label className='label center-input remove-text-highlighting'>Field Type</Label>
            <Input className='field-type center-input' type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
              <option>Choice</option>
              <option>Text</option>
              <option>Number</option>
            </Input>
          </Col>
          <Col sm='6' md='6' lg='6' xl='6'>
            <Label className='label center-input remove-text-highlighting'>Text Content</Label>
            <Input className='text-content center-input' type='text' name='textContent' value={this.state.textContent} onChange={this.handleInputChange} />
          </Col>
        </Row>
        <br />
        <Row>
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
                return (<Property key={i} index={i} name='' colors={this.state.colors} properties={this.state.properties} propertyChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteProperty={this.deleteProperty} buildJSON={this.buildJSON} />)
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
