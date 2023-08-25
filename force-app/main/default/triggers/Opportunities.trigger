trigger Opportunities on Opportunity (after insert, after update) {
	switch on Trigger.operationType {
        when AFTER_INSERT, AFTER_UPDATE {
            OpportunitiesTriggerHandler.createRefreshRelatedListPlatformEvents(Trigger.new);
        }
    }
}