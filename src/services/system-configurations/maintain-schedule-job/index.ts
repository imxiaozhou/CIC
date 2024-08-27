import {
  QueryMaintainScheduleJobListProps,
  ScheduleJobInterface,
  RunNowScheduleJobProps
} from '@/pages/system-configurations/maintain-schedule-job/type';
import request from '../../axios';

const baseUrl = 'sma-adm/api/mgt/sys/';

export const getMaintainScheduleJobListApi = async (
  params: QueryMaintainScheduleJobListProps
) => {
  const res = await request.post<QueryMaintainScheduleJobListProps, any>(
    `${baseUrl}get-maintain-schedule-job-list`,
    params
  );
  return res.payload;
};

export const addOrUpdateScheduleJobApi = async (
  params: ScheduleJobInterface
) => {
  const res = await request.post<ScheduleJobInterface, any>(
    `${baseUrl}add-or-update-schedule-job`,
    params
  );
  return res;
};

export const removeScheduleJobApi = async (params: { id: string }) => {
  const res = await request.post<{ id: string }, any>(
    `${baseUrl}remove-schedule-job`,
    params
  );
  return res;
};

export const runNowScheduleJobApi = async ({
  jobName,
  param
}: RunNowScheduleJobProps) => {
  const res = await request.post<RunNowScheduleJobProps, any>(
    `${baseUrl}jobs/startJob`,
    {
      jobName,
      param
    }
  );
  return res;
};
