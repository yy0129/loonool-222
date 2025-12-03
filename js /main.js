// main.js —— LOONOOL 全局跳转逻辑（最终版）

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 读取登录状态（登录后保存到 localStorage）
  let isLoggedIn = localStorage.getItem("loonool_logged_in") === "true";

  /* ----------------------------------------
   * 首页 index.html
   * ---------------------------------------- */
  const btnCreate = $("btn-create-space");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      if (!isLoggedIn) {
        // 未登录 → 登录/注册
        go("login.html");
      } else {
        // 已登录 → 审核空间（空状态）
        go("review-space.html");
      }
    });
  }

  const btnGoMySpaces = $("btn-go-myspaces");
  if (btnGoMySpaces) {
    btnGoMySpaces.addEventListener("click", () => {
      go("my-spaces.html");
    });
  }

  /* ----------------------------------------
   * 我的空间 my-spaces.html
   * ---------------------------------------- */
  const enterButtons = document.querySelectorAll(".btn-enter-space");
  if (enterButtons.length) {
    enterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        go("review-space.html");
      });
    });
  }

  /* ----------------------------------------
   * 审核空间 review-space.html
   * ---------------------------------------- */
  const btnViewEvidence = $("btn-view-evidence");
  if (btnViewEvidence) {
    btnViewEvidence.addEventListener("click", () => {
      go("evidence-preview.html");
    });
  }

  // 讨论输入（Demo）
  const btnSend = $("btn-send");
  const discussionInput = $("discussion-input");
  if (btnSend && discussionInput) {
    btnSend.addEventListener("click", () => {
      if (!discussionInput.value.trim()) return;
      alert(
        "Demo：评论不会被保存。\n你输入的是：\n" +
          discussionInput.value
      );
      discussionInput.value = "";
    });
  }

  /* ----------------------------------------
   * 证据预览 evidence-preview.html
   * ---------------------------------------- */
  const btnEpLogin = $("btn-ep-login");
  if (btnEpLogin) {
    btnEpLogin.addEventListener("click", () => {
      go("login.html");
    });
  }

  const btnEpHome = $("btn-ep-home");
  if (btnEpHome) {
    btnEpHome.addEventListener("click", () => {
      go("index.html");
    });
  }

  /* ----------------------------------------
   * 登录 login.html
   * ---------------------------------------- */
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      // 保存登录状态
      localStorage.setItem("loonool_logged_in", "true");
      alert("登录成功！（模拟登录）");
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
   * 404 页面
   * ---------------------------------------- */
  const btn404Home = $("btn-404-home");
  if (btn404Home) {
    btn404Home.addEventListener("click", () => {
      go("index.html");
    });
  }

  const btn404MySpaces = $("btn-404-myspaces");
  if (btn404MySpaces) {
    btn404MySpaces.addEventListener("click", () => {
      go("my-spaces.html");
    });
  }
});
