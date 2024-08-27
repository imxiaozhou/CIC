export interface SearchNotificationTemplateParams {
  pageNum: number;
  pageSize: number;
  type?: string;
  templateName?: string;
  associatedTenant?: string;
  sortField?: string;
  sortOrder: string;
}
export interface AddNotificationTemplateParams {
  id?: string;
  type: string;
  templateName: string;
  associatedTenant: string;
  content: string;
}

export interface IsUniqueTemplateNameParams {
  templateName: string;
}
