// community.js - 美食社区相关功能

// 模拟社区帖子数据
let communityPosts = [
  {
    id: 1,
    author: '健康达人',
    avatar: 'https://picsum.photos/64/64?avatar=1',
    content: '分享我的一周减脂餐搭配，简单又好吃，坚持2周瘦了5斤！#减脂餐 #健康饮食',
    images: [
      'https://picsum.photos/800/600?food=1',
      'https://picsum.photos/800/600?food=2'
    ],
    likes: 128,
    comments: 36,
    shares: 15,
    postTime: '2小时前',
    isLiked: false
  },
  {
    id: 2,
    author: '素食主义者',
    avatar: 'https://picsum.photos/64/64?avatar=2',
    content: '纯素食早餐搭配分享，营养均衡，能量满满💪 #素食 #早餐推荐',
    images: [
      'https://picsum.photos/800/600?food=3'
    ],
    likes: 89,
    comments: 24,
    shares: 8,
    postTime: '5小时前',
    isLiked: false
  },
  {
    id: 3,
    author: '健身教练',
    avatar: 'https://picsum.photos/64/64?avatar=3',
    content: '增肌期饮食原则：高蛋白、足量碳水、健康脂肪，附我的一日三餐实拍 #增肌饮食 #健身餐',
    images: [
      'https://picsum.photos/800/600?food=4',
      'https://picsum.photos/800/600?food=5',
      'https://picsum.photos/800/600?food=6'
    ],
    likes: 256,
    comments: 78,
    shares: 42,
    postTime: '昨天',
    isLiked: true
  },
  {
    id: 4,
    author: '厨房小白',
    avatar: 'https://picsum.photos/64/64?avatar=4',
    content: '第一次尝试做的鸡胸肉沙拉，卖相还不错吧？求大神指点改进建议🙏 #新手下厨 #减脂餐',
    images: [
      'https://picsum.photos/800/600?food=7'
    ],
    likes: 45,
    comments: 18,
    shares: 3,
    postTime: '3天前',
    isLiked: false
  }
];

// 模拟评论数据
const postComments = {
  1: [
    {
      id: 101,
      author: '减脂小白',
      avatar: 'https://picsum.photos/64/64?avatar=5',
      content: '求详细的食谱！看起来好好吃',
      time: '1小时前',
      likes: 8
    },
    {
      id: 102,
      author: '健康达人',
      avatar: 'https://picsum.photos/64/64?avatar=1',
      content: '回复 @减脂小白：我已经把食谱发在评论区啦，你可以看看',
      time: '1小时前',
      likes: 5
    }
  ],
  2: [
    {
      id: 201,
      author: '素食爱好者',
      avatar: 'https://picsum.photos/64/64?avatar=6',
      content: '请问用的是什么燕麦？',
      time: '3小时前',
      likes: 3
    }
  ]
};

