public with sharing class CustomRelatedListController {

    public static final String RELATION_OBJECT_NAME = 'relationObjectName';
    public static final String PARENT_OBJECT_NAME = 'parentObjectName';
    public static final String FIELDSET_NAME = 'fieldSetName';
    public static final String API_NAMES = 'apiNames';
    public static final String FIELD_LABELS = 'labels';
    public static final String TYPE_FIELDS = 'types';
    public static final String NUMBER_OF_RECORDS_PARAM = 'numberOfRecords';
    public static final String RECORD_ID_PARAM = 'recordId';
    public static final String SORTED_BY_PARAM = 'sortedBy';
    public static final String REPLACE_FIELDSET_NAME = 'replaceFieldSetName';
    public static final String IS_NEED_HIERARCHY = 'isNeedHierarchy';

    @AuraEnabled
    public static String initData(String jsonData) {
        Map<String, Object> requestMap = (Map<String, Object>) JSON.deserializeUntyped(jsonData);
        String relationObjectName = (String)requestMap.get(RELATION_OBJECT_NAME);
        String fieldSetName = (String)requestMap.get(FIELDSET_NAME);
        String parentObjectName = (String)requestMap.get(PARENT_OBJECT_NAME);
        Integer numberOfRecords = (Integer)requestMap.get(NUMBER_OF_RECORDS_PARAM);
        String recordId = (String)requestMap.get(RECORD_ID_PARAM);
        String sortedByField = (String)requestMap.get(SORTED_BY_PARAM);
        String userId = (String)requestMap.get('userId');
        String replaceFieldSetName = (String)requestMap.get(REPLACE_FIELDSET_NAME);
        Boolean isNeedHierarchy = requestMap.get(IS_NEED_HIERARCHY) != null ? (Boolean)requestMap.get(IS_NEED_HIERARCHY) : false;

        if (isNeedHierarchy) {
            CustomHierarchyClass hierarchyClass = new CustomHierarchyClass();
            if (!hierarchyClass.checkRoleHierarchy(userId, recordId, parentObjectName)) {
                return null;
            }
        }

        String relatedFieldApiName = getParentRelationshipName(parentObjectName, relationObjectName);
        Map<String, List<String>> allFieldsValues = getFieldsFromFSByObjectName(relationObjectName, fieldSetName);
        List<String> replaceApiNames = replaceFieldSetName != null ? getFieldsFromFSByObjectName(relationObjectName, replaceFieldSetName).get(API_NAMES) : null;
        List<Sobject> resultRecords = getRecords(allFieldsValues.get(API_NAMES), relationObjectName, relatedFieldApiName, numberOfRecords, recordId, sortedByField);

        Map<String, Object> responseMap = new Map<String, Object>();
        responseMap.put('recordValues', resultRecords);
        responseMap.put(API_NAMES, allFieldsValues.get(API_NAMES));
        responseMap.put('relatedFieldApiName', getParentRelationshipName(recordId, relationObjectName, relatedFieldApiName));
        responseMap.put(FIELD_LABELS, allFieldsValues.get(FIELD_LABELS));
        responseMap.put(TYPE_FIELDS, allFieldsValues.get(TYPE_FIELDS));
        responseMap.put('iconName', getIconName(relationObjectName));
        responseMap.put('replaceApiNames', replaceApiNames);
        responseMap.put('orgURL', 'https://' + System.URL.getSalesforceBaseUrl().getHost());
        return JSON.serialize(responseMap);
    }

	private static List<Sobject> getRecords(List<String> fieldsApiNames, String relationObjectName,
                                            String relatedFieldApiName, Integer numberOfRecords,
                                            String recordId, String orderBy
    ) {
        String fields = String.join(fieldsApiNames, ',');

        String query = 'SELECT ' + fields + ' FROM ' + relationObjectName + ' WHERE '
                        + relatedFieldApiName + '= :recordId ORDER BY ' + orderBy + ' LIMIT :numberOfRecords';
                        System.debug(query);
        return Database.query(String.escapeSingleQuotes(query));
	}

    private static String getParentRelationshipName(Id recordId, String childSobjectApiName, String relatedFieldApiName) {
        Schema.DescribeSObjectResult descrRes = recordId.getSObjectType().getDescribe();
        String name;
        for (Schema.ChildRelationship cr: descrRes.getChildRelationships()) {
            if (cr.getChildSObject().getDescribe().getName() == childSobjectApiName
            && cr.getField().getDescribe().getName() == relatedFieldApiName) {
                name = cr.getRelationshipName();
                break;
            }
        }
        return name;
    }

    private static Map<String, List<String>> getFieldsFromFSByObjectName(String objectName, String fieldSetName) {
        Schema.FieldSet inverventionFrameworkOppsFS = Schema.getGlobalDescribe().get(objectName).getDescribe().fieldSets.getMap().get(fieldSetName);
        List<String> fieldsToSelect = new List<String>();
        List<String> apisToSelect = new List<String>();
        List<String> typeToSelect = new List<String>();
        for (Schema.FieldSetMember f : inverventionFrameworkOppsFS.getFields()) {
            fieldsToSelect.add(f.getFieldPath());
            apisToSelect.add(f.getLabel());
            typeToSelect.add(String.valueOf(f.getType()));
        }
        Map<String, List<String>> allFieldsValues = new Map<String, List<String>>();
        allFieldsValues.put(API_NAMES, fieldsToSelect);
        allFieldsValues.put(FIELD_LABELS, apisToSelect);
        allFieldsValues.put(TYPE_FIELDS, typeToSelect);

        return allFieldsValues;
    }

    private static String getParentRelationshipName(String childSobjectApiName, String relatedFieldApiName) {
        String relationFieldName;
        for (ChildRelationship rel: Schema.getGlobalDescribe().get(childSobjectApiName).getDescribe().getChildRelationships()) {
            if (rel.getChildSObject() == Schema.getGlobalDescribe().get(relatedFieldApiName)) {
                relationFieldName = String.valueOf(rel.getField());
                break;
            }
        }
        return relationFieldName;
    }

    private static String getIconName(String sobjectApiName) {
        String iconName = 'standard:all';
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.DescribeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for(Schema.DescribeTabSetResult tsr : tabSetDesc) {
            tabDesc.addAll(tsr.getTabs());
        }

        for (Schema.DescribeTabResult tr : tabDesc) {
            if (sobjectApiName == tr.getSobjectName()) {
                if (tr.isCustom()) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    iconName = 'standard:' + sobjectApiName.toLowerCase();
                }
            }
        }

        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml') {
                iconName = 'custom:' + ir.getUrl().substringBetween('custom/','.svg').substringBefore('_');
                break;
            }
        }

        return iconName;
    }

    public without sharing class CustomHierarchyClass {

        public Boolean checkRoleHierarchy(String userId, String recordId, String parentObjectName) {
            Boolean isRoleMoreHigher = false;
            String query = 'SELECT OwnerId, Owner.UserRoleId FROM ' + parentObjectName + ' WHERE Id =: recordId';
            String ownerUserId = String.valueOf(Database.query(String.escapeSingleQuotes(query))[0].get('OwnerId'));

            if (ownerUserId == UserInfo.getUserId()) {
                isRoleMoreHigher = true;
            } else {
                Id roleId = [SELECT UserRoleId FROM User WHERE Id =: userId].UserRoleId;
                Set<Id> allSubRoleIds = getAllSubRoleIds(new Set<Id>{roleId});
                User userSubordinate = [SELECT Id, Name From User WHERE UserRoleId IN :allSubRoleIds AND IsActive = true AND Id =: ownerUserId];
                if (userSubordinate != null) {
                    isRoleMoreHigher = true;
                }
            }
            return isRoleMoreHigher;
        }

        private Set<ID> getAllSubRoleIds(Set<ID> roleIds) {
            Set<ID> currentRoleIds = new Set<ID>{};
            for (UserRole userRole :[SELECT Id FROM UserRole WHERE ParentRoleId IN :roleIds AND ParentRoleID != null]) {
                currentRoleIds.add(userRole.Id);
            }

            if (currentRoleIds.size() > 0) {
                currentRoleIds.addAll(getAllSubRoleIds(currentRoleIds));
            }
            return currentRoleIds;
        }
    }
}