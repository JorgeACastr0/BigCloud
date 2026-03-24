// ==============================
// CONFIG
// ==============================
const API_BASE = ""; // Rutas relativas para evitar líos de dominio/CORS

// ==============================
// HELPERS
// ==============================
const qs = (id) => document.getElementById(id);

// ==============================
// MOBILE MENU
// ==============================
const menuToggle = qs("menuToggle");
const navLinks = qs("navLinks");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

// ==============================
// VULTR MODAL
// --- MANEJO DE MODAL VPS/HOSTING ---
const vpsModal = qs("vultr-modal");
const closeVpsModal = qs("close-vultr-modal");
const plansSection = qs("modal-step-plans");
const leadSection = qs("modal-step-form");

// Función unificada para abrir el catálogo de planes
const openPlansCatalog = () => {
  vpsModal.classList.add("active");
  showStep("modal-step-plans");
  loadLocalPlans(); // Carga planes desde la DB
};

// 1. DISPARADORES VPS (Miami, Atlanta, Dallas)
document.querySelectorAll(".open-vultr-trigger").forEach(btn => {
  btn.addEventListener("click", openPlansCatalog);
});

// 2. DISPARADOR HOSTING PRO
document.querySelectorAll(".show-hosting-panel").forEach(btn => {
  btn.addEventListener("click", openPlansCatalog);
});

if (closeVpsModal) {
  closeVpsModal.onclick = () => vpsModal.classList.remove("active");
}

// ==============================
// LOAD VULTR PLANS
// ==============================
async function loadLocalPlans() {
  const plansContainer = qs("vultr-plans-container");
  plansContainer.innerHTML = "<p>Cargando planes locales...</p>";

  try {
    const res = await axios.get(`${API_BASE}/api/cloud/planes`);
    const planes = res.data.planes;
    plansContainer.innerHTML = "";

    planes.forEach((p) => {
      const div = document.createElement("div");
      div.className = "service-card";
      const precioFormateado = new Intl.NumberFormat('es-CO').format(p.precio_mensual);

      div.innerHTML = `
                <h4>${p.nombre}</h4>
                <p><strong>${p.cpu_cores} vCore</strong></p>
                <p>${p.ram_mb} MB RAM</p>
                <p>${p.disk_gb} GB NVMe</p>
                <div class="price-box">
                    <strong>$${precioFormateado} COP</strong>
                </div>
                <button class="cta-button select-plan-btn" 
                    data-id="${p.plan_id}" 
                    data-name="${p.nombre}" 
                    data-price="${p.precio_mensual}">
                    Seleccionar
                </button>
            `;
      plansContainer.appendChild(div);
    });

    // Event listener para botones de selección
    document.querySelectorAll(".select-plan-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        // Feedback visual: quitar active de otros y poner en este
        document.querySelectorAll(".service-card").forEach(c => c.style.border = "1px solid #e2e8f0");
        btn.closest(".service-card").style.border = "2px solid var(--primary-color)";

        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        const price = btn.getAttribute("data-price");

        // Llenar campos ocultos del form de registro
        qs("selected-plan-id").value = id;
        qs("selected-plan-name").value = name;
        qs("selected-plan-price").value = price;

        // Habilitar el botón de Continuar
        const nextBtn = qs("plans-next-btn");
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.removeAttribute("disabled");
          nextBtn.style.opacity = "1";
          nextBtn.style.cursor = "pointer";
          nextBtn.onclick = (e) => {
            if (e) e.preventDefault();
            showStep("modal-step-form");
          };
        }

        console.log("Plan seleccionado:", name);
      });
    });

  } catch (err) {
    console.error("❌ ERROR CARGANDO PLANES:");
    console.dir(err);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }
    plansContainer.innerHTML = "<p style='color:red'>Error cargando el catálogo</p>";
  }
}

// ==============================
// LOGICA DE PASOS (MODAL REGISTRO)
// ==============================
function showStep(stepId) {
  document.querySelectorAll(".modal-step").forEach(el => el.classList.remove("active"));
  const target = qs(stepId);
  if (target) {
    target.classList.add("active");
    console.log(`🚀 Navegando a paso: ${stepId}`);
  }
}

// 1. BACK BUTTON
const backBtn = qs("form-back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    showStep("modal-step-plans");
  });
}

// 2. SUBMIT FORM (REGISTRO LEAD)
const leadForm = qs("vps-lead-form");
if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = leadForm.querySelector("button[type='submit']");
    const statusMsg = qs("form-status") || { textContent: "", style: {} }; // Paracaídas por si no existe el div

    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "⏳ Procesando...";
    submitBtn.disabled = true;

    const payload = {
      nombre: qs("lead-name").value,
      apellido: qs("lead-lastname").value,
      email: qs("lead-email").value,
      telefono: qs("lead-country-code").value + qs("lead-whatsapp").value,
      perfil: qs("lead-user-type").value,
      tipo_documento: qs("lead-doc-type").value,
      documento: qs("lead-doc-number").value,
      empresa: qs("lead-company").value || "",
      direccion: qs("lead-address").value,
      ciudad: qs("lead-city").value,
      departamento: qs("lead-dept").value,
      plan_name: qs("selected-plan-name").value,
      plan_price: qs("selected-plan-price").value
    };

    try {
      console.log("📤 Enviando Lead:", payload);
      const res = await axios.post(`${API_BASE}/api/cloud/register-lead`, payload);
      if (res.data.success) {
        localStorage.setItem("temp_lead_email", payload.email);
        showStep("modal-step-activation");
      }
    } catch (err) {
      console.error("❌ Error en registro:", err);
      const errorText = err.response?.data?.error || "";

      if (errorText.toLowerCase().includes("existe") || errorText.toLowerCase().includes("registrado")) {
        alert("📧 Este correo ya está registrado.\n\nPor favor, inicia sesión para continuar con tu compra o recupera tu contraseña.");
        window.location.href = "/panel/index.html";
      } else {
        alert("Error: " + (errorText || "Error de conexión al servidor"));
      }
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// 3. VERIFICAR OTP
const verifyBtn = qs("verify-otp-btn");
if (verifyBtn) {
  verifyBtn.addEventListener("click", async () => {
    const otp = qs("otp-input").value;
    const email = localStorage.getItem("temp_lead_email");
    const errorMsg = qs("otp-error");

    if (otp.length < 6) {
      alert("Ingresa el código de 6 dígitos");
      return;
    }

    if (errorMsg) errorMsg.style.display = "none";
    verifyBtn.textContent = "Verificando...";
    verifyBtn.disabled = true;

    try {
      const res = await axios.post(`${API_BASE}/api/cloud/validate-code`, { email, codigo: otp });
      if (res.data.success) {
        showStep("modal-step-payment");
      } else {
        throw new Error("Código inválido");
      }
    } catch (err) {
      console.error(err);
      if (errorMsg) {
        errorMsg.textContent = "❌ " + (err.response?.data?.error || "Código incorrecto");
        errorMsg.style.display = "block";
      } else {
        alert("Código incorrecto");
      }
    } finally {
      verifyBtn.textContent = "Verificar Código";
      verifyBtn.disabled = false;
    }
  });
}

console.log("✅ main.js consolidado (Fase 6.1)");
