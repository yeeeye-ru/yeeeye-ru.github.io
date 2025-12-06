document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;
  
  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentIndex = 0;
  let autoPlayInterval;
  
  // 初始化轮播
  function initCarousel() {
    // 显示第一个项目
    items[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('bg-white');
    
    // 自动播放
    startAutoPlay();
    
    // 绑定事件
    if (prevBtn) {
      prevBtn.addEventListener('click', showPrevItem);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', showNextItem);
    }
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToItem(index);
      });
    });
    
    // 鼠标悬停暂停自动播放
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }
  
  // 显示上一个项目
  function showPrevItem() {
    goToItem(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  }
  
  // 显示下一个项目
  function showNextItem() {
    goToItem(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  }
  
  // 跳转到指定项目
  function goToItem(index) {
    // 移除当前项目的激活状态
    items[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('bg-white');
    indicators[currentIndex].classList.add('bg-white/50');
    
    // 更新索引
    currentIndex = index;
    
    // 添加新项目的激活状态
    items[currentIndex].classList.add('active');
    indicators[currentIndex].classList.remove('bg-white/50');
    indicators[currentIndex].classList.add('bg-white');
    
    // 重新开始自动播放
    stopAutoPlay();
    startAutoPlay();
  }
  
  // 开始自动播放
  function startAutoPlay() {
    autoPlayInterval = setInterval(showNextItem, 5000);
  }
  
  // 停止自动播放
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // 初始化
  initCarousel();
});