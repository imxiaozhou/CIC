export type JobHistoryParams = SearchCommonParams & {
  jobName: string;
  jobType: string;
  jobStatus: string;
  jobTime: string[];
  parameters: string;
};

export interface JobHistoryResponse {
  id: string;
  jobName: string;
  jobType: string;
  jobTypeLabel: string;
  startTime: string;
  completeTime: string;
  jobStatus: string;
  jobStatusLabel: string;
  parameters: string;
}
