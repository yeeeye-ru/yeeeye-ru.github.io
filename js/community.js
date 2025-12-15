// community.js - 美食社区（跨设备共享最终版）
// ========== 核心配置 ==========
// 修复：补充HTTPS协议，确保接口请求正常
const API_BASE_URL = "https://diet-server-zyr.vercel.app"; 
let currentUser = null; // 当前用户（随机生成）

// ========== 随机生成临时用户（避免重复） ==========
function generateRandomUser() {
  const namePrefixes = ["减脂", "健身", "素食", "美食", "轻食", "健康", "厨房"];
  const nameSuffixes = ["达人", "厨神", "爱好者", "小白", "博主", "专家"];
  const randomName = `${namePrefixes[Math.floor(Math.random() * namePrefixes.length)]}${nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]}${Math.floor(Math.random() * 100)}`;
  const randomAvatarId = Math.floor(Math.random() * 1000);
  
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name: randomName,
    avatar: `https://picsum.photos/64/64?user=${randomAvatarId}`
  };
}

// ========== 初始化：获取/生成当前用户 ==========
function initCurrentUser() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  } else {
    currentUser = generateRandomUser();
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
  
  const userDisplayEl = document.getElementById("currentUserDisplay");
  if (userDisplayEl) {
    userDisplayEl.innerHTML = `
      <div class="flex items-center">
        <img src="${currentUser.avatar}" alt="${currentUser.name}" class="w-8 h-8 rounded-full mr-2">
        <span>${currentUser.name}</span>
      </div>
    `;
  }
}

// ========== 后端接口：获取所有帖子（跨设备共享） ==========
async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/posts`);
    // 修复：处理接口返回非JSON的情况
    if (!res.ok) throw new Error(`接口返回错误：${res.status}`);
    const posts = await res.json();
    // 确保返回数组，避免渲染报错
    return Array.isArray(posts) ? posts : [];
  } catch (err) {
    console.error("获取帖子失败", err);
    alert("获取帖子失败，请稍后重试！");
    return [];
  }
}

// ========== 后端接口：添加新帖子 ==========
async function addPostToServer(post) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error(`发布失败：${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("发布帖子失败", err);
    alert("发布失败，请检查网络或后端服务！");
    return null;
  }
}

// ========== 后端接口：删除帖子（仅自己可删） ==========
async function deletePostFromServer(postId) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error(`删除失败：${res.status}`);
    return true;
  } catch (err) {
    console.error("删除帖子失败", err);
    alert("删除失败，请稍后重试！");
    return false;
  }
}

// ========== 后端接口：更新帖子（点赞/评论数） ==========
// 新增：专门用于更新帖子属性的接口
async function updatePost(postId, data) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`更新失败：${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("更新帖子失败", err);
    alert("操作失败，请稍后重试！");
    return null;
  }
}

// ========== 后端接口：获取评论 ==========
async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
    if (!res.ok) throw new Error(`获取评论失败：${res.status}`);
    const comments = await res.json();
    return Array.isArray(comments) ? comments : [];
  } catch (err) {
    console.error("获取评论失败", err);
    return [];
  }
}

// ========== 后端接口：添加评论 ==========
async function addCommentToServer(comment) {
  try {
    const res = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment)
    });
    if (!res.ok) throw new Error(`发布评论失败：${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("发布评论失败", err);
    alert("发布评论失败，请稍后重试！");
    return null;
  }
}

