import React, { Component } from 'react';
import Rule from './Rule.jsx';
import { Button } from 'reactstrap';

class CurrentRules extends Component {
    
    render() {
        return (
            <div className='rules-container'>
                {this.props.rules.map((ele, i) => {
                    var text = ele.operator + ' ' + ele.operand;
                    return (<Rule key={i} index={i} hex={ele.hex} text={text} deleteRule={this.props.deleteRule} />
                    )
                })}
                             
                
            </div>
        )
    }

}



export default CurrentRules;