import {ShowToastEvent} from "lightning/platformShowToastEvent";

export class Utils {

    static mode = {
        DISMISSABLE: 'dismissable',
        PESTER: 'pester',
        STICKY: 'sticky'
    };

    static TYPE = {
        INFO    : 'info',
        ERROR   : 'error',
        SUCCESS : 'success',
        WARNING : 'warning'
    };

    static show = (title, message, variant, mode) => {
        let modeResult = mode === undefined ? 'dismissable' : mode;
        dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: modeResult
            })
        );
    };
}

export default Utils;