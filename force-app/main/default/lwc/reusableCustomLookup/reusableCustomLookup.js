import { LightningElement, api } from 'lwc';

export default class ReusableCustomLookup extends LightningElement {
    @api objectApiName;
    @api objectLookupField;

    handleChange(event) {
        //to do something special

        // worked with MultyLookup
        const id = event.detail.value[0];
        const selectEvent = new CustomEvent('select', {
            detail: id
        });
        this.dispatchEvent(selectEvent);
    }

    @api handleReset() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach((field) => {
                field.reset();
            });
        }
    }
}