@IsTest
private class CustomMultiLookupFieldsControllerTest {

    @IsTest
    private static void whenFindRecordsOnSOSL() {
        Account account = new Account(Name = 'Test Account');
        insert account;

        Id [] fixedSearchResults= new Id[1];
        fixedSearchResults[0] = account.Id;
        Test.setFixedSearchResults(fixedSearchResults);

        Test.startTest();
        List<SObject> resultValues =
                    CustomMultiLookupFieldsController.findRecords('tes', 'Account', 'Name');
        Test.stopTest();
        System.assertEquals(1, resultValues.size());
    }
}