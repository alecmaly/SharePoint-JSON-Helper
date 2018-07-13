import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

class CopyModal extends Component {
    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen}>
                    <ModalHeader>
                        JSON has been copied to the clipboard
                    </ModalHeader>
                    <ModalBody>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button className='center-input' type='button' color='info' onClick={this.props.toggleCopyModal}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default CopyModal;


