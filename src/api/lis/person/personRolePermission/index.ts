import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  PersonRolePermissionVO,
  PersonRolePermissionForm,
  PersonRolePermissionQuery,
} from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询报告权限管理列表
 * @param query
 * @returns {*}
 */

export const listPersonRolePermission = (
  query?: PersonRolePermissionQuery,
): AxiosPromise<PersonRolePermissionVO[]> => {
  return request({
    url: `/${hisPerson()}/personRolePermission/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询报告权限管理详细
 * @param permId
 */
export const getPersonRolePermission = (
  permId: string | number,
): AxiosPromise<PersonRolePermissionVO> => {
  return request({
    url: `/${hisPerson()}/personRolePermission/${permId}`,
    method: "get",
  });
};

/**
 * 新增报告权限管理
 * @param data
 */
export const addPersonRolePermission = (data: PersonRolePermissionForm) => {
  return request({
    url: `/${hisPerson()}/personRolePermission`,
    method: "post",
    data: data,
  });
};

/**
 * 修改报告权限管理
 * @param data
 */
export const updatePersonRolePermission = (data: PersonRolePermissionForm) => {
  return request({
    url: `/${hisPerson()}/personRolePermission`,
    method: "put",
    data: data,
  });
};

/**
 * 删除报告权限管理
 * @param permId
 */
export const delPersonRolePermission = (permId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personRolePermission/${permId}`,
    method: "delete",
  });
};
