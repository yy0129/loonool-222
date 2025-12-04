document.getElementById("createSpaceBtn").addEventListener("click", () => {
  // 未来你可以替换为：检查用户是否登录
  const loggedIn = true; // 先简化处理：模拟已登录

  if (!loggedIn) {
    window.location.href = "/login.html";
  } else {
    // V1 你希望点击后直接进入 My Spaces
    window.location.href = "/my-spaces.html";
  }
});
