import LightningDatatable from 'lightning/datatable';
import imageColumn from './imageColumn.html';
import uploadColumn from './uploadColumn.html';

export default class Datatable_customDatatable extends LightningDatatable {
    static customTypes = {
        image: {
            template: imageColumn,
            typeAttributes: ['imageUrlValue'],
        },
        fileUpload: {
            template: uploadColumn,
            typeAttributes: ['acceptedFormats'],
        }
    };
}