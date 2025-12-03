/* LOONOOL 首页 · 已登录跳审核空间 / 未登录跳登录（最终版） */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 登录状态（localStorage 保存）
  const isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  /* 首页：创建审核空间按钮 */
  const btnCreate = $("btn-create-space");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      if (!isLoggedIn) {
        // ⭐ 未登录 → 登录/注册
        go("login.html");
      } else {
        // ⭐ 已登录 → 进入审核空间（空状态）
        go("review-space.html");
      }
    });
  }
});
