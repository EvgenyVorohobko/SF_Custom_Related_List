import { api, LightningElement } from 'lwc';
import { Utils } from 'c/utils';

export default class Upload_customDatatable extends LightningElement {
    @api recordId;
    @api acceptedFormats;

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        if (uploadedFiles[0]?.documentId !== undefined || uploadedFiles[0]?.documentId !== null) {
            Utils.show('SUCCESS!', 'File has been uploaded', Utils.TYPE.SUCCESS);
        } else {
            Utils.show('ERROR!', 'File has not been uploaded', Utils.TYPE.ERROR);
        }
    }
}