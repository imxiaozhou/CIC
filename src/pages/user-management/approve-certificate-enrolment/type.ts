export type ApproveUserProtableType = {
  id: string;
  user_id: string;
  expiration?: string;
  certificationType: string;
  certificationStatus: string;
  approvalStatus: string;
  validFrom?: string;
  validTo?: string;
};
export interface IsContentInterface {
  title: string;
  type: 'info' | 'warning';
}