// 渲染社区帖子列表
function renderCommunityPosts() {
  const postsContainer = document.getElementById('communityPosts');
  if (!postsContainer) return;
  
  // 清空容器
  postsContainer.innerHTML = '';
  
  // 渲染每个帖子
  communityPosts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'bg-white rounded-xl shadow-lg p-6 mb-6';
    postEl.dataset.postId = post.id;
    
    // 构建图片HTML
    let imagesHtml = '';
    if (post.images && post.images.length > 0) {
      if (post.images.length === 1) {
        imagesHtml = `
          <div class="mt-4 mb-4">
            <img src="${post.images[0]}" alt="帖子图片" class="w-full h-64 object-cover rounded-lg">
          </div>
        `;
      } else {
        imagesHtml = `
          <div class="grid grid-cols-${post.images.length > 3 ? 3 : post.images.length} gap-2 mt-4 mb-4">
            ${post.images.map(img => `
              <img src="${img}" alt="帖子图片" class="w-full h-32 object-cover rounded-lg">
            `).join('')}
          </div>
        `;
      }
    }
    
    // 帖子HTML结构
    postEl.innerHTML = `
      <!-- 作者信息 -->
      <div class="flex items-center mb-4">
        <img src="${post.avatar}" alt="${post.author}" class="w-12 h-12 rounded-full object-cover mr-4">
        <div>
          <h4 class="font-medium text-dark">${post.author}</h4>
          <p class="text-xs text-gray-500">${post.postTime}</p>
        </div>
      </div>
      
      <!-- 帖子内容 -->
      <p class="text-gray-700 mb-2">${post.content}</p>
      
      <!-- 帖子图片 -->
      ${imagesHtml}
      
      <!-- 互动按钮 -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-100">
        <button class="like-btn flex items-center text-gray-500 hover:text-red-500 transition ${post.isLiked ? 'text-red-500' : ''}" data-post-id="${post.id}">
          <i class="fa fa-heart mr-2 ${post.isLiked ? 'fa-solid' : 'fa-regular'}"></i>
          <span>${post.likes}</span>
        </button>
        <button class="comment-btn flex items-center text-gray-500 hover:text-primary transition" data-post-id="${post.id}">
          <i class="fa fa-comment mr-2"></i>
          <span>${post.comments}</span>
        </button>
        <button class="share-btn flex items-center text-gray-500 hover:text-blue-500 transition" data-post-id="${post.id}">
          <i class="fa fa-share-alt mr-2"></i>
          <span>${post.shares}</span>
        </button>
        <button class="collect-btn flex items-center text-gray-500 hover:text-yellow-500 transition" data-post-id="${post.id}">
          <i class="fa fa-bookmark-o mr-2"></i>
          <span>收藏</span>
        </button>
      </div>
      
      <!-- 评论区 (默认隐藏) -->
      <div class="comments-container mt-4 hidden">
        <div class="space-y-4 max-h-64 overflow-y-auto pr-2">
          <!-- 评论会动态加载 -->
        </div>
        <div class="mt-4 flex items-center">
          <img src="https://picsum.photos/64/64?user=1" alt="我的头像" class="w-8 h-8 rounded-full object-cover mr-3">
          <input type="text" placeholder="发表评论..." class="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
          <button class="ml-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
            发布
          </button>
        </div>
      </div>
    `;
    
    // 添加到容器
    postsContainer.appendChild(postEl);
  });
  
  // 绑定互动按钮事件
  bindPostInteractionEvents();
}

// 绑定帖子互动事件
function bindPostInteractionEvents() {
  // 点赞按钮
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = parseInt(this.dataset.postId);
      const post = communityPosts.find(p => p.id === postId);
      
      if (post) {
        if (post.isLiked) {
          // 取消点赞
          post.likes -= 1;
          post.isLiked = false;
          this.classList.remove('text-red-500');
          this.querySelector('i').classList.remove('fa-solid');
          this.querySelector('i').classList.add('fa-regular');
        } else {
          // 点赞
          post.likes += 1;
          post.isLiked = true;
          this.classList.add('text-red-500');
          this.querySelector('i').classList.remove('fa-regular');
          this.querySelector('i').classList.add('fa-solid');
        }
        
        // 更新点赞数显示
        this.querySelector('span').textContent = post.likes;
      }
    });
  });
  
  // 评论按钮
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = parseInt(this.dataset.postId);
      const postEl = this.closest('[data-post-id]');
      const commentsContainer = postEl.querySelector('.comments-container');
      
      // 切换评论区显示/隐藏
      if (commentsContainer.classList.contains('hidden')) {
        // 显示评论区并加载评论
        commentsContainer.classList.remove('hidden');
        loadPostComments(postId, commentsContainer.querySelector('.space-y-4'));
      } else {
        // 隐藏评论区
        commentsContainer.classList.add('hidden');
      }
    });
  });
  
  // 分享按钮
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = parseInt(this.dataset.postId);
      const post = communityPosts.find(p => p.id === postId);
      alert(`分享帖子：${post.author} 的 "${post.content.substring(0, 20)}..."`);
    });
  });
  
  // 收藏按钮
  document.querySelectorAll('.collect-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const isCollected = this.querySelector('i').classList.contains('fa-bookmark');
      
      if (isCollected) {
        // 取消收藏
        this.querySelector('i').classList.remove('fa-bookmark');
        this.querySelector('i').classList.add('fa-bookmark-o');
        this.querySelector('span').textContent = '收藏';
        this.classList.remove('text-yellow-500');
        alert('已取消收藏');
      } else {
        // 收藏
        this.querySelector('i').classList.remove('fa-bookmark-o');
        this.querySelector('i').classList.add('fa-bookmark');
        this.querySelector('span').textContent = '已收藏';
        this.classList.add('text-yellow-500');
        alert('已收藏该帖子');
      }
    });
  });
  
  // 评论发布按钮
  document.querySelectorAll('.comments-container button').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const commentText = input.value.trim();
      
      if (!commentText) {
        alert('请输入评论内容');
        return;
      }
      
      // 模拟发布评论
      alert(`已发布评论：${commentText}`);
      input.value = '';
      
      // 这里可以添加实际发布评论的逻辑
      const postId = parseInt(this.closest('[data-post-id]').dataset.postId);
      addNewComment(postId, {
        author: '我',
        avatar: 'https://picsum.photos/64/64?user=1',
        content: commentText,
        time: '刚刚',
        likes: 0
      });
    });
  });
}

