export interface UserItem {
  userId: string;
  displayName: string;
  emailAddress: string;
  tenantName: string;
  userRole: string;
}

export interface PropsType {
  method: string;
  init?: UserItem;
}

export interface UserInfo {
  id: string;
  displayName: string;
  emailAddress: string;
  tenantName: string;
  tenantNameLabel: string;
  userRole: string;
  userRoleLabel: string[];
}

export interface INotificationForm {
  selectedUsers: LabelValue[];
  sendType: string;
  notificationTemplate: string;
  notificationContent: string;
  sendImmediately: boolean;
  sendDate: string;
  sendTime: string | null;
}
export interface INotificationSendForm {
  selectedUsers: string[];
  sendType: string;
  notificationTemplate: string;
  notificationContent: string;
  sendImmediately: string[];
  sendDate: string;
  sendTime: string;
}
export interface TemplateItems {
  ntfcTmplId: string;
  tmplType: string;
  tntId: null;
  tmplName: string;
  tmplContent: string;
  tmplStatus: string;
}
export interface FormatTemplateItem {
  value: string;
  label: string;
  tmplContent: string;
}

export interface SearchUserForAdHocParams {
  displayName?: string;
  emailAddress?: string;
  tenantName?: string;
  userRole?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
}
