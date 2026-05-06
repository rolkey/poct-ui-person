export interface PersonExamQuestionVO {
  /**
   * 题目ID
   */
  questionId: string | number;

  /**
   * 单选/多选/判断/操作
   */
  questionType: string;

  /**
   * 题目内容
   */
  content: string;

  /**
   * 选项（JSON格式）
   */
  options: string;

  /**
   * 正确答案
   */
  answer: string;

  /**
   * 难度系数1-5（数值越大越难）
   */
  difficulty: number;

  /**
   * 题目分类（如生化、血气、血糖）
   */
  category: string;

  /**
   * 启用/停用
   */
  status: string;

}

export interface PersonExamQuestionForm extends BaseEntity {
  /**
   * 单选/多选/判断/操作
   */
  questionType?: string;

  /**
   * 题目内容
   */
  content?: string;

  /**
   * 选项（JSON格式）
   */
  options?: string;

  /**
   * 正确答案
   */
  answer?: string;

  /**
   * 难度系数1-5（数值越大越难）
   */
  difficulty?: number;

  /**
   * 题目分类（如生化、血气、血糖）
   */
  category?: string;

  /**
   * 启用/停用
   */
  status?: string;

}

export interface PersonExamQuestionQuery extends PageQuery {

  /**
   * 单选/多选/判断/操作
   */
  questionType?: string;

  /**
   * 题目内容
   */
  content?: string;

  /**
   * 选项（JSON格式）
   */
  options?: string;

  /**
   * 正确答案
   */
  answer?: string;

  /**
   * 难度系数1-5（数值越大越难）
   */
  difficulty?: number;

  /**
   * 题目分类（如生化、血气、血糖）
   */
  category?: string;

  /**
   * 启用/停用
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



