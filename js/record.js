// record.js - 饮食记录相关功能（修复读取计算器添加的记录 + 折线图功能）

// 存储记录的数组（保留原有结构：按餐次分类）
let dietRecords = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: []
};

// 初始化 - 从localStorage加载记录（兼容计算器添加的记录）
function initDietRecords() {
  const savedRecords = localStorage.getItem('dietRecords');
  if (savedRecords) {
    try {
      const parsedRecords = JSON.parse(savedRecords);

      // 判断是旧格式（按餐次）还是计算器添加的新格式（一维数组）
      if (Array.isArray(parsedRecords)) {
        // 处理计算器添加的一维数组记录，转换为按餐次分类的格式
        convertAndMergeCalculatorRecords(parsedRecords);
      } else {
        // 原有格式直接使用
        dietRecords = parsedRecords;
      }
    } catch (e) {
      console.error('读取记录失败，使用默认数据：', e);
      initDefaultRecords();
    }
  } else {
    // 初始化示例数据
    initDefaultRecords();
  }

  renderDietRecords();
  updateNutritionSummary();
}

// 初始化默认示例数据
function initDefaultRecords() {
  dietRecords = {
    breakfast: [
      {
        id: 1,
        name: '隔夜燕麦碗',
        calories: 320,
        protein: 12,
        carbs: 45,
        fat: 8,
        time: '08:15',
        servingSize: 200,
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        name: '黑咖啡',
        calories: 5,
        protein: 0,
        carbs: 0,
        fat: 0,
        time: '09:30',
        servingSize: 250,
        date: new Date().toISOString().split('T')[0]
      }
    ],
    lunch: [],
    dinner: [],
    snack: []
  };
  saveDietRecords();
}

// 转换并合并计算器添加的记录到餐次结构中
function convertAndMergeCalculatorRecords(calculatorRecords) {
  // 先保留原有记录（如果有）
  const existingRecords = { ...dietRecords };

  // 遍历计算器记录，转换为餐次格式
  calculatorRecords.forEach(record => {
    // 确定餐次（计算器中默认是"未分类"，这里映射到snack加餐）
    let mealType = 'snack';
    if (record.mealType === '早餐') mealType = 'breakfast';
    if (record.mealType === '午餐') mealType = 'lunch';
    if (record.mealType === '晚餐') mealType = 'dinner';

    // 转换字段名（计算器 -> 原有格式）
    const convertedRecord = {
      id: record.id || Date.now(),
      name: record.foodName || '未知食物',
      calories: parseFloat(record.calorie) || 0,
      protein: parseFloat(record.protein) || 0,
      carbs: parseFloat(record.carbohydrate) || 0,
      fat: parseFloat(record.fat) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      servingSize: parseInt(record.weight) || 0,
      date: new Date().toISOString().split('T')[0],
      notes: '来自卡路里计算器'
    };

    // 添加到对应餐次
    if (!existingRecords[mealType]) existingRecords[mealType] = [];
    existingRecords[mealType].push(convertedRecord);
  });

  // 更新为合并后的记录
  dietRecords = existingRecords;
  // 保存回localStorage（覆盖为餐次格式）
  saveDietRecords();
}

// 保存记录到localStorage
function saveDietRecords() {
  localStorage.setItem('dietRecords', JSON.stringify(dietRecords));
}

