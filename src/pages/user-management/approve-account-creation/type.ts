export interface UserItem {
  id: string;
  displayName: string;
  emailAddress: string;
  emailGroup: string;
  emailGroupLabel?: string;
  userRole: string[];
  userRoleLabel?: string[];
  tenantName: string;
  tenantNameLabel?: string;
  userStatus: string;
  userStatusLabel?: string;
  accountStatus: string;
  accountStatusLabel?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  faxNumber?: number;
  location?: string;
  position: string;
  rank: number;
  substantiveRank?: string;
  title?: string;
  unit?: string;
  requestBy?: string;
  requestTime?: string;
  approveBy?: string;
  approveTime?: string;
  rejectBy?: string;
  rejectTime?: string;
}

export interface PropsType {
  method: string;
  init?: UserItem;
}

export interface ApproveProps {
  id: string;
  otpType: 'approved' | 'rejected';
}
export interface ApproveAccountDetailParams {
  id: string;
}
