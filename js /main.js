/* LOONOOL · 全站跳转与 Demo 交互（最终版） */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 用 localStorage 模拟登录状态
  let isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  /* ========== 首页 Home ========== */
  const btnCreateSpace = $("btn-create-space");
  if (btnCreateSpace) {
    btnCreateSpace.addEventListener("click", () => {
      if (!isLoggedIn) {
        // 未登录 → 去登录/注册
        go("login.html");
      } else {
        // 已登录 → 创建/进入一个审核空间（空状态）
        go("review-space.html");
      }
    });
  }

  /* ========== 登录 Login / Sign Up ========== */
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      const email = $("login-email")?.value || "";
      if (!email.trim()) {
        alert("请输入邮箱（Demo）");
        return;
      }
      // 这里是 Demo 登录逻辑
      localStorage.setItem("loonool_logged_in", "true");
      alert("登录成功！（Demo）");
      go("my-spaces.html");
    });
  }

  const btnBackHome = $("btn-back-home");
  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => go("index.html"));
  }

  // 预留退出登录按钮（如果你以后加）
  const btnLogout = $("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("loonool_logged_in");
      alert("已退出登录（Demo）");
      go("index.html");
    });
  }

  /* ========== 我的空间 My Spaces ========== */
  const enterButtons = document.querySelectorAll(".btn-enter-space");
  if (enterButtons.length) {
    enterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        go("review-space.html");
      });
    });
  }

  const spaceNames = document.querySelectorAll(".space-click");
  if (spaceNames.length) {
    spaceNames.forEach((el) => {
      el.addEventListener("click", () => {
        go("review-space.html");
      });
    });
  }

  /* ========== 审核空间 Review Space ========== */
  const btnUploadImages = $("btn-upload-images");
  const uploadInput = $("file-upload-input");
  const imageArea = $("image-area-text");
  const imageGrid = $("image-grid");
  const discussionBox = $("discussion-box");
  const summaryImages = $("summary-images");
  const summaryEvidence = $("summary-evidence");
  const summaryFinal = $("summary-final");
  let currentTaskIndex = 0;
  let tasks = [
    { name: "任务1", images: [], finalIndex: null },
  ];

  function refreshSummary() {
    if (!summaryImages || !summaryEvidence || !summaryFinal) return;
    const t = tasks[currentTaskIndex];
    summaryImages.textContent = `${t.images.length}/6`;
    summaryEvidence.textContent = "1 条（Demo）";
    summaryFinal.textContent =
      t.finalIndex !== null ? "已选定最终图片" : "尚未选定";
  }

  function renderImages() {
    if (!imageGrid || !imageArea) return;
    const t = tasks[currentTaskIndex];
    imageGrid.innerHTML = "";
    if (t.images.length === 0) {
      imageArea.textContent =
        "将图片拖拽到这里开始审核，或点击左侧「上传图片 Add Images」（Demo 占位）。";
      return;
    }
    imageArea.textContent = "当前任务下的候选图片（Demo 占位缩略图）：";
    t.images.forEach((name, idx) => {
      const card = document.createElement("div");
      card.className =
        "image-card" + (t.finalIndex === idx ? " image-card-final" : "");
      card.innerHTML = `
        <div style="font-weight:600; margin-bottom:4px;">候选图 ${idx + 1}</div>
        <div style="font-size:12px; color:#6b7280;">文件名：${name}</div>
        <button class="btn btn-ghost" data-idx="${idx}" style="margin-top:4px; padding:4px 8px; font-size:12px;">
          设为最终图片
        </button>
      `;
      imageGrid.appendChild(card);
    });

    imageGrid.querySelectorAll("button[data-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-idx"));
        const t = tasks[currentTaskIndex];
        t.finalIndex = idx;
        if (discussionBox) {
          const p = document.createElement("p");
          p.style.margin = "0 0 4px";
          p.style.color = "#4b5563";
          p.textContent = `系统：已将候选图 ${idx + 1} 设为本任务最终图片（Demo）。`;
          discussionBox.appendChild(p);
          discussionBox.scrollTop = discussionBox.scrollHeight;
        }
        refreshSummary();
        renderImages();
      });
    });
  }

  if (btnUploadImages && uploadInput) {
    btnUploadImages.addEventListener("click", () => {
      uploadInput.click();
    });

    uploadInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      let t = tasks[currentTaskIndex];
      files.forEach((f) => {
        if (t.images.length < 6) {
          t.images.push(f.name);
        } else {
          // 当前 Task 已满，新建 Task（简单 Demo）
          const newTask = { name: `任务${tasks.length + 1}`, images: [f.name], finalIndex: null };
          tasks.push(newTask);
          currentTaskIndex = tasks.length - 1;
          const list = document.querySelector(".task-list");
          if (list) {
            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `<span>${newTask.name}</span><span style="font-size:12px;color:#6b7280;">草稿</span>`;
            list.appendChild(li);
          }
        }
      });

      if (discussionBox) {
        const p = document.createElement("p");
        p.style.margin = "0 0 4px";
        p.style.color = "#6b7280";
        p.textContent = `系统：上传了 ${files.length} 张图片到 ${tasks[currentTaskIndex].name}（Demo）。`;
        discussionBox.appendChild(p);
        discussionBox.scrollTop = discussionBox.scrollHeight;
      }

      refreshSummary();
      renderImages();
      uploadInput.value = "";
    });
  }

  const btnSend = $("btn-send");
  const discussionInput = $("discussion-input");
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

  const btnExport = $("btn-export");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      alert("Demo：导出当前空间所有任务的 Final 图片（实际导出功能需后端实现）。");
    });
  }

  const btnViewEvidence = $("btn-view-evidence");
  if (btnViewEvidence) {
    btnViewEvidence.addEventListener("click", () => {
      go("evidence-preview.html");
    });
  }

  /* ========== Evidence Preview ========== */
  const btnEpLogin = $("btn-ep-login");
  if (btnEpLogin) {
    btnEpLogin.addEventListener("click", () => go("login.html"));
  }

  const btnEpHome = $("btn-ep-home");
  if (btnEpHome) {
    btnEpHome.addEventListener("click", () => go("index.html"));
  }

  /* ========== 404 页面 ========== */
  const btn404Home = $("btn-404-home");
  if (btn404Home) {
    btn404Home.addEventListener("click", () => go("index.html"));
  }

  const btn404Spaces = $("btn-404-myspaces");
  if (btn404Spaces) {
    btn404Spaces.addEventListener("click", () => go("my-spaces.html"));
  }

  // 初始化一次 Summary（如果在审核空间）
  refreshSummary?.();
  renderImages?.();
});
