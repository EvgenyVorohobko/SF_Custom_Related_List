import { LightningElement, track, api } from 'lwc';
import getRecordValues from "@salesforce/apex/CustomLookupController.getRecordValues";
import { Utils } from 'c/utils';
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
            if (this.items.filter(item => item.id === id)[0] !== undefined) {
                Utils.show('Error', 'You try to choose the same record!', Utils.TYPE.ERROR);
                this.handleReset();
                return;
            }
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
                Utils.show('Error choose record!', error.body.message, Utils.TYPE.ERROR);
            });
        }
    }

    handleReset() {
        this.template.querySelector("c-reusable-custom-lookup").handleReset();
    }
}