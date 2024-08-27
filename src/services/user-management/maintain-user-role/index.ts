import request from '../../axios';
import { SaveFunctionRole, SearchUserRoleParams } from './type';

/**
 * 获取租户名称
 */
export const getTenantNameApi = () => request.get('/getTenantName');

/**
 * 查询用户角色
 */
export const searchUserRoleApi = async (params: SearchUserRoleParams) => {
  const res = await request.post<SearchUserRoleParams, any>(
    '/sma-adm/api/mgt/usr/search-user-role',
    params
  );
  return res.payload;
};

/**
 * 保存功能角色
 */
export const saveFunctionRoleApi = async (params: SaveFunctionRole[]) => {
  const res = await request.post<SaveFunctionRole[], any>(
    '/sma-adm/api/mgt/usr/save-function-role',
    params
  );
  return res;
};
