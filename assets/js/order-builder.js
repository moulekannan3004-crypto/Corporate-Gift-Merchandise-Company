/**
 * Interactive Multi-Step Corporate Order Builder Engine
 * Handles 6-step progression, item selection, volume tier pricing, location allocation, and summary updates
 */

(function () {
  'use strict';

  let currentStep = 1;
  const orderState = {
    category: 'Executive Kits',
    products: ['Leather Journal', 'Smart Thermos', 'Wireless Charger'],
    branding: 'Laser Engraving + Custom Sleeve',
    quantity: 500,
    unitPrice: 850,
    locations: [
      { name: 'Chennai', qty: 150 },
      { name: 'Bangalore', qty: 120 },
      { name: 'Mumbai', qty: 100 },
      { name: 'Hyderabad', qty: 80 },
      { name: 'Delhi', qty: 50 }
    ],
    productionDays: 12
  };

  document.addEventListener('DOMContentLoaded', () => {
    initBuilderNav();
    initQtyControls();
    initLocationControls();
    updateSummaryUI();
    updatePrevBtnState();
  });

  function initBuilderNav() {
    const stepBtns = document.querySelectorAll('.builder-step-btn');
    const nextBtn = document.getElementById('builderNextBtn');
    const prevBtn = document.getElementById('builderPrevBtn');

    if (!nextBtn) return;

    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step);
        goToStep(step);
      });
    });

    nextBtn.addEventListener('click', () => {
      if (currentStep < 6) {
        goToStep(currentStep + 1);
      } else {
        submitOrderQuote();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) goToStep(currentStep - 1);
      });
    }
  }

  function goToStep(step) {
    currentStep = step;
    const stepBtns = document.querySelectorAll('.builder-step-btn');
    const stepContents = document.querySelectorAll('.builder-step-content');

    stepBtns.forEach((b, idx) => {
      b.classList.remove('active');
      if (idx + 1 === currentStep) b.classList.add('active');
      if (idx + 1 < currentStep) b.classList.add('completed');
    });

    stepContents.forEach(content => {
      content.classList.add('hidden');
      if (parseInt(content.dataset.stepContent) === currentStep) {
        content.classList.remove('hidden');
      }
    });

    const nextBtn = document.getElementById('builderNextBtn');
    if (nextBtn) {
      if (currentStep === 6) {
        nextBtn.innerHTML = '<i class="bi bi-send me-1"></i> Submit Quotation Request';
      } else {
        nextBtn.innerHTML = 'Continue to Next Step <i class="bi bi-chevron-right ms-1"></i>';
      }
    }

    const stepNumEl = document.getElementById('builderCurrentStepNum');
    if (stepNumEl) stepNumEl.textContent = currentStep;

    updatePrevBtnState();
    updateSummaryUI();
  }

  function updatePrevBtnState() {
    const prevBtn = document.getElementById('builderPrevBtn');
    if (!prevBtn) return;
    if (currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }
  }

  function initQtyControls() {
    const qtyInput = document.getElementById('builderQtyInput');
    const qtyTierBtns = document.querySelectorAll('.builder-qty-tier-btn');

    if (!qtyInput) return;

    qtyInput.addEventListener('input', (e) => {
      orderState.quantity = parseInt(e.target.value) || 100;
      recalculatePriceTier();
      updateSummaryUI();
    });

    qtyTierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        qtyTierBtns.forEach(b => b.classList.remove('active', 'border-amber-500', 'bg-amber-50/10'));
        btn.classList.add('active', 'border-amber-500', 'bg-amber-50/10');
        const qty = parseInt(btn.dataset.qty);
        qtyInput.value = qty;
        orderState.quantity = qty;
        recalculatePriceTier();
        updateSummaryUI();
      });
    });
  }

  function recalculatePriceTier() {
    const q = orderState.quantity;
    if (q >= 1000) {
      orderState.unitPrice = 720;
      orderState.productionDays = 15;
    } else if (q >= 500) {
      orderState.unitPrice = 850;
      orderState.productionDays = 12;
    } else if (q >= 250) {
      orderState.unitPrice = 980;
      orderState.productionDays = 10;
    } else {
      orderState.unitPrice = 1150;
      orderState.productionDays = 7;
    }
  }

  function initLocationControls() {
    const locInputs = document.querySelectorAll('.builder-loc-input');
    locInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const city = e.target.dataset.city;
        const val = parseInt(e.target.value) || 0;
        const targetLoc = orderState.locations.find(l => l.name === city);
        if (targetLoc) targetLoc.qty = val;
        updateSummaryUI();
      });
    });
  }

  function updateSummaryUI() {
    const categoryEl = document.getElementById('summaryCategory');
    const itemsEl = document.getElementById('summaryItems');
    const qtyEl = document.getElementById('summaryQty');
    const unitPriceEl = document.getElementById('summaryUnitPrice');
    const totalEstEl = document.getElementById('summaryTotalEst');
    const leadTimeEl = document.getElementById('summaryLeadTime');
    const locListEl = document.getElementById('summaryLocationsList');

    if (categoryEl) categoryEl.textContent = orderState.category;
    if (itemsEl) itemsEl.textContent = orderState.products.join(', ');
    if (qtyEl) qtyEl.textContent = `${orderState.quantity.toLocaleString()} Units`;
    if (unitPriceEl) unitPriceEl.textContent = `₹${orderState.unitPrice.toLocaleString()}`;
    if (leadTimeEl) leadTimeEl.textContent = `${orderState.productionDays} Business Days`;

    const total = orderState.quantity * orderState.unitPrice;
    if (totalEstEl) totalEstEl.textContent = `₹${total.toLocaleString()}`;

    if (locListEl) {
      locListEl.innerHTML = orderState.locations.map(loc => `
        <div class="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
          <span class="text-slate-500">${loc.name}:</span>
          <span class="font-bold">${loc.qty} Units</span>
        </div>
      `).join('');
    }
  }

  window.selectBuilderCategory = function (categoryName, element) {
    orderState.category = categoryName;
    const cards = document.querySelectorAll('.builder-category-card');
    cards.forEach(c => c.classList.remove('border-amber-500', 'bg-amber-500/5'));
    if (element) element.classList.add('border-amber-500', 'bg-amber-500/5');
    updateSummaryUI();
  };

  window.toggleBuilderProduct = function (productName, element) {
    const idx = orderState.products.indexOf(productName);
    if (idx > -1) {
      orderState.products.splice(idx, 1);
      if (element) element.classList.remove('border-amber-500', 'bg-amber-500/5');
    } else {
      orderState.products.push(productName);
      if (element) element.classList.add('border-amber-500', 'bg-amber-500/5');
    }
    updateSummaryUI();
  };

  window.selectBuilderBranding = function (brandingName, element) {
    orderState.branding = brandingName;
    const cards = document.querySelectorAll('.builder-branding-card');
    cards.forEach(c => c.classList.remove('border-amber-500', 'bg-amber-500/5'));
    if (element) element.classList.add('border-amber-500', 'bg-amber-500/5');
    updateSummaryUI();
  };

  function submitOrderQuote() {
    if (window.showToast) {
      window.showToast('Quotation request submitted! Sales manager will contact you.', 'Order Configured');
    } else {
      alert('Quotation request submitted!');
    }
  }
})();
