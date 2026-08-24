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
  initServiceDetails();
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

// Enterprise Service Offerings Data Store
window.servicesData = {
  'onboarding': {
    id: 'onboarding',
    title: 'Employee Onboarding Kit Fulfillment',
    category: 'ONBOARDING KITS',
    tag: '24H DISPATCH',
    img: 'assets/images/corporate_apparel.jpg',
    desc: 'We streamline your HR onboarding workflow by curating premium gifts, applying exact vector logo branding, packaging in custom magnetic closure boxes, and shipping directly to new hires prior to day one.',
    deliverables: [
      'Custom embroidered high-density cotton hoodies & branded apparel',
      'Insulated double-wall stainless steel thermal flasks with laser logo',
      'Embossed hardbound journal with matching metallic stylus pen',
      'Premium padded canvas tech organizer pouch',
      'Personalized welcome letter printed on 300gsm textured cardstock'
    ],
    slas: [
      '2-3 Business Days Production SLA',
      'Quality Inspection Checkpoints on 100% of Units',
      'Real-time GPS tracking link emailed to HR manager & recipient'
    ],
    specs: {
      moq: '25 Units',
      packaging: 'Magnetic Rigid Gift Box',
      leadTime: '2-3 Business Days',
      price: '₹1,500 - ₹3,500 / kit'
    }
  },
  'branding': {
    id: 'branding',
    title: 'Precision Surface Branding & Engraving',
    category: 'BRANDING LAB',
    tag: '300DPI UV & FOIL',
    img: 'assets/images/leather_notebook.jpg',
    desc: 'Industrial-grade surface customization utilizing fiber laser etching, metallic hot foil debossing, 300DPI cylindrical UV printing, and precision silk-screen logo application across metal, leather, glass, and wood substrates.',
    deliverables: [
      'High-precision Fiber & CO2 Laser Engraving for metal & wood items',
      'Metallic Gold, Silver & Blind Hot Foil Stamping for leather journals',
      '300 DPI Cylindrical UV Printing for tumblers, flasks & drinkware',
      'Pantone PMS Exact Color Match Screen Printing on textiles & bags',
      'Instant 3D Digital Vector Mockup & Automated Proof Signoff'
    ],
    slas: [
      '15-Minute Digital Vector Proof SLA',
      'Pantone PMS Color Accuracy Guarantee (ΔE < 1.0)',
      'Scratch-resistant & UV-cured surface durability testing'
    ],
    specs: {
      moq: '50 Units',
      packaging: 'Substrate Bulk / Custom Box',
      leadTime: '15-Min Proof / 3-5 Days',
      price: 'Custom Quote / Unit'
    }
  },
  'eco': {
    id: 'eco',
    title: 'Eco-Friendly Sustainable Hampers',
    category: 'ECO SUSTAINABLE',
    tag: '100% FSC CERTIFIED',
    img: 'assets/images/eco_hampers.jpg',
    desc: 'Certified zero-waste, plastic-free eco gifting solutions crafted from FSC-certified cork, organic bamboo, recycled cotton, and plantable seed paper to reinforce your enterprise ESG commitments.',
    deliverables: [
      'Organic bamboo double-wall thermal flask & stainless steel tea infuser',
      'Recycled cork bound daily planner & eco-bamboo pen set',
      'Handcrafted organic herbal tea assortment in reusable tin',
      'Plantable seed paper greeting card (wildflower/basil seeds embedded)',
      'Unbleached jute tote bag printed with eco water-based ink'
    ],
    slas: [
      '100% Plastic-Free & FSC Certified Eco Packaging',
      'Carbon-neutral shipping options available across Pan-India',
      'Comprehensive ESG Compliance documentation provided for reporting'
    ],
    specs: {
      moq: '30 Units',
      packaging: 'Recycled Kraft Box & Tissue',
      leadTime: '3-5 Business Days',
      price: '₹1,200 - ₹2,800 / hamper'
    }
  },
  'executive': {
    id: 'executive',
    title: 'Executive & Leadership VIP Hampers',
    category: 'EXECUTIVE VIP',
    tag: 'LUXURY SUITE',
    img: 'assets/images/executive_kit.jpg',
    desc: 'Bespoke luxury hampers engineered for C-suite executives, board members, key client appreciation, and high-value milestone celebrations, packaged in handcrafted rigid presentation boxes.',
    deliverables: [
      'Premium top-grain Italian leather organizer portfolio with debossed logo',
      'Swiss-engineered precision ballpoint pen with custom monogram engraving',
      'ANC wireless headphones with genuine leather ear cushions in custom case',
      'Artisanal single-origin gourmet chocolate & roasted coffee selection',
      'Hand-signed wax-sealed personalized appreciation card'
    ],
    slas: [
      'White-glove personal concierge account handling',
      '12-Point optical QC inspection on 100% of executive units',
      'Priority hand-delivery by dedicated courier service'
    ],
    specs: {
      moq: '10 Units',
      packaging: 'Velvet-Lined Rigid Box',
      leadTime: '4-6 Business Days',
      price: '₹5,000 - ₹15,000 / suite'
    }
  },
  'tech': {
    id: 'tech',
    title: 'Tech Accessories & Electronics Merchandise',
    category: 'TECH HARDWARE',
    tag: 'BIS CERTIFIED',
    img: 'assets/images/tech_accessories.jpg',
    desc: 'Cutting-edge branded technology merchandise including MagSafe power banks, multi-device fast wireless chargers, active noise-canceling earbuds, and desk productivity gadgets with full safety certifications.',
    deliverables: [
      '10,000mAh MagSafe magnetic wireless power bank with laser logo',
      '3-in-1 foldable wireless charging station for phone, watch & pods',
      'Active Noise Canceling (ANC) Bluetooth 5.3 earbuds',
      'Braided 100W USB-C multi-cable with illuminated LED logo badge',
      'Smart desktop digital clock & wireless charging mousepad'
    ],
    slas: [
      '1-Year Instant Replacement Warranty on all electronic units',
      'BIS, CE & FCC Certified hardware safety compliance',
      'Laser-engraved brand logo guaranteed against wear & tear'
    ],
    specs: {
      moq: '25 Units',
      packaging: 'Matte Black Tech Sleeve Box',
      leadTime: '2-4 Business Days',
      price: '₹1,800 - ₹4,500 / unit'
    }
  },
  'logistics': {
    id: 'logistics',
    title: 'Multi-City Warehousing & Desk Drop Logistics',
    category: 'DESK DROP SLA',
    tag: '5 REGIONAL HUBS',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
    desc: 'End-to-end corporate gifting supply chain infrastructure featuring 5 climate-controlled regional distribution hubs, real-time GPS shipment telemetry, and synchronized desk-drop deliveries for remote & hybrid teams.',
    deliverables: [
      'Synchronized multi-city delivery execution on scheduled date',
      'Climate-controlled inventory warehousing & stock management',
      'Automated address collection & verification portal for HR',
      'Live GPS tracking dashboard with SMS & email alerts',
      'Automated GST invoice breakdown per department/location'
    ],
    slas: [
      '99.4% On-Time Delivery SLA across 500+ Indian cities',
      'Zero-damage packaging guarantee with bubble-vault protection',
      'Real-time proof of delivery with digital signature capture'
    ],
    specs: {
      moq: '50 Hub Units',
      packaging: 'Reinforced Transport Cartons',
      leadTime: '24-48 Hours Express SLA',
      price: 'Volume Freight Matrix'
    }
  }
};

