/***********************
 * 1. 读取 spaceId
 ***********************/
function getSpaceIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("spaceId"); // 比如 "space-001"
}

/***********************
 * 2. 每个 Space 的配置（假数据）
 ***********************/
const SPACE_CONFIGS = {
  "space-001": {
    spaceName: "新品包装设计审核 · 2025-Q1",
    tasks: [
      {
        id: "task-1",
        name: "任务 1 · 主 KV",
        hasFinal: true,
        images: [
          { id: "img-1", name: "kv-main.png", isFinal: true },
          { id: "img-2", name: "kv-variant-a.png", isFinal: false },
          { id: "img-3", name: "kv-variant-b.png", isFinal: false },
        ],
        evidences: [
          {
            id: "ev-1",
            title: "图形相似度初筛报告",
            type: "风险",
            who: "系统",
            time: "2025-12-03 10:12",
            summary:
              "与 3 个已注册图形存在中等相似度，建议进一步核查商标持有人与使用范围。",
          },
          {
            id: "ev-2",
            title: "品牌视觉使用规范 · KV 章节",
            type: "风格",
            who: "Li Mei",
            time: "2025-12-03 10:30",
            summary:
              "当前方案与品牌主色系、Logo 安全区及最小尺寸要求整体匹配度高。",
          },
        ],
      },
      {
        id: "task-2",
        name: "任务 2 · 备用 KV",
        hasFinal: false,
        images: [
          { id: "img-4", name: "kv-alt-1.png", isFinal: false },
          { id: "img-5", name: "kv-alt-2.png", isFinal: false },
        ],
        evidences: [
          {
            id: "ev-3",
            title: "竞品 KV 收集",
            type: "市场",
            who: "You",
            time: "2025-12-03 11:05",
            summary:
              "收集了 5 个同品类 KV，当前方案在排版结构上与主流方案有一定差异。",
          },
        ],
      },
    ],
    discussion: [
      {
        id: "m1",
        type: "system",
        text: "系统：任务 1 已创建（首张图片已上传）。",
      },
      {
        id: "m2",
        type: "system",
        text: "系统：Li Mei 上传了图片《kv-main.png》到任务 1。",
      },
      {
        id: "m3",
        type: "user",
        author: "You",
        text: "主 KV 我先标记为 Final 候选，等相似度和风格工具跑完再确认。",
      },
    ],
  },

  "space-002": {
    spaceName: "品牌 Logo 相似度审核",
    tasks: [
      {
        id: "task-1",
        name: "任务 1 · Logo 初筛",
        hasFinal: false,
        images: [
          { id: "img-10", name: "logo-v1.png", isFinal: false },
          { id: "img-11", name: "logo-v2.png", isFinal: false },
        ],
        evidences: [
          {
            id: "ev-10",
            title: "公开注册商标截图",
            type: "外部证据",
            who: "Wang Si",
            time: "2025-11-21 09:10",
            summary:
              "截取了 4 个在同一大类下已注册的图形商标，用于后续比对。",
          },
        ],
      },
    ],
    discussion: [
      {
        id: "m1",
        type: "system",
        text: "系统：已创建 Logo 相似度审核任务（任务 1）。",
      },
      {
        id: "m2",
        type: "user",
        author: "You",
        text: "这组 Logo 主要担心的是图形轮廓太接近已有商标。",
      },
    ],
  },

  "space-003": {
    spaceName: "社交媒体活动视觉素材审核",
    tasks: [], // 故意留空：演示空空间
    discussion: [
      {
        id: "m1",
        type: "system",
        text: "系统：该空间尚未上传任何图片，可以从左侧 Add Images 开始。",
      },
    ],
  },
};

/***********************
 * 3. 当前 Space 运行状态
 ***********************/
const currentSpaceId = getSpaceIdFromUrl() || "space-001";
const currentSpaceConfig =
  SPACE_CONFIGS[currentSpaceId] || SPACE_CONFIGS["space-001"];

