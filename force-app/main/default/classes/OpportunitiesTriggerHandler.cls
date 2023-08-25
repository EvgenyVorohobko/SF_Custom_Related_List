public with sharing class OpportunitiesTriggerHandler {

	public static void createRefreshRelatedListPlatformEvents(List<Opportunity> newOpportunities) {
        List<Refresh_Related_List__e> refreshRecordEventList = new List<Refresh_Related_List__e>();
        try {
			if (newOpportunities <> null || !newOpportunities.isEmpty()) {
				for (Opportunity opp : newOpportunities) {
					refreshRecordEventList.add(new Refresh_Related_List__e(
						Record_Id__c = opp.Id
					));
				}
			}

            if (refreshRecordEventList <> null && !refreshRecordEventList.isEmpty()) {
				EventBus.publish(refreshRecordEventList);
			}
        } catch(Exception e) {
            System.debug('Exception during publishing of refresh platform events-->' + e.getMessage());
        }
    }
}