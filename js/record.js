// record.js - 饮食记录相关功能

// 存储记录的数组
let dietRecords = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: []
};

// 初始化 - 从localStorage加载记录
function initDietRecords() {
  const savedRecords = localStorage.getItem('dietRecords');
  if (savedRecords) {
    dietRecords = JSON.parse(savedRecords);
    renderDietRecords();
    updateNutritionSummary();
  } else {
    // 初始化示例数据
    dietRecords.breakfast = [
      {
        id: 1,
        name: '隔夜燕麦碗',
        calories: 320,
        protein: 12,
        carbs: 45,
        fat: 8,
        time: '08:15',
        servingSize: 200
      },
      {
        id: 2,
        name: '黑咖啡',
        calories: 5,
        protein: 0,
        carbs: 0,
        fat: 0,
        time: '09:30',
        servingSize: 250
      }
    ];
    
    saveDietRecords();
    renderDietRecords();
    updateNutritionSummary();
  }
}

// 保存记录到localStorage
function saveDietRecords() {
  localStorage.setItem('dietRecords', JSON.stringify(dietRecords));
}

// 渲染饮食记录列表
function renderDietRecords() {
  // 这里可以根据当前选中的餐次渲染对应的记录列表
  // 简化版：仅更新早餐记录示例
  console.log('渲染记录：', dietRecords);
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
      totalCalories += parseInt(record.calories) || 0;
      totalProtein += parseInt(record.protein) || 0;
      totalCarbs += parseInt(record.carbs) || 0;
      totalFat += parseInt(record.fat) || 0;
    });
  });
  
  // 更新页面显示
  if (document.getElementById('calorieIntake')) {
    document.getElementById('calorieIntake').textContent = totalCalories;
  }
  if (document.getElementById('proteinIntake')) {
    document.getElementById('proteinIntake').textContent = totalProtein;
  }
  if (document.getElementById('carbsIntake')) {
    document.getElementById('carbsIntake').textContent = totalCarbs;
  }
  if (document.getElementById('fatIntake')) {
    document.getElementById('fatIntake').textContent = totalFat;
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
  
  // 更新进度条宽度
  const calorieProgress = document.querySelector('.bg-primary.h-2.rounded-full');
  if (calorieProgress) {
    calorieProgress.style.width = `${caloriePercent}%`;
    // 更新百分比文本
    const caloriePercentText = calorieProgress.parentElement.nextElementSibling.querySelector('.text-primary');
    if (caloriePercentText) {
      caloriePercentText.textContent = `${caloriePercent}%`;
    }
  }
  
  // 其他进度条同理（简化版仅更新卡路里）
  console.log(`进度更新 - 卡路里：${caloriePercent}%，蛋白质：${proteinPercent}%，碳水：${carbsPercent}%，脂肪：${fatPercent}%`);
}

// 添加新记录
function addDietRecord(mealType, record) {
  // 生成唯一ID
  record.id = Date.now();
  
  // 添加到对应餐次
  dietRecords[mealType].push(record);
  
  // 保存到localStorage
  saveDietRecords();
  
  // 更新UI
  renderDietRecords();
  updateNutritionSummary();
  
  return record;
}

// 删除记录
function deleteDietRecord(mealType, recordId) {
  // 过滤掉要删除的记录
  dietRecords[mealType] = dietRecords[mealType].filter(record => record.id !== recordId);
  
  // 保存到localStorage
  saveDietRecords();
  
  // 更新UI
  renderDietRecords();
  updateNutritionSummary();
}

// 编辑记录
function editDietRecord(mealType, recordId, updatedRecord) {
  // 找到记录索引
  const index = dietRecords[mealType].findIndex(record => record.id === recordId);
  
  if (index !== -1) {
    // 更新记录
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
    
    return true;
  }
  
  return false;
}

// 获取指定日期的记录（简化版）
function getRecordsByDate(date) {
  // 实际项目中应该按日期存储，这里简化处理
  return dietRecords;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initDietRecords();
  
  // 绑定添加记录表单提交事件
  const addRecordForm = document.getElementById('addRecordForm');
  if (addRecordForm) {
    addRecordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 获取表单数据
      const mealType = document.querySelector('input[name="mealType"]:checked').value;
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
        calories: parseInt(calories),
        servingSize: parseInt(servingSize) || 0,
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
        time: mealTime,
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
  
  // 绑定删除按钮事件（动态生成的元素需要事件委托）
  document.addEventListener('click', (e) => {
    if (e.target.closest('.fa-trash')) {
      const recordItem = e.target.closest('.flex.items-center.justify-between');
      if (recordItem) {
        // 这里需要获取实际的recordId和mealType
        const mealType = document.querySelector('.record-tab.active').textContent.toLowerCase();
        const recordName = recordItem.querySelector('h4').textContent;
        
        if (confirm(`确定要删除 "${recordName}" 的记录吗？`)) {
          // 实际项目中应该获取真实的recordId
          const mockRecordId = 1; // 示例ID
          deleteDietRecord(mealType, mockRecordId);
          alert('记录已删除');
        }
      }
    }
  });
});

// 导出函数供外部使用
window.dietRecord = {
  add: addDietRecord,
  delete: deleteDietRecord,
  edit: editDietRecord,
  getByDate: getRecordsByDate,
  init: initDietRecords
};