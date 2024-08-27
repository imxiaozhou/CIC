export type SearchUserDelegationParams = SearchCommonParams & {
  userTenant?: string;
  userName?: string;
  userEmail?: string;
  delegateUserTenant?: string;
  delegateUserName?: string;
  delegateUserEmail?: string;
  delegateFrom?: string;
  delegateTo?: string;
  delegateStatus?: string;
  delegateDate?: string;
};

export interface SearchUserDelegationResponse {
  id: string;
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

export interface UserDelegationDetailParams {
  id: string;
}

export interface UserDelegationDetailResponse {
  id: string;
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

export type SearchLookupUserParams = SearchCommonParams & {
  userTenant: string;
  userName: string;
  userEmail: string;
};

export interface SearchLookupUserResponse {
  uid: string;
  userName: string;
  userEmail: string;
  userTenant: string;
}

export interface SubmitUserDelegationParams {}

export interface SubmitUserDelegationResponse {}
