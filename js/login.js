// js/login.js

// ===============================
// Demo 登录账号密码（你指定的）：
// ===============================
// 账号 / 邮箱：
const MOCK_EMAIL = "3415470347@qq.com";
// 密码：
const MOCK_PASSWORD = "ylf012900";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("auth-error");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = (emailInput.value || "").trim();
    const password = passwordInput.value || "";

    // 简单对比（大小写敏感）
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      // 隐藏错误提示
      if (errorBox) {
        errorBox.style.display = "none";
      }

      // 这里是「登录成功」后的跳转
      // 你现在的流转是：登录成功 → My Spaces
      window.location.href = "my-spaces.html";
    } else {
      // 显示错误提示
      if (errorBox) {
        errorBox.textContent = "账号或密码不正确，请检查后重试。";
        errorBox.style.display = "block";
      }
    }
  });
}
