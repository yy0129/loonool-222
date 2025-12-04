// js/main.js
// LOONOOL · 第 1 阶段：Supabase Auth + Space / Task 流转逻辑

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * TODO：这里换成你自己的 Supabase 项目配置
 * 在 Supabase 控制台 Settings → API 里可以找到：
 *  - Project URL
 *  - anon public
 */
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co"; // ← 替换
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";               // ← 替换

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 小工具：获取当前登录用户（没有就返回 null）
async function getCurrentUserOrNull() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("getUser error:", error);
      return null;
    }
    return data.user;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// 小工具：页面跳转
const go = (url) => (window.location.href = url);

document.addEventListener("DOMContentLoaded", () => {
  initHome();
  initAuthPage();
  initMySpaces();
  initReviewSpace();
  init404Page();
});

/* =========================
 * 1. 首页 Home：创建图片审核空间
 * ========================= */
// index.html 需要有：
// <button id="btn-create-space">创建图片审核空间</button>
function initHome() {
  const btn = document.getElementById("btn-create-space");
  if (!btn) return; // 不在首页就跳过

  btn.addEventListener("click", async () => {
    const user = await getCurrentUserOrNull();

    // 未登录 → 去登录页
    if (!user) {
      go("login.html");
      return;
    }

    // 已登录 → 创建 Space + Task1
    try {
      // 1) 创建空间
      const spaceName = "未命名审核空间";
      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .insert({
          name: spaceName,
          owner_id: user.id,
          task_count: 1, // 先写 1，表示至少有 Task1
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (spaceError) {
        console.error("create space error:", spaceError);
        alert("创建审核空间失败，请稍后重试。");
        return;
      }

      const spaceId = space.id;

      // 2) 创建 Task1
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
          space_id: spaceId,
          title: "任务1",
        })
        .select("id")
        .single();

      if (taskError) {
        console.error("create task error:", taskError);
        alert("创建任务失败，请稍后重试。");
        return;
      }

      const taskId = task.id;

      // 3) 跳转到 review-space.html?spaceId=...&taskId=...
      go(
        `review-space.html?spaceId=${encodeURIComponent(
          spaceId
        )}&taskId=${encodeURIComponent(taskId)}`
      );
    } catch (e) {
      console.error(e);
      alert("创建空间时发生异常，请查看控制台。");
    }
  });
}

/* =========================
 * 2. 登录 / 注册页面：Supabase Auth
 * ========================= */
// login.html 需要有：
//  input#auth-email, input#auth-password
//  div#auth-error
//  button#btn-login, button#btn-signup
function initAuthPage() {
  const emailInput = document.getElementById("auth-email");
  const passInput = document.getElementById("auth-password");
  const errorBox = document.getElementById("auth-error");
  const btnLogin = document.getElementById("btn-login");
  const btnSignup = document.getElementById("btn-signup");

  if (!emailInput || !passInput || !errorBox) return; // 不在 login 页面

  const showError = (msg) => {
    errorBox.textContent = msg || "";
  };

  // 登录
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      showError("");
      const email = emailInput.value.trim();
      const password = passInput.value;

      if (!email || !password) {
        showError("请输入邮箱和密码。");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("login error:", error);
        showError("登录失败：" + error.message);
        return;
      }

      // 登录成功 → My Spaces
      go("my-spaces.html");
    });
  }

  // 注册
  if (btnSignup) {
    btnSignup.addEventListener("click", async () => {
      showError("");
      const email = emailInput.value.trim();
      const password = passInput.value;

      if (!email || !password) {
        showError("请输入邮箱和密码。");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("signup error:", error);
        showError("注册失败：" + error.message);
        return;
      }

      showError("注册成功，请查收验证邮件，然后再登录。");
    });
  }
}

/* =========================
 * 3. My Spaces：从 Supabase 读取 Space 列表
 * ========================= */
