import { MessageStorageQuotaItem } from '@/types/business';
import request from '../../axios';
import { SearchOrganizationGroupParams } from './type';
import { AdjustMessageStorageQuotaGroupParams } from '../maintain-group-total-message/type';

const baseUrl = 'sma-adm/api/mgt/sys/';

export const adjustMessageStorageQuotaOrganizationApi = async (
  params: AdjustMessageStorageQuotaGroupParams
) => {
  const res = await request.post<AdjustMessageStorageQuotaGroupParams, any>(
    `${baseUrl}adjust-message-storage-quota-organisation`,
    params
  );
  return res;
};

export const searchOrganizationApi = async (
  params: SearchOrganizationGroupParams
) => {
  const res = await request.post<SearchOrganizationGroupParams, any>(
    `${baseUrl}search-organisation-group`,
    params
  );
  return res.payload;
};

export const organizationMessageStorageQuotaDetailApi = async (
  params: MessageStorageQuotaItem
) => {
  const res = await request.post<MessageStorageQuotaItem, any>(
    `${baseUrl}organisation-message-storage-quota-detail`,
    params
  );
  return res.payload;
};
