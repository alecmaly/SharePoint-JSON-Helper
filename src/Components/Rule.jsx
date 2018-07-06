import React, { Component } from 'react';

class Rule extends Component {
    render() {
        return (
            <div className='rule' name={this.key} onClick={ () => {this.props.selectRule(this.props.index)}} 
            style={ {'backgroundColor': '#'+this.props.hex, 'borderWidth': (this.props.index === this.props.selectedRule ? '3px' : '0px') }}>
                {this.props.text}
            </div>
        );
    }
}


export default Rule;