import request from '../../axios';
import { ItemProps } from './type';

const baseUrl = '/sma-adm/api/mgt/ntm/';

export const searchOptInOut = async (params: any) => {
  const res = await request.post<any, any>(
    `${baseUrl}search-opt-in-out`,
    params
  );
  return res.payload;
};

export const editsearchOptInOut = async (params: ItemProps[]) => {
  const res = await request.post<ItemProps[], any>(
    `${baseUrl}edit-opt-in-out`,
    params
  );
  return res.payload;
};
