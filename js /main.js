document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const go = (url) => (window.location.href = url);

  // 首页：创建空间 / 进入我的空间
  const btnCreate = $("btn-create-space");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      go("my-spaces.html");
    });
  }

  const btnGoMySpaces = $("btn-go-myspaces");
  if (btnGoMySpaces) {
    btnGoMySpaces.addEventListener("click", () => {
      go("my-spaces.html");
    });
  }

  // 我的空间：进入空间按钮（可能有多个）
  const enterButtons = document.querySelectorAll(".btn-enter-space");
  if (enterButtons.length) {
    enterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        go("review-space.html");
      });
    });
  }

  // 审核空间：查看在线预览
  const btnViewEvidence = $("btn-view-evidence");
  if (btnViewEvidence) {
    btnViewEvidence.addEventListener("click", () => {
      go("evidence-preview.html");
    });
  }

  // Evidence 预览：去登录 / 回首页
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

  // 登录页：模拟登录 → 我的空间；返回首页
  const btnLogin = $("btn-login");
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      const email = ($("login-email")?.value || "Demo User").trim();
      alert(
        `模拟登录成功：${email}\n\n实际项目中，这里会调用后端接口。`
      );
      go("my-spaces.html");
    });
  }

  const btnBackHome = $("btn-back-home");
  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => {
      go("index.html");
    });
  }

  // 404 页：返回首页 / 进入我的空间
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

  // 审核空间：讨论输入只是 Demo 提示
  const btnSend = $("btn-send");
  const discussionInput = $("discussion-input");
  if (btnSend && discussionInput) {
    btnSend.addEventListener("click", () => {
      if (!discussionInput.value.trim()) return;
      alert(
        "Demo：这里只是示意，评论没有真正保存。\n\n你输入的内容是：\n" +
          discussionInput.value
      );
      discussionInput.value = "";
    });
  }
});
