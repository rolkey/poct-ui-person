import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  PersonRolePermissionVO,
  PersonRolePermissionForm,
  PersonRolePermissionQuery,
} from "./types";

/**
 * 查询报告权限管理列表
 * @param query
 * @returns {*}
 */

export const listPersonRolePermission = (
  query?: PersonRolePermissionQuery,
): AxiosPromise<PersonRolePermissionVO[]> => {
  return request({
    url: "/his/personRolePermission/list",
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
    url: "/his/personRolePermission/" + permId,
    method: "get",
  });
};

/**
 * 新增报告权限管理
 * @param data
 */
export const addPersonRolePermission = (data: PersonRolePermissionForm) => {
  return request({
    url: "/his/personRolePermission",
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
    url: "/his/personRolePermission",
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
    url: "/his/personRolePermission/" + permId,
    method: "delete",
  });
};
