<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="选项" prop="options">
              <el-input
                v-model="queryParams.options"
                placeholder="请输入选项"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="正确答案" prop="answer">
              <el-input
                v-model="queryParams.answer"
                placeholder="请输入正确答案"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="难度系数1-5" prop="difficulty">
              <el-input
                v-model="queryParams.difficulty"
                placeholder="请输入难度系数1-5"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="题目分类" prop="category">
              <el-input
                v-model="queryParams.category"
                placeholder="请输入题目分类"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="flex flex-col flex-1 table-card">
      <template #header>
        <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['his:personExamQuestion:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['his:personExamQuestion:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['his:personExamQuestion:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personExamQuestion:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="personExamQuestionList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="题目ID" align="center" prop="questionId" v-if="true" />
          <el-table-column label="单选/多选/判断/操作" align="center" prop="questionType" />
          <el-table-column label="题目内容" align="center" prop="content" />
          <el-table-column label="选项" align="center" prop="options" />
          <el-table-column label="正确答案" align="center" prop="answer" />
          <el-table-column label="难度系数1-5" align="center" prop="difficulty" />
          <el-table-column label="题目分类" align="center" prop="category" />
          <el-table-column label="启用/停用" align="center" prop="status" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['his:personExamQuestion:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personExamQuestion:remove']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        ref="paginationRef"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改题库对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personExamQuestionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题目内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="选项" prop="options">
          <el-input v-model="form.options" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="正确答案" prop="answer">
          <el-input v-model="form.answer" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="难度系数1-5" prop="difficulty">
          <el-input v-model="form.difficulty" placeholder="请输入难度系数1-5" />
        </el-form-item>
        <el-form-item label="题目分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入题目分类" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PersonExamQuestion" lang="ts">
import {
  listPersonExamQuestion,
  getPersonExamQuestion,
  delPersonExamQuestion,
  addPersonExamQuestion,
  updatePersonExamQuestion,
} from "@/api/lis/person/personExamQuestion";
import {
  PersonExamQuestionVO,
  PersonExamQuestionQuery,
  PersonExamQuestionForm,
} from "@/api/lis/person/personExamQuestion/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personExamQuestionList = ref<PersonExamQuestionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personExamQuestionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonExamQuestionForm = {
  questionType: undefined,
  content: undefined,
  options: undefined,
  answer: undefined,
  difficulty: undefined,
  category: undefined,
  status: undefined,
};
const data = reactive<PageData<PersonExamQuestionForm, PersonExamQuestionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    questionType: undefined,
    content: undefined,
    options: undefined,
    answer: undefined,
    difficulty: undefined,
    category: undefined,
    status: undefined,
    params: {},
  },
  rules: {
    questionType: [{ required: true, message: "单选/多选/判断/操作不能为空", trigger: "change" }],
    content: [{ required: true, message: "题目内容不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询题库列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonExamQuestion(queryParams.value);
  personExamQuestionList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
// 计算高度
const tableHeight = ref("500px"); // 使用 ref 而非 computed

const updateHeight = () => {
  setTimeout(() => {
    if (tableWrapperRef.value) {
      const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
      const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
      const tabHeightCale =
        tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
      console.log(
        "tabHeightCale",
        tabHeightCale,
        "pageinationHeight",
        pageinationHeight,
        "editButtonsHeight",
        editButtonsHeight,
      );
      if (tabHeightCale > 500) {
        queryParams.value.pageSize = 20;
      } else if (tabHeightCale < 500) {
        queryParams.value.pageSize = 10;
      }
      tableHeight.value = tabHeightCale + "px";
    }
  }, 150);
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  personExamQuestionFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonExamQuestionVO[]) => {
  ids.value = selection.map((item) => item.questionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加题库";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonExamQuestionVO) => {
  reset();
  const _questionId = row?.questionId || ids.value[0];
  const res = await getPersonExamQuestion(_questionId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改题库";
};

/** 提交按钮 */
const submitForm = () => {
  personExamQuestionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.questionId) {
        await updatePersonExamQuestion(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonExamQuestion(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonExamQuestionVO) => {
  const _questionIds = row?.questionId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除题库编号为"' + _questionIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonExamQuestion(_questionIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personExamQuestion/export",
    {
      ...queryParams.value,
    },
    `personExamQuestion_${new Date().getTime()}.xlsx`,
  );
};

onMounted(() => {
  getList();
  updateHeight(); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
