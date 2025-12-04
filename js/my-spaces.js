// ================== 1. 假数据：Space 列表 ==================
const spaces = [
  {
    id: "space-001",
    name: "新品包装设计审核",              // 👈 你希望排在最上面的
    owner: "Li Mei",
    taskCount: 4,
    lastUpdated: "2025-12-01 16:20",       // 时间最新 → 排第一
  },
  {
    id: "space-002",
    name: "新品包装设计审核 · 2025-Q1",
    owner: "Li Mei",
    taskCount: 8,
    lastUpdated: "2025-12-01 15:32",
  },
  {
    id: "space-003",
    name: "品牌 Logo 相似度审核",
    owner: "Wang Si",
    taskCount: 3,
    lastUpdated: "2025-11-20 10:05",
  },
];

// ================== 2. 按更新时间排序（最新排最上） ==================
spaces.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

// ================== 3. 渲染 Space 列表 ==================
function renderSpaces() {
  const container = document.getElementById("spacesContainer");
  if (!container) return;

  // 有空间 → 渲染表格
  if (spaces.length > 0) {
    container.innerHTML = `
      <table class="spaces-table">
        <thead>
          <tr>
            <th class="spaces-col-name">Space Name</th>
            <th class="spaces-col-owner">Owner</th>
            <th class="spaces-col-tasks">Task Count</th>
            <th class="spaces-col-updated">Last Updated</th>
            <th class="spaces-col-action"></th>
          </tr>
        </thead>
        <tbody>
          ${spaces
            .map(
              (s) => `
            <tr data-space-id="${s.id}">
              <td class="spaces-col-name">
                <button class="link-button space-link" data-space-id="${s.id}">
                  ${s.name}
                </button>
              </td>
              <td class="spaces-col-owner">${s.owner}</td>
              <td class="spaces-col-tasks">${s.taskCount}</td>
              <td class="spaces-col-updated">${s.lastUpdated}</td>
              <td class="spaces-col-action">
                <button class="btn-ghost enter-space-btn" data-space-id="${s.id}">
                  进入空间
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } else {
    // 空状态（当前先写一个简单提示，你以后可以替换成更漂亮的空状态）
    container.innerHTML = `
      <div class="spaces-empty">
        你还没有任何图片审核空间。
        <button id="createSpaceFromEmpty" class="btn-primary">
          创建新的审核空间
        </button>
      </div>
    `;
  }
}

// ================== 4. 绑定事件 ==================
function bindMySpacesEvents() {
  // 顶部“创建新的审核空间”按钮
  const createBtn = document.getElementById("createSpaceFromList");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      // 现在先简单跳到 review-space 页面
      window.location.href = "review-space.html";
    });
  }

  // 若空状态里有一个按钮，也绑定一下
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.id === "createSpaceFromEmpty") {
      window.location.href = "review-space.html";
      return;
    }

    // 点击 Space 名称
    if (target.classList.contains("space-link")) {
      const spaceId = target.getAttribute("data-space-id");
      window.location.href = `review-space.html?spaceId=${spaceId}`;
    }

    // 点击“进入空间”
    if (target.classList.contains("enter-space-btn")) {
      const spaceId = target.getAttribute("data-space-id");
      window.location.href = `review-space.html?spaceId=${spaceId}`;
    }
  });
}

// ================== 5. 页面加载完成后执行 ==================
window.addEventListener("DOMContentLoaded", () => {
  renderSpaces();
  bindMySpacesEvents();
});
