import React, { Component } from 'react';

import './App.css';
import CurrentRules from './Components/CurrentRules.jsx'

import { 
  Container,
  Jumbotron,
  Row,
  Col,
  Button,
  Input,
  Form,
  FormGroup,
  Label
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.addRule = this.addRule.bind(this);
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
      JSON: '',
      operator: '<',
      operand: '',
      color: '',
      hex: '98FB98',
      fieldType: 'Choice',
      colors: {
        'Green': '98FB98',
        'Yellow': 'FFFF66',
        'Orange': 'FFA450',
        'Red': 'FF6A6A',
        'Blue': '5078FF',
        'Purple': 'B350FF',
        'Custom': ''
      }
    };
  }

  componentDidMount() {
    this.buildJSON();
  }

  addRule() {
    var arr = this.state.rules.slice();
    arr.push({operator: this.state.operator, operand: this.state.operand, hex: this.state.hex});
    this.setState({
      rules: arr
    }, () => this.buildJSON() );    
  }

  deleteRule(index) {
    var arr = this.state.rules;
    var deleted_Hex = arr[index].hex;
    delete arr[index];
    this.setState({
      rules: arr,
      color: 'Custom',
      hex: deleted_Hex
    }, () => this.buildJSON() );
  }
  
  clearRules() {
    this.setState({
      rules: []
    }, () => this.buildJSON() );
  }

  buildJSON() {
    var JSON_Body = ``;
    var JSON_Header = 
    `{
      "elmType": "div",
      "txtContent": "@currentField",
      "style": {
        "background-color":`;
    var JSON_Footer = ``;

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
                ` + (this.state.fieldType != 'Number' ? `"` + ele.operand + `"` : ele.operand) + `
            ]
        },
        "#` + ele.hex + `", `
    });

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
      JSON: JSON_Header + JSON_Body + JSON_Footer
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
          if (value != 'Custom') {
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
        <Col md='9' lg='6'>
          <Row>
            <Col sm='2'>
              <Label>Operator:</Label>
              <Input className='operator' type='select' name='operator' value={this.state.operator} onChange={this.handleInputChange}>
                <option>&lt;</option>
                <option>&gt;</option>
                <option>==</option>
                <option>!=</option>
                <option>&lt;=</option>
                <option>&gt;=</option>
              </Input>  
            </Col>
            <Col sm='4'>
              <Label>Operand:</Label>
              <Input className='operand' type='text' name='operand' placeholder='Compare to' value={this.state.operand} onChange={this.handleInputChange} />
            </Col>
            <Col sm='3'>
              <Label>Color:</Label>
              <Input className='color' type='select' name='color' value={this.state.color} onChange={this.handleInputChange}>
                {Object.keys(this.state.colors).map((key, i) => {
                  return (<option key={i}>{key}</option>);
                })}

              </Input>  
            </Col>
            <Col sm='3' md='3' lg='3' xl='2'>
              <Label>&nbsp;</Label>
              <Input className='color' type='text'className='text-center' style={{'backgroundColor': '#'+this.state.hex}} name='hex' placeholder='Hex Color' value={this.state.hex} onChange={this.handleInputChange} />
            </Col>
          </Row>
          <br />

          <Row>
            <Col sm='3'>
              <Label>Field Type:</Label>
              <Input type='select' name='fieldType' value={this.state.fieldType} onChange={this.handleInputChange}>
                <option>Choice</option>
                <option>Text</option>
                <option>Number</option>
                
              </Input>  
            </Col>
            <Col sm='2' md='3' lg='3'>
              <br />
              <Button size='lg' color='info' onClick={this.addRule}>Add Rule</Button>
            </Col>
            <Col sm='2' md='3' lg='3'>
              <br />
              <Button size='lg' color='danger' onClick={this.clearRules}>Clear All</Button>
            </Col>
          </Row>        
        

        </Col>
        <Col sm='3'>
            <Label>Rules (Click to Delete):</Label>
            <CurrentRules rules={this.state.rules} deleteRule={this.deleteRule} />
        </Col>
        
      </Row>
      <br />
      <Row> 
          <Input className='output' type='textarea' value={this.state.JSON} />
      </Row>

      </Container>
    );
  }
}

export default App;