// my-spaces.html 需要有：
//  <div id="spaces-list"></div>
//  <div id="spaces-empty" style="display:none;">空状态文案...</div>
async function initMySpaces() {
  const listEl = document.getElementById("spaces-list");
  if (!listEl) return; // 不在 my-spaces 页面

  const emptyEl = document.getElementById("spaces-empty");

  const user = await getCurrentUserOrNull();
  if (!user) {
    // 未登录 → 去登录页
    go("login.html");
    return;
  }

  // 从 Supabase 拉取当前用户的所有 Space
  const { data: spaces, error } = await supabase
    .from("spaces")
    .select("id, name, owner_id, task_count, updated_at")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("load spaces error:", error);
    listEl.textContent = "加载空间列表失败，请稍后重试。";
    return;
  }

  if (!spaces || spaces.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }

  spaces.forEach((space) => {
    const card = document.createElement("div");
    card.className = "space-card";

    const lastUpdatedText = space.updated_at
      ? new Date(space.updated_at).toLocaleString()
      : "未知时间";

    const taskCountText =
      typeof space.task_count === "number" ? space.task_count : "—";

    card.innerHTML = `
      <div>
        <div class="space-name space-click">${space.name || "未命名空间"}</div>
        <div class="space-meta">
          Owner: ${space.owner_id.slice(0, 8)}… · 
          Task Count: ${taskCountText} · 
          Last Updated: ${lastUpdatedText}
        </div>
      </div>
      <button class="btn btn-outline btn-enter-space">进入空间</button>
    `;

    // 点击逻辑：先查这个 space 的第一个 Task，再跳转
    const goToSpace = async () => {
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .select("id")
        .eq("space_id", space.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (taskError) {
        console.error("load first task error:", taskError);
        alert("未找到该空间的任务，请检查数据库。");
        return;
      }

      const taskId = task.id;
      go(
        `review-space.html?spaceId=${encodeURIComponent(
          space.id
        )}&taskId=${encodeURIComponent(taskId)}`
      );
    };

    const btn = card.querySelector(".btn-enter-space");
    const nameEl = card.querySelector(".space-name");
    if (btn) btn.addEventListener("click", goToSpace);
    if (nameEl) nameEl.addEventListener("click", goToSpace);

    listEl.appendChild(card);
  });
}

/* =========================
 * 4. Review Space：上传按钮 + Task 切换（UI 版）
 * ========================= */
// review-space.html 需要有：
//
// 上传：
//  <button id="btn-upload-images">…</button>
//  <input id="file-upload-input" type="file" multiple style="display:none" />
//  <div id="image-area-text"></div>
//
// 任务：
//  <li class="task-item active"><span>任务1 …</span></li>
//  <span id="current-task-title">任务1…</span>
//  <span id="summary-task-title">任务1…</span>
//
function initReviewSpace() {
  const uploadBtn = document.getElementById("btn-upload-images");
  const fileInput = document.getElementById("file-upload-input");
  const imageAreaText = document.getElementById("image-area-text");

  const taskItems = document.querySelectorAll(".task-item");
  const currentTaskTitle = document.getElementById("current-task-title");
  const summaryTaskTitle = document.getElementById("summary-task-title");

  // 上传图片按钮 → 打开系统 file 选择
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      if (imageAreaText) {
        imageAreaText.textContent = `已选择 ${files.length} 张图片（当前仅做 UI 示意，未接真实上传逻辑）。`;
      }
    });
  }

  // 任务列表点击 → 切换当前 Task（高亮 & 标题）
  if (taskItems.length) {
    taskItems.forEach((item) => {
      item.addEventListener("click", () => {
        taskItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const span = item.querySelector("span");
        const name = span ? span.textContent.trim() : "";
        if (currentTaskTitle && name) currentTaskTitle.textContent = name;
        if (summaryTaskTitle && name) summaryTaskTitle.textContent = name;
      });
    });
  }

  // 解析 URL 里的 spaceId / taskId（现在先打印出来）
  const params = new URLSearchParams(window.location.search);
  const spaceId = params.get("spaceId");
  const taskId = params.get("taskId");
  if (spaceId && taskId) {
    console.log("当前 Review Space：", { spaceId, taskId });
  }
}

/* =========================
 * 5. 404 页面：按钮跳转
 * ========================= */
// 404.html 需要有：
//  button#btn-404-home, button#btn-404-myspaces
function init404Page() {
  const btn404Home = document.getElementById("btn-404-home");
  const btn404Myspaces = document.getElementById("btn-404-myspaces");

  if (btn404Home) {
    btn404Home.addEventListener("click", () => go("index.html"));
  }
  if (btn404Myspaces) {
    btn404Myspaces.addEventListener("click", () => go("my-spaces.html"));
  }
}
