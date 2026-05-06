export interface PersonAuthorizeItemVO {
  /**
   * 授权ID
   */
  authId: string | number;

  /**
   * 目标类型：设备/项目
   */
  targetType: string;

  /**
   * 目标ID（instrument_id或test_item_id）
   */
  targetId: string | number;

}

export interface PersonAuthorizeItemForm extends BaseEntity {
  /**
   * 授权ID
   */
  authId?: string | number;

  /**
   * 目标类型：设备/项目
   */
  targetType?: string;

  /**
   * 目标ID（instrument_id或test_item_id）
   */
  targetId?: string | number;

}

export interface PersonAuthorizeItemQuery extends PageQuery {

  /**
   * 授权ID
   */
  authId?: string | number;

  /**
   * 目标类型：设备/项目
   */
  targetType?: string;

  /**
   * 目标ID（instrument_id或test_item_id）
   */
  targetId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}



