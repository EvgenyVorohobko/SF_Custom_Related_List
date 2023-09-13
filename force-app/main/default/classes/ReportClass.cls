public with sharing class ReportClass {

    public static void wokrWithRecordReportsClass() {
        String reportName = '<name of the report>';
        Report reportRecord = [SELECT Id FROM Report WHERE Name =: reportName];
        Reports.ReportResults results = Reports.ReportManager.runReport(reportRecord.Id, true);
        //see the key : values for mapping.
        System.debug('results.getFactMap() ' + results.getFactMap());
        Reports.ReportFactWithDetails reportDetails = (Reports.ReportFactWithDetails) results.getFactMap().get('T!T');
        Set<Id> accIds = new Set<Id>();
        for (Reports.ReportDetailRow detailRow : reportDetails.getRows()) {
            //see values to the start element
            System.debug('get(0) ' + detailRow.getDataCells().get(0).getValue());
            for (Reports.ReportDataCell dataCell : detailRow.getDataCells()) {
                //see all values that you need and see all information
                System.debug('cell values ' + dataCell.getValue());
            }
        }
    }
}