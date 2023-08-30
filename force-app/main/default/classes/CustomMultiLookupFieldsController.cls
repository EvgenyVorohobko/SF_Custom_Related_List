public with sharing class CustomMultiLookupFieldsController {

    @AuraEnabled
    public static List<SObject> findRecords(String textSearch, String objectApiName, String fields) {
        List<SObject> resultValues;
        System.debug('resultValues ' + resultValues);
        System.debug('textSearch ' + textSearch);
        try {
            if (textSearch != null || textSearch != '') {
                System.debug('textSearch ' + textSearch);
                String searchQuery = 'FIND :textSearch IN ALL FIELDS RETURNING ' + objectApiName + '(' + fields + ')';
                System.debug('searchQuery ' + searchQuery);
                List<List<sObject>> searchList = search.query(searchQuery);
                System.debug('searchList ' + searchList);
                resultValues = searchList[0];
                System.debug('resultValues ' + resultValues);
            }
        } catch(Exception exp) {
            System.debug(exp.getMessage());
            System.debug('exp.getMessage() ' + exp.getMessage());
            return null;
        }
        return resultValues;
    }
}