<template>
  <div class="showFull p-2 flex flex-col">
    <!-- Top Bar -->
    <el-card shadow="hover" class="mb-[10px]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-lg font-bold">{{ examInfo.examName || examInfo.paperName }}</span>
          <el-tag :type="examInfo.status === '已发布' ? 'success' : 'info'">{{ examInfo.status }}</el-tag>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <el-icon><Clock /></el-icon>
            <span :class="['font-mono text-lg', timerMinutes <= 5 ? 'text-red-500' : '']">
              {{ formatTime(timerMinutes) }}:{{ formatTime(timerSeconds) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <el-icon><Document /></el-icon>
            <span>{{ currentIndex + 1 }} / {{ questions.length }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Question Area -->
    <el-card shadow="never" class="flex-1 flex flex-col" v-loading="loading">
      <template v-if="!submitted && questions.length > 0">
        <div class="mb-4">
          <div class="text-sm text-gray-400 mb-2">
            第 {{ currentIndex + 1 }} 题
            <el-tag size="small" class="ml-2">{{ questions[currentIndex]?.questionType }}</el-tag>
            <span class="ml-2 text-primary">({{ questions[currentIndex]?.score }} 分)</span>
          </div>
          <div class="text-base leading-relaxed mb-4">{{ questions[currentIndex]?.content }}</div>

          <!-- 单选题 -->
          <el-radio-group
            v-if="questions[currentIndex]?.questionType === '单选题'"
            v-model="answers[questions[currentIndex]?.questionId]"
            class="flex flex-col gap-3"
          >
            <el-radio
              v-for="opt in parsedOptions(questions[currentIndex]?.options)"
              :key="opt.value"
              :value="opt.value"
              class="py-2 px-4 rounded hover:bg-gray-50"
            >
              {{ opt.label }}
            </el-radio>
          </el-radio-group>

          <!-- 多选题 -->
          <el-checkbox-group
            v-else-if="questions[currentIndex]?.questionType === '多选题'"
            v-model="answers[questions[currentIndex]?.questionId]"
            class="flex flex-col gap-3"
          >
            <el-checkbox
              v-for="opt in parsedOptions(questions[currentIndex]?.options)"
              :key="opt.value"
              :value="opt.value"
              class="py-2 px-4 rounded hover:bg-gray-50"
            >
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>

          <!-- 判断题 -->
          <el-radio-group
            v-else-if="questions[currentIndex]?.questionType === '判断题'"
            v-model="answers[questions[currentIndex]?.questionId]"
            class="flex flex-col gap-3"
          >
            <el-radio value="对" class="py-2 px-4 rounded hover:bg-gray-50">对</el-radio>
            <el-radio value="错" class="py-2 px-4 rounded hover:bg-gray-50">错</el-radio>
          </el-radio-group>
        </div>

        <!-- Navigation -->
        <div class="mt-auto flex justify-between items-center pt-4 border-t">
          <el-button @click="prevQuestion" :disabled="currentIndex === 0">上一题</el-button>
          <div class="flex gap-2">
            <el-button v-if="currentIndex < questions.length - 1" type="primary" @click="nextQuestion">下一题</el-button>
            <el-button v-else type="danger" @click="handleSubmit" :loading="submitLoading">交 卷</el-button>
          </div>
        </div>
      </template>

      <!-- Result -->
      <template v-else-if="submitted">
        <div class="flex flex-col items-center justify-center py-12">
          <el-icon :size="64" :color="examResult.passed ? '#67c23a' : '#f56c6c'">
            <CircleCheckFilled v-if="examResult.passed" />
            <CircleCloseFilled v-else />
          </el-icon>
          <div class="text-2xl font-bold mt-4">{{ examResult.passed ? '恭喜通过' : '未通过' }}</div>
          <div class="text-gray-500 mt-2">得分：{{ examResult.score }} / {{ examResult.totalScore }}</div>
          <div class="text-gray-400 mt-1">正确：{{ examResult.correctCount }} / {{ examResult.totalQuestions }}</div>
          <el-button type="primary" class="mt-6" @click="handleClose">关闭</el-button>
        </div>
      </template>

      <el-empty v-else-if="!loading" description="暂无试题" />
    </el-card>
  </div>
</template>

<script setup name="PersonExamTake" lang="ts">
import { getPersonExamPaper } from "@/api/lis/person/personExamPaper";
import { submitExam } from "@/api/lis/person/personExam";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();

const loading = ref(false);
const submitLoading = ref(false);
const submitted = ref(false);

const examInfo = ref<any>({});
const questions = ref<any[]>([]);
const answers = reactive<Record<string, any>>({});
const currentIndex = ref(0);

const timerMinutes = ref(0);
const timerSeconds = ref(0);
let timerHandle: ReturnType<typeof setInterval> | null = null;

const examResult = reactive({
  passed: false,
  score: 0,
  totalScore: 0,
  correctCount: 0,
  totalQuestions: 0,
});

const parsedOptions = (optionsStr: string) => {
  if (!optionsStr) return [];
  try {
    const parsed = typeof optionsStr === "string" ? JSON.parse(optionsStr) : optionsStr;
    if (Array.isArray(parsed)) return parsed;
    return Object.entries(parsed).map(([key, val]) => ({ value: key, label: val as string }));
  } catch {
    return [];
  }
};

const formatTime = (val: number) => String(val).padStart(2, "0");

const startTimer = (durationMinutes: number) => {
  let totalSeconds = durationMinutes * 60;
  timerMinutes.value = Math.floor(totalSeconds / 60);
  timerSeconds.value = totalSeconds % 60;
  timerHandle = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      clearInterval(timerHandle!);
      proxy?.$modal.msgWarning("考试时间到，自动交卷");
      handleSubmit();
      return;
    }
    timerMinutes.value = Math.floor(totalSeconds / 60);
    timerSeconds.value = totalSeconds % 60;
  }, 1000);
};

