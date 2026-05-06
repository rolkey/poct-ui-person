import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonTrainPlanVO, PersonTrainPlanForm, PersonTrainPlanQuery } from "./types";

/**
 * 查询培训计划列表
 * @param query
 * @returns {*}
 */

export const listPersonTrainPlan = (
  query?: PersonTrainPlanQuery,
): AxiosPromise<PersonTrainPlanVO[]> => {
  return request({
    url: "/his/personTrainPlan/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询培训计划详细
 * @param planId
 */
export const getPersonTrainPlan = (planId: string | number): AxiosPromise<PersonTrainPlanVO> => {
  return request({
    url: "/his/personTrainPlan/" + planId,
    method: "get",
  });
};

/**
 * 新增培训计划
 * @param data
 */
export const addPersonTrainPlan = (data: PersonTrainPlanForm) => {
  return request({
    url: "/his/personTrainPlan",
    method: "post",
    data: data,
  });
};

/**
 * 修改培训计划
 * @param data
 */
export const updatePersonTrainPlan = (data: PersonTrainPlanForm) => {
  return request({
    url: "/his/personTrainPlan",
    method: "put",
    data: data,
  });
};

/**
 * 删除培训计划
 * @param planId
 */
export const delPersonTrainPlan = (planId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personTrainPlan/" + planId,
    method: "delete",
  });
};
