import React, { Component } from 'react';
import Rule from './Rule.jsx';

class CurrentRules extends Component {

    render() {
        return (
            <div className='rules-container'>
                {/* Only check if rules exist, print if they do */}
                {typeof this.props.rules === 'object' && this.props.rules.length > 0 ? this.props.rules.map((ele, i) => {
                    var text = ele.operand + ' ' + ele.operator + ' ' + ele.operand2 + ' (' + ele.value + ')';
                    return (<Rule key={i} index={i} name={this.props.name} value={ele.value} text={text} selectRule={this.props.selectRule} selectedRule={this.props.selectedRule} />
                    )
                }) : ''}
            </div> 
        )
    }
}


export default CurrentRules;