const loadExam = async () => {
  const paperId = route.query.paperId as string;
  if (!paperId) {
    proxy?.$modal.msgError("缺少试卷ID");
    return;
  }
  loading.value = true;
  try {
    const res = await getPersonExamPaper(paperId);
    const data = res.data || res;
    examInfo.value = data;
    if (data.questions) {
      questions.value = data.questions;
    } else if (data.paperQuestions) {
      questions.value = data.paperQuestions.map((pq: any) => ({
        ...pq.question,
        questionId: pq.questionId || pq.question?.questionId,
        score: pq.score,
        sortNo: pq.sortNo,
      }));
    }
    if (data.durationMinutes) {
      startTimer(data.durationMinutes);
    }
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "加载试卷失败");
  } finally {
    loading.value = false;
  }
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const handleSubmit = async () => {
  const unanswered = questions.value.filter((q) => {
    const ans = answers[q.questionId];
    return ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0);
  });
  if (unanswered.length > 0) {
    try {
      await proxy?.$modal.confirm(`还有 ${unanswered.length} 题未作答，确定交卷吗？`);
    } catch {
      return;
    }
  }

  submitLoading.value = true;
  try {
    const answerSheet = questions.value.map((q, idx) => {
      const userAnswer = answers[q.questionId];
      return {
        questionId: q.questionId,
        sortNo: idx + 1,
        userAnswer: Array.isArray(userAnswer) ? userAnswer.sort().join(",") : (userAnswer || ""),
        correctAnswer: q.answer || "",
        isCorrect: false,
        score: q.score || 0,
      };
    });

    const res = await submitExam({
      paperId: route.query.paperId,
      personId: route.query.personId,
      examName: examInfo.value.paperName,
      answerSheet: JSON.stringify(answerSheet),
      durationSeconds: examInfo.value.durationMinutes * 60 - (timerMinutes.value * 60 + timerSeconds.value),
    });

    const data = res.data || res;
    examResult.passed = data.result === "合格" || data.passed;
    examResult.score = data.score || 0;
    examResult.totalScore = data.totalScore || examInfo.value.totalScore || 0;
    examResult.correctCount = data.correctCount || 0;
    examResult.totalQuestions = data.totalQuestions || questions.value.length;
    submitted.value = true;

    if (timerHandle) clearInterval(timerHandle);
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "交卷失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleClose = () => {
  proxy?.$tab.closePage();
};

onMounted(() => {
  loadExam();
});

onBeforeUnmount(() => {
  if (timerHandle) clearInterval(timerHandle);
});
</script>
