// Si ya hay token válido, redirigir directamente al dashboard
(function checkExistingSession() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/dashboard/';
  }
  // Mostrar alerta si la sesión expiró
  const params = new URLSearchParams(window.location.search);
  if (params.get('expired') === '1') {
    const el = document.getElementById('msg-expired');
    if (el) el.style.display = 'block';
  }
})();

function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearErrors() {
  ['err-email', 'err-password', 'msg-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  });
  document.getElementById('email')?.style.removeProperty('border-color');
  document.getElementById('password')?.style.removeProperty('border-color');
}

async function login() {
  clearErrors();

  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const btn = document.getElementById('btn-login');

  const email = emailEl?.value.trim();
  const password = passwordEl?.value;

  // Validaciones
  let valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('err-email', 'Ingresa un correo electrónico válido');
    emailEl?.style.setProperty('border-color', '#dc2626');
    valid = false;
  }

  if (!password || password.length < 6) {
    showError('err-password', 'La contraseña debe tener al menos 6 caracteres');
    passwordEl?.style.setProperty('border-color', '#dc2626');
    valid = false;
  }

  if (!valid) return;

  // Spinner en botón
  if (btn) { btn.disabled = true; btn.textContent = 'Verificando...'; }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      const msgEl = document.getElementById('msg-error');
      if (msgEl) {
        msgEl.textContent = data.error || 'Credenciales incorrectas';
        msgEl.style.display = 'block';
      }
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard/';

  } catch (err) {
    const msgEl = document.getElementById('msg-error');
    if (msgEl) {
      msgEl.textContent = 'No se pudo conectar con el servidor. Intenta nuevamente.';
      msgEl.style.display = 'block';
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Ingresar'; }
  }
}

// Permitir login con Enter
document.addEventListener('DOMContentLoaded', () => {
  ['email', 'password'].forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') login();
    });
  });
});
