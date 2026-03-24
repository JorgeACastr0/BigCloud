// Configuración
const API_URL = '/api';
let selectedPlanId = null;
let selectedTemplateId = null;

// ========================
// INICIALIZACIÓN
// ========================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        checkAuth();
        loadUserInfo();
        setupNavigation();
        await Promise.all([loadInstancias(), loadPlanes()]);
    } catch (error) {
        console.error('❌ Error crítico en inicialización:', error);
        const list = document.getElementById('instancias-list');
        if (list) list.innerHTML = `<div class="loading">❌ Error al cargar el dashboard. Por favor recarga.</div>`;
    }
});

// ========================
// AUTENTICACIÓN
// ========================
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/panel/';
    }
}

function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    };
}

// Maneja respuestas 401 (sesión expirada)
async function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/panel/?expired=1';
        return null;
    }
    return response.json();
}

// ========================
// INFO DE USUARIO
// ========================
function loadUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const el = document.getElementById('user-email');
        if (el) el.textContent = user.email || 'Usuario';
    } catch (e) { }
}

// ========================
// NAVEGACIÓN
// ========================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.currentTarget.getAttribute('onclick')) return;
            e.preventDefault();
            const view = e.currentTarget.dataset.view;
            if (view) showView(view);
        });
    });
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const viewEl = document.getElementById(`view-${viewId}`);
    if (viewEl) viewEl.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(v => v.classList.remove('active'));
    document.querySelector(`[data-view="${viewId}"]`)?.classList.add('active');

    if (viewId === 'instancias') loadInstancias();
    if (viewId === 'crear') loadTemplates();
}

