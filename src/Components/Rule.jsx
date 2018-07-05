import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Rule extends Component {
    render() {
        return (
            <div name={this.key} onClick={ () => {this.props.deleteRule(this.props.index)}} className='rule' style={{'backgroundColor': '#'+this.props.hex}}>
                {this.props.text}
            </div>
        );
    }
}


export default Rule;