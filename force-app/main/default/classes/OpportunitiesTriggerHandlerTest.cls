@IsTest
private class OpportunitiesTriggerHandlerTest {

	@IsTest
    private static void whenRefreshRelatedList() {
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
		Test.getEventBus().deliver();
		EventBusSubscriber[] subscribers = [
			SELECT Name, Type, Position, Retries, LastError
            FROM EventBusSubscriber WHERE Topic = 'Refresh_Related_List__e'
		];

		for (EventBusSubscriber sub : subscribers) {
			System.assertNotEquals(sub, null);
		}
		Test.getEventBus().deliver();
		Test.stopTest();
    }
}