// ========================
// INSTANCIAS VPS
// ========================
async function loadInstancias() {
    const container = document.getElementById('instancias-list');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando instancias...</div>';

    try {
        const response = await fetch(`${API_URL}/cloud/mis-instancias`, {
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        if (!data) return;

        if (data.instancias && data.instancias.length > 0) {
            container.innerHTML = data.instancias.map(inst => renderInstanciaCard(inst)).join('');
        } else {
            container.innerHTML = `
                <div class="loading">
                    <p style="margin-bottom:1rem">No tienes instancias activas aún.</p>
                    <button class="btn-primary" onclick="showView('crear')">➕ Crear tu primer VPS</button>
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = `<div class="loading">❌ Error cargando instancias: ${error.message}</div>`;
    }
}

function getStatusBadge(estado) {
    const map = {
        'RUNNING':      '<span class="badge badge-running">● RUNNING</span>',
        'STOPPED':      '<span class="badge badge-stopped">● STOPPED</span>',
        'CREATING':     '<span class="badge badge-creating">● CREATING</span>',
        'PROVISIONING': '<span class="badge badge-creating">● PROVISIONING</span>',
        'ERROR':        '<span class="badge badge-error">● ERROR</span>',
    };
    return map[estado] || `<span class="badge badge-stopped">● ${estado}</span>`;
}

function renderInstanciaCard(inst) {
    const id = inst.instancia_id;
    const hasPassword = inst.password_vps && inst.password_vps.length > 0;

    return `
        <div class="instancia-card" id="card-${id}">
            <div class="instancia-header">
                <div>
                    <div class="instancia-hostname">${escapeHtml(inst.hostname)}</div>
                    <span class="badge-tipo">${inst.tipo}</span>
                </div>
                ${getStatusBadge(inst.estado)}
            </div>

            <div class="instancia-info">
                <div class="instancia-detail">
                    <span class="label">IP Pública</span>
                    <span class="valueHighlight">
                        ${inst.ip_publica || '<em style="color:#f59e0b">Asignando...</em>'}
                        <button class="btn-icon-small" onclick="refrescarInstancia(${id})" title="Sincronizar IP">🔄</button>
                    </span>
                </div>

                <div class="info-item">
                    <div class="info-label">Plan</div>
                    <div class="info-value">${inst.plan_nombre || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">RAM / CPU</div>
                    <div class="info-value">${inst.ram_mb}MB / ${inst.cpu_cores} Core(s)</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Disco</div>
                    <div class="info-value">${inst.disk_gb}GB</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Vencimiento</div>
                    <div class="info-value">${formatDate(inst.fecha_expiracion)}</div>
                </div>

                <!-- Acceso SSH -->
                <div class="instancia-detail" style="grid-column:span 2; flex-direction:column; align-items:flex-start; gap:0.5rem;">
                    <span class="label">Acceso SSH</span>
                    <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
                        <span style="color:#94a3b8; font-size:0.8rem;">Usuario:</span>
                        <code class="valueHighlight" style="font-size:0.85rem;">${escapeHtml(inst.usuario_vps || 'root')}</code>

                        <span style="color:#94a3b8; font-size:0.8rem;">Password:</span>
                        <div class="password-field">
                            <input
                                type="password"
                                id="pwd-${id}"
                                class="password-input"
                                value="${hasPassword ? escapeHtml(inst.password_vps) : ''}"
                                readonly
                                placeholder="${hasPassword ? '••••••••••••••••' : 'No disponible'}"
                            >
                            ${hasPassword ? `
                            <button class="btn-eye" id="eye-${id}" onclick="togglePassword(${id})" title="Mostrar/ocultar password">👁️</button>
                            <button class="btn-copy" id="copy-${id}" onclick="copyPassword(${id})" title="Copiar password">📋</button>
                            ` : '<span style="color:#f59e0b; font-size:0.8rem;">Contacta soporte</span>'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="instancia-actions">
                ${inst.estado === 'RUNNING'
                    ? `<button class="btn-action btn-stop" id="btn-stop-${id}" onclick="controlarVPS(${id}, 'stop', this)">⏹ Apagar</button>`
                    : `<button class="btn-action btn-start" id="btn-start-${id}" onclick="controlarVPS(${id}, 'start', this)">▶ Encender</button>`
                }
                <button class="btn-action btn-reboot" onclick="controlarVPS(${id}, 'reboot', this)">🔄 Reiniciar</button>
                <button class="btn-action btn-info" onclick="mostrarInfoVPS(${id})">ℹ️ Info</button>
                <button class="btn-action btn-console" onclick="abrirConsola(${id})">🖥️ Consola</button>
                <button class="btn-action btn-delete" onclick="eliminarVPS(${id}, '${escapeHtml(inst.hostname)}')">🗑️ Eliminar</button>
            </div>
        </div>
    `;
}

// ========================
// BOTÓN OJO - PASSWORD
// ========================
function togglePassword(instanciaId) {
    const input = document.getElementById(`pwd-${instanciaId}`);
    const btn = document.getElementById(`eye-${instanciaId}`);
    if (!input || !btn) return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
        btn.title = 'Ocultar password';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
        btn.title = 'Mostrar password';
    }
}

function copyPassword(instanciaId) {
    const input = document.getElementById(`pwd-${instanciaId}`);
    const btn = document.getElementById(`copy-${instanciaId}`);
    if (!input || !btn) return;

    const originalType = input.type;
    input.type = 'text';

    navigator.clipboard.writeText(input.value).then(() => {
        btn.textContent = '✅';
        btn.title = '¡Copiado!';
        setTimeout(() => {
            btn.textContent = '📋';
            btn.title = 'Copiar password';
        }, 2000);
    }).catch(() => {
        // Fallback para browsers sin clipboard API
        input.select();
        document.execCommand('copy');
        btn.textContent = '✅';
        setTimeout(() => btn.textContent = '📋', 2000);
    });

    input.type = originalType;
}

// ========================
// PLANES
// ========================
async function loadPlanes() {
    const container = document.getElementById('planes-list');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/cloud/planes`);
        const data = await response.json();

        if (data.planes && data.planes.length > 0) {
            container.innerHTML = data.planes.map(plan => renderPlanCard(plan)).join('');
        } else {
            container.innerHTML = '<div class="loading">⚠️ No hay planes configurados</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">❌ Error cargando planes</div>';
    }
}

function renderPlanCard(plan) {
    const precio = parseFloat(plan.precio_mensual);
    const precioFormat = precio === 0 ? 'GRATIS' : `$${precio.toFixed(2)} USD/mes`;

    return `
        <div class="plan-card" id="plan-${plan.plan_id}" onclick="selectPlan(${plan.plan_id})">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <div class="plan-name">${plan.nombre}</div>
                <span class="badge-tipo">${plan.tipo}</span>
            </div>
            <div class="plan-price">${precioFormat}</div>
            <ul class="plan-specs">
                <li>💾 RAM: ${plan.ram_mb >= 1024 ? (plan.ram_mb/1024) + 'GB' : plan.ram_mb + 'MB'}</li>
                <li>💿 Disco: ${plan.disk_gb}GB SSD</li>
                <li>⚡ CPU: ${plan.cpu_cores} vCore(s)</li>
            </ul>
        </div>
    `;
}

function selectPlan(planId) {
    selectedPlanId = planId;
    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('plan-' + planId)?.classList.add('selected');
    const formConfig = document.getElementById('form-config');
    if (formConfig) {
        formConfig.style.display = 'block';
        formConfig.scrollIntoView({ behavior: 'smooth' });
    }
}

// ========================
// CREAR INSTANCIA
// ========================
async function crearInstancia() {
    const hostnameInput = document.getElementById('input-hostname');
    const hostname = hostnameInput?.value.trim();
    const btn = document.querySelector('[onclick="crearInstancia()"]');

    if (!hostname) {
        showFormError('input-hostname', 'Debes ingresar un hostname');
        return;
    }

    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    if (!hostnameRegex.test(hostname)) {
        showFormError('input-hostname', 'Solo letras, números y guiones. Máximo 63 caracteres.');
        return;
    }

    if (!selectedPlanId) {
        alert('❌ Debes seleccionar un plan');
        return;
    }

    // Deshabilitar botón durante la creación
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Creando VPS... (puede tardar 30-60s)';
    }

    try {
        const response = await fetch(`${API_URL}/cloud/crear-instancia`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                plan_id: selectedPlanId,
                hostname,
                template: selectedTemplateId
            })
        });

        const data = await handleResponse(response);
        if (!data) return;

        if (data.success) {
            // Mostrar modal con el password UNA SOLA VEZ
            const password = data.instancia?.password_vps;
            if (password) {
                showPasswordModal(hostname, data.instancia?.usuario_vps || 'root', password);
            } else {
                alert('✅ VPS creado exitosamente!');
            }
            hostnameInput.value = '';
            selectedPlanId = null;
            document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
            document.getElementById('form-config').style.display = 'none';
            showView('instancias');
        } else {
            alert('❌ Error: ' + (data.error || 'No se pudo crear el VPS'));
        }
    } catch (error) {
        alert('❌ Error de conexión: ' + error.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🚀 Crear VPS';
        }
    }
}

function showPasswordModal(hostname, usuario, password) {
    const existing = document.getElementById('modal-password');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-password';
    modal.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.85); z-index:9999;
        display:flex; align-items:center; justify-content:center;
    `;
    modal.innerHTML = `
        <div style="background:#1e293b; border:2px solid #f59e0b; border-radius:1rem; padding:2rem; max-width:500px; width:90%;">
            <h3 style="color:#f59e0b; margin-bottom:1rem;">⚠️ Guarda tu contraseña</h3>
            <p style="color:#94a3b8; margin-bottom:1.5rem; font-size:0.9rem;">
                VPS <strong style="color:#e2e8f0">${escapeHtml(hostname)}</strong> creado exitosamente.<br>
                Esta contraseña se mostrará en tu dashboard pero toma nota ahora por seguridad.
            </p>
            <div style="background:#0f172a; padding:1rem; border-radius:0.5rem; margin-bottom:1rem;">
                <div style="margin-bottom:0.5rem;"><span style="color:#94a3b8;">Usuario:</span> <code style="color:#3b82f6">${escapeHtml(usuario)}</code></div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="color:#94a3b8;">Password:</span>
                    <code style="color:#10b981; font-size:1.1rem; letter-spacing:0.05em" id="modal-pwd-display">${escapeHtml(password)}</code>
                    <button onclick="copyText('${escapeHtml(password)}', this)" style="background:none;border:1px solid #334155;color:#94a3b8;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:0.8rem;">📋 Copiar</button>
                </div>
            </div>
            <button onclick="document.getElementById('modal-password').remove(); loadInstancias();"
                style="width:100%; padding:0.75rem; background:#2563eb; color:white; border:none; border-radius:0.5rem; cursor:pointer; font-size:1rem;">
                ✅ Entendido, ya la guardé
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✅ Copiado';
        setTimeout(() => btn.textContent = '📋 Copiar', 2000);
    });
}

