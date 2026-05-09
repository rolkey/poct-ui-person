<template>
  <div class="showFull p-2 flex flex-col">
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-medium">自动组卷</span>
          <el-steps :active="activeStep" align-center class="w-[400px]">
            <el-step title="策略配置" />
            <el-step title="预览确认" />
          </el-steps>
        </div>
      </template>

      <!-- Step 1: Strategy Configuration -->
      <div v-show="activeStep === 0">
        <el-form ref="strategyFormRef" :model="strategyForm" :rules="strategyRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="试卷名称" prop="paperName">
                <el-input v-model="strategyForm.paperName" placeholder="请输入试卷名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合格分数线" prop="passLine">
                <el-input-number v-model="strategyForm.passLine" :min="0" :max="100" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考试时长(分)" prop="durationMinutes">
                <el-input-number v-model="strategyForm.durationMinutes" :min="10" :max="180" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">选题分类</el-divider>
          <el-form-item label="题目分类" prop="categories">
            <el-checkbox-group v-model="strategyForm.categories">
              <el-checkbox label="生化" value="生化" />
              <el-checkbox label="血气" value="血气" />
              <el-checkbox label="血糖" value="血糖" />
              <el-checkbox label="凝血" value="凝血" />
              <el-checkbox label="心肌标志物" value="心肌标志物" />
              <el-checkbox label="感染标志物" value="感染标志物" />
              <el-checkbox label="尿液分析" value="尿液分析" />
              <el-checkbox label="其他" value="其他" />
            </el-checkbox-group>
          </el-form-item>

          <el-divider content-position="left">题型分布</el-divider>
          <el-table :data="strategyForm.typeDistribution" border max-height="300">
            <el-table-column label="题型" align="center" width="160">
              <template #default="scope">
                <span>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="题数" align="center" width="160">
              <template #default="scope">
                <el-input-number v-model="scope.row.count" :min="0" :max="100" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="每题分值" align="center" width="160">
              <template #default="scope">
                <el-input-number v-model="scope.row.scorePerQuestion" :min="1" :max="20" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="小计" align="center">
              <template #default="scope">
                <span class="text-primary">{{ (scope.row.count || 0) * (scope.row.scorePerQuestion || 0) }} 分</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-2 text-right text-sm text-gray-500">
            预计总分：<span class="text-primary font-bold">{{ estimatedTotalScore }} 分</span>
          </div>

          <el-divider />
          <div class="flex justify-center gap-4">
            <el-button @click="handleBack">取 消</el-button>
            <el-button type="primary" @click="handlePreview" :loading="previewLoading">生成预览</el-button>
          </div>
        </el-form>
      </div>

      <!-- Step 2: Preview -->
      <div v-show="activeStep === 1">
        <el-alert
          :title="`试卷名称：${previewResult.paperName} | 总分：${previewResult.totalScore} 分 | 合格线：${previewResult.passLine} 分 | 题数：${previewResult.questionCount} 题 | 时长：${previewResult.durationMinutes} 分钟`"
          type="success"
          show-icon
          :closable="false"
          class="mb-4"
        />

        <el-table :data="previewResult.questions || []" border v-loading="previewLoading" max-height="500">
          <el-table-column label="序号" type="index" width="60" align="center" />
          <el-table-column label="题型" align="center" prop="questionType" width="100" />
          <el-table-column label="题目内容" align="left" prop="content" min-width="300" show-overflow-tooltip />
          <el-table-column label="分类" align="center" prop="category" width="120" />
          <el-table-column label="分值" align="center" prop="score" width="80" />
        </el-table>

        <div class="mt-4 flex justify-center gap-4">
          <el-button @click="activeStep = 0">返回修改</el-button>
          <el-button type="primary" @click="handleSavePaper" :loading="saveLoading">保存试卷</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup name="PersonExamPaperGenerate" lang="ts">
import { generatePaper } from "@/api/lis/person/personExamPaper";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeStep = ref(0);
const previewLoading = ref(false);
const saveLoading = ref(false);
const strategyFormRef = ref<ElFormInstance>();

interface TypeDistributionItem {
  type: string;
  count: number;
  scorePerQuestion: number;
}

interface StrategyForm {
  paperName: string;
  passLine: number;
  durationMinutes: number;
  categories: string[];
  typeDistribution: TypeDistributionItem[];
}

const strategyForm = reactive<StrategyForm>({
  paperName: "",
  passLine: 60,
  durationMinutes: 60,
  categories: [],
  typeDistribution: [
    { type: "单选题", count: 15, scorePerQuestion: 4 },
    { type: "多选题", count: 5, scorePerQuestion: 6 },
    { type: "判断题", count: 10, scorePerQuestion: 2 },
  ],
});

const strategyRules = {
  paperName: [{ required: true, message: "试卷名称不能为空", trigger: "blur" }],
  passLine: [{ required: true, message: "合格分数线不能为空", trigger: "blur" }],
  durationMinutes: [{ required: true, message: "考试时长不能为空", trigger: "blur" }],
  categories: [{ required: true, message: "请至少选择一个分类", trigger: "change" }],
};

const estimatedTotalScore = computed(() => {
  return strategyForm.typeDistribution.reduce((sum, item) => {
    return sum + (item.count || 0) * (item.scorePerQuestion || 0);
  }, 0);
});

const previewResult = ref<any>({});

const handlePreview = async () => {
  const valid = await strategyFormRef.value?.validate().catch(() => false);
  if (!valid) return;

  previewLoading.value = true;
  try {
    const strategy = {
      categories: strategyForm.categories,
      typeDistribution: strategyForm.typeDistribution,
    };
    const res = await generatePaper({
      paperName: strategyForm.paperName,
      passLine: strategyForm.passLine,
      durationMinutes: strategyForm.durationMinutes,
      strategy: JSON.stringify(strategy),
      generateType: "自动组卷",
    });
    previewResult.value = res.data || res;
    activeStep.value = 1;
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "生成预览失败");
  } finally {
    previewLoading.value = false;
  }
};

const handleSavePaper = async () => {
  saveLoading.value = true;
  try {
    const strategy = {
      categories: strategyForm.categories,
      typeDistribution: strategyForm.typeDistribution,
    };
    await generatePaper({
      paperName: strategyForm.paperName,
      passLine: strategyForm.passLine,
      durationMinutes: strategyForm.durationMinutes,
      strategy: JSON.stringify(strategy),
      generateType: "自动组卷",
      status: "未发布",
    });
    proxy?.$modal.msgSuccess("试卷保存成功");
    handleBack();
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "保存失败");
  } finally {
    saveLoading.value = false;
  }
};

const handleBack = () => {
  proxy?.$tab.closePage();
};
</script>
