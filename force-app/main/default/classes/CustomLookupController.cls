public with sharing class CustomLookupController {

    @AuraEnabled
    public static List<sObject> getRecordValues(String recordId, String field) {
        try {
            String sObjName = Id.valueOf(recordId).getSObjectType().getDescribe().getName();
            String query = 'SELECT ' + field + ' FROM ' + sObjName + ' WHERE Id = :recordId';
            System.debug(Database.query(String.escapeSingleQuotes(query)));
            return Database.query(String.escapeSingleQuotes(query));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}