// ========================
// CONTROLAR VPS
// ========================
async function controlarVPS(instanciaId, accion, btnEl) {
    const acciones = { 'start': 'encender', 'stop': 'apagar', 'reboot': 'reiniciar' };
    if (!confirm(`¿Confirmas ${acciones[accion]} este VPS?`)) return;

    const originalText = btnEl?.innerHTML;
    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '⏳...';
    }

    try {
        const response = await fetch(`${API_URL}/cloud/controlar/${instanciaId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ accion })
        });

        const data = await handleResponse(response);
        if (!data) return;

        if (data.success) {
            loadInstancias();
        } else {
            alert('❌ Error: ' + data.error);
            if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = originalText; }
        }
    } catch (error) {
        alert('❌ Error de conexión');
        if (btnEl) { btnEl.disabled = false; btnEl.innerHTML = originalText; }
    }
}

// ========================
// ELIMINAR VPS
// ========================
async function eliminarVPS(instanciaId, hostname) {
    if (!confirm(`⚠️ ¿Eliminar el VPS "${hostname}"?\n\nEsta acción NO se puede deshacer. Se perderán todos los datos.`)) return;

    // Segunda confirmación para VPS
    const confirmText = prompt(`Escribe el nombre del VPS para confirmar: ${hostname}`);
    if (confirmText !== hostname) {
        alert('Nombre incorrecto. Operación cancelada.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cloud/eliminar/${instanciaId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        if (!data) return;

        if (data.success) {
            const card = document.getElementById(`card-${instanciaId}`);
            if (card) card.remove();
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (error) {
        alert('❌ Error de conexión');
    }
}

// ========================
// CONSOLA VNC
// ========================
async function abrirConsola(instanciaId) {
    const width = 1024, height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    try {
        const response = await fetch(`${API_URL}/cloud/mis-instancias`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        const inst = data.instancias?.find(i => i.instancia_id == instanciaId);

        if (inst) {
            const type = inst.tipo === 'KVM' ? 'qemu' : 'lxc';
            const consoleUrl = `/dashboard/console.html?id=${instanciaId}&vmid=${inst.proxmox_vmid}&type=${type}`;
            window.open(consoleUrl, 'Consola VPS', `width=${width},height=${height},top=${top},left=${left}`);
        }
    } catch (e) {
        alert('❌ Error abriendo consola: ' + e.message);
    }
}

// ========================
// INFO LIVE + REFRESCAR
// ========================
async function refrescarInstancia(instanciaId) {
    try {
        const response = await fetch(`${API_URL}/cloud/refrescar/${instanciaId}`, {
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        if (data?.success) loadInstancias();
        return data;
    } catch (e) { return null; }
}

async function mostrarInfoVPS(instanciaId) {
    const modal = document.getElementById('modal-info');
    const body = document.getElementById('info-body');
    if (!modal || !body) return;

    body.innerHTML = '<div class="loading">Sincronizando con Proxmox...</div>';
    modal.classList.add('active');

    const data = await refrescarInstancia(instanciaId);

    if (data?.success) {
        const s = data.live_status;
        const uptime = Math.floor((s.uptime || 0) / 3600);
        const cpu = ((s.cpu || 0) * 100).toFixed(1);
        const mem = Math.floor((s.mem || 0) / (1024 * 1024));
        const maxmem = Math.floor((s.maxmem || 0) / (1024 * 1024));

        body.innerHTML = `
            <div class="info-grid">
                <div class="info-item-live">
                    <span class="label">Estado Live</span>
                    <span class="valueHighlight ${s.status === 'running' ? 'text-success' : 'text-danger'}">${(s.status || 'unknown').toUpperCase()}</span>
                </div>
                <div class="info-item-live">
                    <span class="label">IP Pública</span>
                    <span class="valueHighlight">${data.db_status.ip_publica || 'No asignada aún'}</span>
                </div>
                <div class="info-item-live">
                    <span class="label">Uptime</span>
                    <span class="valueHighlight">${uptime}h</span>
                </div>
                <div class="info-item-live">
                    <span class="label">Uso CPU</span>
                    <span class="valueHighlight">${cpu}% de ${s.cpus || '?'} Cores</span>
                </div>
                <div class="info-item-live">
                    <span class="label">RAM usada</span>
                    <span class="valueHighlight">${mem}MB / ${maxmem}MB</span>
                </div>
                <div class="info-item-live">
                    <span class="label">VMID Proxmox</span>
                    <span class="valueHighlight">${s.vmid || '?'}</span>
                </div>
            </div>
            <p style="margin-top:1rem; font-size:0.75rem; color:#94a3b8;">* Datos en tiempo real desde Proxmox.</p>
        `;
    } else {
        body.innerHTML = '<div class="loading">❌ No se pudo conectar con Proxmox.</div>';
    }
}

function closeConsole() {
    document.getElementById('modal-console')?.classList.remove('active');
    const iframe = document.getElementById('console-iframe');
    if (iframe) iframe.src = '';
}

function closeInfo() {
    document.getElementById('modal-info')?.classList.remove('active');
}

// ========================
// LOGOUT
// ========================
function logout() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/panel/';
    }
}

// ========================
// TEMPLATES
// ========================
async function loadTemplates() {
    const container = document.getElementById('templates-list');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando sistemas operativos...</div>';

    try {
        const response = await fetch(`${API_URL}/cloud/templates`);
        const data = await response.json();

        if (data.templates && data.templates.length > 0) {
            container.innerHTML = data.templates.map(tmp => renderTemplateCard(tmp)).join('');
            if (!selectedTemplateId) selectTemplate(data.templates[0].volid);
        } else {
            container.innerHTML = '<div class="loading">⚠️ No se encontraron plantillas en Proxmox</div>';
        }
    } catch (error) {
        container.innerHTML = `<div class="loading">❌ Error: ${error.message}</div>`;
    }
}

function renderTemplateCard(tmp) {
    let icon = '🐧';
    const name = tmp.name.toLowerCase();
    if (name.includes('ubuntu')) icon = '🟠';
    else if (name.includes('debian')) icon = '🌀';
    else if (name.includes('alpine')) icon = '🏔️';
    else if (name.includes('centos') || name.includes('rocky')) icon = '🎩';
    else if (name.includes('wordpress')) icon = '🌐';
    else if (name.includes('mysql')) icon = '🐬';

    const displayName = tmp.name
        .replace('-standard', '').replace('.tar.zst', '')
        .replace('.tar.xz', '').replace('.tar.gz', '');
    const isSelected = selectedTemplateId === tmp.volid ? 'selected' : '';
    const safeId = `tmp-${tmp.volid.replace(/[:/.]/g, '-')}`;

    return `
        <div class="template-card ${isSelected}" id="${safeId}" onclick="selectTemplate('${tmp.volid.replace(/'/g, "\\'")}')">
            <span class="template-icon">${icon}</span>
            <div class="template-name">${displayName}</div>
        </div>
    `;
}

function selectTemplate(volid) {
    selectedTemplateId = volid;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    const safeId = `tmp-${volid.replace(/[:/.]/g, '-')}`;
    document.getElementById(safeId)?.classList.add('selected');
}

// ========================
// UTILIDADES
// ========================
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showFormError(inputId, msg) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.style.borderColor = '#dc2626';
    const existing = input.nextElementSibling;
    if (existing && existing.classList.contains('field-error')) existing.remove();
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#dc2626; font-size:0.8rem; margin-top:0.25rem; display:block;';
    err.textContent = msg;
    input.after(err);
    input.addEventListener('input', () => {
        input.style.borderColor = '';
        err.remove();
    }, { once: true });
}
