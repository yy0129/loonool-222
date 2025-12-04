// login.js

// 取到全局的 supabase 客户端（在 supabase-client.js 里挂到了 window 上）
const supabase = window.supabaseClient;

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const messageEl = document.getElementById('message');

function showMessage(text, type = 'info') {
  messageEl.textContent = text || '';
  messageEl.className = '';
  if (type === 'error') {
    messageEl.classList.add('msg-error');
  } else if (type === 'success') {
    messageEl.classList.add('msg-success');
  }
}

// 简单校验
function getCredentials() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage('请先填写邮箱和密码。', 'error');
    return null;
  }
  if (password.length < 6) {
    showMessage('密码至少 6 位。', 'error');
    return null;
  }
  return { email, password };
}

// 注册
btnSignup.addEventListener('click', async (e) => {
  e.preventDefault();
  const creds = getCredentials();
  if (!creds) return;

  showMessage('注册中，请稍候…');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: creds.email,
      password: creds.password,
    });

    if (error) {
      console.error('signUp error', error);
      showMessage(error.message || '注册失败，请稍后再试。', 'error');
      return;
    }

    // 如果在 Auth 设置里开启了 “需要确认邮箱”，Supabase 会发验证邮件
    showMessage('注册成功！如果需要邮箱验证，请先去邮箱收信。现在可以直接尝试登录。', 'success');
  } catch (err) {
    console.error(err);
    showMessage('发生未知错误，请稍后再试。', 'error');
  }
});

// 登录
btnLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  const creds = getCredentials();
  if (!creds) return;

  showMessage('登录中，请稍候…');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });

    if (error) {
      console.error('signIn error', error);
      showMessage(error.message || '登录失败，请检查邮箱和密码。', 'error');
      return;
    }

    showMessage('登录成功，正在跳转到「我的空间」…', 'success');

    // ✅ 登录成功后跳转
    // 这里你可以改成 “我的太空.html” 或其它你实际的文件名
    setTimeout(() => {
      window.location.href = 'my-spaces.html';
    }, 600);
  } catch (err) {
    console.error(err);
    showMessage('发生未知错误，请稍后再试。', 'error');
  }
});