// 渲染饮食记录列表（完善渲染逻辑，显示所有餐次记录）
function renderDietRecords() {
  // 获取记录列表容器
  const recordList = document.getElementById('recordList') || document.querySelector('.record-list');

  if (!recordList) {
    console.log('未找到记录列表容器');
    return;
  }

  // 获取当前选中的餐次（默认早餐）
  const activeTab = document.querySelector('.record-tab.active');
  const currentMealType = activeTab ? activeTab.textContent.toLowerCase() : 'breakfast';

  // 获取当前餐次的记录
  const currentRecords = dietRecords[currentMealType] || [];

  // 清空列表
  recordList.innerHTML = '';

  // 无记录时显示提示
  if (currentRecords.length === 0) {
    recordList.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa fa-list-ul text-4xl mb-2"></i>
        <p>暂无${getMealTypeName(currentMealType)}记录</p>
      </div>
    `;
    return;
  }

  // 渲染每条记录
  currentRecords.forEach(record => {
    const recordItem = document.createElement('div');
    recordItem.className = 'flex items-center justify-between p-4 border-b border-gray-200';
    recordItem.innerHTML = `
      <div>
        <h4 class="font-medium">${record.name} (${record.servingSize}克)</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
          <div><span class="text-green-500">卡路里：</span>${record.calories.toFixed(1)}千卡</div>
          <div><span class="text-blue-500">蛋白质：</span>${record.protein.toFixed(2)}克</div>
          <div><span class="text-yellow-500">碳水：</span>${record.carbs.toFixed(2)}克</div>
          <div><span class="text-red-500">脂肪：</span>${record.fat.toFixed(2)}克</div>
        </div>
        <div class="text-xs text-gray-400 mt-1">
          ${record.time} | ${record.notes || ''}
        </div>
      </div>
      <button class="text-red-500 hover:text-red-700" data-record-id="${record.id}" data-meal-type="${currentMealType}">
        <i class="fa fa-trash"></i>
      </button>
    `;
    recordList.appendChild(recordItem);
  });

  console.log(`渲染${getMealTypeName(currentMealType)}记录：`, currentRecords);
}

// 辅助函数：获取餐次中文名称
function getMealTypeName(mealType) {
  const map = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  };
  return map[mealType] || mealType;
}

// 更新营养摄入汇总
function updateNutritionSummary() {
  // 计算总摄入量
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  // 遍历所有餐次
  Object.values(dietRecords).forEach(mealRecords => {
    mealRecords.forEach(record => {
      totalCalories += parseFloat(record.calories) || 0;
      totalProtein += parseFloat(record.protein) || 0;
      totalCarbs += parseFloat(record.carbs) || 0;
      totalFat += parseFloat(record.fat) || 0;
    });
  });

  // 更新页面显示
  if (document.getElementById('calorieIntake')) {
    document.getElementById('calorieIntake').textContent = totalCalories.toFixed(1);
  }
  if (document.getElementById('proteinIntake')) {
    document.getElementById('proteinIntake').textContent = totalProtein.toFixed(2);
  }
  if (document.getElementById('carbsIntake')) {
    document.getElementById('carbsIntake').textContent = totalCarbs.toFixed(2);
  }
  if (document.getElementById('fatIntake')) {
    document.getElementById('fatIntake').textContent = totalFat.toFixed(2);
  }

  // 更新进度条
  updateProgressBars(totalCalories, totalProtein, totalCarbs, totalFat);
}

// 更新进度条
function updateProgressBars(calories, protein, carbs, fat) {
  // 目标值
  const calorieGoal = 2000;
  const proteinGoal = 60;
  const carbsGoal = 300;
  const fatGoal = 60;

  // 计算百分比
  const caloriePercent = Math.min(100, Math.round((calories / calorieGoal) * 100));
  const proteinPercent = Math.min(100, Math.round((protein / proteinGoal) * 100));
  const carbsPercent = Math.min(100, Math.round((carbs / carbsGoal) * 100));
  const fatPercent = Math.min(100, Math.round((fat / fatGoal) * 100));

  // 更新卡路里进度条
  const calorieProgress = document.querySelector('.bg-primary.h-2.rounded-full');
  if (calorieProgress) {
    calorieProgress.style.width = `${caloriePercent}%`;
    // 更新百分比文本
    const caloriePercentText = calorieProgress.parentElement?.nextElementSibling?.querySelector('.text-primary');
    if (caloriePercentText) {
      caloriePercentText.textContent = `${caloriePercent}%`;
    }
  }

  // 更新蛋白质进度条
  const proteinProgress = document.querySelector('.bg-blue-500.h-2.rounded-full');
  if (proteinProgress) {
    proteinProgress.style.width = `${proteinPercent}%`;
    const proteinPercentText = proteinProgress.parentElement?.nextElementSibling?.querySelector('.text-blue-500');
    if (proteinPercentText) {
      proteinPercentText.textContent = `${proteinPercent}%`;
    }
  }

  // 更新碳水进度条
  const carbsProgress = document.querySelector('.bg-yellow-500.h-2.rounded-full');
  if (carbsProgress) {
    carbsProgress.style.width = `${carbsPercent}%`;
    const carbsPercentText = carbsProgress.parentElement?.nextElementSibling?.querySelector('.text-yellow-500');
    if (carbsPercentText) {
      carbsPercentText.textContent = `${carbsPercent}%`;
    }
  }

  // 更新脂肪进度条
  const fatProgress = document.querySelector('.bg-red-500.h-2.rounded-full');
  if (fatProgress) {
    fatProgress.style.width = `${fatPercent}%`;
    const fatPercentText = fatProgress.parentElement?.nextElementSibling?.querySelector('.text-red-500');
    if (fatPercentText) {
      fatPercentText.textContent = `${fatPercent}%`;
    }
  }

  console.log(`进度更新 - 卡路里：${caloriePercent}%，蛋白质：${proteinPercent}%，碳水：${carbsPercent}%，脂肪：${fatPercent}%`);
}

// 添加新记录（整合折线图更新）
function addDietRecord(mealType, record) {
  // 生成唯一ID
  record.id = record.id || Date.now();
  // 确保日期字段存在
  record.date = record.date || new Date().toISOString().split('T')[0];

  // 添加到对应餐次
  if (!dietRecords[mealType]) dietRecords[mealType] = [];
  dietRecords[mealType].push(record);

  // 保存到localStorage
  saveDietRecords();

  // 更新UI
  renderDietRecords();
  updateNutritionSummary();
  // 新增：更新折线图
  initDietTrendChart();

  return record;
}

// 删除记录（整合折线图更新）
function deleteDietRecord(mealType, recordId) {
  if (!dietRecords[mealType]) return false;

  // 过滤掉要删除的记录
  const initialLength = dietRecords[mealType].length;
  dietRecords[mealType] = dietRecords[mealType].filter(record => record.id !== recordId);

  // 保存到localStorage
  saveDietRecords();

  // 更新UI
  renderDietRecords();
  updateNutritionSummary();
  // 新增：更新折线图
  initDietTrendChart();

  return initialLength > dietRecords[mealType].length;
}

// 编辑记录（整合折线图更新）
function editDietRecord(mealType, recordId, updatedRecord) {
  if (!dietRecords[mealType]) return false;

  // 找到记录索引
  const index = dietRecords[mealType].findIndex(record => record.id === recordId);

  if (index !== -1) {
    // 更新记录（保留原有字段）
    dietRecords[mealType][index] = {
      ...dietRecords[mealType][index],
      ...updatedRecord,
      id: recordId // 保持ID不变
    };

    // 保存到localStorage
    saveDietRecords();

    // 更新UI
    renderDietRecords();
    updateNutritionSummary();
    // 新增：更新折线图
    initDietTrendChart();

    return true;
  }

  return false;
}

// 获取指定日期的记录
function getRecordsByDate(date) {
  const filteredRecords = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  // 按日期过滤
  Object.entries(dietRecords).forEach(([mealType, records]) => {
    filteredRecords[mealType] = records.filter(record => record.date === date);
  });

  return filteredRecords;
}

// ========== 折线图核心逻辑 ==========
// 初始化/更新饮食趋势折线图（卡路里趋势）
function initDietTrendChart() {
  // 1. 获取折线图容器（需确保页面有 id 为 dietTrendChart 的元素）
  const chartContainer = document.getElementById('dietTrendChart');
  if (!chartContainer) {
    console.warn('未找到折线图容器（id: dietTrendChart），请检查页面DOM');
    return;
  }

  // 2. 初始化ECharts实例（兼容未引入ECharts的情况）
  if (typeof echarts === 'undefined') {
    console.error('ECharts未加载，请在HTML中引入：<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>');
    chartContainer.innerHTML = '<div class="text-center py-4 text-red-500">折线图依赖ECharts，请引入相关脚本</div>';
    return;
  }
  const chart = echarts.init(chartContainer);

  // 3. 处理近7天的卡路里数据
  const trendData = get7DaysCalorieTrend();

  // 4. 配置折线图选项
  const option = {
    title: { text: '近7天卡路里摄入趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['卡路里摄入'], top: 30 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.dates // 近7天日期（如：['12-10', '12-11', ...]）
    },
    yAxis: {
      type: 'value',
      name: '千卡',
      min: 0 // 热量值不低于0
    },
    series: [
      {
        name: '卡路里摄入',
        type: 'line',
        data: trendData.calories, // 对应日期的总卡路里
        smooth: true, // 平滑曲线
        areaStyle: { color: 'rgba(66, 185, 131, 0.2)' }, // 填充区域
        itemStyle: { color: '#42b983' }, // 线条颜色
        lineStyle: { width: 2 }
      }
    ]
  };

  // 5. 渲染折线图
  chart.setOption(option);

  // 适配窗口大小变化（防止重复绑定）
  window.removeEventListener('resize', chart.resize);
  window.addEventListener('resize', () => chart.resize());
  
  console.log('折线图已更新，近7天数据：', trendData);
}

// 辅助函数：获取近7天的卡路里趋势数据
function get7DaysCalorieTrend() {
  const dates = [];
  const calories = [];
  const today = new Date();

  // 生成近7天的日期（从6天前到今天）
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0]; // 格式：2025-12-10
    dates.push(dateStr.slice(5)); // 显示：12-10

    // 计算当天的总卡路里
    const dailyRecords = getRecordsByDate(dateStr);
    let dailyCalorie = 0;
    Object.values(dailyRecords).forEach(mealRecords => {
      mealRecords.forEach(record => {
        dailyCalorie += parseFloat(record.calories) || 0;
      });
    });
    calories.push(Number(dailyCalorie.toFixed(1))); // 转为数字（ECharts兼容）
  }

  return { dates, calories };
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initDietRecords();

  // 绑定餐次标签切换事件
  const mealTabs = document.querySelectorAll('.record-tab');
  mealTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有active类
      mealTabs.forEach(t => t.classList.remove('active'));
      // 添加当前active类
      tab.classList.add('active');
      // 重新渲染记录
      renderDietRecords();
    });
  });

  // 绑定添加记录表单提交事件
  const addRecordForm = document.getElementById('addRecordForm');
  if (addRecordForm) {
    addRecordForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 获取表单数据
      const mealType = document.querySelector('input[name="mealType"]:checked')?.value || 'breakfast';
      const foodName = document.getElementById('foodName').value.trim();
      const calories = document.getElementById('calories').value;
      const servingSize = document.getElementById('servingSize').value;
      const protein = document.getElementById('protein').value;
      const carbs = document.getElementById('carbs').value;
      const fat = document.getElementById('fat').value;
      const mealTime = document.getElementById('mealTime').value;
      const notes = document.getElementById('notes').value.trim();

      // 验证
      if (!foodName) {
        alert('请输入食物名称');
        return;
      }

      if (!calories || calories <= 0) {
        alert('请输入有效的热量值');
        return;
      }

      // 构建记录对象
      const newRecord = {
        name: foodName,
        calories: parseFloat(calories),
        servingSize: parseInt(servingSize) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        time: mealTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: notes,
        date: new Date().toISOString().split('T')[0] // 当前日期
      };

      // 添加记录
      addDietRecord(mealType, newRecord);

      // 关闭模态框
      const addRecordModal = document.getElementById('addRecordModal');
      if (addRecordModal) {
        addRecordModal.classList.add('hidden');
        document.body.style.overflow = '';
      }

      // 重置表单
      addRecordForm.reset();

      alert(`成功添加记录：${foodName} (${calories}千卡)`);
    });
  }

  // 绑定删除按钮事件（事件委托）
  document.addEventListener('click', (e) => {
    if (e.target.closest('.fa-trash')) {
      const deleteBtn = e.target.closest('button');
      if (deleteBtn) {
        const recordId = parseInt(deleteBtn.dataset.recordId);
        const mealType = deleteBtn.dataset.mealType;
        const recordName = deleteBtn.parentElement.querySelector('h4').textContent;

        if (confirm(`确定要删除 "${recordName}" 的记录吗？`)) {
          const deleted = deleteDietRecord(mealType, recordId);
          if (deleted) {
            alert('记录已删除');
          } else {
            alert('删除失败，记录不存在');
          }
        }
      }
    }
  });

  // 初始化折线图
  initDietTrendChart();
});

// 导出函数供外部使用（兼容计算器调用）
window.dietRecord = {
  add: addDietRecord,
  delete: deleteDietRecord,
  edit: editDietRecord,
  getByDate: getRecordsByDate,
  init: initDietRecords,
  save: saveDietRecords
};

// 兼容计算器添加记录的全局函数（供calculator.js调用）
window.addCalculatorRecordToDiet = function (calculatorRecord) {
  // 确定餐次
  let mealType = 'snack';
  if (calculatorRecord.mealType === '早餐') mealType = 'breakfast';
  if (calculatorRecord.mealType === '午餐') mealType = 'lunch';
  if (calculatorRecord.mealType === '晚餐') mealType = 'dinner';

  // 转换为原有格式
  const convertedRecord = {
    name: calculatorRecord.foodName || '未知食物',
    calories: parseFloat(calculatorRecord.calorie) || 0,
    protein: parseFloat(calculatorRecord.protein) || 0,
    carbs: parseFloat(calculatorRecord.carbohydrate) || 0,
    fat: parseFloat(calculatorRecord.fat) || 0,
    servingSize: parseInt(calculatorRecord.weight) || 0,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: '来自卡路里计算器',
    date: new Date().toISOString().split('T')[0]
  };

  // 添加到记录并触发折线图更新
  const addedRecord = addDietRecord(mealType, convertedRecord);
  
  // 兜底更新折线图
  initDietTrendChart();
  
  return addedRecord;
};
