<template>
  <div class="showFull p-2 flex flex-col">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="授权ID" prop="authId">
              <el-input v-model="queryParams.authId" placeholder="请输入授权ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目标ID" prop="targetId">
              <el-input v-model="queryParams.targetId" placeholder="请输入目标ID" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['his:personAuthorizeItem:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['his:personAuthorizeItem:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['his:personAuthorizeItem:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['his:personAuthorizeItem:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table v-loading="loading" border :data="personAuthorizeItemList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="明细ID" align="center" prop="itemId" v-if="false" />
          <el-table-column label="授权ID" align="center" prop="authId" />
          <el-table-column label="目标类型：设备/项目" align="center" prop="targetType" />
          <el-table-column label="目标ID" align="center" prop="targetId" />
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['his:personAuthorizeItem:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['his:personAuthorizeItem:remove']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
	  </div>

      <pagination ref="paginationRef" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改授权明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personAuthorizeItemFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="授权ID" prop="authId">
          <el-input v-model="form.authId" placeholder="请输入授权ID" />
        </el-form-item>
        <el-form-item label="目标ID" prop="targetId">
          <el-input v-model="form.targetId" placeholder="请输入目标ID" />
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

<script setup name="PersonAuthorizeItem" lang="ts">
import { listPersonAuthorizeItem, getPersonAuthorizeItem, delPersonAuthorizeItem, addPersonAuthorizeItem, updatePersonAuthorizeItem } from '@/api/his/personAuthorizeItem';
import { PersonAuthorizeItemVO, PersonAuthorizeItemQuery, PersonAuthorizeItemForm } from '@/api/his/personAuthorizeItem/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personAuthorizeItemList = ref<PersonAuthorizeItemVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personAuthorizeItemFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PersonAuthorizeItemForm = {
  authId: undefined,
  targetType: undefined,
  targetId: undefined,
}
const data = reactive<PageData<PersonAuthorizeItemForm, PersonAuthorizeItemQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    authId: undefined,
    targetType: undefined,
    targetId: undefined,
    params: {
    }
  },
  rules: {
    authId: [
      { required: true, message: "授权ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询授权明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonAuthorizeItem(queryParams.value);
  personAuthorizeItemList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

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
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  personAuthorizeItemFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonAuthorizeItemVO[]) => {
  ids.value = selection.map(item => item.itemId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加授权明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonAuthorizeItemVO) => {
  reset();
  const _itemId = row?.itemId || ids.value[0]
  const res = await getPersonAuthorizeItem(_itemId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改授权明细";
}

/** 提交按钮 */
const submitForm = () => {
  personAuthorizeItemFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.itemId) {
        await updatePersonAuthorizeItem(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPersonAuthorizeItem(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PersonAuthorizeItemVO) => {
  const _itemIds = row?.itemId || ids.value;
  await proxy?.$modal.confirm('是否确认删除授权明细编号为"' + _itemIds + '"的数据项？').finally(() => loading.value = false);
  await delPersonAuthorizeItem(_itemIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('his/personAuthorizeItem/export', {
    ...queryParams.value
  }, `personAuthorizeItem_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
  updateHeight(); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
