import { LightningElement, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import Id from '@salesforce/user/Id';
import initDataMethod from "@salesforce/apex/CustomRelatedListController.initData";
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { deleteRecord } from 'lightning/uiRecordApi';
import { Utils } from 'c/utils';
import modal from "c/modal_cmp";
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

export default class RelatedList_custom extends NavigationMixin(LightningElement) {

    @track state = {};
    @api recordId;
    @api objectApiName;
    @api sobjectApiName;
    @api fieldSetName;
    @api numberOfRecords;
    @api sortedBy;
    @api sortedDirection;
    @api fildsMoveFromFormulaToImg;
    @api isNeedHierarchy;
    userId = Id;
    isUserHaveAccess = false;
    open = true;
    titleModal;
    modalQuestion;
    recordForDelete;
    isMoreThanZero = false;
    subscription = {};
    CHANNEL_NAME = '/event/Refresh_Related_List__e';

    connectedCallback() {
        this.init()
        subscribe(this.CHANNEL_NAME, -1, this.refreshList)
            .then(response => {
                this.subscription = response;
            });
            onError(error => {
                console.error('Server Error--->' + error);
            });
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, () => {
            console.log('Unsubscribed Channel');
        });
    }

    refreshList = () => {
        this.init();
    }

    async init() {
        this.state = {};
        this.state.showRelatedList = this.recordId != null;
        if (! (this.recordId
            && this.objectApiName
            && this.sobjectApiName
            && this.fieldSetName)) {
            this.state.records = [];
            return;
        }

        this.state.recordId = this.recordId;
        this.state.relationObjectName = this.sobjectApiName;
        this.state.parentObjectName = this.objectApiName;
        this.state.userId = this.userId;
        this.state.numberOfRecords = this.numberOfRecords;
        this.state.fieldSetName = this.fieldSetName;
        this.state.sortedBy = this.sortedBy;
        this.state.sortedDirection = this.sortedDirection;
        this.state.replaceFieldSetName = this.fildsMoveFromFormulaToImg;
        this.state.isNeedHierarchy = this.isNeedHierarchy;
        const data = await this.fetchData(this.state);
        this.isUserHaveAccess = data !== undefined;

        if (data !== undefined) {
            this.state.replaceApiNames = data.replaceApiNames;
            this.state.columns = this.state.columns === undefined ? this.configureColumns(data.types, data.labels, data.apiNames) : this.state.columns;
            this.state.records = this.state.records === undefined ? this.updateDataDependsOnImage(data.recordValues, data.orgURL) : this.state.records;
            this.state.relatedFieldApiName = data.relatedFieldApiName;
            this.state.iconName = data.iconName;
            this.state.sortedBy = this.sortedBy;
            this.state.sortedDirection = this.sortedDirection;
            this.isMoreThanZero = data.recordValues.length > 0;
            this.state.title = this.sobjectApiName.split('__')[0].split('_').join(' ');
            this.state.titleRelatedList = this.state.title + ' (' + data.recordValues.length + ')';
            this.titleModal = 'Delete ' + this.state.title;
            this.modalQuestion = 'Are you sure you want to delete this ' + this.state.title + '?';
        }
    }

    async fetchData(state) {
        let jsonData = Object.assign({}, state);
        jsonData.numberOfRecords = state.numberOfRecords + 1;
        jsonData = JSON.stringify(jsonData);
        return initDataMethod({ jsonData })
            .then(response => {
                return JSON.parse(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleGotoRelatedList() {
        this[NavigationMixin.Navigate]({
            type: "standard__recordRelationshipPage",
            attributes: {
                recordId: this.state.recordId,
                relationshipApiName: this.state.relatedFieldApiName,
                actionName: "view",
                sobjectApiName: this.sobjectApiName
            }
        });
    }

    configureColumns(types, labels, apiNames) {
        let columns = [];
        columns.push({ label : '', fieldName : 'rowNumber',type : 'number', initialWidth: 20 });
        for (let index = 0; index < types.length; index++) {
            let type = this.configureTypeValues(types[index].toLowerCase());
            let fieldName = apiNames[index];
            let label = labels[index];
            let oneColumn = { label: label, fieldName: fieldName, type: type, sortable: true, title: label, initialWidth: 200, wrapText: true};
            if (this.state.replaceApiNames !== undefined && this.state.replaceApiNames.includes(apiNames[index])) {
                oneColumn.typeAttributes = { imageUrlValue: { fieldName: apiNames[index] }};
                oneColumn.type = 'image';
            }
            columns.push(oneColumn);
        }
        columns.push({ label: 'Upload file', type: 'fileUpload', fieldName: 'Id', title: 'Upload file', initialWidth: 200, wrapText: true,
                        typeAttributes: { acceptedFormats: '.jpg,.jpeg,.pdf,.png' }}
        );
        columns.push({ type: 'action', typeAttributes: { rowActions: actions }});
        return columns;
    }

    configureTypeValues(type) {
        let resultValue;
        switch (type.toLowerCase()) {
            case 'phone':
                resultValue = 'phone';
                break;
            case 'site':
                resultValue = 'url';
                break;
            case 'email':
                resultValue = 'email';
                break;
            case 'currency':
                resultValue = 'currency';
                break;
            case 'date':
                resultValue = 'date';
                break;
            default:
                resultValue = 'text';
        }
        return resultValue;
    }

    hadleSortValues(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.state.records];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.state.records = cloneData;
        this.state.sortedDirection = sortDirection;
        this.state.sortedBy = sortedBy;
    }

    sortBy(field, reverse, primer) {
        const key = primer ?
                function (x) {
                    return primer(x[field]);
                } :
                function (x) {
                    return x[field];
                };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (this.rowActionHandler) {
            this.rowActionHandler.call()
        } else {
            switch (actionName) {
                case "delete":
                    this.handleDeleteRecord(row);
                    break;
                case "edit":
                    this.handleEditRecord(row);
                    break;
                default:
            }
        }
    }

    handleCreateRecord() {
        const defaultValues = encodeDefaultFieldValues({
            OwnerId: this.userId
        });
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: this.sobjectApiName,
                actionName: "new"
            },
            state: {
                count: 2,
                nooverride: 1,
                useRecordTypeCheck: 1,
                navigationLocation: 'RELATED_LIST',
                defaultFieldValues: defaultValues
            }
        });
    }

    handleEditRecord(row) {
        let recordId = row.Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: this.sobjectApiName,
                actionName: 'edit',
            }
        });
    }

    async handleDeleteRecord(row) {
        this.recordForDelete = row.Id;
        const options = [
            { id: '1', label: 'Delete', variant: 'destructive', icon: 'utility:delete', style: 'slds-p-right_x-small' },
            { id: '2', label: 'Cancel', variant: 'brand-outline', style: 'slds-p-right_x-small' }
        ];
        await modal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Pop-up message information',
            options: options,
            titleModal: this.titleModal,
            bodyMessage: this.modalQuestion,
            styleBody: 'font-size:16pt;text-align:center;color:red;',
            onmodalselect: (event) => {
                event.stopPropagation();
                const result = options.filter((option) => event.detail === option.id)[0].label;
                if (result === 'Delete') {
                    this.handleProceedDeleteRecord();
                }
            }
        });
    }

    handleProceedDeleteRecord() {
        deleteRecord(this.recordForDelete)
        .then(() => {
            Utils.show('Success', this.state.title + ' was deleted', Utils.TYPE.SUCCESS);
            this.init();
        })
        .catch(error => {
            Utils.show('Error deleting record', error.body.message, Utils.TYPE.ERROR);
        });
    }

    updateDataDependsOnImage(dataRecords) {
        for (let index = 0; index < dataRecords.length; index++) {
            dataRecords[index].rowNumber = index + 1;
            if (this.state.replaceApiNames === null) {
                continue;
            }
            this.state.replaceApiNames.forEach(apiNameField => {
                if (dataRecords[index][apiNameField] !== null) {
                    let _orgURL = dataRecords[index][apiNameField];
                    let txt = document.createElement("textarea");
                    txt.innerHTML = _orgURL;
                    dataRecords[index][apiNameField] = txt.value;
                }
            });
        }
        return dataRecords;
    }
}