import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonAuthorizeFlowVO, PersonAuthorizeFlowForm, PersonAuthorizeFlowQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询授权审批流列表
 * @param query
 * @returns {*}
 */

export const listPersonAuthorizeFlow = (
  query?: PersonAuthorizeFlowQuery,
): AxiosPromise<PersonAuthorizeFlowVO[]> => {
  return request({
    url: `/${hisPerson()}/personAuthorizeFlow/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询授权审批流详细
 * @param flowId
 */
export const getPersonAuthorizeFlow = (
  flowId: string | number,
): AxiosPromise<PersonAuthorizeFlowVO> => {
  return request({
    url: `/${hisPerson()}/personAuthorizeFlow/${flowId}`,
    method: "get",
  });
};

/**
 * 新增授权审批流
 * @param data
 */
export const addPersonAuthorizeFlow = (data: PersonAuthorizeFlowForm) => {
  return request({
    url: `/${hisPerson()}/personAuthorizeFlow`,
    method: "post",
    data: data,
  });
};

/**
 * 修改授权审批流
 * @param data
 */
export const updatePersonAuthorizeFlow = (data: PersonAuthorizeFlowForm) => {
  return request({
    url: `/${hisPerson()}/personAuthorizeFlow`,
    method: "put",
    data: data,
  });
};

/**
 * 删除授权审批流
 * @param flowId
 */
export const delPersonAuthorizeFlow = (flowId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personAuthorizeFlow/${flowId}`,
    method: "delete",
  });
};
