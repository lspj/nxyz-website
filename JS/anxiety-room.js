// anxiety-room.js - 情绪空间交互功能
document.addEventListener("DOMContentLoaded", function () {
  // 初始化变量
  const room = document.getElementById("anxietyRoom");
  const breatheBtn = document.getElementById("breatheBtn");
  const calmIndicator = document.getElementById("calmIndicator");
  const anxietyLevelDisplay = document.getElementById("anxietyLevel");
  const roomElements = document.querySelectorAll(".room-element");
  const flickerElements = document.querySelectorAll(".flicker");

  // 状态变量
  let anxietyLevel = 50; // 0-100，0表示完全平静
  let isCalm = false;
  let flickerInterval;
  let mouseX = 0;
  let mouseY = 0;

  // 初始化情绪空间
  function initAnxietyRoom() {
    // 设置初始焦虑水平
    updateAnxietyLevel(anxietyLevel);

    // 开始闪烁效果
    startFlickering();

    // 初始房间元素轻微动画
    animateRoomElements();

    // 添加鼠标移动监听
    document.addEventListener("mousemove", handleMouseMove);

    // 添加呼吸按钮事件
    breatheBtn.addEventListener("click", startBreathingExercise);

    // 添加房间元素点击事件
    roomElements.forEach((element) => {
      element.addEventListener("click", function () {
        if (!isCalm) {
          // 点击时增加焦虑水平
          const increase = Math.floor(Math.random() * 5) + 3;
          updateAnxietyLevel(anxietyLevel + increase);

          // 添加点击反馈
          this.style.transform = "scale(0.95)";
          setTimeout(() => {
            this.style.transform = "";
          }, 200);
        }
      });
    });

    // 控制台提示
    console.log("情绪空间已加载");
    console.log("试试移动鼠标观察房间变化，或点击'深呼吸'按钮平静下来");
  }

  // 处理鼠标移动
  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 如果不是平静状态，根据鼠标位置影响房间
    if (!isCalm) {
      const roomRect = room.getBoundingClientRect();
      const xPercent = (mouseX - roomRect.left) / roomRect.width;
      const yPercent = (mouseY - roomRect.top) / roomRect.height;

      // 根据鼠标位置产生轻微扭曲
      roomElements.forEach((element) => {
        if (element.classList.contains("distortable")) {
          const distX = parseFloat(element.getAttribute("data-dist-x") || 0);
          const distY = parseFloat(element.getAttribute("data-dist-y") || 0);
          const speed = parseFloat(element.getAttribute("data-speed") || 0.5);

          // 计算鼠标对元素的影响
          const elemRect = element.getBoundingClientRect();
          const elemCenterX = elemRect.left + elemRect.width / 2;
          const elemCenterY = elemRect.top + elemRect.height / 2;

          const distance = Math.sqrt(
            Math.pow(mouseX - elemCenterX, 2) +
              Math.pow(mouseY - elemCenterY, 2)
          );

          // 距离越近影响越大
          const influence = Math.max(0, 1 - distance / 300);

          if (influence > 0.1) {
            const moveX =
              Math.sin(Date.now() * speed * 0.001) * distX * influence;
            const moveY =
              Math.cos(Date.now() * speed * 0.001) * distY * influence;

            element.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${
              moveX * 0.1
            }deg)`;
          } else {
            element.style.transform = "";
          }
        }
      });

      // 轻微增加焦虑水平
      if (Math.random() < 0.01) {
        // 1%的几率
        updateAnxietyLevel(anxietyLevel + 0.5);
      }
    }
  }

  // 更新焦虑水平
  function updateAnxietyLevel(newLevel) {
    // 限制范围
    anxietyLevel = Math.max(0, Math.min(100, newLevel));

    // 更新显示
    anxietyLevelDisplay.textContent = Math.round(anxietyLevel);

    // 更新平静指示器
    const calmPercent = 100 - anxietyLevel;
    calmIndicator.style.width = `${calmPercent}%`;

    // 根据焦虑水平更新房间状态
    updateRoomByAnxiety();

    // 检查是否进入平静状态
    if (anxietyLevel <= 10 && !isCalm) {
      enterCalmState();
    } else if (anxietyLevel > 10 && isCalm) {
      exitCalmState();
    }
  }

  // 根据焦虑水平更新房间
  function updateRoomByAnxiety() {
    // 计算焦虑强度 (0-1)
    const intensity = anxietyLevel / 100;

    // 更新房间元素
    roomElements.forEach((element) => {
      if (element.classList.contains("anxiety-affected")) {
        // 根据焦虑水平调整不透明度、模糊等
        const baseOpacity = parseFloat(
          element.getAttribute("data-base-opacity") || 1
        );
        const targetOpacity = baseOpacity * (1 - intensity * 0.3);
        element.style.opacity = targetOpacity;

        // 轻微模糊效果
        const blurAmount = intensity * 2;
        element.style.filter = `blur(${blurAmount}px)`;

        // 颜色偏移
        if (intensity > 0.5) {
          const hueRotate = intensity * 20;
          element.style.filter += ` hue-rotate(${hueRotate}deg)`;
        }
      }
    });

    // 更新背景
    const bgHue = 220 - intensity * 40; // 从蓝色向紫色偏移
    const bgSaturation = 20 + intensity * 30;
    const bgLightness = 90 - intensity * 20;

    room.style.background = `
            radial-gradient(circle at ${mouseX}px ${mouseY}px, 
                hsla(${bgHue}, ${bgSaturation}%, ${bgLightness}%, 0.2) 0%, 
                hsla(${bgHue - 20}, ${bgSaturation}%, ${
      bgLightness - 10
    }%, 0.1) 20%, 
                transparent 50%),
            linear-gradient(135deg, 
                hsla(${bgHue}, 10%, ${bgLightness}%, 1) 0%, 
                hsla(${bgHue - 30}, 15%, ${bgLightness - 5}%, 1) 100%)
        `;
  }

  // 开始闪烁效果
  function startFlickering() {
    flickerInterval = setInterval(() => {
      if (!isCalm && anxietyLevel > 20) {
        flickerElements.forEach((element) => {
          if (Math.random() < anxietyLevel / 200) {
            // 焦虑水平越高闪烁几率越大
            const flickerIntensity = 0.3 + Math.random() * 0.7;
            const duration = 50 + Math.random() * 150;

            element.style.opacity = flickerIntensity;

            setTimeout(() => {
              if (element) {
                element.style.opacity = "";
              }
            }, duration);
          }
        });
      }
    }, 300);
  }

  // 动画房间元素
  function animateRoomElements() {
    roomElements.forEach((element) => {
      if (element.classList.contains("floatable")) {
        const amplitude = parseFloat(
          element.getAttribute("data-float-amp") || 5
        );
        const duration = parseFloat(
          element.getAttribute("data-float-dur") || 3
        );
        const delay = Math.random() * 2;

        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      }
    });
  }

  // 开始呼吸练习
  function startBreathingExercise() {
    if (isCalm) return;

    // 禁用按钮
    breatheBtn.disabled = true;
    breatheBtn.textContent = "深呼吸中...";

    // 呼吸动画
    let breathCount = 0;
    const maxBreaths = 5;

    function breatheCycle() {
      if (breathCount >= maxBreaths) {
        // 呼吸完成
        breatheBtn.disabled = false;
        breatheBtn.textContent = "深呼吸";
        return;
      }

      // 吸气阶段 (4秒)
      room.style.animation = "breatheIn 4s ease-in-out";

      setTimeout(() => {
        // 屏气阶段 (2秒)
        room.style.animation = "holdBreath 2s ease-in-out";

        setTimeout(() => {
          // 呼气阶段 (6秒)
          room.style.animation = "breatheOut 6s ease-in-out";

          // 减少焦虑水平
          updateAnxietyLevel(anxietyLevel - 15);
          breathCount++;

          // 下一个呼吸循环
          setTimeout(breatheCycle, 6000);
        }, 2000);
      }, 4000);
    }

    // 开始第一个呼吸循环
    breatheCycle();
  }

  // 进入平静状态
  function enterCalmState() {
    isCalm = true;

    // 清除闪烁
    clearInterval(flickerInterval);

    // 停止所有动画
    roomElements.forEach((element) => {
      element.style.animation = "none";
      element.style.transform = "";
      element.style.filter = "";
      element.style.opacity = "";
    });

    // 更新房间背景为平静状态
    room.style.background = `
            radial-gradient(circle at center, 
                hsla(180, 30%, 95%, 0.3) 0%, 
                hsla(200, 20%, 90%, 0.2) 40%, 
                transparent 70%),
            linear-gradient(135deg, 
                hsla(180, 20%, 95%, 1) 0%, 
                hsla(200, 15%, 90%, 1) 100%)
        `;

    // 显示平静信息
    const calmMessage = document.createElement("div");
    calmMessage.className = "calm-message";
    calmMessage.innerHTML = `
            <h3>你已进入平静状态</h3>
            <p>房间恢复了平静。一切都会好起来的。</p>
        `;
    room.appendChild(calmMessage);

    // 5秒后自动退出平静状态
    setTimeout(() => {
      if (isCalm) {
        // 缓慢增加焦虑水平
        const anxietyIncrease = setInterval(() => {
          updateAnxietyLevel(anxietyLevel + 2);

          if (anxietyLevel >= 30) {
            clearInterval(anxietyIncrease);
            if (calmMessage.parentNode) {
              calmMessage.remove();
            }
          }
        }, 1000);
      }
    }, 5000);
  }

  // 退出平静状态
  function exitCalmState() {
    isCalm = false;

    // 重新开始闪烁
    startFlickering();

    // 重新开始动画
    animateRoomElements();

    // 移除平静信息
    const calmMessage = document.querySelector(".calm-message");
    if (calmMessage) {
      calmMessage.remove();
    }
  }

  // 页面加载时初始化情绪空间
  initAnxietyRoom();
});
