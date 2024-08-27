export interface MessageOperationReportColumns {
  key: string;
  hashKey: string; // 后端数据是联表查询出来的，会存在key值相同的情况，因此后端额外提供hashkey用来做表格的rowkey，以防止前端报错
  date: string;
  displayName: string;
  emailAddress: string;
  tenantName: string;
  emailGroup: string;
  userRole: string;
  userStatus: string;
  userStatusLabel: string;
  dateForm: string;
  dateTo: string;
  accountStatus: string;
  accountStatusLabel: string;
  messageSize: string;
  timeforReceive: string;
  timeforSend: string;
}

export interface MessageOperationReportSearchParams {
  sentDate?: string[];
  emailGroup?: string;
  userRole?: string;
  userStatus?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
export interface MessageOperationReportPrintParams {
  sentDate?: string[];
  emailGroup?: string;
  userRole?: string;
  userStatus?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
