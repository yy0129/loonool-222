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
  const uploadInput
