import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonProfileVO } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询人员档案列表
 * @param query
 */
export const listProfile = (query?: any): AxiosPromise<PersonProfileVO[]> => {
  return request({
    url: `/${hisPerson()}/personProfile/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询人员档案详细
 * @param personId
 */
export const getProfile = (personId: number | string): AxiosPromise<PersonProfileVO> => {
  return request({
    url: `/${hisPerson()}/personProfile/${personId}`,
    method: "get",
  });
};
