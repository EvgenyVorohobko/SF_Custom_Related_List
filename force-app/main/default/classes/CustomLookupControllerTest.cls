@IsTest
private class CustomLookupControllerTest {

    @IsTest
    private static void makeData() {
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

        Test.startTest();
        List<Account> resultValues = (List<Account>) CustomLookupController.getRecordValues(account.Id, 'Name');
        Test.stopTest();
        System.assertEquals('Test Account', resultValues[0].Name);
    }
}