// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      // 切换图标
      const icon = menuBtn.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fa fa-bars';
      } else {
        icon.className = 'fa fa-times';
      }
    });
  }
  
  // 检查登录状态
  const isLogin = localStorage.getItem('isLogin') === 'true';
  const username = localStorage.getItem('username');
  
  // 如果已登录，替换导航栏的登录/注册按钮
  if (isLogin && username) {
    const userActions = document.querySelector('.flex.items-center.space-x-4');
    if (userActions) {
      // 清空原有内容
      userActions.innerHTML = '';
      
      // 添加用户信息
      const userInfo = document.createElement('div');
      userInfo.className = 'flex items-center space-x-3';
      
      const avatar = document.createElement('div');
      avatar.className = 'w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold';
      avatar.textContent = username.charAt(0).toUpperCase();
      
      const userName = document.createElement('span');
      userName.className = 'hidden md:block text-dark font-medium';
      userName.textContent = username;
      
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'text-dark hover:text-primary font-medium';
      logoutBtn.innerHTML = '<i class="fa fa-sign-out"></i> <span class="hidden md:inline">退出</span>';
      
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('username');
        window.location.reload();
      });
      
      userInfo.appendChild(avatar);
      userInfo.appendChild(userName);
      userInfo.appendChild(logoutBtn);
      
      userActions.appendChild(userInfo);
      
      // 移动端菜单也需要更新
      const mobileUserActions = document.querySelector('#mobileMenu .flex.space-x-4');
      if (mobileUserActions) {
        mobileUserActions.innerHTML = '';
        mobileUserActions.appendChild(userInfo.cloneNode(true));
      }
    }
  }
});