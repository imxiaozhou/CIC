import request from '../axios';
import { ToggleFavoritesProps, GetFavoritesProps } from './type';

const baseUrl = '/sma-adm/api/mgt/oth/';

export const dashboardApi = async (params = {}) => {
  const res = await request.post(`${baseUrl}get-dashboard-list`, params);
  return res.payload;
};

export const toggleFavoritesApi = async (params: ToggleFavoritesProps) => {
  const res = await request.post<ToggleFavoritesProps, any>(
    `${baseUrl}toggle-favorites`,
    params
  );
  return res;
};
export const getFavoritesApi = async (params: GetFavoritesProps) => {
  const res = await request.post<GetFavoritesProps, any>(
    `${baseUrl}get-favorites`,
    params
  );
  return res.payload;
};
