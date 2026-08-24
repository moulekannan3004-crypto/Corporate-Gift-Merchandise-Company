/**
 * Storefront Application Interactions & Signature Features
 * Handles Toast system, Gift Intelligence filter engine, Live Customization previewer, Counter animations, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initGiftIntelligence();
  initCustomizerPreview();
  initCounterAnimations();
  initModals();
  initProductFilter();
  initMobileNav();
  initAuthSession();
});

// Auth Session & Navbar Login/Logout State Management
function initAuthSession() {
  const isLoggedIn = localStorage.getItem('vanguard_logged_in') === 'true';

  // Global Logout Handler
  window.handleUserLogout = function (e) {
    if (e) e.preventDefault();
    localStorage.removeItem('vanguard_logged_in');
    window.location.href = 'login.html';
  };

  if (isLoggedIn) {
    // Replace Login button in desktop nav actions across all pages
    document.querySelectorAll('.nav-actions').forEach(container => {
      const loginBtn = container.querySelector('a[href*="login.html"]');
      if (loginBtn) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'navLogoutBtn';
        logoutBtn.type = 'button';
        logoutBtn.className = 'btn-outline text-xs !py-2 !px-3.5 font-bold border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center gap-1.5 transition-all shadow-sm';
        logoutBtn.title = 'Logout from Account';
        logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right font-bold"></i> Logout';
        logoutBtn.addEventListener('click', window.handleUserLogout);
        loginBtn.parentNode.replaceChild(logoutBtn, loginBtn);
      }
    });

    // Replace Login link in mobile navigation drawer if present
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (mobileDrawer) {
      const mobileLogin = mobileDrawer.querySelector('a[href*="login.html"]');
      if (mobileLogin) {
        const mobileLogout = document.createElement('a');
        mobileLogout.href = '#';
        mobileLogout.className = 'mobile-nav-link text-rose-500 font-bold';
        mobileLogout.innerHTML = 'Logout <i class="bi bi-box-arrow-right"></i>';
        mobileLogout.addEventListener('click', window.handleUserLogout);
        mobileLogin.parentNode.replaceChild(mobileLogout, mobileLogin);
      }
    }
  }
}

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (drawer.classList.contains('active')) {
        icon.className = 'bi bi-x-lg';
      } else {
        icon.className = 'bi bi-list';
      }
    }
  });
}

// Dynamic Toast Notifications
function initToasts() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function (message, title = 'Notification', icon = 'bi-check-circle-fill') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <i class="bi ${icon} text-amber-500 text-xl"></i>
    <div>
      <div class="font-bold text-sm">${title}</div>
      <div class="text-xs text-slate-500">${message}</div>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Gift Intelligence Finder Engine
function initGiftIntelligence() {
  const budgetInput = document.getElementById('giftBudgetRange');
  const budgetVal = document.getElementById('giftBudgetValue');
  const audienceButtons = document.querySelectorAll('.gift-audience-btn');
  const resultsContainer = document.getElementById('giftIntelligenceResults');

  if (!budgetInput || !resultsContainer) return;

  const sampleGifts = [
    { name: 'Executive Tech Onboarding Kit', price: 2500, audience: 'Employees', style: 'Tech', img: 'assets/images/executive_kit.jpg' },
    { name: 'Embossed Italian Leather Journal', price: 1200, audience: 'Executives', style: 'Minimal', img: 'assets/images/leather_notebook.jpg' },
    { name: 'Organic Bamboo & Eco Hamper', price: 1800, audience: 'Clients', style: 'Eco', img: 'assets/images/executive_kit.jpg' },
    { name: 'Crystal Achievement Award Trophy', price: 4500, audience: 'Partners', style: 'Premium', img: 'assets/images/leather_notebook.jpg' }
  ];

  let selectedAudience = 'Employees';

  budgetInput.addEventListener('input', (e) => {
    budgetVal.textContent = `₹${parseInt(e.target.value).toLocaleString()}`;
    renderFilteredGifts();
  });

  audienceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      audienceButtons.forEach(b => b.classList.remove('active', 'btn-gold'));
      audienceButtons.forEach(b => b.classList.add('btn-outline'));
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-gold');
      selectedAudience = btn.dataset.audience;
      renderFilteredGifts();
    });
  });

  function renderFilteredGifts() {
    const maxBudget = parseInt(budgetInput.value);
    const filtered = sampleGifts.filter(g => g.price <= maxBudget);

    resultsContainer.innerHTML = filtered.map(item => `
      <div class="glass-card p-4 rounded-xl flex items-center gap-4">
        <img src="${item.img}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-grow">
          <div class="font-bold text-sm">${item.name}</div>
          <div class="text-xs text-amber-600 font-semibold">Est. ₹${item.price.toLocaleString()} / unit</div>
          <span class="badge-gold text-[10px] mt-1">${item.style}</span>
        </div>
        <button class="btn-primary text-xs !py-1.5 !px-3" onclick="showToast('Added ${item.name} to configurator', 'Product Selected')">Select</button>
      </div>
    `).join('');
  }

  renderFilteredGifts();
}

// Live Branding Customization Canvas
function initCustomizerPreview() {
  const colorBtns = document.querySelectorAll('.customizer-color-btn');
  const logoInput = document.getElementById('customizerLogoInput');
  const logoOverlay = document.getElementById('customizerLogoOverlay');
  const mockupImg = document.getElementById('customizerMockupImg');
  const techniqueSelect = document.getElementById('brandingTechniqueSelect');

  if (!mockupImg) return;

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('ring-2', 'ring-amber-500'));
      btn.classList.add('ring-2', 'ring-amber-500');
      const hex = btn.dataset.color;
      mockupImg.style.filter = `drop-shadow(0 0 10px ${hex}44)`;
      showToast(`Selected Color Tone: ${hex}`, 'Customization');
    });
  });

  if (logoInput && logoOverlay) {
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          logoOverlay.src = evt.target.result;
          logoOverlay.classList.remove('hidden');
          showToast('Brand logo proof overlaid successfully!', 'Logo Upload');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (techniqueSelect) {
    techniqueSelect.addEventListener('change', (e) => {
      showToast(`Applied Technique: ${e.target.value}`, 'Branding Updated');
    });
  }
}

// Number Counter Animations
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 40);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = current.toLocaleString();
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// Global Modal Dialog Controls
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.dataset.modalTarget;
      const modal = document.getElementById(targetId);
      if (modal) modal.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closer => {
    closer.addEventListener('click', (e) => {
      if (e.target === closer || closer.classList.contains('modal-close')) {
        const backdrop = closer.closest('.modal-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      }
    });
  });
}

// B2B Catalog Live Filter
function initProductFilter() {
  const filterInputs = document.querySelectorAll('.product-filter-input');
  const productCards = document.querySelectorAll('.product-card-item');

  if (!productCards.length) return;

  filterInputs.forEach(input => {
    input.addEventListener('change', filterProducts);
    input.addEventListener('keyup', filterProducts);
  });

  function filterProducts() {
    const searchVal = (document.getElementById('productSearchInput')?.value || '').toLowerCase();
    const moqVal = parseInt(document.getElementById('moqFilterSelect')?.value || 0);

    productCards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const moq = parseInt(card.dataset.moq || 0);

      const matchesSearch = title.includes(searchVal);
      const matchesMoq = moqVal === 0 || moq <= moqVal;

      if (matchesSearch && matchesMoq) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// 7-Step Enterprise Order Workflow Interactive Switcher
window.workflowData = {
  1: {
    num: "Step 01 of 07",
    title: "Brief Request & Vector Upload",
    sla: "Instant (Real-Time)",
    icon: "bi-file-earmark-text-fill",
    desc: "Clients specify gift category, target unit count, delivery destinations, and upload high-resolution brand vector artwork (SVG/EPS).",
    milestone: "Order Specification Sealed & Artwork Vectorized",
    audit: "[LOG 01]: Brief Received • Vector Validated (SVG 300DPI)"
  },
  2: {
    num: "Step 02 of 07",
    title: "Automated Quotation & Tier Pricing",
    sla: "24 Hours SLA",
    icon: "bi-calculator-fill",
    desc: "AI engine calculates volume discounts, custom branding setup fees, packaging options, and multi-hub freight logistics costs.",
    milestone: "Formal Itemized B2B Quotation Generated",
    audit: "[LOG 02]: Volume Tier Applied • GST & Freight Calculated"
  },
  3: {
    num: "Step 03 of 07",
    title: "3D Virtual Proof & Spec Signoff",
    sla: "24 Hours SLA",
    icon: "bi-shield-check",
    desc: "Digital 3D rendering of branded items showing exact color Pantone codes, logo dimensions, and packaging sleeve alignment for signoff.",
    milestone: "Client Digital Proof Approved & Locked",
    audit: "[LOG 03]: Client Signature Verified • Production Pre-Check Clear"
  },
  4: {
    num: "Step 04 of 07",
    title: "Batch Production & Custom Branding",
    sla: "5-7 Business Days",
    icon: "bi-gear-wide-connected",
    desc: "Precision laser engraving, gold metallic foil stamping, and debossing applied across all order units in automated cleanroom facilities.",
    milestone: "Branded Product Batch Completed & Staged",
    audit: "[LOG 04]: Production Line #3 Active • 500 Units Sealed"
  },
  5: {
    num: "Step 05 of 07",
    title: "ISO Quality Inspection & Kitting",
    sla: "1 Business Day",
    icon: "bi-clipboard2-check-fill",
    desc: "Every individual item undergoes a 12-point quality check before being hand-kitted into luxury rigid boxes with custom ribbon tissue.",
    milestone: "100% Quality Audit Passed • Kitted & Sealed",
    audit: "[LOG 05]: Quality Pass Rate 100% • 0 Defect Rate Recorded"
  },
  6: {
    num: "Step 06 of 07",
    title: "Multi-City Dispatch & Hub Sorting",
    sla: "1 Business Day",
    icon: "bi-box-seam-fill",
    desc: "Orders are split according to regional distribution manifests and dispatched via priority air freight to regional hubs.",
    milestone: "Shipment Dispatched with Live GPS SLA Trackers",
    audit: "[LOG 06]: Air Freight Manifest #CG-10482 Active"
  },
  7: {
    num: "Step 07 of 07",
    title: "Desktop Hand-Off & SLA Confirmation",
    sla: "Same-Day Desk Delivery",
    icon: "bi-truck-front-fill",
    desc: "Packages are delivered directly to corporate desks or remote employee addresses with automated SMS notifications to HR leads.",
    milestone: "All Destinations Delivered • Proof of Delivery Received",
    audit: "[LOG 07]: Desk Delivery Complete • 99.4% On-Time SLA Verified"
  }
};

window.currentWfStep = 4;

window.switchWorkflowStep = function(stepId) {
  const data = window.workflowData[stepId];
  if (!data) return;

  window.currentWfStep = stepId;

  const nodes = document.querySelectorAll('.workflow-step-node');
  nodes.forEach(node => {
    const id = parseInt(node.dataset.stepId);
    node.classList.remove('active', 'completed');
    if (id < stepId) {
      node.classList.add('completed');
    } else if (id === stepId) {
      node.classList.add('active');
    }
  });

  const line = document.getElementById('workflowProgressLine');
  if (line) {
    const pct = Math.round(((stepId - 1) / 6) * 100);
    line.style.width = `${pct}%`;
  }

  const numEl = document.getElementById('wfDetailStepNum');
  if (numEl) numEl.textContent = data.num;

  const slaEl = document.getElementById('wfDetailSla');
  if (slaEl) slaEl.innerHTML = `<i class="bi bi-clock-history me-1"></i> Lead Time: ${data.sla}`;

  const titleEl = document.getElementById('wfDetailTitle');
  if (titleEl) titleEl.textContent = data.title;

  const descEl = document.getElementById('wfDetailDesc');
  if (descEl) descEl.textContent = data.desc;

  const msEl = document.getElementById('wfDetailMilestone');
  if (msEl) msEl.innerHTML = `<i class="bi bi-check-circle-fill text-emerald-500 me-2"></i> ${data.milestone}`;

  const auditEl = document.getElementById('wfDetailAudit');
  if (auditEl) auditEl.innerHTML = `<i class="bi bi-terminal me-1"></i> ${data.audit}`;

  const iconEl = document.getElementById('wfDetailIcon');
  if (iconEl) iconEl.innerHTML = `<i class="bi ${data.icon}"></i>`;
};

window.navigateWorkflow = function(delta) {
  let newStep = window.currentWfStep + delta;
  if (newStep < 1) newStep = 7;
  if (newStep > 7) newStep = 1;
  window.switchWorkflowStep(newStep);
};
