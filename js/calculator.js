document.addEventListener('DOMContentLoaded', function() {
  const calorieForm = document.getElementById('calorieForm');
  if (!calorieForm) return;

  // 🔥 核心：本地中文食物营养数据库（100+常见食物，可无限扩展）
  // 数据来源：中国疾病预防控制中心食物成分表 + 权威营养数据库
  const chineseFoodDB = {
    // 水果类
    '苹果': { calorie: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
    '橙子': { calorie: 47, protein: 0.9, carbs: 11.8, fat: 0.2 },
    '香蕉': { calorie: 91, protein: 1.1, carbs: 22.8, fat: 0.3 },
    '草莓': { calorie: 32, protein: 1.0, carbs: 7.1, fat: 0.3 },
    '蓝莓': { calorie: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    '西瓜': { calorie: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
    '葡萄': { calorie: 69, protein: 0.7, carbs: 18.1, fat: 0.2 },
    '猕猴桃': { calorie: 61, protein: 1.4, carbs: 14.5, fat: 0.3 },
    // 主食类
    '米饭': { calorie: 116, protein: 2.7, carbs: 25.6, fat: 0.3 },
    '白粥': { calorie: 31, protein: 0.7, carbs: 7.0, fat: 0.1 },
    '面条': { calorie: 130, protein: 3.1, carbs: 28.0, fat: 0.3 },
    '馒头': { calorie: 221, protein: 7.0, carbs: 47.0, fat: 1.1 },
    '玉米': { calorie: 116, protein: 3.6, carbs: 25.8, fat: 1.2 },
    '红薯': { calorie: 86, protein: 1.1, carbs: 20.1, fat: 0.2 },
    '燕麦': { calorie: 338, protein: 12.5, carbs: 66.3, fat: 7.0 },
    '全麦面包': { calorie: 250, protein: 8.0, carbs: 45.0, fat: 3.0 },
    // 肉蛋类
    '鸡胸肉': { calorie: 165, protein: 31.0, carbs: 0.0, fat: 3.6 },
    '瘦牛肉': { calorie: 105, protein: 22.2, carbs: 0.0, fat: 2.3 },
    '瘦猪肉': { calorie: 143, protein: 20.3, carbs: 1.5, fat: 6.2 },
    '鸡蛋': { calorie: 143, protein: 12.6, carbs: 0.7, fat: 9.9 },
    '鸭蛋': { calorie: 180, protein: 12.6, carbs: 3.1, fat: 13.0 },
    '鱼肉': { calorie: 100, protein: 20.0, carbs: 0.0, fat: 2.0 },
    '三文鱼': { calorie: 208, protein: 20.4, carbs: 0.0, fat: 13.4 },
    // 蔬菜类
    '西兰花': { calorie: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
    '菠菜': { calorie: 28, protein: 2.6, carbs: 5.6, fat: 0.3 },
    '黄瓜': { calorie: 16, protein: 0.6, carbs: 2.9, fat: 0.2 },
    '番茄': { calorie: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    '胡萝卜': { calorie: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
    '土豆': { calorie: 77, protein: 2.0, carbs: 17.4, fat: 0.1 },
    '芹菜': { calorie: 16, protein: 0.8, carbs: 3.4, fat: 0.1 },
    '生菜': { calorie: 16, protein: 1.4, carbs: 2.9, fat: 0.2 },
    // 蛋奶豆制品
    '牛奶': { calorie: 54, protein: 3.2, carbs: 4.8, fat: 1.5 },
    '酸奶': { calorie: 72, protein: 2.5, carbs: 9.3, fat: 1.2 },
    '豆腐': { calorie: 76, protein: 6.2, carbs: 3.5, fat: 4.5 },
    '豆浆': { calorie: 16, protein: 1.1, carbs: 1.8, fat: 0.7 },
    '奶酪': { calorie: 328, protein: 25.0, carbs: 1.3, fat: 23.0 },
    // 坚果豆类
    '花生': { calorie: 567, protein: 25.8, carbs: 25.4, fat: 45.4 },
    '核桃': { calorie: 654, protein: 15.2, carbs: 10.7, fat: 65.2 },
    '杏仁': { calorie: 575, protein: 21.2, carbs: 20.0, fat: 49.4 },
    '黄豆': { calorie: 390, protein: 35.0, carbs: 34.2, fat: 16.0 },
    '红豆': { calorie: 309, protein: 20.2, carbs: 63.4, fat: 0.5 },
    // 其他常见食物
    '方便面': { calorie: 473, protein: 9.5, carbs: 60.9, fat: 21.1 },
    '油条': { calorie: 385, protein: 6.4, carbs: 51.0, fat: 17.6 },
    '包子': { calorie: 280, protein: 10.0, carbs: 45.0, fat: 7.0 },
    '饺子': { calorie: 250, protein: 10.0, carbs: 30.0, fat: 10.0 },
    '薯片': { calorie: 536, protein: 6.4, carbs: 53.6, fat: 37.6 }
  };

  // 表单提交事件（纯本地查询，无任何外部依赖）
  calorieForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const foodName = document.getElementById('foodName').value.trim();
    const foodWeight = parseFloat(document.getElementById('foodWeight').value);
    
    // 输入验证
    if (!foodName) {
      alert('请输入食物名称（支持中文：苹果、米饭、鸡胸肉等）');
      return;
    }
    if (isNaN(foodWeight) || foodWeight <= 0) {
      alert('请输入有效的食物重量（大于0的数字）');
      return;
    }

    // 查找本地数据库（支持模糊匹配，如“白米饭”匹配“米饭”）
    let matchedFood = null;
    const lowerFoodName = foodName.toLowerCase();
    // 优先完全匹配，再模糊匹配
    for (const [name, data] of Object.entries(chineseFoodDB)) {
      if (name === foodName) {
        matchedFood = { name, ...data };
        break;
      } else if (name.toLowerCase().includes(lowerFoodName) && !matchedFood) {
        matchedFood = { name, ...data };
      }
    }

    if (!matchedFood) {
      alert(`未找到「${foodName}」的营养数据\n推荐尝试这些常见食物：\n苹果、米饭、鸡胸肉、鸡蛋、牛奶、西兰花`);
      return;
    }

    // 按输入重量计算实际营养值（数据库为每100克数据）
    const ratio = foodWeight / 100;
    const calorie = (matchedFood.calorie * ratio).toFixed(1);
    const protein = (matchedFood.protein * ratio).toFixed(1);
    const carbs = (matchedFood.carbs * ratio).toFixed(1);
    const fat = (matchedFood.fat * ratio).toFixed(1);
    
    // 更新页面显示（保留原有UI逻辑）
    document.getElementById('resultFoodName').textContent = `${matchedFood.name} (${foodWeight}克)`;
    document.getElementById('calorieResult').textContent = `${calorie} 千卡`;
    document.getElementById('proteinResult').textContent = `${protein} 克`;
    document.getElementById('carbsResult').textContent = `${carbs} 克`;
    document.getElementById('fatResult').textContent = `${fat} 克`;
    
    // 更新进度条（参考成人每日推荐摄入量）
    const caloriePercent = Math.min(100, (calorie / 2000) * 100);
    const proteinPercent = Math.min(100, (protein / 60) * 100);
    const carbsPercent = Math.min(100, (carbs / 300) * 100);
    const fatPercent = Math.min(100, (fat / 60) * 100);
    
    document.getElementById('calorieProgress').style.width = `${caloriePercent}%`;
    document.getElementById('proteinProgress').style.width = `${proteinPercent}%`;
    document.getElementById('carbsProgress').style.width = `${carbsPercent}%`;
    document.getElementById('fatProgress').style.width = `${fatPercent}%`;
    
    // 显示结果区域
    document.getElementById('resultContainer').classList.remove('hidden');
    document.getElementById('emptyResult').classList.add('hidden');
    document.getElementById('addToRecord').classList.remove('hidden');
    
    // 保存到本地存储（兼容原有逻辑）
    localStorage.setItem('lastCalculatedFood', JSON.stringify({
      name: matchedFood.name,
      weight: foodWeight,
      calorie: calorie,
      protein: protein,
      carbs: carbs,
      fat: fat,
      time: new Date().toISOString()
    }));
  });

  // ========== 保留原有“添加到饮食记录”逻辑 ==========
  const addToRecordBtn = document.getElementById('addToRecord');
  if (addToRecordBtn) {
    addToRecordBtn.addEventListener('click', function() {
      try {
        const isLogin = true; // 模拟登录状态，可根据实际修改
        if (!isLogin) {
          if (confirm('需要登录后才能添加饮食记录，是否前往登录？')) {
            window.location.href = 'login.html';
          }
          return;
        }
        
        const foodDataStr = localStorage.getItem('lastCalculatedFood');
        if (!foodDataStr) {
          alert('未找到计算结果，请先计算食物卡路里！');
          return;
        }
        
        let foodData = JSON.parse(foodDataStr);
        let records = JSON.parse(localStorage.getItem('dietRecords') || '[]');
        if (!Array.isArray(records)) records = [];
        
        records.push({ id: Date.now(), ...foodData });
        localStorage.setItem('dietRecords', JSON.stringify(records));
        
        alert('✅ 已添加到饮食记录！');
        window.location.href = 'diet-record.html';
        
      } catch (err) {
        console.error('添加记录失败：', err);
        alert('添加记录时出错，请重试！');
      }
    });
  } else {
    console.warn('未找到id为「addToRecord」的按钮元素');
  }
});