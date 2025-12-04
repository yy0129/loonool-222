// js/login.js

// ===============================
// 你指定的 Demo 固定账号密码
// ===============================
const MOCK_EMAIL = "3415470347@qq.com";
const MOCK_PASSWORD = "ylf012900";

// 获取 DOM
const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("auth-error");

// 显示错误
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}

// 隐藏错误
function hideError() {
  errorBox.style.display = "none";
}

// 绑定登录事件
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = (emailInput.value || "").trim();
  const password = (passwordInput.value || "").trim();

  console.log("输入账号:", email);
  console.log("输入密码长度:", password.length);

  // 校验空值
  if (!email || !password) {
    showError("账号和密码不能为空");
    return;
  }

  // 核心比对
  if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
    hideError();
    console.log("登录成功 → 前往 my-spaces.html");

    // 跳转到 My Spaces（确保文件名正确）
    window.location.href = "my-spaces.html";
  } else {
    showError("账号或密码不正确，请检查后重试。");
  }
});
