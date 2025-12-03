/* LOONOOL · 全站跳转与审核空间 Demo 逻辑（最终版） */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // --------------------
  // 全局登录状态（localStorage 模拟）
  // --------------------
  let isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  // ====================
  // 1. 首页 Home
  // ====================
  const btnCreateSpace = $("btn-create-space");
  if (btnCreateSpace) {
    btnCreateSpace.addEventListener("click", () => {
      if (!isLoggedIn) {
        // 未登录 → 注册/登录页
        go("login.html");
      } else {
        // 已登录 → 审核空间（空状态 Demo）
        go("review-space.html");
      }
    });
  }

  // ====================
  // 2. 登录 Login / 注册
  // ====================
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      const email = $("login-email")?.value || "";
      if (!email.trim()) {
        alert("请输入邮箱（Demo）");
        return;
      }
      // Demo：直接视为登录成功
      localStorage.setItem("loonool_logged_in", "true");
      alert("登录成功！（Demo）");
      go("my-spaces.html");
    });
  }

  const btnBackHome = $("btn-back-home");
  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => go("index.html"));
  }

  // 预留：退出登录按钮（如果页面上有 id="btn-logout"）
  const btnLogout = $("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("loonool_logged_in");
      alert("已退出登录（Demo）");
      go("index.html");
    });
  }

  // ====================
  // 3. 我的空间 My Spaces
  // ====================
  const enterButtons = document.querySelectorAll(".btn-enter-space");
  if (enterButtons.length) {
    enterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // 点击“进入空间” → 审核空间
        go("review-space.html");
      });
    });
  }

  const spaceNames = document.querySelectorAll(".space-click");
  if (spaceNames.length) {
    spaceNames.forEach((el) => {
      el.addEventListener("click", () => {
        // 点击 Space 名称 → 审核空间
        go("review-space.html");
      });
    });
  }

  // ====================
  // 4. 审核空间 Review Space
  // ====================
  const btnUploadImages = $("btn-upload-images");      // 上传按钮
  const uploadInput = $("file-upload-input");          // 隐藏的 file input
  const imageArea = $("image-area-text");              // 中间空状态文字区域
  const imageGrid = $("image-grid");                   // 图片网格区域
  const discussionBox = $("discussion-box");           // 讨论区内容
  const discussionInput = $("discussion-input");       // 讨论输入框
  const btnSend = $("btn-send");                       // 讨论发送按钮

  const summaryImages = $("summary-images");           // Summary：图片数量
  const summaryEvidence = $("summary-evidence");       // Summary：证据数量（Demo）
  const summaryFinal = $("summary-final");             // Summary：Final 状态

  // 任务列表 DOM
  const taskListElement = document.querySelector(".task-list");
  const taskItems = taskListElement
    ? taskListElement.querySelectorAll(".task-item")
    : [];

  // ---- Task 数据结构（前端 Demo） ----
  let tasks = [];
  let currentTaskIndex = 0;

  if (taskItems.length) {
    // 根据现有 li.task-item 初始化 tasks
    taskItems.forEach((li, index) => {
      const nameSpan = li.querySelector("span");
      const name = nameSpan ? nameSpan.textContent.trim() : `任务${index + 1}`;
      li.dataset.index = String(index);
      tasks.push({
        name,
        images: [],      // 当前 Task 下的图片文件名列表（Demo）
        finalIndex: null // 最终图片在 images 数组中的索引
      });
    });
  }

  // ---- 工具函数：刷新右侧 Summary ----
  function refreshSummary() {
    if (!tasks.length) return;
    const t = tasks[currentTaskIndex];
    if (summaryImages) summaryImages.textContent = `${t.images.length}/6`;
    if (summaryEvidence) summaryEvidence.textContent = "1 条（Demo）";
    if (summaryFinal) {
      summaryFinal.textContent =
        t.finalIndex !== null ? "已选定最终图片" : "尚未选定";
    }
  }

  // ---- 工具函数：重新渲染当前 Task 的图片网格 ----
  function renderImages() {
    if (!tasks.length || !imageGrid || !imageArea) return;

    const t = tasks[currentTaskIndex];
    imageGrid.innerHTML = "";

    if (t.images.length === 0) {
      imageArea.textContent =
        "将图片拖拽到这里开始审核，或点击左侧「上传图片 Add Images」（当前任务暂无图片，Demo）。";
      return;
    }

    imageArea.textContent = `当前 ${t.name} 下的候选图片（Demo 占位缩略图）：`;

    t.images.forEach((name, idx) => {
      const card = document.createElement("div");
      card.className =
        "image-card" + (t.finalIndex === idx ? " image-card-final" : "");
      card.innerHTML = `
        <div style="font-weight:600; margin-bottom:4px;">候选图 ${idx + 1}</div>
        <div style="font-size:12px; color:#6b7280;">文件名：${name}</div>
        <button class="btn btn-ghost" data-idx="${idx}"
                style="margin-top:4px; padding:4px 8px; font-size:12px;">
          设为最终图片
        </button>
      `;
      imageGrid.appendChild(card);
    });

    // 给“设为最终图片”绑定点击事件
    imageGrid.querySelectorAll("button[data-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        const t = tasks[currentTaskIndex];
        t.finalIndex = idx;

        // 在 Discussion 中插入系统消息
        if (discussionBox) {
          const p = document.createElement("p");
          p.style.margin = "0 0 4px";
          p.style.color = "#4b5563";
          p.textContent = `系统：已将候选图 ${idx + 1} 设为 ${t.name} 的最终图片（Demo）。`;
          discussionBox.appendChild(p);
          discussionBox.scrollTop = discussionBox.scrollHeight;
        }

        refreshSummary();
        renderImages();
      });
    });
  }

  // ---- 工具函数：切换当前 Task ----
  function setActiveTask(index) {
    if (!tasks.length) return;
    currentTaskIndex = index;

    // 切换左侧任务栏的 active 样式
    if (taskItems.length) {
      taskItems.forEach((li) => li.classList.remove("active"));
      const activeLi = taskListElement.querySelector(
        `.task-item[data-index="${index}"]`
      );
      if (activeLi) activeLi.classList.add("active");
    }

    // 在讨论区插入系统消息（提示已切换任务）
    if (discussionBox) {
      const p = document.createElement("p");
      p.style.margin = "0 0 4px";
      p.style.color = "#6b7280";
      p.textContent = `系统：已切换到 ${tasks[index].name}（Demo，讨论记录未做任务级分离）。`;
      discussionBox.appendChild(p);
      discussionBox.scrollTop = discussionBox.scrollHeight;
    }

    refreshSummary();
    renderImages();
  }

  // ---- 点击任务列表项：切换当前 Task ----
  if (taskItems.length && tasks.length) {
    taskItems.forEach((li) => {
      li.addEventListener("click", () => {
        const idx = Number(li.dataset.index || "0");
        setActiveTask(idx);
      });
    });
  }

  // ---- 上传图片按钮：打开系统文件选择窗口 ----
  if (btnUploadImages && uploadInput && tasks.length) {
    // 点击按钮 → 打开文件选择
    btnUploadImages.addEventListener("click", () => {
      uploadInput.click();
    });

    // 文件选择完成 → 分配到当前 Task（超过 6 张则自动创建新 Task）
    uploadInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      files.forEach((file) => {
        let currentTask = tasks[currentTaskIndex];
        if (currentTask.images.length < 6) {
          currentTask.images.push(file.name);
        } else {
          // 当前 Task 已满 → 新建 Task（符合规则 3 Demo）
          const newIndex = tasks.length;
          const newTask = {
            name: `任务${newIndex + 1}`,
            images: [file.name],
            finalIndex: null
          };
          tasks.push(newTask);

          // 在左侧 DOM 中追加一个任务项
          if (taskListElement) {
            const li = document.createElement("li");
            li.className = "task-item";
            li.dataset.index = String(newIndex);
            li.innerHTML = `
              <span>${newTask.name}</span>
              <span style="font-size:12px;color:#6b7280;">草稿</span>
            `;
            taskListElement.appendChild(li);

            // 给新 Task 绑定点击事件
            li.addEventListener("click", () => {
              const idx = Number(li.dataset.index || "0");
              setActiveTask(idx);
            });
          }

          // 自动切换到新建 Task
          setActiveTask(newIndex);
        }
      });

      // 在讨论区插入“上传图片”系统消息
      if (discussionBox) {
        const p = document.createElement("p");
        p.style.margin = "0 0 4px";
        p.style.color = "#6b7280";
        p.textContent = `系统：向 ${tasks[currentTaskIndex].name} 上传了 ${files.length} 张图片（Demo）。`;
        discussionBox.appendChild(p);
        discussionBox.scrollTop = discussionBox.scrollHeight;
      }

      refreshSummary();
      renderImages();
      uploadInput.value = ""; // 清空 input，方便下次上传同样文件
    });
  }

  // ---- 讨论区发送按钮 ----
  if (btnSend && discussionInput && discussionBox) {
    btnSend.addEventListener("click", () => {
      const text = discussionInput.value.trim();
      if (!text) return;
      const p = document.createElement("p");
      p.style.margin = "0 0 4px";
      p.style.color = "#4b5563";
      p.textContent = `你：${text}`;
      discussionBox.appendChild(p);
      discussionBox.scrollTop = discussionBox.scrollHeight;
      discussionInput.value = "";
    });
  }

  // ---- 导出结果（Demo 提示） ----
  const btnExport = $("btn-export");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      alert("Demo：导出当前空间所有任务的 Final 图片（实际导出需后端实现）。");
    });
  }

  // ---- 点击“查看在线预览” → Evidence Preview ----
  const btnViewEvidence = $("btn-view-evidence");
  if (btnViewEvidence) {
    btnViewEvidence.addEventListener("click", () => {
      go("evidence-preview.html");
    });
  }

  // ====================
  // 5. 证据在线预览页面
  // ====================
  const btnEpLogin = $("btn-ep-login");
  if (btnEpLogin) {
    btnEpLogin.addEventListener("click", () => go("login.html"));
  }

  const btnEpHome = $("btn-ep-home");
  if (btnEpHome) {
    btnEpHome.addEventListener("click", () => go("index.html"));
  }

  // ====================
  // 6. 404 页面
  // ====================
  const btn404Home = $("btn-404-home");
  if (btn404Home) {
    btn404Home.addEventListener("click", () => go("index.html"));
  }

  const btn404Spaces = $("btn-404-myspaces");
  if (btn404Spaces) {
    btn404Spaces.addEventListener("click", () => go("my-spaces.html"));
  }

  // 初始化一次 Summary / 图片显示（如果在审核空间页面）
  if (tasks.length) {
    refreshSummary();
    renderImages();
  }
});
