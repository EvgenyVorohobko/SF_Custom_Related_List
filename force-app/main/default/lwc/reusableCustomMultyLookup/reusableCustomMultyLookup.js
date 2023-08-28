import { LightningElement, track, api } from 'lwc';
import getRecordValues from "@salesforce/apex/CustomLookupController.getRecordValues";

export default class ReusableCustomMultyLookup extends LightningElement {
    @api objectApiName;
    @api objectLookupField;
    @api field;
    @track items = [];

    handleItemRemove(event) {
        event.preventDefault();
        const id = event.currentTarget.getAttribute("data-id");
        this.items = this.items.filter(item => item.id !== id);
    }

    handleItemSelect(event) {
        const id = event.detail;
        if (id !== null) {
            getRecordValues({ recordId : id, field: this.field })
            .then(response => {
                const data = response[0];
                this.items.push({
                    label: data[this.field],
                    src: `/${data.Id}`,
                    id: data.Id,
                });
                this.handleReset();
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    handleReset() {
        this.template.querySelector("c-reusable-custom-lookup").handleReset();
    }
}