@IsTest
private class CustomRelatedListControllerTest {

    @IsTest
    private static void whenInitDataForCustomRelatedList() {
        Account account = new Account(Name = 'Test Account');
        insert account;

        List<Opportunity> opps = new List<Opportunity>();
        for (Integer i = 0; i < 10; i++) {
            opps.add(new Opportunity(
                AccountId = account.Id,
                CloseDate = Date.today() + i,
                Name = 'Opportunity Name ' + i,
                StageName = 'Qualification'
            ));
        }
        insert opps;

        Map<String, Object> mapStartWorks = new Map<String, Object>();
        mapStartWorks.put('recordId', account.Id);
        mapStartWorks.put('relationObjectName', 'Opportunity');
        mapStartWorks.put('parentObjectName', 'Account');
        mapStartWorks.put('userId', UserInfo.getUserId());
        mapStartWorks.put('numberOfRecords', 6);
        mapStartWorks.put('fieldSetName', 'OppFieldSet');
        mapStartWorks.put('sortedBy', 'Name');
        mapStartWorks.put('sortedDirection', 'asc');
        mapStartWorks.put('isNeedHierarchy', true);

        Test.startTest();
        String resultValues = CustomRelatedListController.initData(JSON.serialize(mapStartWorks));
        Test.stopTest();
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(resultValues);

        System.assertNotEquals(null, responseMap.get('recordValues'));
    }
}