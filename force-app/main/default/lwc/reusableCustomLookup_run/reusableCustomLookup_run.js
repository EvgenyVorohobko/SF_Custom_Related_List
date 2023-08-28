import { LightningElement, api } from 'lwc';

export default class ReusableCustomLookup_run extends LightningElement {
    objectApiName = 'Opportunity';
    objectLookupField = 'AccountId';
    field = 'Name';
}