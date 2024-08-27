export interface ISummaryReport {
  key: string;
  date: string;
  tenantName: string;
  msgSent: string;
  msgReceived: string;
  averageSizeOfMsgSent: string;
  averageSizeOfMsgReceived: string;
  totalSizeOfMsgSent: string;
  totalSizeOfMsgReceived: string;
  delegationFrom: string;
  delegationTo: string;
}

export interface SummaryReportExportProps {
  tenantName?: string;
  date?: string[];
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
export interface SummaryReportSearchProps {
  pageNum: number;
  pageSize: number;
  tenantName?: string;
  date?: string[];
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
