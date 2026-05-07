<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="操作权限集合，多选逗号分隔" prop="operPerm">
              <el-input
                v-model="queryParams.operPerm"
                placeholder="请输入操作权限集合，多选逗号分隔"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="数据权限：本科室/全院" prop="dataScope">
              <el-input
                v-model="queryParams.dataScope"
                placeholder="请输入数据权限：本科室/全院"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="生效日期" prop="startDate">
              <el-date-picker
                clearable
                v-model="queryParams.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择生效日期"
              />
            </el-form-item>
            <el-form-item label="失效日期" prop="endDate">
              <el-date-picker
                clearable
                v-model="queryParams.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择失效日期"
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
              v-hasPermi="['his:personRolePermission:add']"
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
              v-hasPermi="['his:personRolePermission:edit']"
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
              v-hasPermi="['his:personRolePermission:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personRolePermission:export']"
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
          :data="personRolePermissionList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="权限ID" align="center" prop="permId" v-if="false" />
          <el-table-column label="操作权限集合，多选逗号分隔" align="center" prop="operPerm" />
          <el-table-column label="数据权限：本科室/全院" align="center" prop="dataScope" />
          <el-table-column label="生效日期" align="center" prop="startDate" width="180">
            <template #default="scope">
              <span>{{ proxy.parseTime(scope.row.startDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="失效日期" align="center" prop="endDate" width="180">
            <template #default="scope">
              <span>{{ proxy.parseTime(scope.row.endDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效/已失效" align="center" prop="permStatus" />
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
                  v-hasPermi="['his:personRolePermission:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personRolePermission:remove']"
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
    <!-- 添加或修改报告权限管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personRolePermissionFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="操作权限集合，多选逗号分隔" prop="operPerm">
          <el-input v-model="form.operPerm" placeholder="请输入操作权限集合，多选逗号分隔" />
        </el-form-item>
        <el-form-item label="数据权限：本科室/全院" prop="dataScope">
          <el-input v-model="form.dataScope" placeholder="请输入数据权限：本科室/全院" />
        </el-form-item>
        <el-form-item label="生效日期" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择生效日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择失效日期"
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

<script setup name="PersonRolePermission" lang="ts">
import {
  listPersonRolePermission,
  getPersonRolePermission,
  delPersonRolePermission,
  addPersonRolePermission,
  updatePersonRolePermission,
} from "@/api/lis/person/personRolePermission";
import {
  PersonRolePermissionVO,
  PersonRolePermissionQuery,
  PersonRolePermissionForm,
} from "@/api/lis/person/personRolePermission/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personRolePermissionList = ref<PersonRolePermissionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personRolePermissionFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonRolePermissionForm = {
  operPerm: undefined,
  dataScope: undefined,
  startDate: undefined,
  endDate: undefined,
  permStatus: undefined,
};
const data = reactive<PageData<PersonRolePermissionForm, PersonRolePermissionQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    operPerm: undefined,
    dataScope: undefined,
    startDate: undefined,
    endDate: undefined,
    permStatus: undefined,
    params: {},
  },
  rules: {},
});

const { queryParams, form, rules } = toRefs(data);

/** 查询报告权限管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonRolePermission(queryParams.value);
  personRolePermissionList.value = res.rows;
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
  personRolePermissionFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PersonRolePermissionVO[]) => {
  ids.value = selection.map((item) => item.permId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加报告权限管理";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonRolePermissionVO) => {
  reset();
  const _permId = row?.permId || ids.value[0];
  const res = await getPersonRolePermission(_permId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改报告权限管理";
};

/** 提交按钮 */
const submitForm = () => {
  personRolePermissionFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.permId) {
        await updatePersonRolePermission(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonRolePermission(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonRolePermissionVO) => {
  const _permIds = row?.permId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除报告权限管理编号为"' + _permIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonRolePermission(_permIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personRolePermission/export",
    {
      ...queryParams.value,
    },
    `personRolePermission_${new Date().getTime()}.xlsx`,
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
