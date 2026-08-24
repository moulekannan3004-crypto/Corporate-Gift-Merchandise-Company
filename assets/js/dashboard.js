/**
 * Client Portal & Admin Dashboard Interactions
 * Handles sidebar toggling, search filtering, quotation response triggers, modal dialogs, and Kanban drag-drop handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initKanbanDragDrop();
  initQuotationActions();
});

function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.dashboard-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }
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