// Dynamic Service Details Loader
function initServiceDetails() {
  const serviceTitle = document.getElementById('serviceTitle');
  if (!serviceTitle) return; // Not on service-details.html

  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get('id') || params.get('service') || 'onboarding';
  const service = window.servicesData[serviceId] || window.servicesData['onboarding'];

  // Document Title Update
  document.title = `${service.title} | Vanguard Gift`;

  // Category & Tag Badges
  const categoryBadge = document.getElementById('serviceCategoryBadge');
  if (categoryBadge) categoryBadge.textContent = service.category;

  const tagBadge = document.getElementById('serviceTagBadge');
  if (tagBadge) tagBadge.textContent = service.tag;

  // Title
  serviceTitle.textContent = service.title;

  // Hero Image
  const heroImg = document.getElementById('serviceHeroImg');
  if (heroImg) {
    heroImg.src = service.img;
    heroImg.alt = service.title;
  }

  // Description
  const desc = document.getElementById('serviceDesc');
  if (desc) desc.textContent = service.desc;

  // Deliverables List
  const deliverablesEl = document.getElementById('serviceDeliverables');
  if (deliverablesEl && service.deliverables) {
    deliverablesEl.innerHTML = service.deliverables.map(item => `
      <li class="flex items-start gap-2.5">
        <i class="bi bi-check2-circle text-amber-500 text-base mt-0.5 flex-shrink-0"></i>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // SLAs List
  const slasEl = document.getElementById('serviceSlas');
  if (slasEl && service.slas) {
    slasEl.innerHTML = service.slas.map(item => `
      <li class="flex items-start gap-2.5">
        <i class="bi bi-shield-check text-emerald-500 text-base mt-0.5 flex-shrink-0"></i>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Procurement Specifications Grid
  const specsEl = document.getElementById('serviceSpecs');
  if (specsEl && service.specs) {
    specsEl.innerHTML = `
      <div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
        <div class="text-slate-400 font-medium text-[11px]">Min. Order (MOQ)</div>
        <div class="font-bold text-slate-800 dark:text-slate-200 mt-1">${service.specs.moq}</div>
      </div>
      <div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
        <div class="text-slate-400 font-medium text-[11px]">Packaging Type</div>
        <div class="font-bold text-slate-800 dark:text-slate-200 mt-1">${service.specs.packaging}</div>
      </div>
      <div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
        <div class="text-slate-400 font-medium text-[11px]">Lead Time SLA</div>
        <div class="font-bold text-slate-800 dark:text-slate-200 mt-1">${service.specs.leadTime}</div>
      </div>
      <div class="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
        <div class="text-slate-400 font-medium text-[11px]">Pricing Guide</div>
        <div class="font-bold text-amber-500 mt-1">${service.specs.price}</div>
      </div>
    `;
  }

  // Quote Form Service Input
  const nameInput = document.getElementById('quoteServiceNameInput');
  if (nameInput) nameInput.value = service.title;
}

