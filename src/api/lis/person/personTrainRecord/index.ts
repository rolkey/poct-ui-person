import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonTrainRecordVO, PersonTrainRecordForm, PersonTrainRecordQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询培训记录列表
 * @param query
 * @returns {*}
 */

export const listPersonTrainRecord = (
  query?: PersonTrainRecordQuery,
): AxiosPromise<PersonTrainRecordVO[]> => {
  return request({
    url: `/${hisPerson()}/personTrainRecord/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询培训记录详细
 * @param recordId
 */
export const getPersonTrainRecord = (
  recordId: string | number,
): AxiosPromise<PersonTrainRecordVO> => {
  return request({
    url: `/${hisPerson()}/personTrainRecord/${recordId}`,
    method: "get",
  });
};

/**
 * 新增培训记录
 * @param data
 */
export const addPersonTrainRecord = (data: PersonTrainRecordForm) => {
  return request({
    url: `/${hisPerson()}/personTrainRecord`,
    method: "post",
    data: data,
  });
};

/**
 * 修改培训记录
 * @param data
 */
export const updatePersonTrainRecord = (data: PersonTrainRecordForm) => {
  return request({
    url: `/${hisPerson()}/personTrainRecord`,
    method: "put",
    data: data,
  });
};

/**
 * 删除培训记录
 * @param recordId
 */
export const delPersonTrainRecord = (recordId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personTrainRecord/${recordId}`,
    method: "delete",
  });
};

/**
 * 培训签到
 * @param personId
 * @param planId
 */
export const signIn = (personId: number | string, planId: number | string) =>
  request({url: `/${hisPerson()}/personTrainRecord/sign`, method: "post", params: {personId, planId}});
