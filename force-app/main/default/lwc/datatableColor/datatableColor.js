import { LightningElement, track } from 'lwc';

const columns = [
    {label: 'Name', fieldName: 'name', type: 'text'},
    {label: 'Business', fieldName: 'business', type: 'text', cellAttributes: { class: { fieldName: 'businessCSSClass' }}},
    {label: 'Business Name', fieldName: 'bName', type: 'text'},
    {label: 'Label Color', fieldName: 'lColor', type: 'text', cellAttributes: { class: { fieldName: 'lColorCSS' }}},
    {label: 'Working Now', fieldName: 'working', type: 'boolean', cellAttributes: { class: { fieldName: 'workingCSS' }}}
];

export default class DatatableColor extends LightningElement {
    @track data = [];
    columns = columns;

    connectedCallback(){
        const data = [];
        data.push({
            name : 'Anna Jones',
            business : 'Heath Care',
            businessCSSClass : 'slds-text-color_success',
            bName : 'Tooth Brushes',
            lColor : 'Blue',
            lColorCSS : 'slds-icon-custom-9',
            working : true,
            workingCSS : 'slds-icon-custom-8'
        });
        data.push({
            name : 'Big Spender',
            business : 'Goods',
            businessCSSClass : 'slds-text-color_inverse-weak',
            bName : 'H&M',
            lColor : 'Red',
            lColorCSS : 'slds-icon-custom-1',
            working : true,
            workingCSS : 'slds-icon-custom-8'
        });
        data.push({
            name : 'Brad Holmes',
            business : 'Food',
            businessCSSClass : 'slds-text-color_inverse-weak',
            bName : 'Fish and Chips',
            lColor : 'Gold',
            lColorCSS : 'slds-icon-custom-3',
            working : false,
            workingCSS : 'slds-icon-custom-76'
        });
        data.push({
            name : 'John Connor',
            business : 'IT',
            businessCSSClass : 'slds-text-color_error',
            bName : 'SkyNet',
            lColor : 'Orange',
            lColorCSS : 'slds-icon-custom-101',
            working : false,
            workingCSS : 'slds-icon-custom-76'
        });
        this.data = data;
    }
}