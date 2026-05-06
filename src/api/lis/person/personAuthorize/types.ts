export interface PersonAuthorizeVO {
  /**
   * 授权类型：操作授权/报告权限/质控权限/管理权限
   */
  authType: string;

  /**
   * 授权开始日期
   */
  startDate: string;

  /**
   * 授权结束日期（自动到期停权）
   */
  endDate: string;

  /**
   * 有效/已过期/已撤销
   */
  authStatus: string;

  /**
   * 审批人
   */
  approveBy: number;

  /**
   * 审批时间
   */
  approveTime: string;

  /**
   * 备注（临时授权说明等）
   */
  remark: string;

}

export interface PersonAuthorizeForm extends BaseEntity {
  /**
   * 授权类型：操作授权/报告权限/质控权限/管理权限
   */
  authType?: string;

  /**
   * 授权开始日期
   */
  startDate?: string;

  /**
   * 授权结束日期（自动到期停权）
   */
  endDate?: string;

  /**
   * 有效/已过期/已撤销
   */
  authStatus?: string;

  /**
   * 审批人
   */
  approveBy?: number;

  /**
   * 审批时间
   */
  approveTime?: string;

  /**
   * 备注（临时授权说明等）
   */
  remark?: string;

}

export interface PersonAuthorizeQuery extends PageQuery {

  /**
   * 授权类型：操作授权/报告权限/质控权限/管理权限
   */
  authType?: string;

  /**
   * 授权开始日期
   */
  startDate?: string;

  /**
   * 授权结束日期（自动到期停权）
   */
  endDate?: string;

  /**
   * 有效/已过期/已撤销
   */
  authStatus?: string;

  /**
   * 审批人
   */
  approveBy?: number;

  /**
   * 审批时间
   */
  approveTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



