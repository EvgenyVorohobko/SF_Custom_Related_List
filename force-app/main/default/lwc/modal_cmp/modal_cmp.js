import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class Modal_cmp extends LightningModal {
    @api options = [];
    @api titleModal = 'Modal Window';
    @api bodyMessage = 'Body Message';
    @api styleBody;

    handleOptionClick(event) {
        const id = event.currentTarget.getAttribute("data-id");
        const selectEvent = new CustomEvent('modalselect', {
            detail: id
        });
        this.dispatchEvent(selectEvent);
        this.closeModal();
    }

    closeModal() {
        this.close('success');
    }
}