// 加载帖子评论
function loadPostComments(postId, container) {
  if (!container) return;
  
  // 清空容器
  container.innerHTML = '';
  
  // 获取该帖子的评论
  const comments = postComments[postId] || [];
  
  if (comments.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-gray-500">
        <i class="fa fa-comment-o text-2xl mb-2"></i>
        <p>暂无评论，快来抢沙发吧！</p>
      </div>
    `;
    return;
  }
  
  // 渲染每条评论
  comments.forEach(comment => {
    const commentEl = document.createElement('div');
    commentEl.className = 'flex items-start';
    commentEl.innerHTML = `
      <img src="${comment.avatar}" alt="${comment.author}" class="w-8 h-8 rounded-full object-cover mr-3 mt-1 flex-shrink-0">
      <div class="bg-gray-50 rounded-lg p-3 flex-grow">
        <div class="flex justify-between items-center mb-1">
          <span class="font-medium text-sm text-dark">${comment.author}</span>
          <span class="text-xs text-gray-500">${comment.time}</span>
        </div>
        <p class="text-sm text-gray-700">${comment.content}</p>
        <div class="flex items-center mt-2">
          <button class="text-xs text-gray-500 hover:text-primary flex items-center">
            <i class="fa fa-thumbs-up mr-1"></i>
            <span>${comment.likes || 0}</span>
          </button>
          <button class="text-xs text-gray-500 hover:text-primary flex items-center ml-4">
            <i class="fa fa-reply mr-1"></i>
            <span>回复</span>
          </button>
        </div>
      </div>
    `;
    
    container.appendChild(commentEl);
  });
}

// 添加新评论
function addNewComment(postId, comment) {
  // 生成唯一ID
  comment.id = Date.now();
  
  // 如果该帖子没有评论数组，创建一个
  if (!postComments[postId]) {
    postComments[postId] = [];
  }
  
  // 添加到评论数组开头
  postComments[postId].unshift(comment);
  
  // 更新对应帖子的评论数
  const post = communityPosts.find(p => p.id === postId);
  if (post) {
    post.comments += 1;
    
    // 更新页面上的评论数显示
    const commentBtn = document.querySelector(`.comment-btn[data-post-id="${postId}"] span`);
    if (commentBtn) {
      commentBtn.textContent = post.comments;
    }
  }
  
  // 重新加载评论
  const commentsContainer = document.querySelector(`[data-post-id="${postId}"] .comments-container .space-y-4`);
  if (commentsContainer) {
    loadPostComments(postId, commentsContainer);
  }
}

// 发布新帖子
function publishNewPost(formData) {
  // 验证表单数据
  if (!formData.content || formData.content.trim() === '') {
    alert('请输入帖子内容');
    return false;
  }
  
  // 构建新帖子对象
  const newPost = {
    id: Date.now(),
    author: '我',
    avatar: 'https://picsum.photos/64/64?user=1',
    content: formData.content.trim(),
    images: formData.images || [],
    likes: 0,
    comments: 0,
    shares: 0,
    postTime: '刚刚',
    isLiked: false
  };
  
  // 添加到帖子数组开头
  communityPosts.unshift(newPost);
  
  // 保存到localStorage（模拟）
  localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
  
  // 更新UI
  renderCommunityPosts();
  
  return true;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  // 从localStorage加载帖子数据
  const savedPosts = localStorage.getItem('communityPosts');
  if (savedPosts) {
    try {
      communityPosts = JSON.parse(savedPosts);
    } catch (e) {
      console.error('加载社区帖子失败', e);
    }
  }
  
  // 渲染帖子列表
  renderCommunityPosts();
  
  // 绑定发布帖子表单
  const publishForm = document.getElementById('publishPostForm');
  if (publishForm) {
    publishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const content = document.getElementById('postContent').value;
      // 模拟图片上传（实际项目中需要处理文件上传）
      const images = [];
      const imageInput = document.getElementById('postImages');
      
      if (imageInput.files.length > 0) {
        // 模拟生成图片URL
        for (let i = 0; i < Math.min(imageInput.files.length, 9); i++) {
          images.push(`https://picsum.photos/800/600?random=${Date.now() + i}`);
        }
      }
      
      // 发布帖子
      const success = publishNewPost({
        content: content,
        images: images
      });
      
      if (success) {
        // 关闭发布模态框
        const publishModal = document.getElementById('publishModal');
        if (publishModal) {
          publishModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
        
        // 重置表单
        publishForm.reset();
        
        alert('帖子发布成功！');
      }
    });
  }
  
  // 绑定标签筛选
  document.querySelectorAll('.community-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      // 移除所有标签激活状态
      document.querySelectorAll('.community-tag').forEach(t => {
        t.classList.remove('active', 'bg-primary', 'text-white');
        t.classList.add('bg-gray-100', 'text-dark');
      });
      
      // 添加当前标签激活状态
      this.classList.add('active', 'bg-primary', 'text-white');
      this.classList.remove('bg-gray-100', 'text-dark');
      
      // 模拟筛选
      const tagText = this.textContent.trim();
      if (tagText === '全部') {
        renderCommunityPosts(); // 显示全部
      } else {
        // 筛选包含该标签的帖子
        const filteredPosts = communityPosts.filter(post => 
          post.content.includes(`#${tagText.replace(/^#/, '')}`)
        );
        
        // 保存原始帖子
        const originalPosts = [...communityPosts];
        
        // 替换为筛选后的帖子
        communityPosts = filteredPosts;
        
        // 渲染筛选结果
        renderCommunityPosts();
        
        // 恢复原始帖子（实际项目中应该保留筛选状态）
        setTimeout(() => {
          communityPosts = originalPosts;
        }, 0);
        
        alert(`已筛选：${tagText} 相关帖子，共 ${filteredPosts.length} 条`);
      }
    });
  });
  
  // 绑定发布按钮
  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      const publishModal = document.getElementById('publishModal');
      if (publishModal) {
        publishModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  }
  
  // 绑定关闭发布模态框按钮
  const closePublishModal = document.getElementById('closePublishModal');
  if (closePublishModal) {
    closePublishModal.addEventListener('click', () => {
      const publishModal = document.getElementById('publishModal');
      if (publishModal) {
        publishModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
  
  // 绑定取消发布按钮
  const cancelPublish = document.getElementById('cancelPublish');
  if (cancelPublish) {
    cancelPublish.addEventListener('click', () => {
      const publishModal = document.getElementById('publishModal');
      if (publishModal) {
        publishModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
  
  // 点击模态框外部关闭
  const publishModal = document.getElementById('publishModal');
  if (publishModal) {
    publishModal.addEventListener('click', (e) => {
      if (e.target === publishModal) {
        publishModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
  
  // 模拟图片上传预览
  const postImages = document.getElementById('postImages');
  if (postImages) {
    postImages.addEventListener('change', function() {
      const previewContainer = document.getElementById('imagePreview');
      if (!previewContainer) return;
      
      // 清空预览
      previewContainer.innerHTML = '';
      
      // 显示预览
      for (let i = 0; i < Math.min(this.files.length, 9); i++) {
        const file = this.files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const previewItem = document.createElement('div');
          previewItem.className = 'relative w-20 h-20 mr-2 mb-2';
          previewItem.innerHTML = `
            <img src="${e.target.result}" alt="预览图片" class="w-full h-full object-cover rounded-lg">
            <button class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
              ×
            </button>
          `;
          
          // 删除预览图片
          previewItem.querySelector('button').addEventListener('click', function() {
            previewItem.remove();
            // 实际项目中需要处理文件删除逻辑
          });
          
          previewContainer.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
      }
    });
  }
});

// 导出函数供外部使用
window.community = {
  renderPosts: renderCommunityPosts,
  publishPost: publishNewPost,
  addComment: addNewComment,
  loadComments: loadPostComments
};