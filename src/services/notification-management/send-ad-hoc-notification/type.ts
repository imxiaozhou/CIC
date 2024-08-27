export interface SendAdHocNotificationProps {
  ntfcRcptId: string[];
  ntfcType: string;
  ntfcTmplId?: number;
  ntfcContent: string;
  sendImmdtInd: string;
  schdSendDt: string;
  ntfcSenderId: string;
}
