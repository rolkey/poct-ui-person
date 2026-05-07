export interface PersonAuthorizeFlowVO {
  /**
   * 授权申请类型
   */
  flowId: string;

  /**
   * 授权申请类型
   */
  flowType: string;

  /**
   * 待审核/已通过/已驳回
   */
  flowStatus: string;

  /**
   * 科室主管（第一级审核）
   */
  auditor1: number;

  /**
   * 科室主管审核时间
   */
  auditor1Time: string;

  /**
   * 检验科/质管部门（第二级审核）
   */
  auditor2: number;

  /**
   * 质检部门审核时间
   */
  auditor2Time: string;

  /**
   * 完成时间
   */
  finishTime: string;
}

export interface PersonAuthorizeFlowForm extends BaseEntity {
  /**
   * 授权申请类型
   */
  flowId?: string;

  /**
   * 授权申请类型
   */
  flowType?: string;

  /**
   * 待审核/已通过/已驳回
   */
  flowStatus?: string;

  /**
   * 科室主管（第一级审核）
   */
  auditor1?: number;

  /**
   * 科室主管审核时间
   */
  auditor1Time?: string;

  /**
   * 检验科/质管部门（第二级审核）
   */
  auditor2?: number;

  /**
   * 质检部门审核时间
   */
  auditor2Time?: string;

  /**
   * 完成时间
   */
  finishTime?: string;
}

export interface PersonAuthorizeFlowQuery extends PageQuery {
  /**
   * 授权申请类型
   */
  flowType?: string;

  /**
   * 待审核/已通过/已驳回
   */
  flowStatus?: string;

  /**
   * 科室主管（第一级审核）
   */
  auditor1?: number;

  /**
   * 科室主管审核时间
   */
  auditor1Time?: string;

  /**
   * 检验科/质管部门（第二级审核）
   */
  auditor2?: number;

  /**
   * 质检部门审核时间
   */
  auditor2Time?: string;

  /**
   * 完成时间
   */
  finishTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
