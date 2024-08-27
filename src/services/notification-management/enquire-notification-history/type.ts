export type NotificationHistoryParams = SearchCommonParams & {
  type: string;
  template: string;
  content: string;
  sender: string;
  sentDateAndTime: string;
  recipient: string;
};

export interface NotificationHistoryResponse {
  key: string;
  type: string;
  template: string;
  content: string;
  sender: string;
  recipient: string;
  sentDateAndTime: string;
}
