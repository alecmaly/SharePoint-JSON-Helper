import React, { Component } from 'react';

import './App.css';
import TopNavigation from './Components/TopNavigation.jsx';
import BottomNavigation from './Components/BottomNavigation.jsx';
import CurrentRules from './Components/CurrentRules.jsx';
import BuildRule from './Components/BuildRule.jsx';
import Property from './Components/Property.jsx';
import Condition from './Components/Condition.jsx';
import CopyModal from './Components/CopyModal.jsx';

// polyfill for .repeat function in IE11
import './pollyfills.js';

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
    this.newRule = this.newRule.bind(this);
    this.selectRule = this.selectRule.bind(this);
    this.editRule = this.editRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.clearRules = this.clearRules.bind(this);
    this.buildJSON = this.buildJSON.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.toggleCopyModal = this.toggleCopyModal.bind(this);
    this.state = {
      rules: [],
      properties: [],
      JSON: '',
      operator: '==',
      operand: '',
      color: '',
      hex: '98FB98',
      fieldType: 'Choice',
      selectedRule: '',
      copyModal: false,
      propertyChoices: 
        {
            'background-color': {
              'placeholder': '#hex -- color'
            },
            'font-size': {
              'placeholder': '18px -- 150% '
            },
            'text-align': {
                'options': 'left,right,center,justify'
            },
            'border': {
                'placeholder': '4px solid black'
            },
            'border-radius': {},
            'font-weight': {
                'options': 'bold,semibold'
            },
            
            'color': {
              'placeholder': '#hex -- color'
            },
            'width': {}
        },
        colors: {
            'Green': '#98FB98',
            'Yellow': '#FFFF66',
            'Orange': '#FFA450',
            'Red': '#FF6A6A',
            'Blue': '#5078FF',
            'Purple': '#B350FF',
            'Custom': '#'
        }   
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
    console.log(event.target.name);

    switch (event.target.name) {
      case 'copy to clipboard':
        var copyText = document.querySelector(".output");
        copyText.select();
        document.execCommand("copy");
        this.toggleCopyModal();
        break;
      case 'reset': 
        this.resetForm();
        break;
      case 'quick add':
        var arr = this.state.properties.slice();
        arr.splice(0, 0, {'property': event.target.value, 'value': event.target.innerHTML});
        this.buildProperties(arr);
        break;
      case 'template':
        switch (event.target.innerHTML) {
          case ('Completed/In Progress/Late'):
            this.resetForm();
            const arr = [
              {
                property: 'background-color',
                value:  [
                  {
                    operator: '==',
                    operand: 'Completed',
                    value: '#98fb98'
                  },
                  {
                    operator: '==',
                    operand: 'In Progress',
                    value: '#FFFF66'
                  },
                  {
                    operator: '==',
                    operand: 'Late',
                    value: '#ff6a6a'
                  }
                ]
              }];
            this.buildProperties(arr);
            break;

        }
        
    }
  }

  resetForm() {
    this.clearRules();
    this.clearAllProperties();
  }

  
  newProperty() {
    var arr = this.state.properties.slice();
    arr.push({'property': 'background-color', 'value':[]});
    this.setState({
      properties: arr
    }, () => { this.buildJSON() });
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

  newRule() {
    var arr = this.state.rules.slice();
    arr.push({operator: this.state.operator, operand: this.state.operand, hex: this.state.hex});
    this.setState({
      rules: arr
    }, () => this.buildJSON() );    
  }

  selectRule(index) {
    switch (index) {
      case this.state.selectedRule:
        //this.deleteRule();
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
        fieldType: rule.fieldType,
        color: 'Custom',
        hex: rule.hex
      });
    } 
  }

  editRule() {
    var arr = this.state.rules.slice();
    arr[this.state.selectedRule].operator = this.state.operator;
    arr[this.state.selectedRule].operand = this.state.operand;
    arr[this.state.selectedRule].hex = this.state.hex;
    this.setState({
      rules: arr
    }, () => this.buildJSON() );    
  }

  deleteRule() {
    if (this.state.selectedRule !==  '') {
      var arr = this.state.rules;
      var deleted_Hex = arr[this.state.selectedRule].hex;
      arr.splice(this.state.selectedRule, 1);
      this.setState({
        rules: arr,
        operand: '',
        color: 'Custom',
        hex: deleted_Hex,
        selectedRule: ''
      }, () => this.buildJSON() );
    }
  }
  
  clearRules() {
    this.setState({
      rules: [],
      operand: '',
      selectedRule: ''
    }, () => this.buildJSON() );
  }

  buildJSON() {
    var JSON_Body = ``;
    var JSON_Header = 
    `{
      "elmType": "div",
      "txtContent": "@currentField",
      "style": {`;
    var JSON_Footer = ``;
    var JSON_Properties = '';
    var JSON_Properties_Footer = '';

    // BUILD JSON HERE in forEach loop for PROPERTIES
    this.state.properties.forEach((ele, i) => {
      JSON_Properties = JSON_Properties + `
      "` + ele.property + '": ' + (typeof ele.value === 'string' ? '"' + ele.value + '"' : '') ;

      
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
    }, () => { 

      // additional actions based on button clicked
      switch(name) {
        case 'color': 
          if (value !== 'Custom') {
            this.setState({
              hex: this.state.colors[value]
            });
          }
          break;
        case 'hex':
          this.setState({
            color: 'Custom'
          });
        break;
        case 'fieldType':
          this.buildJSON();
        break;
      }
    });

  }

  toggleCopyModal() {
    this.setState({
      copyModal: !this.state.copyModal
    });
  }

  render() {
    return (
      <Container className="App">
        <header>  
          <Jumbotron className='banner' color='red'>
            <h2>SharePoint Helper</h2>
            <p>Used for building conditional formatting JSON - <a target='_blank' href='https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/column-formatting'>Microsoft Docs</a> <br />
            Note: Rules are read from top to bottom.
            </p>
          </Jumbotron>
        </header>

        <TopNavigation navButtonClick={this.navButtonClick} />

        <CopyModal toggleCopyModal={this.toggleCopyModal} isOpen={this.state.copyModal} />

        <Row>
          <Col sm='12' md='12' lg='12' xl='12'>
            <Label className='label center-input remove-text-highlighting'>Field Type</Label>
            <Input className='field-type center-input' type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
              <option>Choice</option>
              <option>Text</option>
              <option>Number</option>
            </Input>  
            <br />
          </Col>

          <Col>
            <Row>
              {Object.keys(this.state.properties).map((key, i) => {
                return (<Property key={i} index={i} name='' colors={this.state.colors} properties={this.state.properties} propertyChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteProperty={this.deleteProperty} buildJSON={this.buildJSON} />)
              })}
            </Row>
            <Row className='padded-row'>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='success' onClick={this.newProperty}>New CSS Property</Button>
              </div>
              <div className='center-input'>
                <Button type='button' className='remove-text-highlighting add-remove-property-button' color='danger' style={{ 'visibility': this.state.properties.length > 0 ? 'Visible' : 'hidden'}} onClick={this.clearAllProperties}>Clear All CSS Properties</Button>
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
