export interface UserReportItem {
  reportId: string;
  reportName: string;
  user: string;
  displayName: string;
  emailAddress: string;
  emailGroup: string;
  userRole: string;
  userRoleLabel: string;
  lastLogOnTime: string;
  tenantName: string;
  SMAUser: string;
  userStatus: string;
  userStatusLabel: string;
  accountStatus: string;
  accountStatusLabel: string;
}

export interface UserReportPrintProps {
  tenantName?: string;
  userStatus?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
export interface UserReportSearchProps {
  pageNum: number;
  pageSize: number;
  tenantName?: string;
  userStatus?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}
