import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

class MyModal extends Component {  
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(key) {
        if (key.keyCode === 13 || key.keyCode === 27) {
            this.props.toggleModal();
        }
    }

    render() {
        return (
            <div onKeyDown={this.handleKeyDown} tabIndex='0'>
                <Modal isOpen={this.props.isOpen}>
                    <ModalHeader>
                        {this.props.modalHeader}
                    </ModalHeader>
                    <ModalBody dangerouslySetInnerHTML={ { __html: this.props.modalBody } } />
                    <ModalFooter>
                        <Button className='modal-ok-button center-input' type='button' color='info' onClick={this.props.toggleModal}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default MyModal;


