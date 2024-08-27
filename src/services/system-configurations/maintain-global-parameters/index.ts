import { UpdateGlobalParameterProps } from '@/pages/system-configurations/maintain-global-parameters/type';
import request from '@/services/axios';

const baseUrl = '/sma-adm/api/mgt/sys/';

export const getGlobalParameters = async (params: any) => {
  const res = await request.post(`${baseUrl}getGlobalParameters`, params);
  return res;
};

export const updateMaintainGlobalParameters = async (
  params: UpdateGlobalParameterProps
) => {
  const res = await request.post<UpdateGlobalParameterProps, any>(
    `${baseUrl}update-maintain-global-parameters`,
    params
  );
  return res;
};
