export interface UserDelegation {
  id?: string;
  userId: string;
  delegateUserId: string;
  msgBoxId: string;
  effectFrom: string;
  userTenant: string;
  userName: string;
  userEmail: string;
  delegateUserTenant: string;
  delegateUserName: string;
  delegateUserEmail: string;
  delegateFrom: string;
  delegateTo: string;
  delegateStatus: string;
  delegateStatusLabel: string;
  remark: string;
}
