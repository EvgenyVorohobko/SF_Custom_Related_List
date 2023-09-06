public with sharing class CustomMultiLookupFieldsController {

    @AuraEnabled
    public static List<SObject> findRecords(String textSearch, String objectApiName, String fields) {
        List<SObject> resultValues;
        try {
            if (textSearch != null || textSearch != '') {
                String searchQuery = 'FIND :textSearch IN ALL FIELDS RETURNING ' + objectApiName + '(' + fields + ')';
                List<List<sObject>> searchList = search.query(searchQuery);
                resultValues = searchList[0];
            }
        } catch(Exception exp) {
            return null;
        }
        return resultValues;
    }
}