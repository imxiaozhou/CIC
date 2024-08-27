export interface SearchUserRoleParams {
  tenantName?: string;
  userRoleID: string;
}

export interface FunctionItem {
  screenId: string;
  functionName: string;
  recommendedRole: any;
}

export interface SaveFunctionRole {
  type: 'assignableFunction' | 'assignedFunction';
  data: FunctionItem[];
}