// ========== 渲染社区帖子列表（从后端拉取） ==========
async function renderCommunityPosts(filterTag = "全部") {
  const postsContainer = document.getElementById("communityPosts");
  if (!postsContainer) return;

  let communityPosts = await fetchPosts();

  // 筛选帖子（兼容标签格式）
  if (filterTag !== "全部") {
    const tag = filterTag.replace(/^#/, "");
    communityPosts = communityPosts.filter(post => 
      post.content && post.content.includes(`#${tag}`)
    );
  }

  // 空状态处理
  if (communityPosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="bg-white rounded-xl shadow-lg p-10 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
          <i class="fa fa-newspaper-o text-3xl"></i>
        </div>
        <h4 class="text-xl font-medium text-dark mb-2">暂无相关帖子</h4>
        <p class="text-gray-500 mb-6">快来发布第一条帖子吧！</p>
        <button id="emptyPublishBtn" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition">
          <i class="fa fa-pencil mr-2"></i> 发布帖子
        </button>
      </div>
    `;
    document.getElementById("emptyPublishBtn")?.addEventListener("click", () => {
      document.getElementById("publishModal")?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
    return;
  }

  // 渲染帖子（修复HTML语法错误）
  postsContainer.innerHTML = communityPosts.map(post => {
    // 补全默认值，避免属性缺失报错
    post.likes = post.likes || 0;
    post.comments = post.comments || 0;
    post.shares = post.shares || 0;
    post.isLiked = post.isLiked || false;
    post.images = post.images || [];

    // 构建图片HTML
    let imagesHtml = "";
    if (post.images.length > 0) {
      imagesHtml = post.images.length === 1 
        ? `<div class="mt-4 mb-4"><img src="${post.images[0]}" alt="帖子图片" class="w-full h-64 object-cover rounded-lg"></div>`
        : `<div class="grid grid-cols-${Math.min(post.images.length, 3)} gap-2 mt-4 mb-4">${post.images.map(img => `<img src="${img}" alt="帖子图片" class="w-full h-32 object-cover rounded-lg">`).join("")}</div>`;
    }

    // 仅自己的帖子显示删除按钮
    const deleteBtn = post.authorId === currentUser.id 
      ? `<button class="delete-post-btn absolute top-4 right-4 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition opacity-0" data-post-id="${post.id}"><i class="fa fa-trash"></i></button>`
      : "";

    return `
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 post-card relative" data-post-id="${post.id}">
        ${deleteBtn}
        <!-- 作者信息 -->
        <div class="flex items-center mb-4">
          <img src="${post.avatar}" alt="${post.author}" class="w-12 h-12 rounded-full object-cover mr-4">
          <div>
            <h4 class="font-medium text-dark">${post.author}</h4>
            <p class="text-xs text-gray-500">${formatPostTime(post.createdAt)}</p>
          </div>
        </div>
        <!-- 帖子内容 -->
        <p class="text-gray-700 mb-2">${post.content || ""}</p>
        <!-- 帖子图片 -->
        ${imagesHtml}
        <!-- 互动按钮 -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <button class="like-btn flex items-center text-gray-500 hover:text-red-500 transition ${post.isLiked ? "text-red-500" : ""}" data-post-id="${post.id}">
            <i class="fa fa-heart mr-2 ${post.isLiked ? "fa-solid" : "fa-regular"}"></i>
            <span>${post.likes}</span>
          </button>
          <button class="comment-btn flex items-center text-gray-500 hover:text-primary transition" data-post-id="${post.id}">
            <i class="fa fa-comment mr-2"></i>
            <span>${post.comments}</span>
          </button>
          <button class="share-btn flex items-center text-gray-500 hover:text-blue-500 transition" data-post-id="${post.id}">
            <i class="fa fa-share-alt mr-2"></i>
            <span>${post.shares || 0}</span>
          </button>
          <button class="collect-btn flex items-center text-gray-500 hover:text-yellow-500 transition" data-post-id="${post.id}">
            <i class="fa fa-bookmark-o mr-2"></i>
            <span>收藏</span>
          </button>
        </div>
        <!-- 评论区 -->
        <div class="comments-container mt-4 hidden">
          <div class="space-y-4 max-h-64 overflow-y-auto pr-2"></div>
          <div class="mt-4 flex items-center">
            <img src="${currentUser.avatar}" alt="我的头像" class="w-8 h-8 rounded-full object-cover mr-3">
            <input type="text" placeholder="发表评论..." class="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">
            <button class="ml-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">发布</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // 渲染完成后重新绑定事件
  bindPostInteractionEvents();
}

// ========== 工具函数：格式化帖子时间 ==========
function formatPostTime(createdAt) {
  if (!createdAt) return "未知时间";
  const now = new Date();
  const postTime = new Date(createdAt);
  const diffMs = now - postTime;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "刚刚";
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  return `${postTime.getMonth() + 1}月${postTime.getDate()}日`;
}

// ========== 绑定互动事件 ==========
function bindPostInteractionEvents() {
  // 修复：先移除旧事件，避免重复绑定
  document.querySelectorAll(".like-btn, .comment-btn, .delete-post-btn, .comments-container button").forEach(btn => {
    btn.onclick = null;
  });

  // 点赞
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", async function () {
      const postId = this.dataset.postId; // 修复：不再转数字，保持字符串ID（和后端一致）
      const post = await fetch(`${API_BASE_URL}/posts/${postId}`).then(res => res.json());
      
      const newIsLiked = !post.isLiked;
      const newLikes = newIsLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
      
      // 调用新增的updatePost函数更新
      await updatePost(postId, { isLiked: newIsLiked, likes: newLikes });
      // 重新渲染帖子列表
      await renderCommunityPosts();
    });
  });

  // 评论
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", async function () {
      const postId = this.dataset.postId;
      const postEl = this.closest("[data-post-id]");
      const commentsContainer = postEl.querySelector(".comments-container");
      const commentsList = commentsContainer.querySelector(".space-y-4");

      if (commentsContainer.classList.contains("hidden")) {
        commentsContainer.classList.remove("hidden");
        const comments = await fetchComments(postId);
        commentsList.innerHTML = comments.length === 0 
          ? `<div class="text-center py-6 text-gray-500"><i class="fa fa-comment-o text-2xl mb-2"></i><p>暂无评论，快来抢沙发吧！</p></div>`
          : comments.map(comment => `
              <div class="flex items-start">
                <img src="${comment.avatar}" alt="${comment.author}" class="w-8 h-8 rounded-full mr-3 mt-1">
                <div class="bg-gray-50 rounded-lg p-3 flex-grow">
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium text-sm">${comment.author}</span>
                    <span class="text-xs text-gray-500">${formatPostTime(comment.createdAt)}</span>
                  </div>
                  <p class="text-sm">${comment.content}</p>
                </div>
              </div>
            `).join("");
      } else {
        commentsContainer.classList.add("hidden");
      }
    });
  });

  // 发布评论
  document.querySelectorAll(".comments-container button").forEach(btn => {
    btn.addEventListener("click", async function () {
      const input = this.previousElementSibling;
      const content = input.value.trim();
      if (!content) return alert("请输入评论内容");
      
      const postId = this.closest("[data-post-id]").dataset.postId;
      const newComment = {
        postId,
        author: currentUser.name,
        avatar: currentUser.avatar,
        content,
        createdAt: new Date().toISOString()
      };
      
      const savedComment = await addCommentToServer(newComment);
      if (savedComment) {
        // 更新帖子评论数
        const post = await fetch(`${API_BASE_URL}/posts/${postId}`).then(res => res.json());
        await updatePost(postId, { comments: (post.comments || 0) + 1 });
        
        input.value = "";
        await renderCommunityPosts();
      }
    });
  });

  // 删除帖子
  document.querySelectorAll(".delete-post-btn").forEach(btn => {
    btn.addEventListener("click", async function () {
      const postId = this.dataset.postId;
      if (confirm("确定删除帖子吗？")) {
        const success = await deletePostFromServer(postId);
        if (success) {
          await renderCommunityPosts();
        }
      }
    });
  });

  // 帖子卡片hover显示删除按钮
  document.querySelectorAll(".post-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      const deleteBtn = card.querySelector(".delete-post-btn");
      if (deleteBtn) deleteBtn.style.opacity = "1";
    });
    card.addEventListener("mouseleave", () => {
      const deleteBtn = card.querySelector(".delete-post-btn");
      if (deleteBtn) deleteBtn.style.opacity = "0";
    });
  });
}

