/**
 * Client Portal & Admin Dashboard Interactions
 * Handles sidebar toggling, backdrop overlay, search filtering, quotation response triggers, modal dialogs, and Kanban drag-drop handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initKanbanDragDrop();
  initQuotationActions();
});

function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.dashboard-sidebar');

  if (!sidebar) return;

  // Create or retrieve sidebar backdrop overlay
  let backdrop = document.getElementById('dashboardSidebarBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'dashboardSidebarBackdrop';
    backdrop.className = 'dashboard-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  // Ensure close button exists in sidebar header for mobile view
  const sidebarHeader = sidebar.querySelector('.sidebar-header');
  if (sidebarHeader && !sidebarHeader.querySelector('.sidebar-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'sidebar-close-btn lg:hidden text-slate-400 hover:text-white p-1 rounded-lg transition-colors';
    closeBtn.innerHTML = '<i class="bi bi-x-lg text-lg"></i>';
    closeBtn.setAttribute('aria-label', 'Close Sidebar');
    closeBtn.addEventListener('click', closeSidebar);
    sidebarHeader.appendChild(closeBtn);
  }

  function openSidebar() {
    sidebar.classList.add('show');
    backdrop.classList.add('active');
    if (window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (sidebar.classList.contains('show')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  backdrop.addEventListener('click', closeSidebar);

  // Close sidebar when clicking any menu link on mobile screens
  const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeSidebar();
    }
  });

  // Export helper globally if needed
  window.toggleAdminSidebar = toggleSidebar;
}

function initKanbanDragDrop() {
  const cards = document.querySelectorAll('.kanban-card');
  const columns = document.querySelectorAll('.kanban-column-cards');

  if (!cards.length) return;

  cards.forEach(card => {
    card.setAttribute('draggable', 'true');

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.id || 'card-drag');
      card.classList.add('opacity-50');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('opacity-50');
    });
  });

  columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('bg-amber-50/20');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('bg-amber-50/20');
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('bg-amber-50/20');
      const card = document.querySelector('.opacity-50');
      if (card) {
        column.appendChild(card);
        const colTitle = column.previousElementSibling?.querySelector('h4')?.textContent || 'New Status';
        if (window.showToast) {
          window.showToast(`Order status updated to: ${colTitle}`, 'Production Board');
        }
      }
    });
  });
}

function initQuotationActions() {
  window.approveQuotation = function (quoteId) {
    if (window.showToast) {
      window.showToast(`Quotation ${quoteId} officially APPROVED! Converting to active order...`, 'Quotation Approved', 'bi-check-all');
    }
  };

  window.rejectQuotation = function (quoteId) {
    if (window.showToast) {
      window.showToast(`Quotation ${quoteId} sent for negotiation with account manager.`, 'Negotiation Requested', 'bi-arrow-repeat');
    }
  };
}
