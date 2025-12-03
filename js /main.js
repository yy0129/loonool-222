/* ============================================================
   LOONOOL · 全站统一跳转逻辑（最终稳定版 main.js）
   支持页面：index / login / my-spaces / review-space / preview / 404
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 登录状态（localStorage 用于模拟）
  let isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  /* ----------------------------------------
   * 1) 首页 index.html
   ---------------------------------------- */
  const btnCreateSpace = $("btn-create-space");
  if (btnCreateSpace) {
    btnCreateSpace.addEventListener("click", () => {
      if (!isLoggedIn) {
        // ⭐ 未登录 → 登录/注册页面
        go("login.html");
      } else {
        // ⭐ 已登录 → 审核空间页面（空状态）
        go("review-space.html");
      }
    });
  }

  /* ----------------------------------------
   * 2) 登录 login.html（模拟登录）
   ---------------------------------------- */
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      localStorage.setItem("loonool_logged_in", "true");
      alert("登录成功！（模拟）");
      go("my-spaces.html");
    });
  }

  const btnBackHome = $("btn-back-home");
  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => {
      go("index.html");
    });
  }

  /* ----------------------------------------
   * 3) 我的空间 my-spaces.html
   ---------------------------------------- */
  const btnEnterSpaceList = document.querySelectorAll(".btn-enter-space");
  if (btnEnterSpaceList.length > 0) {
    btnEnterSpaceList.forEach((btn) => {
      btn.addEventListener("click", () => {
        go("review-space.html");
      });
    });
  }

  /* ----------------------------------------
   * 4) 审核空间 review-space.html
   ---------------------------------------- */
  const btnViewEvidence = $("btn-view-evidence");
  if (btnViewEvidence) {
    btnViewEvidence.addEventListener("click", () => {
      go("evidence-preview.html");
    });
  }

  // 审核空间 - Demo 讨论区发送按钮
  const btnSend = $("btn-send");
  const discussionInput = $("discussion-input");
  if (btnSend && discussionInput) {
    btnSend.addEventListener("click", () => {
      if (!discussionInput.value.trim()) return;
      alert("（Demo）评论内容不会保存：\n\n" + discussionInput.value);
      discussionInput.value = "";
    });
  }

  /* ----------------------------------------
   * 5) 证据在线预览 evidence-preview.html
   ---------------------------------------- */
  const btnPreviewLogin = $("btn-ep-login");
  if (btnPreviewLogin) {
    btnPreviewLogin.addEventListener("click", () => {
      go("login.html");
    });
  }

  const btnPreviewHome = $("btn-ep-home");
  if (btnPreviewHome) {
    btnPreviewHome.addEventListener("click", () => {
      go("index.html");
    });
  }

  /* ----------------------------------------
   * 6) 404 页面
   ---------------------------------------- */
  const btn404home = $("btn-404-home");
  if (btn404home) {
    btn404home.addEventListener("click", () => {
      go("index.html");
    });
  }

  const btn404spaces = $("btn-404-myspaces");
  if (btn404spaces) {
    btn404spaces.addEventListener("click", () => {
      go("my-spaces.html");
    });
  }

  /* ----------------------------------------
   * 7) 退出登录（如果你未来添加按钮）
   ---------------------------------------- */
  const btnLogout = $("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("loonool_logged_in");
      alert("已退出登录");
      go("index.html");
    });
  }
});
