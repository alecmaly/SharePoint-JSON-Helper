import React, { Component } from 'react';

import './App.css';
import CurrentRules from './Components/CurrentRules.jsx';
import BuildRule from './Components/BuildRule.jsx';
import Property from './Components/Property.jsx';

import { 
  Container,
  Jumbotron,
  Row,
  Col,
  Button,
  Input,
  Label
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.newProperty = this.newProperty.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.clearAllProperties = this.clearAllProperties.bind(this);
    this.newRule = this.newRule.bind(this);
    this.selectRule = this.selectRule.bind(this);
    this.editRule = this.editRule.bind(this);
    this.deleteRule = this.deleteRule.bind(this);
    this.clearRules = this.clearRules.bind(this);
    this.buildJSON = this.buildJSON.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      rules: [
        {
          operator: '==',
          operand: 'Completed',
          hex: '98fb98'
        },
        {
          operator: '==',
          operand: 'In Progress',
          hex: 'FFFF66'
        },
        {
          operator: '==',
          operand: 'Late',
          hex: 'ff6a6a'
        }
      ],
      properties: [],
      JSON: '',
      operator: '<',
      operand: '',
      color: '',
      hex: '98FB98',
      fieldType: 'Choice',
      selectedRule: '',
      colors: {
        'Green': '98FB98',
        'Yellow': 'FFFF66',
        'Orange': 'FFA450',
        'Red': 'FF6A6A',
        'Blue': '5078FF',
        'Purple': 'B350FF',
        'Custom': ''
      },
      propertyChoices: 
        {
            'text-align': {
                'options': 'left,right,center,justify'
            },
            'border': {
                'placeholder': '4px solid black'
            },
            'border-radius': {},
            'font-weight': {
                'options': 'bold, semibold'
            },
            'font-size': {}
        }
    };
  }

  componentDidMount() {
    this.buildJSON();
  }

  newProperty() {
    var arr = this.state.properties.slice();
    arr.push({'property': 'text-align', 'value':''});
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
      properties: arr
    }, () => { this.buildJSON() });

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

    // BUILD JSON HERE in forEach loop for PROPERTIES
    this.state.properties.forEach((ele) => {
      JSON_Properties = JSON_Properties + `
      "` + ele.property + '": "' + ele.value + '",';
    });

    //END TEST

    // JSON Body
    this.state.rules.forEach((ele) => {
      JSON_Body = JSON_Body + `
      {
        "operator": "?",
        "operands": [
        {
            "operator": "` + ele.operator + `",
            "operands": [
                "@currentField",
                ` + (this.state.fieldType !== 'Number' ? `"` + ele.operand + `"` : ele.operand) + `
            ]
        },
        "#` + ele.hex + `", `
    });
    JSON_Body = `
    "background-color":` + JSON_Body;

    // JSON Footer 
    var JSON_Footer_Base = `"#FFFFFF00"`;
    this.state.rules.forEach((ele) => {
      JSON_Footer = JSON_Footer + `
      ]
    }`
    });
    JSON_Footer = JSON_Footer_Base + JSON_Footer + 
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

  render() {
    return (
      <Container className="App" fluid>
        <header>  
          <Jumbotron className='banner' color='red'>
            <h2>SharePoint Helper</h2>
            <p>Used for building conditional formatting JSON - <a target='_blank' href='https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/column-formatting'>Microsoft Docs</a> <br />
            Note: Rules are read from top to bottom.
            </p>
          </Jumbotron>
        </header>

      <Row>
        <Col md='11' lg='10'>
          <Row>
            {Object.keys(this.state.properties).map((key, i) => {
              return (<Property key={i} index={i} name='' value='' propertyChoices={this.state.propertyChoices} updateProperty={this.updateProperty} deleteProperty={this.deleteProperty} />)
            })}
            <br />
          </Row>
          <Row>
            <div className='center-input'>
              <span className='new-property-link remove-text-highlighting' onClick={this.newProperty}>New CSS Property</span>
            </div>
            <div className='center-input'>
              <span className='new-property-link remove-text-highlighting' onClick={this.clearAllProperties}>Clear All Properties</span>
            </div>
           
          </Row>
          <br />

          <Row>
            <Col sm='2'>
              <Label className='label remove-text-highlighting'>Operator</Label>
              <Input className='operator center-input' type='select' name='operator' value={this.state.operator} onChange={this.handleInputChange}>
                <option>&lt;</option>
                <option>&gt;</option>
                <option>==</option>
                <option>!=</option>
                <option>&lt;=</option>
                <option>&gt;=</option>
              </Input>  
            </Col>
            <Col sm='4'>
              <Label className='label remove-text-highlighting'>Operand</Label>
              <Input className='operand center-input' type='text' name='operand' placeholder='Compare to' value={this.state.operand} onChange={this.handleInputChange} />
            </Col>
            <Col sm='3'>
              <Label className='label remove-text-highlighting'>Color</Label>
              <Input className='color center-input' type='select' name='color' value={this.state.color} onChange={this.handleInputChange}>
                {Object.keys(this.state.colors).map((key, i) => {
                  return (<option key={i}>{key}</option>);
                })}

              </Input>  
            </Col>
            <Col sm='3' md='3' lg='3' xl='3'>
              <Label className='label remove-text-highlighting'>Hex Value <a target='_blank' href='https://www.w3schools.com/colors/colors_picker.asp'>(help)</a></Label>
              <Input className='color center-input' type='text'className='text-center' style={{'backgroundColor': '#'+this.state.hex}} name='hex' placeholder='Hex Color' value={this.state.hex} onChange={this.handleInputChange} />
            </Col>
          </Row>
          <br />

          <Row>
            <Col sm='3' md='3' lg='4'>
              <Label className='label remove-text-highlighting'>Field Type</Label>
              <Input className='center-input' type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
                <option>Choice</option>
                <option>Text</option>
                <option>Number</option>
                
              </Input>  
            </Col>
            <Col sm='4' md='4' lg='3'>
              <br />
              <Button className='center-input' size='lg' color={this.state.selectedRule === '' ? 'success' : 'info'} onClick={this.state.selectedRule === '' ? this.newRule : this.editRule}>{this.state.selectedRule === '' ? 'New Rule' : 'Edit Rule'}</Button>
            </Col>
            <Col sm='4' md='4' lg='5'>
              <br />
              <Button className='center-input' size='lg' color='danger' onClick={this.clearRules}>Clear All Rules</Button>
            </Col>
              <Container fluid>
              <Col >
                <Label className='label remove-text-highlighting'>Condtions<br />{this.state.selectedRule === '' ? '(Click to Select)' : '(Click to Deselect)'}</Label>
                <CurrentRules className='center-input' rules={this.state.rules} selectRule={this.selectRule} selectedRule={this.state.selectedRule} />
              </Col>
              <Col>
                <br />
                <Button className='center-input' color='danger' size='lg' style={this.state.selectedRule === '' ? {'visibility': 'hidden'} : {}} onClick={this.deleteRule}>Delete Rule</Button>
              </Col>
            </Container>
          </Row>        
          <br />
        </Col>
        
        
        
      </Row>
      <br />
      <Row> 
          <Col>
            <Input className='output center-input' type='textarea' value={this.state.JSON} />
          </Col>
      </Row>
      </Container>
    );
  }
}

export default App;
