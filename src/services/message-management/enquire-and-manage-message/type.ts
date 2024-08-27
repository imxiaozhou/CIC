export type SearchManageMessageParams = SearchCommonParams & {
  deliveryStatus: string;
  sentDate: string[];
  classification: string;
  messageSize: string;
  subject: string;
  sender: string;
  recipient: string;
  relatedMessage: string;
};

export interface SearchManageMessageResponse {
  id: string;
  smaMessageId: string;
  cmmpMessageId: string;
  sentDateAndTime: string;
  toS: string;
  ccS: string;
  bccS: string;
  deliveryStatus: string;
  deliveryStatusLabel: string;
  sentDate: string;
  classification: string;
  messageSize: string;
  subject: string;
  sender: string;
  recipient: string;
}

export type DetailManageMessageParams = {
  id: string;
};

export type DetailManageMessageResponse = {
  routingInformation: string;
};