// ========== 发布新帖子 ==========
async function publishNewPost(formData) {
  if (!formData.content.trim()) return alert("请输入帖子内容");

  const newPost = {
    authorId: currentUser.id,
    author: currentUser.name,
    avatar: currentUser.avatar,
    content: formData.content.trim(),
    images: formData.images || [],
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    createdAt: new Date().toISOString()
  };

  const savedPost = await addPostToServer(newPost);
  if (savedPost) {
    document.getElementById("publishModal").classList.add("hidden");
    document.getElementById("publishPostForm").reset();
    document.getElementById("imagePreview").innerHTML = "";
    await renderCommunityPosts(); // 重新渲染
    alert("帖子发布成功！所有用户都能看到啦～");
  }
}

// ========== 页面初始化 ==========
document.addEventListener("DOMContentLoaded", async () => {
  initCurrentUser();

  // 初始化渲染帖子
  await renderCommunityPosts();

  // 标签筛选
  document.querySelectorAll(".community-tag").forEach(tag => {
    tag.addEventListener("click", async function () {
      document.querySelectorAll(".community-tag").forEach(t => {
        t.classList.remove("active", "bg-primary", "text-white");
        t.classList.add("bg-gray-100", "text-dark");
      });
      this.classList.add("active", "bg-primary", "text-white");
      await renderCommunityPosts(this.textContent.trim());
    });
  });

  // 发布帖子表单
  document.getElementById("publishPostForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("postContent").value;
    const images = [];
    const imageInput = document.getElementById("postImages");
    if (imageInput.files.length > 0) {
      for (let i = 0; i < Math.min(imageInput.files.length, 9); i++) {
        images.push(`https://picsum.photos/800/600?random=${Date.now() + i}`);
      }
    }
    await publishNewPost({ content, images });
  });

  // 模态框交互
  document.getElementById("publishBtn").addEventListener("click", () => {
    document.getElementById("publishModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
  document.getElementById("closePublishModal").addEventListener("click", () => {
    document.getElementById("publishModal").classList.add("hidden");
    document.body.style.overflow = "";
  });
  document.getElementById("cancelPublish").addEventListener("click", () => {
    document.getElementById("publishModal").classList.add("hidden");
    document.body.style.overflow = "";
  });
  document.getElementById("publishModal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("publishModal")) {
      document.getElementById("publishModal").classList.add("hidden");
      document.body.style.overflow = "";
    }
  });

  // 图片预览
  document.getElementById("postImages").addEventListener("change", function () {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = "";
    Array.from(this.files).slice(0, 9).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewItem = document.createElement("div");
        previewItem.className = "relative w-20 h-20 mr-2 mb-2";
        previewItem.innerHTML = `<img src="${e.target.result}" class="w-full h-full rounded-lg"><button class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs" onclick="this.parentElement.remove()">×</button>`;
        previewContainer.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });
  });
});
