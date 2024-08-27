export type NotificationsListParams = {
  userId?: string;
  uid?: string;
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
};

export interface NotificationsListResponse {
  id: string;
  notificationType: string;
  title: string;
  content: string;
  date: string;
  isRead: string;
  userName: string;
  email: string;
  tenantName: string;
  position: string;
  notificationTemplateType: 'SYSTEM' | 'TENANT';
}

export interface NotificationsIsReadParams {
  userId?: string;
  ids: string[];
  isRead: string;
}
