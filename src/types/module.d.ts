import modal from "@/plugins/modal";
import tab from "@/plugins/tab";
import type { AxiosResponse } from "axios";
import download from "@/plugins/download";
import auth from "@/plugins/auth";
import cache from "@/plugins/cache";
import animate from "@/animate";
import { useDict } from "@/utils/dict";
import {
  handleTree,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  parseTime,
} from "@/utils/ruoyi";
import { getConfigKey, updateConfigByKey } from "@/api/system/config";
import { download as rd } from "@/utils/request";
import type { LanguageType } from "@/lang";
import type { ComponentInternalInstance } from "vue";

export {};

declare module "vue" {
  interface ComponentCustomProperties {
    $modal: typeof modal;
    $download: typeof download;
    animate: typeof animate;
    download: typeof rd;
  }

  interface ComponentInternalInstance {
    $modal: typeof modal;
    $download: typeof download;
    animate: typeof animate;
    download: typeof rd;
  }
}

export type ObjKeysToUnion<T, P extends string = ""> = T extends object
  ? {
      [K in keyof T]: ObjKeysToUnion<T[K], P extends "" ? `${K & string}` : `${P}.${K & string}`>;
    }[keyof T]
  : P;
