<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="人员ID" prop="personId">
              <el-input
                v-model="queryParams.personId"
                placeholder="请输入人员ID"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="培训计划ID" prop="planId">
              <el-input
                v-model="queryParams.planId"
                placeholder="请输入培训计划ID"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="培训时长" prop="hours">
              <el-input
                v-model="queryParams.hours"
                placeholder="请输入培训时长"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="学习进度" prop="progress">
              <el-input
                v-model="queryParams.progress"
                placeholder="请输入学习进度"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="签到时间" prop="signInTime">
              <el-date-picker
                clearable
                v-model="queryParams.signInTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择签到时间"
              />
            </el-form-item>
            <el-form-item label="证书有效期" prop="certExpireDate">
              <el-date-picker
                clearable
                v-model="queryParams.certExpireDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择证书有效期"
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
              v-hasPermi="['his:personTrainRecord:add']"
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
              v-hasPermi="['his:personTrainRecord:edit']"
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
              v-hasPermi="['his:personTrainRecord:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personTrainRecord:export']"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Check"
              @click="handleSignIn"
              v-hasPermi="['his:personTrainRecord:sign']"
              >签到</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="personTrainRecordList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="记录ID" align="center" prop="recordId" v-if="false" />
          <el-table-column label="人员ID" align="center" prop="personId" />
          <el-table-column label="培训计划ID" align="center" prop="planId" />
          <el-table-column label="培训时长" align="center" prop="hours" />
          <el-table-column label="学习进度" align="center" prop="progress" />
          <el-table-column label="签到时间" align="center" prop="signInTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.signInTime, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否已生成合格证书 Y/N" align="center" prop="certGenerated" />
          <el-table-column label="证书有效期" align="center" prop="certExpireDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.certExpireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
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
                  v-hasPermi="['his:personTrainRecord:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personTrainRecord:remove']"
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
    <!-- 签到对话框 -->
    <el-dialog v-model="signInDialog.visible" title="签到" width="400px" append-to-body>
      <el-form ref="signInFormRef" :model="signInForm" label-width="80px">
        <el-form-item label="人员ID" prop="personId">
          <el-input v-model="signInForm.personId" placeholder="请输入人员ID" />
        </el-form-item>
        <el-form-item label="培训计划ID" prop="planId">
          <el-input v-model="signInForm.planId" placeholder="请输入培训计划ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitSignIn">确 定</el-button>
          <el-button @click="signInDialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加或修改培训记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personTrainRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="人员ID" prop="personId">
          <el-input v-model="form.personId" placeholder="请输入人员ID" />
        </el-form-item>
        <el-form-item label="培训计划ID" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入培训计划ID" />
        </el-form-item>
        <el-form-item label="培训时长" prop="hours">
          <el-input v-model="form.hours" placeholder="请输入培训时长" />
        </el-form-item>
        <el-form-item label="学习进度" prop="progress">
          <el-input v-model="form.progress" placeholder="请输入学习进度" />
        </el-form-item>
        <el-form-item label="签到时间" prop="signInTime">
          <el-date-picker
            clearable
            v-model="form.signInTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择签到时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="证书有效期" prop="certExpireDate">
          <el-date-picker
            clearable
            v-model="form.certExpireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择证书有效期"
          >
          </el-date-picker>
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

<script setup name="PersonTrainRecord" lang="ts">
import {
  listPersonTrainRecord,
  getPersonTrainRecord,
  delPersonTrainRecord,
  addPersonTrainRecord,
  updatePersonTrainRecord,
  signIn,
} from "@/api/lis/person/personTrainRecord";
import {
  PersonTrainRecordVO,
  PersonTrainRecordQuery,
  PersonTrainRecordForm,
} from "@/api/lis/person/personTrainRecord/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personTrainRecordList = ref<PersonTrainRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personTrainRecordFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const signInDialog = reactive({ visible: false });
const signInForm = reactive({ personId: "", planId: "" });
const signInFormRef = ref();

const initFormData: PersonTrainRecordForm = {
  recordId: undefined,
  personId: undefined,
  planId: undefined,
  hours: undefined,
  progress: undefined,
  signInTime: undefined,
  certGenerated: undefined,
  certExpireDate: undefined,
};
const data = reactive<PageData<PersonTrainRecordForm, PersonTrainRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    personId: undefined,
    planId: undefined,
    hours: undefined,
    progress: undefined,
    signInTime: undefined,
    certGenerated: undefined,
    certExpireDate: undefined,
    params: {},
  },
  rules: {
    personId: [{ required: true, message: "人员ID不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询培训记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonTrainRecord(queryParams.value);
  personTrainRecordList.value = res.rows;
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
  personTrainRecordFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PersonTrainRecordVO[]) => {
  ids.value = selection.map((item) => item.recordId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加培训记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonTrainRecordVO) => {
  reset();
  const _recordId = row?.recordId || ids.value[0];
  const res = await getPersonTrainRecord(_recordId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改培训记录";
};

/** 提交按钮 */
const submitForm = () => {
  personTrainRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.recordId) {
        await updatePersonTrainRecord(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonTrainRecord(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonTrainRecordVO) => {
  const _recordIds = row?.recordId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除培训记录编号为"' + _recordIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonTrainRecord(_recordIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personTrainRecord/export",
    {
      ...queryParams.value,
    },
    `personTrainRecord_${new Date().getTime()}.xlsx`,
  );
};

/** 签到 */
const handleSignIn = () => {
  signInForm.personId = "";
  signInForm.planId = "";
  signInDialog.visible = true;
};

/** 提交签到 */
const submitSignIn = async () => {
  await signIn(signInForm.personId, signInForm.planId);
  proxy?.$modal.msgSuccess("签到成功");
  signInDialog.visible = false;
  getList();
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