let tasks = JSON.parse(JSON.stringify(currentSpaceConfig.tasks || []));
let discussionMessages = JSON.parse(
  JSON.stringify(currentSpaceConfig.discussion || [])
);

let currentTaskId = tasks[0]?.id || null;

/***********************
 * 4. 工具函数
 ***********************/
function getCurrentTask() {
  if (!currentTaskId) return null;
  return tasks.find((t) => t.id === currentTaskId) || null;
}

/***********************
 * 5. 左侧：Task List
 ***********************/
function renderTaskList() {
  const taskListEl = document.getElementById("taskList");
  if (!taskListEl) return;

  if (!tasks.length) {
    taskListEl.innerHTML =
      '<li class="task-item"><span class="task-meta">暂无任务，请先上传图片。</span></li>';
    return;
  }

  taskListEl.innerHTML = tasks
    .map((task, index) => {
      const imgCount = task.images.length;
      const active = task.id === currentTaskId ? "active" : "";
      const finalHtml = task.hasFinal
        ? '<span class="task-final-icon">✅</span>'
        : '<span class="task-final-placeholder">Final</span>';
      const label = task.name || `任务 ${index + 1}`;

      return `
        <li class="task-item ${active}" data-task-id="${task.id}">
          <div class="task-item-left">
            <div class="task-name">${label}</div>
            <div class="task-meta">图片：${imgCount}/6</div>
          </div>
          ${finalHtml}
        </li>
      `;
    })
    .join("");
}

/***********************
 * 6. 中间：Image Review
 ***********************/
function renderImages() {
  const task = getCurrentTask();
  const grid = document.getElementById("imageGrid");
  const empty = document.getElementById("imageEmptyState");
  const taskLabel = document.getElementById("currentTaskLabel");
  if (!grid || !empty || !taskLabel) return;

  if (!task) {
    taskLabel.textContent = "当前：暂无任务";
    empty.style.display = "block";
    grid.style.display = "none";
    return;
  }

  taskLabel.textContent = `当前：${task.name}`;

  if (!task.images.length) {
    empty.style.display = "block";
    grid.style.display = "none";
    return;
  }

  empty.style.display = "none";
  grid.style.display = "block";

  const count = task.images.length;
  grid.className = "image-grid " + (count === 1 ? "single" : "multi");

  grid.innerHTML = task.images
    .map(
      (img) => `
      <div class="image-card" data-img-id="${img.id}">
        <div class="image-thumb" data-img-id="${img.id}">
          <span>预览：${img.name}</span>
          <div class="image-thumb-overlay">
            设为 Final（预留按钮）
          </div>
        </div>
        <div class="image-meta-row">
          <div class="image-name">${img.name}</div>
          ${
            img.isFinal
              ? `<div class="image-final-tag">Final ✅</div>`
              : `<div style="font-size:11px;color:#aaa;">候选</div>`
          }
        </div>
      </div>
    `
    )
    .join("");
}

/***********************
 * 7. 中间：Discussion
 ***********************/
function renderDiscussion() {
  const box = document.getElementById("discussionMessages");
  if (!box) return;

  box.innerHTML = discussionMessages
    .map((m) => {
      if (m.type === "system") {
        return `<div class="msg-system">${m.text}</div>`;
      }
      return `
        <div class="msg-user">
          <div class="msg-user-author">${m.author}</div>
          <div class="msg-user-text">${m.text}</div>
        </div>
      `;
    })
    .join("");

  box.scrollTop = box.scrollHeight;
}

/***********************
 * 8. 右侧：Evidence Summary
 ***********************/
