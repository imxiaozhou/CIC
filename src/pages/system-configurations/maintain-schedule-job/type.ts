export interface MaintainScheduleJobItem {
  id: string;
  jobName: string;
  jobType: string;
  createDate: string;
  lastExecuteDate: string;
  nextExecuteDate: string;
  jobStatus: string | boolean;
  jobStatusLabel: string;
  atTime: string | null;
  frequency?: string;
  parameters?: string;
  repeatInd?: string;
}

export interface ScheduleJobInterface {
  id?: string; // update
  jobName: string;
  jobType: string | null;
  jobStatus: boolean | string;
  atTime: string | null;
  frequency?: string | null;
  parameters?: string;
  repeatInd?: string;
}

export interface QueryMaintainScheduleJobListProps {
  jobName?: string;
  jobType?: string;
  parameters?: string;
  createDate?: string;
  lastExecuteDate?: string;
  nextExecuteDate?: string;
  jobStatus?: string;
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface RunNowScheduleJobProps {
  jobName: string;
  param: string;
}
