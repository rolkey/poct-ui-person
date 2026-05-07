export interface PersonRolePermissionVO {
  /**
   * 操作权限集合，多选逗号分隔
   */
  permId: string;

  /**
   * 操作权限集合，多选逗号分隔
   */
  operPerm: string;

  /**
   * 数据权限：本科室/全院
   */
  dataScope: string;

  /**
   * 生效日期
   */
  startDate: string;

  /**
   * 失效日期
   */
  endDate: string;

  /**
   * 有效/已失效
   */
  permStatus: string;
}

export interface PersonRolePermissionForm extends BaseEntity {
  /**
   * 操作权限集合，多选逗号分隔
   */
  permId?: string;

  /**
   * 操作权限集合，多选逗号分隔
   */
  operPerm?: string;

  /**
   * 数据权限：本科室/全院
   */
  dataScope?: string;

  /**
   * 生效日期
   */
  startDate?: string;

  /**
   * 失效日期
   */
  endDate?: string;

  /**
   * 有效/已失效
   */
  permStatus?: string;
}

export interface PersonRolePermissionQuery extends PageQuery {
  /**
   * 操作权限集合，多选逗号分隔
   */
  operPerm?: string;

  /**
   * 数据权限：本科室/全院
   */
  dataScope?: string;

  /**
   * 生效日期
   */
  startDate?: string;

  /**
   * 失效日期
   */
  endDate?: string;

  /**
   * 有效/已失效
   */
  permStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