function renderEvidenceSummary() {
  const task = getCurrentTask();
  const el = document.getElementById("evidenceSummary");
  if (!el) return;

  if (!task) {
    el.innerHTML = `
      <div class="summary-row">
        <span class="summary-label">当前空间</span>
        <span class="summary-value">${currentSpaceConfig.spaceName}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">状态</span>
        <span class="summary-value summary-pill">尚未创建任务</span>
      </div>
    `;
    return;
  }

  const imgCount = task.images.length;
  const evCount = task.evidences.length;
  const finalImg = task.images.find((i) => i.isFinal);

  el.innerHTML = `
    <div class="summary-row">
      <span class="summary-label">当前空间</span>
      <span class="summary-value">${currentSpaceConfig.spaceName}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">任务名称</span>
      <span class="summary-value">${task.name}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">图片数量</span>
      <span class="summary-value">${imgCount}/6</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">已生成证据</span>
      <span class="summary-value">${evCount} 条</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Final 图片</span>
      <span class="summary-value">
        ${
          finalImg
            ? `已选定：${finalImg.name}`
            : `<span style="color:#c0392b;">尚未选定</span>`
        }
      </span>
    </div>
    <div class="summary-row">
      <span class="summary-label">AI 综合建议</span>
      <span class="summary-value summary-pill">
        ${
          finalImg
            ? "当前 Final 方向整体风险可控，可继续完善细节。"
            : "建议先完成相似度与风格检查，再讨论最终方案。"
        }
      </span>
    </div>
  `;
}

/***********************
 * 9. 右侧：Evidence List（带预览按钮）
 ***********************/
