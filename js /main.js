/* LOONOOL · 全站跳转控制（最终稳定版） */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 登录状态（localStorage）
  let isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  /* ----------------------------------------
   * 首页：创建新的审核空间
   ---------------------------------------- */
  const btnCreate = $("btn-create-space");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      if (!isLoggedIn) go("login.html");
      else go("review-space.html");
    });
  }

  /* ----------------------------------------
   * My Spaces：进入审核空间
   ---------------------------------------- */
  const enterButtons = document.querySelectorAll(".btn-enter-space");
  const clickNames = document.querySelectorAll(".space-click");

  // 点击按钮进入空间
  enterButtons.forEach(btn => {
    btn.addEventListener("click", () => go("review-space.html"));
  });

  // 点击空间名称也进入空间
  clickNames.forEach(item => {
    item.addEventListener("click", () => go("review-space.html"));
  });

  /* ----------------------------------------
   * 登录页面（模拟登录）
   ---------------------------------------- */
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      localStorage.setItem("loonool_logged_in", "true");
      alert("登录成功！（模拟）");
      go("my-spaces.html");
    });
  }
});
