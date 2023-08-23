import { LightningElement } from 'lwc';
import modal from "c/modal_cmp";

export default class Modal_cmp_run extends LightningElement {
    async handleClick() {
        await modal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Pop-up message information',
            options: [
                { id: 1, label: 'Delete', variant: 'destructive', icon: 'utility:delete', style: 'slds-p-right_x-small' },
                { id: 2, label: 'Download', variant: 'brand', icon: 'utility:download', style: 'slds-p-right_x-small' },
                { id: 3, label: 'Option 2' },
            ],
            titleModal: 'Pop-up message! Important Information',
            bodyMessage: 'Important Information',
            styleBody: 'font-size:16pt;text-align:center;color:red;',
            onmodalselect: (event) => {
                event.stopPropagation();
                this.handleSelectEvent(event.detail);
            }
        });
    }

    handleSelectEvent(detail) {
        const uniq = detail;
        console.log(`select event fired elem with id ${uniq}`);
    }
}