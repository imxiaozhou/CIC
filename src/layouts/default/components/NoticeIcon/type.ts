export type dataItemI = {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: string;
  userName: string;
  email: string;
  tenantName: string;
  position: string;
  notificationTemplateType: notificationTemplateTypeProps;
  notificationType: string;
};

export type isReadProps = 'Y' | 'N';

export type notificationTemplateTypeProps = 'SYSTEM' | 'TENANT';

export type notificationIcon = 'SettingOutlined' | 'LockOutlined';

export interface IconItemsType {
  icon: notificationIcon;
  color: string;
  type: notificationTemplateTypeProps;
  background: string;
}

export const iconItems: IconItemsType[] = [
  {
    icon: 'SettingOutlined',
    color: '#306dcf',
    type: 'SYSTEM',
    background: '#F3F8FF'
  },
  {
    icon: 'LockOutlined',
    color: '#6D5003',
    type: 'TENANT',
    background: '#FFF0B3'
  }
];
