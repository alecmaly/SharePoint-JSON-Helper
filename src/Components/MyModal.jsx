import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

class MyModal extends Component {
    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen}>
                    <ModalHeader >
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


