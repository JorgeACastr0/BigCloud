// Version 2.0 - Con redirección
const loginModal = document.getElementById('login-modal');
const payModal = document.getElementById('pay-modal');

document.getElementById('btn-login').onclick = () => {
  loginModal.classList.remove('hidden');
};

document.getElementById('btn-quick-pay').onclick = () => {
  payModal.classList.remove('hidden');
};

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.onclick = () => {
    loginModal.classList.add('hidden');
    payModal.classList.add('hidden');
  };
});

// LOGIN CON REDIRECCIÓN
document.getElementById('login-submit').onclick = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  console.log('Intentando login...');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('Respuesta login:', data);

    if (data.success && data.token) {
      console.log('Login exitoso, guardando token...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Redirigiendo al dashboard...');
      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = '/dashboard/';
      }, 500);
    } else {
      alert('❌ Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('❌ Error de conexión');
  }
};

// PAGO RÁPIDO
document.getElementById('pay-submit').onclick = () => {
  const doc = document.getElementById('pay-document').value;
  if (!doc) return alert('Ingrese el documento');
  alert('Aquí se redirige a Wompi con el documento: ' + doc);
};

console.log('Panel.js v2.0 cargado correctamente');
