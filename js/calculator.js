// ===================== 修复添加到饮食记录功能 =====================
// 替换原有handleAddToRecord函数
function handleAddToRecord() {
  const result = window.currentNutritionResult;
  if (!result) {
    alert("请先计算食物营养成分");
    return;
  }

  // 🌟 新增：让用户选择餐次（可选，也可默认，推荐添加）
  const mealTypeMap = {
    "早餐": "breakfast",
    "午餐": "lunch",
    "晚餐": "dinner",
    "加餐": "snack"
  };
  // 弹出选择框让用户选餐次（也可以在页面加单选框）
  const mealTypeName = prompt("请选择餐次", "加餐").trim() || "加餐";
  const mealType = mealTypeMap[mealTypeName] || "snack";

  // 兼容两种调用方式（确保折线图触发更新）
  try {
    if (window.addCalculatorRecordToDiet) {
      // 方式1：调用专门为计算器设计的全局函数（推荐）
      window.addCalculatorRecordToDiet({
        foodName: result.foodName,
        calorie: result.calorie,
        protein: result.protein,
        carbohydrate: result.carbohydrate,
        fat: result.fat,
        weight: result.weight,
        mealType: mealTypeName // 传递中文餐次名，让record.js转换
      });
    } else if (window.dietRecord && window.dietRecord.add) {
      // 方式2：备用调用dietRecord.add（确保触发折线图更新）
      const newRecord = {
        name: result.foodName,
        calories: parseFloat(result.calorie),
        protein: parseFloat(result.protein),
        carbs: parseFloat(result.carbohydrate),
        fat: parseFloat(result.fat),
        servingSize: parseInt(result.weight),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: '来自卡路里计算器',
        date: new Date().toISOString().split('T')[0] // 🌟 补充日期字段（关键！折线图按日期统计）
      };
      window.dietRecord.add(mealType, newRecord);
    } else {
      throw new Error("饮食记录模块未加载");
    }

    alert(`✅ 已将「${result.foodName}」添加到${mealTypeName}记录！`);
    
    // 清空状态
    document.querySelector(DOM_SELECTORS.foodInput).value = "";
    document.querySelector(DOM_SELECTORS.weightInput).value = "";
    document.querySelector(DOM_SELECTORS.addRecordBtn).classList.add("hidden");
    document.querySelector(DOM_SELECTORS.resultArea).classList.add("hidden");
    document.querySelector(DOM_SELECTORS.emptyResult).classList.remove("hidden");
    window.currentNutritionResult = null;

  } catch (error) {
    alert(`添加失败：${error.message}，请刷新页面重试`);
    console.error("添加记录失败：", error);
  }
}
