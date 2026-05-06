export interface PersonExamPaperQuestionVO {
  /**
   * 试卷ID
   */
  paperId: string | number;

  /**
   * 题目ID
   */
  questionId: string | number;

  /**
   * 排序号（题号）
   */
  sortNo: number;

  /**
   * 本题分值
   */
  score: number;

}

export interface PersonExamPaperQuestionForm extends BaseEntity {
  /**
   * 试卷ID
   */
  paperId?: string | number;

  /**
   * 题目ID
   */
  questionId?: string | number;

  /**
   * 排序号（题号）
   */
  sortNo?: number;

  /**
   * 本题分值
   */
  score?: number;

}

export interface PersonExamPaperQuestionQuery extends PageQuery {

  /**
   * 排序号（题号）
   */
  sortNo?: number;

  /**
   * 本题分值
   */
  score?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}



