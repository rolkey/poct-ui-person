<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="工号" prop="empNo">
              <el-input
                v-model="queryParams.empNo"
                placeholder="请输入工号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="姓名" prop="personName">
              <el-input
                v-model="queryParams.personName"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                clearable
                v-model="queryParams.birthDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择出生日期"
              />
            </el-form-item>
            <el-form-item label="所在科室" prop="deptId">
              <el-input
                v-model="queryParams.deptId"
                placeholder="请输入所在科室"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="职务/职称" prop="postId">
              <el-input
                v-model="queryParams.postId"
                placeholder="请输入职务/职称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="最高学历" prop="education">
              <el-input
                v-model="queryParams.education"
                placeholder="请输入最高学历"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="专业" prop="major">
              <el-input
                v-model="queryParams.major"
                placeholder="请输入专业"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="queryParams.phone"
                placeholder="请输入联系电话"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="queryParams.email"
                placeholder="请输入邮箱"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="人员状态" prop="personStatus">
              <el-select
                v-model="queryParams.personStatus"
                placeholder="人员状态"
                clearable
                style="width: 140px"
              >
                <el-option label="在岗" value="在岗" />
                <el-option label="离职" value="离职" />
              </el-select>
            </el-form-item>
            <el-form-item label="考核状态" prop="examStatus">
              <el-select
                v-model="queryParams.examStatus"
                placeholder="考核状态"
                clearable
                style="width: 140px"
              >
                <el-option label="合格" value="合格" />
                <el-option label="预选" value="预选" />
                <el-option label="不合格" value="不合格" />
              </el-select>
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
              v-hasPermi="['person:info:add']"
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
              v-hasPermi="['person:info:edit']"
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
              v-hasPermi="['person:info:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['person:info:export']"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['person:info:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              @click="handlePreselection"
              v-hasPermi="['person:info:preselection:list']"
              >预选管理</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="personInfoList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="人员ID" align="center" prop="personId" v-if="false" />
          <el-table-column label="工号" align="center" prop="empNo" />
          <el-table-column label="姓名" align="center" prop="personName" />
          <el-table-column label="性别" align="center" prop="gender" />
          <el-table-column label="出生日期" align="center" prop="birthDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.birthDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所在科室" align="center" prop="deptId" />
          <el-table-column label="职务/职称" align="center" prop="postId" />
          <el-table-column label="最高学历" align="center" prop="education" />
          <el-table-column label="专业" align="center" prop="major" />
          <el-table-column label="联系电话" align="center" prop="phone" />
          <el-table-column label="邮箱" align="center" prop="email" />
          <el-table-column label="入职日期" align="center" prop="hireDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.hireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="personStatus">
            <template #default="scope">
              <el-tag
                :type="scope.row.personStatus === '在岗' ? 'success' : scope.row.personStatus === '离职' ? 'danger' : 'info'"
              >{{ scope.row.personStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="考核状态" align="center" prop="examStatus">
            <template #default="scope">
              <el-tag
                :type="scope.row.examStatus === '合格' ? 'success' : scope.row.examStatus === '预选' ? 'warning' : scope.row.examStatus === '不合格' ? 'danger' : 'info'"
              >{{ scope.row.examStatus }}</el-tag>
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
                  v-hasPermi="['person:info:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['person:info:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="切换状态" placement="top">
                <el-button
                  link
                  type="warning"
                  icon="Switch"
                  @click="handleStatusChange(scope.row)"
                  v-hasPermi="['person:info:edit']"
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
    <el-upload
      ref="importUploadRef"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      accept=".xlsx,.xls"
      style="display:none"
    >
      <el-button ref="importTriggerRef">click</el-button>
    </el-upload>

    <!-- 预选管理对话框 -->
    <el-dialog v-model="preselectionDialog.visible" title="预选管理" width="700px" append-to-body>
      <el-table :data="preselectionList" @selection-change="handlePreselectionSelect">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="empNo" label="工号" align="center" />
        <el-table-column prop="personName" label="姓名" align="center" />
        <el-table-column prop="deptId" label="科室" align="center" />
        <el-table-column label="考核状态" align="center" prop="examStatus">
          <template #default="scope">
            <el-tag type="warning">{{ scope.row.examStatus }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button
          type="success"
          @click="handleConfirmPreselection"
          :disabled="!preselectionSelected.length"
          >确认合格</el-button
        >
        <el-button
          type="danger"
          @click="handleRejectPreselection"
          :disabled="!preselectionSelected.length"
          >驳回</el-button
        >
      </template>
    </el-dialog>

    <!-- 添加或修改人员基础信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personInfoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工号" prop="empNo">
          <el-input v-model="form.empNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="form.personName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            clearable
            v-model="form.birthDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择出生日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在科室" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入所在科室" />
        </el-form-item>
        <el-form-item label="职务/职称" prop="postId">
          <el-input v-model="form.postId" placeholder="请输入职务/职称" />
        </el-form-item>
        <el-form-item label="最高学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入最高学历" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker
            clearable
            v-model="form.hireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择入职日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联系统用户ID，FK->sys_user" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联系统用户ID，FK->sys_user" />
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

<script setup name="PersonInfo" lang="ts">
import {
  listPersonInfo,
  getPersonInfo,
  delPersonInfo,
  addPersonInfo,
  updatePersonInfo,
  preselectionList,
  confirmPreselection,
  rejectPreselection,
  updatePersonStatus,
  importPersonInfo,
} from "@/api/lis/person/personInfo";
import { PersonInfoVO, PersonInfoQuery, PersonInfoForm } from "@/api/lis/person/personInfo/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personInfoList = ref<PersonInfoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personInfoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const importUploadRef = ref();
const preselectionDialog = reactive({ visible: false });
const preselectionList = ref<any[]>([]);
const preselectionSelected = ref<any[]>([]);

const initFormData: PersonInfoForm = {
  empNo: undefined,
  personName: undefined,
  gender: undefined,
  birthDate: undefined,
  deptId: undefined,
  postId: undefined,
  education: undefined,
  major: undefined,
  phone: undefined,
  email: undefined,
  hireDate: undefined,
  personStatus: undefined,
  examStatus: undefined,
  userId: undefined,
};
const data = reactive<PageData<PersonInfoForm, PersonInfoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    empNo: undefined,
    personName: undefined,
    gender: undefined,
    birthDate: undefined,
    deptId: undefined,
    postId: undefined,
    education: undefined,
    major: undefined,
    phone: undefined,
    email: undefined,
    personStatus: undefined,
    examStatus: undefined,
    params: {},
  },
  rules: {
    empNo: [{ required: true, message: "工号不能为空", trigger: "blur" }],
    personName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询人员基础信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonInfo(queryParams.value);
  personInfoList.value = res.rows;
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
  personInfoFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PersonInfoVO[]) => {
  ids.value = selection.map((item) => item.personId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加人员基础信息";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonInfoVO) => {
  reset();
  const _personId = row?.personId || ids.value[0];
  const res = await getPersonInfo(_personId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改人员基础信息";
};

/** 提交按钮 */
const submitForm = () => {
  personInfoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.personId) {
        await updatePersonInfo(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonInfo(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonInfoVO) => {
  const _personIds = row?.personId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除人员基础信息编号为"' + _personIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonInfo(_personIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personInfo/export",
    {
      ...queryParams.value,
    },
    `personInfo_${new Date().getTime()}.xlsx`,
  );
};

/** 导入按钮操作 */
const handleImport = () => {
  importUploadRef.value?.$el.querySelector("input").click();
};

/** 导入前处理 */
const handleBeforeUpload = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  await importPersonInfo(formData);
  proxy?.$modal.msgSuccess("导入成功");
  getList();
  return false;
};

/** 预选管理 */
const handlePreselection = async () => {
  const res = await preselectionList({ pageNum: 1, pageSize: 999 });
  preselectionList.value = res.rows;
  preselectionDialog.visible = true;
};

/** 预选多选 */
const handlePreselectionSelect = (selection: any[]) => {
  preselectionSelected.value = selection;
};

/** 确认合格 */
const handleConfirmPreselection = async () => {
  const ids = preselectionSelected.value.map((r: any) => r.personId);
  await confirmPreselection(ids);
  proxy?.$modal.msgSuccess("已确认合格");
  preselectionDialog.visible = false;
  getList();
};

/** 驳回 */
const handleRejectPreselection = async () => {
  const ids = preselectionSelected.value.map((r: any) => r.personId);
  await rejectPreselection(ids);
  proxy?.$modal.msgSuccess("已驳回");
  preselectionDialog.visible = false;
  getList();
};

/** 切换人员状态 */
const handleStatusChange = async (row: any) => {
  const newStatus = row.personStatus === "在岗" ? "离职" : "在岗";
  await updatePersonStatus(row.personId, newStatus);
  proxy?.$modal.msgSuccess("状态已更新");
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
