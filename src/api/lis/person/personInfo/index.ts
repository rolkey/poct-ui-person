import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonInfoVO, PersonInfoForm, PersonInfoQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询人员基础信息列表
 * @param query
 * @returns {*}
 */

export const listPersonInfo = (query?: PersonInfoQuery): AxiosPromise<PersonInfoVO[]> => {
  return request({
    url: `/${hisPerson()}/personInfo/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询人员基础信息详细
 * @param personId
 */
export const getPersonInfo = (personId: string | number): AxiosPromise<PersonInfoVO> => {
  return request({
    url: `/${hisPerson()}/personInfo/${personId}`,
    method: "get",
  });
};

/**
 * 新增人员基础信息
 * @param data
 */
export const addPersonInfo = (data: PersonInfoForm) => {
  return request({
    url: `/${hisPerson()}/personInfo`,
    method: "post",
    data: data,
  });
};

/**
 * 修改人员基础信息
 * @param data
 */
export const updatePersonInfo = (data: PersonInfoForm) => {
  return request({
    url: `/${hisPerson()}/personInfo`,
    method: "put",
    data: data,
  });
};

/**
 * 删除人员基础信息
 * @param personId
 */
export const delPersonInfo = (personId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personInfo/${personId}`,
    method: "delete",
  });
};

/**
 * 查询预选人员列表
 * @param query
 */
export const preselectionList = (query?: PageQuery) =>
  request({url: `/${hisPerson()}/personInfo/preselection/list`, method: "get", params: query});

/**
 * 确认预选人员
 * @param personIds
 */
export const confirmPreselection = (personIds: (string | number)[]) =>
  request({url: `/${hisPerson()}/personInfo/preselection/confirm`, method: "put", data: personIds});

/**
 * 驳回预选人员
 * @param personIds
 */
export const rejectPreselection = (personIds: (string | number)[]) =>
  request({url: `/${hisPerson()}/personInfo/preselection/reject`, method: "put", data: personIds});

/**
 * 更新人员状态
 * @param personId
 * @param status
 */
export const updatePersonStatus = (personId: number | string, status: string) =>
  request({url: `/${hisPerson()}/personInfo/${personId}/status?status=${status}`, method: "put"});

/**
 * 导入人员信息
 * @param data
 */
export const importPersonInfo = (data: FormData) =>
  request({url: `/${hisPerson()}/personInfo/import`, method: "post", data, headers: {"Content-Type": "multipart/form-data"}});
