import { LightningElement, api, track } from "lwc";
import findRecords from "@salesforce/apex/CustomMultiLookupFieldsController.findRecords";
import { Utils } from 'c/utils';

export default class CustomLookup_multiFields extends LightningElement {
    @api label = 'Search';
    @api placeholder = 'Search...';
    @api objectApiName;
    @api fields;
    @track items = [];
    @track searchResults;
    @track searchForResponse;
    fieldForSearch;

    connectedCallback() {
        this.fieldForSearch = this.fields !== undefined ? this.fields.split(',')[0] : 'Name';
    }

    handleItemRemove(event) {
        event.preventDefault();
        const id = event.currentTarget.getAttribute("data-id");
        this.items = this.items.filter(item => item.Id !== id);
    }

    handleKeyChange(event) {
        const searchKey = event.target.value;
        if (searchKey.length < 2) {
            this.searchResults = undefined;
            this.searchForResponse = undefined;
            return;
        }
        findRecords({ textSearch : searchKey, objectApiName: this.objectApiName, fields: this.fields })
            .then(response => {
                this.searchResults = response;
                this.searchForResponse = response;
                for (const data of this.searchResults) {
                    data.label = data[this.fieldForSearch];
                    data.src = `/${data.Id}`;
                }
            })
            .catch(error => {
                Utils.show('Error choose record!', error.body.message, Utils.TYPE.ERROR);
            });
    }

    toggleResult() {
        const searchResultsElement = this.template.querySelector('.searchResults');
        if (searchResultsElement === null) {
            this.searchResults = this.searchForResponse;
        } else {
            this.searchResults = undefined;
        }
    }

    selectSearchResult(event) {
        const id = event.currentTarget.getAttribute("data-value");
        const searchElement = this.searchResults.filter(item => item.Id === id);
        if (this.items.filter(item => item.Id === id)[0] !== undefined) {
            Utils.show('Error', 'You try to choose the same record!', Utils.TYPE.ERROR);
        } else {
            this.items.push(searchElement[0]);
            this.handleReset();
        }
    }
}