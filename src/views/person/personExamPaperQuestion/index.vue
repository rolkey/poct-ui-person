<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="排序号" prop="sortNo">
              <el-input
                v-model="queryParams.sortNo"
                placeholder="请输入排序号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="本题分值" prop="score">
              <el-input
                v-model="queryParams.score"
                placeholder="请输入本题分值"
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
              v-hasPermi="['his:personExamPaperQuestion:add']"
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
              v-hasPermi="['his:personExamPaperQuestion:edit']"
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
              v-hasPermi="['his:personExamPaperQuestion:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personExamPaperQuestion:export']"
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
          :data="personExamPaperQuestionList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="关联ID" align="center" prop="id" v-if="false" />
          <el-table-column label="试卷ID" align="center" prop="paperId" />
          <el-table-column label="题目ID" align="center" prop="questionId" />
          <el-table-column label="排序号" align="center" prop="sortNo" />
          <el-table-column label="本题分值" align="center" prop="score" />
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
                  v-hasPermi="['his:personExamPaperQuestion:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personExamPaperQuestion:remove']"
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
    <!-- 添加或修改试卷题目关联对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personExamPaperQuestionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷ID" prop="paperId">
          <el-input v-model="form.paperId" placeholder="请输入试卷ID" />
        </el-form-item>
        <el-form-item label="题目ID" prop="questionId">
          <el-input v-model="form.questionId" placeholder="请输入题目ID" />
        </el-form-item>
        <el-form-item label="排序号" prop="sortNo">
          <el-input v-model="form.sortNo" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="本题分值" prop="score">
          <el-input v-model="form.score" placeholder="请输入本题分值" />
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

<script setup name="PersonExamPaperQuestion" lang="ts">
import {
  listPersonExamPaperQuestion,
  getPersonExamPaperQuestion,
  delPersonExamPaperQuestion,
  addPersonExamPaperQuestion,
  updatePersonExamPaperQuestion,
} from "@/api/lis/person/personExamPaperQuestion";
import {
  PersonExamPaperQuestionVO,
  PersonExamPaperQuestionQuery,
  PersonExamPaperQuestionForm,
} from "@/api/lis/person/personExamPaperQuestion/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personExamPaperQuestionList = ref<PersonExamPaperQuestionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personExamPaperQuestionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonExamPaperQuestionForm = {
  paperId: undefined,
  questionId: undefined,
  sortNo: undefined,
  score: undefined,
};
const data = reactive<PageData<PersonExamPaperQuestionForm, PersonExamPaperQuestionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sortNo: undefined,
    score: undefined,
    params: {},
  },
  rules: {
    paperId: [{ required: true, message: "试卷ID不能为空", trigger: "blur" }],
    questionId: [{ required: true, message: "题目ID不能为空", trigger: "blur" }],
    score: [{ required: true, message: "本题分值不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询试卷题目关联列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonExamPaperQuestion(queryParams.value);
  personExamPaperQuestionList.value = res.rows;
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
  personExamPaperQuestionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PersonExamPaperQuestionVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加试卷题目关联";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonExamPaperQuestionVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getPersonExamPaperQuestion(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改试卷题目关联";
};

/** 提交按钮 */
const submitForm = () => {
  personExamPaperQuestionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePersonExamPaperQuestion(form.value).finally(
          () => (buttonLoading.value = false),
        );
      } else {
        await addPersonExamPaperQuestion(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonExamPaperQuestionVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除试卷题目关联编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonExamPaperQuestion(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personExamPaperQuestion/export",
    {
      ...queryParams.value,
    },
    `personExamPaperQuestion_${new Date().getTime()}.xlsx`,
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