function renderEvidenceList() {
  const task = getCurrentTask();
  const listEl = document.getElementById("evidenceList");
  if (!listEl) return;

  if (!task || !task.evidences.length) {
    listEl.innerHTML =
      '<div class="sidebar-hint">当前任务还没有任何 Evidence，可以从下方工具或上传入口创建。</div>';
    return;
  }

  const spaceId = currentSpaceId;

  listEl.innerHTML = task.evidences
    .map(
      (ev) => `
      <div class="evidence-item">
        <div class="evidence-row-top">
          <div class="evidence-title">${ev.title}</div>
          <div class="evidence-type-pill">${ev.type}</div>
        </div>
        <div class="evidence-meta">
          ${ev.who} · ${ev.time}
        </div>
        <div class="evidence-summary">
          ${ev.summary}
        </div>
        <div class="evidence-actions">
          <button
            class="btn-secondary btn-small evidence-preview-btn"
            data-space-id="${spaceId}"
            data-task-id="${task.id}"
            data-evidence-id="${ev.id}"
          >
            查看详情
          </button>
          <button
            class="btn-secondary btn-small evidence-copy-btn"
            data-space-id="${spaceId}"
            data-task-id="${task.id}"
            data-evidence-id="${ev.id}"
          >
            复制预览链接
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

/***********************
 * 10. 图片预览 Modal
 ***********************/
function openImageModal(img) {
  const modal = document.getElementById("imageModal");
  const body = document.getElementById("imageModalBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="image-modal-thumb">
      假图预览：${img.name}
    </div>
    <div class="image-modal-name">${img.name}</div>
    <p style="font-size:12px;color:#777;margin-top:4px;">
      这里将来接真实大图预览（全屏 / 放大）。
    </p>
  `;

  modal.style.display = "flex";
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;
  modal.style.display = "none";
}

/***********************
 * 11. 事件绑定
 ***********************/
function bindEvents() {
  // 左侧：上传图片
  const addBtn = document.getElementById("addImagesBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      alert("这里将来接：系统打开文件选择窗口，支持多张图片。");
    });
  }

  // 左侧：导出结果
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      alert(
        "这里将来接：导出当前空间所有任务的 Final 图片为 zip 包（按 Task 分文件夹）。"
      );
    });
  }

  // 左侧：切换任务
  const taskListEl = document.getElementById("taskList");
  if (taskListEl) {
    taskListEl.addEventListener("click", (e) => {
      const item = e.target.closest(".task-item");
      if (!item) return;
      const id = item.getAttribute("data-task-id");
      if (!id || id === currentTaskId) return;
      currentTaskId = id;
      renderTaskList();
      renderImages();
      renderEvidenceSummary();
      renderEvidenceList();
    });
  }

  // 中间：点击图片 → 弹 Modal
  const imageGrid = document.getElementById("imageGrid");
  if (imageGrid) {
    imageGrid.addEventListener("click", (e) => {
      const thumb = e.target.closest(".image-thumb");
      if (!thumb) return;
      const imgId = thumb.getAttribute("data-img-id");
      if (!imgId) return;

      const task = getCurrentTask();
      const img = task?.images.find((i) => i.id === imgId);
      if (!img) return;

      openImageModal(img);
    });
  }

  // Modal 关闭
  const modal = document.getElementById("imageModal");
  const modalClose = document.getElementById("imageModalClose");
  if (modal && modalClose) {
    modalClose.addEventListener("click", closeImageModal);
    modal.addEventListener("click", (e) => {
      if (
        e.target === modal ||
        e.target.classList.contains("image-modal-backdrop")
      ) {
        closeImageModal();
      }
    });
  }

  // Discussion：发送消息
  const form = document.getElementById("discussionForm");
  const input = document.getElementById("discussionInput");
  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      discussionMessages.push({
        id: "user-" + Date.now(),
        type: "user",
        author: "You",
        text,
      });
      input.value = "";
      renderDiscussion();
    });
  }

  // 邀请成员
  const inviteBtn = document.getElementById("inviteBtn");
  if (inviteBtn) {
    inviteBtn.addEventListener("click", () => {
      alert(
        `这里将来接：为 Space 「${currentSpaceConfig.spaceName}」生成邀请链接。`
      );
    });
  }

  // 分析工具点击
  document.addEventListener("click", (e) => {
    const row = e.target.closest(".tool-row");
    if (row) {
      const nameEl = row.querySelector(".tool-name");
      const label = nameEl ? nameEl.textContent.trim() : "分析工具";
      alert(
        `这里将来接：执行分析工具「${label}」，针对当前 Task 图片生成结果，并可保存为 Evidence。`
      );
      return;
    }

    // Evidence 预览按钮
    const previewBtn = e.target.closest(".evidence-preview-btn");
    if (previewBtn) {
      const spaceId = previewBtn.getAttribute("data-space-id");
      const taskId = previewBtn.getAttribute("data-task-id");
      const evId = previewBtn.getAttribute("data-evidence-id");
      const url = `evidence-preview.html?spaceId=${spaceId}&taskId=${taskId}&evidenceId=${evId}`;
      window.location.href = url;
      return;
    }

    // Evidence 复制链接按钮
    const copyBtn = e.target.closest(".evidence-copy-btn");
    if (copyBtn) {
      const spaceId = copyBtn.getAttribute("data-space-id");
      const taskId = copyBtn.getAttribute("data-task-id");
      const evId = copyBtn.getAttribute("data-evidence-id");

      // 生成预览链接（本地 file:// 环境下会有点丑，但部署到服务器就正常了）
      const base =
        window.location.origin === "null" || window.location.origin === ""
          ? ""
          : window.location.origin;
      const path = window.location.pathname.replace(/[^/]*$/, "");
      const url = `${base}${path}evidence-preview.html?spaceId=${spaceId}&taskId=${taskId}&evidenceId=${evId}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(url)
          .then(() =>
            alert("预览链接已复制，可以分享给需要查看的人。")
          )
          .catch(() =>
            alert("复制失败，可以在打开预览页后从地址栏手动复制链接。")
          );
      } else {
        alert("当前环境不支持一键复制，可在打开预览页后从地址栏手动复制链接。");
      }
    }
  });
}

/***********************
 * 12. 初始化
 ***********************/
window.addEventListener("DOMContentLoaded", () => {
  if (currentSpaceConfig.spaceName) {
    document.title =
      currentSpaceConfig.spaceName + " · 审核空间 · LOONOOL 图片审核空间";
  }

  renderTaskList();
  renderImages();
  renderDiscussion();
  renderEvidenceSummary();
  renderEvidenceList();
  bindEvents();
});
