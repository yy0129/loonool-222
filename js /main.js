document.addEventListener('DOMContentLoaded', () => {

  // 首页 “创建图片审核空间” 按钮跳转
  const createBtn = document.getElementById('create-review-space-btn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {

      // （V1 简化逻辑）直接进入 “我的空间” 页面
      window.location.href = "my-spaces.html";

      // —— 如果未来你要加入登录判断，换成下面的：——
      // const isLoggedIn = localStorage.getItem("logged_in");
      // if (isLoggedIn) {
      //   window.location.href = "my-spaces.html";
      // } else {
      //   window.location.href = "login.html";
      // }
    });
  }

  // 我的空间页面：点击“进入空间” → review-space.html
  const enterButtons = document.querySelectorAll('.enter-space-btn');
  if (enterButtons.length > 0) {
    enterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = "review-space.html";
      });
    });
  }

});
