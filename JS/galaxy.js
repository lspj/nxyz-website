// galaxy.js - 【共鸣星海】无限社交化音乐银河
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const galaxyCanvas = document.getElementById("galaxyCanvas");
  const filterButtons = document.querySelectorAll(".control-btn");
  const audioPlayer = document.getElementById("audioPlayer");
  const nowPlayingSimple = document.getElementById("nowPlayingSimple");
  const currentSongSimple = document.getElementById("currentSongSimple");
  const currentArtistSimple = document.getElementById("currentArtistSimple");

  // 状态变量
  let stars = [];
  let currentFilter = "all";
  let currentPlayingStar = null;
  let isDragging = false;
  let startX, startY;
  // 增大初始偏移，让视野从画布中心区域开始
  let initialCanvasX = -1000,
    initialCanvasY = -1000;
  let canvasOffsetX = initialCanvasX,
    canvasOffsetY = initialCanvasY;

  // ==================== 1. 核心数据生成 ====================
  // 歌曲与投稿者素材库
  const songPool = [
    {
      title: "#Lov3 #Ngẫu Hứng",
      artist: "Hoaprox",
      mood: "energy",
      tags: ["电子音乐", "编程伴侣"],
    },
    {
      title: "Bloom of Youth",
      artist: "清水淳一",
      mood: "quiet",
      tags: ["纯音乐", "宁静", "钢琴"],
    },
    {
      title: "孤身",
      artist: "徐秉龙",
      mood: "quiet",
      tags: ["流行", "抒情", "夜晚"],
    },
    {
      title: "Zoo (From Zootopia 2)",
      artist: "Disney; Shakira",
      mood: "energy",
      tags: ["流行", "电影原声", "快乐"],
    },
    {
      title: "光辉岁月",
      artist: "Beyond",
      mood: "energy",
      tags: ["摇滚", "经典", "粤语"],
    },
    {
      title: "小宇",
      artist: "蓝心羽",
      mood: "quiet",
      tags: ["民谣", "温柔", "翻唱"],
    },
    {
      title: "Lowlife",
      artist: "Neck Deep",
      mood: "energy",
      tags: ["朋克", "流行朋克", "摇滚"],
    },
    {
      title: "inhuman",
      artist: "ISOxo",
      mood: "energy",
      tags: ["电子", "实验", "Bass"],
    },
    {
      title: "成都",
      artist: "赵雷",
      mood: "quiet",
      tags: ["民谣", "城市", "旅行"],
    },
    {
      title: "Can We Kiss Forever",
      artist: "Kina",
      mood: "quiet",
      tags: ["流行", "舒缓", "英文"],
    },
  ];
  const contributorPool = [
    {
      nickname: "量子猫Coder",
      emoji: "😺💻",
      intro: "深夜写码，音乐是燃料。",
      social: ["技术", "夜猫子", "开源"],
    },
    {
      nickname: "谧林",
      emoji: "🎋📖",
      intro: "在音乐中寻找内心的宁静。",
      social: ["阅读", "写作", "冥想"],
    },
    {
      nickname: "城市漫游者",
      emoji: "🚶‍♂️🌃",
      intro: "用脚步和耳机丈量城市。",
      social: ["摄影", "散步", "独处"],
    },
    {
      nickname: "欢乐饲养员",
      emoji: "🦁🎉",
      intro: "专职传播快乐，兼职听歌。",
      social: ["电影", "社交", "快乐"],
    },
    {
      nickname: "老派少年",
      emoji: "🤘🎸",
      intro: "信仰是吉他拨片和磁带。",
      social: ["摇滚", "怀旧", "KTV"],
    },
    {
      nickname: "星星收藏家",
      emoji: "⭐🧸",
      intro: "收集所有温柔的声音。",
      social: ["分享", "治愈", "小众"],
    },
    {
      nickname: "电路板诗人",
      emoji: "⚡🤖",
      intro: "用代码写诗，用电音做梦。",
      social: ["编程", "极客", "声音设计"],
    },
    {
      nickname: "星际快递员",
      emoji: "🚀📦",
      emoji: "🚀📦",
      intro: "正在派送来自宇宙的旋律。",
      social: ["科幻", "游戏", "探索"],
    },
  ];
  const contactPool = [
    "Telegram: @username_xxx",
    "邮箱: someone@example.com",
    "网易云音乐ID: MusicLover_123",
    "微信号: WeChat_123 (备注：星海)",
    "QQ群: 123456789",
    "小红书: Red_Book_User",
    "微博: Weibo_Handle",
  ];

  // galaxy.js - 【共鸣星海】- 修改部分
  // ... (文件前面的代码保持不变，直到 generateStarData 函数) ...

  // 自动生成大量星星数据的函数 (生成约500颗，其中约20%是社交星)
  function generateStarData(totalCount) {
    const data = [];
    const socialStarCount = Math.floor(totalCount * 0.2); // 例如 500 * 0.2 = 100 颗社交星
    const backgroundStarCount = totalCount - socialStarCount; // 约400颗背景星

    // 1. 生成社交星 (有完整信息)
    for (let i = 1; i <= socialStarCount; i++) {
      const song = songPool[Math.floor(Math.random() * songPool.length)];
      const contributor =
        contributorPool[Math.floor(Math.random() * contributorPool.length)];
      const mood = song.mood;

      data.push({
        id: i,
        songTitle: song.title,
        songArtist: song.artist,
        audioUrl: "assets/audio/all music/Can We Kiss Forever_ - Kina.mp3", // 社交星可配置音频
        contributor: {
          nickname: contributor.nickname,
          avatarEmoji: contributor.emoji,
          uploadTime: `2025-0${Math.floor(Math.random() * 3) + 2}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")} ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
          contactInfo:
            contactPool[Math.floor(Math.random() * contactPool.length)],
          briefIntro: contributor.intro,
        },
        tags: [...song.tags],
        socialTags: [
          ...contributor.social,
          mood === "energy" ? "寻找玩伴" : "寻找静友",
        ],
        playCount: Math.floor(Math.random() * 200) + 20,
        likeCount: Math.floor(Math.random() * 100) + 10,
        // 在 5000x5000 的画布上随机分布
        x: Math.floor(Math.random() * 5000),
        y: Math.floor(Math.random() * 5000),
        size: Math.floor(Math.random() * 8) + 24, // 24-32px，社交星稍大
        colorHue:
          mood === "energy"
            ? Math.floor(Math.random() * 60) + 10
            : Math.floor(Math.random() * 60) + 200,
        mood: mood,
        isSocialStar: true, // 标记为社交星
      });
    }

    // 2. 生成背景星 (只有基础信息)
    for (let j = 1; j <= backgroundStarCount; j++) {
      const mood = Math.random() > 0.5 ? "energy" : "quiet";
      data.push({
        id: socialStarCount + j, // 继续ID编号
        songTitle: `未命名旋律 ${j}`,
        songArtist: "未知艺术家",
        audioUrl: "", // 背景星无音频
        contributor: null, // 无投稿者信息
        tags: [mood === "energy" ? "节奏" : "氛围"],
        socialTags: [],
        playCount: Math.floor(Math.random() * 50),
        likeCount: Math.floor(Math.random() * 30),
        x: Math.floor(Math.random() * 5000),
        y: Math.floor(Math.random() * 5000),
        size: Math.floor(Math.random() * 6) + 10, // 10-16px，背景星较小
        colorHue:
          mood === "energy"
            ? Math.floor(Math.random() * 60) + 10
            : Math.floor(Math.random() * 60) + 200,
        mood: mood,
        isSocialStar: false, // 标记为背景星
      });
    }
    return data;
  }

  // 生成约500颗星星 (100社交星 + 400背景星) !! 您可以通过修改这里的数字调整总数
  const starData = generateStarData(500);

  // ==================== 2. 核心功能函数 ====================
  // 初始化无限银河
  function initGalaxy() {
    galaxyCanvas.innerHTML = "";
    stars = [];
    galaxyCanvas.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px)`;

    const filteredData = starData.filter((song) => {
      if (currentFilter === "all") return true;
      if (currentFilter === "energy" && song.mood === "energy") return true;
      if (currentFilter === "quiet" && song.mood === "quiet") return true;
      if (
        currentFilter === "social-tech" &&
        song.socialTags.some(
          (tag) =>
            tag.includes("技术") ||
            tag.includes("开发") ||
            tag.includes("极客") ||
            tag.includes("代码"),
        )
      )
        return true;
      if (
        currentFilter === "social-game" &&
        song.socialTags.some((tag) => tag.includes("游戏"))
      )
        return true;
      return false;
    });

    filteredData.forEach((song) => {
      const star = createStarElement(song);
      galaxyCanvas.appendChild(star);
      stars.push(star);
    });
    console.log(`银河初始化完成，共 ${stars.length} 颗星辰。`);
  }

  // ... (中间的代码保持不变，直到 createStarElement 函数) ...

  // 创建单个星星元素
  function createStarElement(song) {
    const star = document.createElement("div");
    star.className = "star";
    star.dataset.id = song.id;
    // 根据星星类型添加额外类名，方便后续样式区分（可选）
    if (!song.isSocialStar) {
      star.classList.add("background-star");
    }
    star.style.left = `${song.x}px`;
    star.style.top = `${song.y}px`;
    star.style.width = `${song.size}px`;
    star.style.height = `${song.size}px`;
    const brightness = 50 + (song.playCount % 30); // 背景星稍暗
    star.style.backgroundColor = `hsl(${song.colorHue}, 60%, ${brightness}%)`; // 降低饱和度
    star.style.boxShadow = `0 0 ${song.size / 1.5}px hsla(${song.colorHue}, 80%, 70%, 0.5)`;

    star.addEventListener("mouseenter", () => {
      if (!star.classList.contains("playing")) {
        star.style.transform = "scale(1.5)";
        star.style.boxShadow = `0 0 ${song.size}px hsla(${song.colorHue}, 90%, 80%, 0.7)`;
      }
    });
    star.addEventListener("mouseleave", () => {
      if (!star.classList.contains("playing")) {
        star.style.transform = "scale(1)";
        star.style.boxShadow = `0 0 ${song.size / 1.5}px hsla(${song.colorHue}, 80%, 70%, 0.5)`;
      }
    });

    // 点击事件：根据星星类型决定行为
    star.addEventListener("click", (e) => {
      e.stopPropagation();
      if (song.isSocialStar) {
        // 社交星：播放音乐并显示详细信息
        playSong(song, star);
        showStarDetailPanel(song);
      } else {
        // 背景星：只播放一个简单的点击音效（或忽略），不显示详情面板
        // 这里可以添加一个轻微的视觉反馈
        star.style.boxShadow = `0 0 ${song.size * 2}px white`;
        setTimeout(() => {
          if (!star.classList.contains("playing")) {
            star.style.boxShadow = `0 0 ${song.size / 1.5}px hsla(${song.colorHue}, 80%, 70%, 0.5)`;
          }
        }, 300);
        // 可选：播放一个通用的点击声音
        // console.log("点击了背景星:", song.id);
      }
    });
    return star;
  }

  // 播放歌曲
  function playSong(song, starElement) {
    if (currentPlayingStar && currentPlayingStar !== starElement) {
      currentPlayingStar.classList.remove("playing");
      audioPlayer.pause();
    }
    currentPlayingStar = starElement;
    starElement.classList.add("playing");

    currentSongSimple.textContent = `${song.songTitle} - ${song.contributor.nickname}`;
    currentArtistSimple.textContent = `歌手: ${song.songArtist}`;
    nowPlayingSimple.style.display = "block";

    // !! 音频播放代码注释：请取消注释以下if代码块来启用播放功能
    // if (song.audioUrl) {
    //   audioPlayer.src = song.audioUrl;
    //   audioPlayer.play().catch(e => console.error("播放失败，请检查音频路径:", song.audioUrl, e));
    // } else {
    //   console.warn("此星星未配置音频URL，仅展示社交信息。");
    //   // 可以在这里添加一个提示音或忽略
    // }
  }

  // 显示星星的详细信息面板
  function showStarDetailPanel(song) {
    const oldPanel = document.getElementById("starDetailPanel");
    if (oldPanel) oldPanel.remove();
    const panel = document.createElement("div");
    panel.id = "starDetailPanel";
    panel.className = "star-detail-panel";
    panel.innerHTML = `
      <div class="panel-header">
        <button class="close-panel-btn">&times;</button>
        <h3>${song.songTitle}</h3>
        <p class="song-artist">${song.songArtist}</p>
      </div>
      <div class="panel-body">
        <div class="contributor-section">
          <div class="contributor-header">
            <span class="contributor-avatar">${song.contributor.avatarEmoji}</span>
            <div>
              <h4>👤 ${song.contributor.nickname}</h4>
              <p class="upload-time">⏱️ 点亮于 ${song.contributor.uploadTime}</p>
            </div>
          </div>
          <p class="contributor-intro">💬 ${song.contributor.briefIntro}</p>
        </div>
        <div class="social-section">
          <h4>🤝 想结识这样的人：</h4>
          <div class="social-tags">
            ${song.socialTags.map((tag) => `<span class="social-tag">${tag}</span>`).join("")}
          </div>
        </div>
        <div class="contact-section">
          <h4>📮 联系方式：</h4>
          <p class="contact-info">${song.contributor.contactInfo}</p>
          <button class="action-btn" id="copyContactBtn">📋 复制联系方式</button>
          <button class="action-btn secondary" id="sendSignalBtn">✨ 发送问候信号</button>
        </div>
        <div class="song-info-section">
          <p><strong>🎵 歌曲标签：</strong> ${song.tags.join(" · ")}</p>
          <p><strong>📈 互动数据：</strong> ❤️ ${song.likeCount}  |  ▶️ ${song.playCount}</p>
        </div>
      </div>
    `;
    document.querySelector(".galaxy-container").appendChild(panel);
    panel
      .querySelector(".close-panel-btn")
      .addEventListener("click", () => panel.remove());
    panel.querySelector("#copyContactBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(song.contributor.contactInfo).then(() => {
        alert("联系方式已复制到剪贴板！");
      });
    });
    panel.querySelector("#sendSignalBtn").addEventListener("click", () => {
      alert(
        `✨ 一道载着问候的星光飞向了 ${song.contributor.nickname} 的星辰！`,
      );
    });
  }

  // 无限画布拖拽功能
  function initDragToPan() {
    galaxyCanvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX - canvasOffsetX;
      startY = e.clientY - canvasOffsetY;
      galaxyCanvas.style.cursor = "grabbing";
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      canvasOffsetX = e.clientX - startX;
      canvasOffsetY = e.clientY - startY;
      galaxyCanvas.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px)`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      galaxyCanvas.style.cursor = "grab";
    });
    galaxyCanvas.style.cursor = "grab";
  }

  // ==================== 事件监听器绑定 ====================
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      initGalaxy();
    });
  });
  galaxyCanvas.addEventListener("click", (e) => {
    if (e.target === galaxyCanvas) {
      const panel = document.getElementById("starDetailPanel");
      if (panel) panel.remove();
    }
  });

  // ==================== 初始化执行 ====================
  initGalaxy();
  initDragToPan();
  // ==================== 新增：创建新星功能 ====================
  // 1. 处理画布空白处点击，显示“创建新星”入口
  function initCreateStarOnCanvasClick() {
    galaxyCanvas.addEventListener("click", function (e) {
      // 只有点击到画布本身（即空白处），且没有点击到任何 .star 元素时，才触发创建流程
      if (e.target === galaxyCanvas) {
        // 先检查是否已有详情面板，有则关闭
        const oldPanel = document.getElementById("starDetailPanel");
        if (oldPanel) oldPanel.remove();

        // 检查是否已有“建新”入口，避免重复创建
        const existingCreator = document.getElementById("createStarEntry");
        if (existingCreator) {
          existingCreator.remove();
          return;
        }

        // 计算点击位置（相对于画布）
        const rect = galaxyCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left - canvasOffsetX; // 点击的X坐标（虚拟画布坐标系）
        const clickY = e.clientY - rect.top - canvasOffsetY; // 点击的Y坐标（虚拟画布坐标系）

        // 创建“建新”入口按钮
        const createEntry = document.createElement("div");
        createEntry.id = "createStarEntry";
        createEntry.className = "create-star-entry";
        createEntry.style.position = "absolute";
        createEntry.style.left = `${clickX}px`;
        createEntry.style.top = `${clickY}px`;
        createEntry.style.transform = "translate(-50%, -50%)"; // 使按钮中心对准点击点
        createEntry.innerHTML = `
        <button id="startCreateBtn" class="create-entry-btn">✨ 在此新建星辰</button>
      `;
        galaxyCanvas.appendChild(createEntry);

        // 为“新建星辰”按钮绑定事件，点击后显示详细表单
        document
          .getElementById("startCreateBtn")
          .addEventListener("click", function (ev) {
            ev.stopPropagation(); // 防止事件冒泡到画布
            showCreateStarForm(clickX, clickY); // 传入坐标，用于创建新星
            createEntry.remove(); // 移除入口按钮
          });

        // 点击画布其他位置时移除入口按钮（通过事件冒泡到画布的事件处理）
      }
    });
  }

  // 2. 显示创建新星的详细表单
  function showCreateStarForm(x, y) {
    const oldPanel = document.getElementById("starDetailPanel");
    if (oldPanel) oldPanel.remove();

    const formPanel = document.createElement("div");
    formPanel.id = "starDetailPanel"; // 复用详情面板的ID和样式
    formPanel.className = "star-detail-panel";
    formPanel.innerHTML = `
    <div class="panel-header">
      <button class="close-panel-btn">&times;</button>
      <h3>✨ 创造你的星辰</h3>
      <p class="song-artist">为这片星海贡献你的旋律与故事</p>
    </div>
    <div class="panel-body">
      <form id="newStarForm">
        <!-- 歌曲信息 -->
        <div class="form-section">
          <h4>🎵 歌曲信息</h4>
          <div class="form-group">
            <label for="newSongTitle">歌曲标题 *</label>
            <input type="text" id="newSongTitle" placeholder="例如：#Lov3 #Ngẫu Hứng" required>
          </div>
          <div class="form-group">
            <label for="newSongArtist">演唱者/艺术家 *</label>
            <input type="text" id="newSongArtist" placeholder="例如：Hoaprox" required>
          </div>
          <div class="form-group">
            <label>歌曲心情 *</label>
            <div class="radio-group">
              <label><input type="radio" name="newMood" value="energy" checked> 活力节拍</label>
              <label><input type="radio" name="newMood" value="quiet"> 静谧时光</label>
            </div>
          </div>
          <div class="form-group">
            <label for="newSongTags">歌曲标签 (用逗号分隔)</label>
            <input type="text" id="newSongTags" placeholder="电子音乐, 编程伴侣, 推荐">
          </div>
        </div>

        <!-- 投稿者信息 -->
        <div class="form-section">
          <h4>👤 关于你</h4>
          <div class="form-group">
            <label for="newNickname">你的昵称 *</label>
            <input type="text" id="newNickname" placeholder="例如：量子猫Coder" required>
          </div>
          <div class="form-group">
            <label for="newAvatarEmoji">代表你的表情 (可选)</label>
            <input type="text" id="newAvatarEmoji" placeholder="😺💻" maxlength="4">
          </div>
          <div class="form-group">
            <label for="newBriefIntro">一句简单的介绍 *</label>
            <textarea id="newBriefIntro" rows="2" placeholder="深夜写码，音乐是燃料。" required></textarea>
          </div>
          <div class="form-group">
            <label for="newContactInfo">联系方式 *</label>
            <input type="text" id="newContactInfo" placeholder="例如：Telegram: @yourname" required>
          </div>
        </div>

        <!-- 社交标签 -->
        <div class="form-section">
          <h4>🤝 你想结识什么样的人？</h4>
          <div class="form-group">
            <label for="newSocialTags">社交标签 (用逗号分隔)</label>
            <input type="text" id="newSocialTags" placeholder="技术, 夜猫子, 开源, 游戏">
            <small>系统会根据你的“歌曲心情”自动添加“寻找玩伴”或“寻找静友”标签。</small>
          </div>
        </div>

        <!-- 表单操作按钮 -->
        <div class="form-actions">
          <button type="button" class="action-btn secondary" id="cancelCreateBtn">取消</button>
          <button type="submit" class="action-btn" id="submitStarBtn">点亮这颗星！</button>
        </div>
      </form>
    </div>
  `;

    document.querySelector(".galaxy-container").appendChild(formPanel);

    // 关闭面板按钮事件
    formPanel
      .querySelector(".close-panel-btn")
      .addEventListener("click", () => formPanel.remove());

    // 取消按钮事件
    formPanel
      .querySelector("#cancelCreateBtn")
      .addEventListener("click", () => formPanel.remove());

    // 表单提交事件
    formPanel
      .querySelector("#newStarForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        createNewStar(x, y); // 调用创建函数，传入坐标
        formPanel.remove();
      });
  }

  // 3. 创建新星的核心逻辑
  function createNewStar(x, y) {
    // 获取表单数据
    const songTitle = document.getElementById("newSongTitle").value.trim();
    const songArtist = document.getElementById("newSongArtist").value.trim();
    const mood = document.querySelector('input[name="newMood"]:checked').value;
    const songTags = document
      .getElementById("newSongTags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const nickname = document.getElementById("newNickname").value.trim();
    const avatarEmoji =
      document.getElementById("newAvatarEmoji").value.trim() || "⭐"; // 默认表情
    const briefIntro = document.getElementById("newBriefIntro").value.trim();
    const contactInfo = document.getElementById("newContactInfo").value.trim();
    const socialTagsInput = document
      .getElementById("newSocialTags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const moodSocialTag = mood === "energy" ? "寻找玩伴" : "寻找静友";
    const socialTags = [...socialTagsInput, moodSocialTag];

    // 生成新的星星数据对象
    const newStar = {
      id: starData.length + 1, // 生成一个新ID
      songTitle: songTitle || "未命名旋律",
      songArtist: songArtist || "未知艺术家",
      audioUrl: "assets/audio/all music/Can We Kiss Forever_ - Kina.mp3", // 使用默认音频，或留空
      contributor: {
        nickname: nickname || "匿名星旅人",
        avatarEmoji: avatarEmoji,
        uploadTime: new Date()
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\//g, "-"),
        contactInfo: contactInfo,
        briefIntro: briefIntro,
      },
      tags:
        songTags.length > 0 ? songTags : [mood === "energy" ? "节奏" : "氛围"],
      socialTags: socialTags,
      playCount: 1, // 新建星星初始播放次数
      likeCount: 1, // 新建星星初始点赞数
      x: Math.max(0, Math.min(4999, Math.floor(x))), // 确保坐标在画布(5000x5000)范围内
      y: Math.max(0, Math.min(4999, Math.floor(y))),
      size: Math.floor(Math.random() * 8) + 24, // 尺寸与现有社交星一致
      colorHue:
        mood === "energy"
          ? Math.floor(Math.random() * 60) + 10
          : Math.floor(Math.random() * 60) + 200, // 根据心情决定色调
      mood: mood,
      isSocialStar: true, // 标记为可交互的社交星
    };

    // 将新星星数据添加到全局数组
    starData.push(newStar);
    console.log("新星已创建:", newStar);

    // 重新初始化银河，使新星立即可见
    initGalaxy();

    // 可选：给用户一个成功提示
    alert(`✨ 成功！你的星辰“${newStar.songTitle}”已点亮在星海中。`);
  }

  initGalaxy();
  initDragToPan();
  initCreateStarOnCanvasClick(); // 新增：初始化“点击创建”功能
  console.log(
    "【共鸣星海】已加载完毕。拖拽画布漫游，点击星星结识同好，点击空白处创建属于你的星辰！",
  );
  console.log("【共鸣星海】已加载完毕。拖拽画布漫游，点击星星结识同好！");
});
