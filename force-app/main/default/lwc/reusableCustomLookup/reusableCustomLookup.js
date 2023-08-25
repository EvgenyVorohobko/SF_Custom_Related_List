import { LightningElement, api } from 'lwc';

export default class ReusableCustomLookup extends LightningElement {
    @api objectApiName;
    @api objectLookupField;

    handleChange() {
        //to do something special
    }
}