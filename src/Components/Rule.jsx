import React, { Component } from 'react';

class Rule extends Component {

    render() {
        return (
            <div className='rule' name={this.key} onClick={ () => {this.props.selectRule(this.props.index)}} 
            style={ { [this.props.name] : this.props.value, 'borderWidth': (this.props.index === this.props.selectedRule ? '3px' : '0px') }}>
                {this.props.text}
            </div>
        );
    }
}


export default Rule;