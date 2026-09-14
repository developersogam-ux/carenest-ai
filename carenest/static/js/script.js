/**
 * CARENEST - Frontend JavaScript Helper
 * Initializes tooltips, filters, search helpers, and interactive modals.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Bootstrap Tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Auto-dismiss alert messages after 5 seconds
  const flashAlerts = document.querySelectorAll('.alert-dismissible');
  flashAlerts.forEach(function (alert) {
    setTimeout(function () {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // Dynamic filter helper for client tables / list cards
  const quickSearchInput = document.getElementById('quickCardSearch');
  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase();
      const searchableCards = document.querySelectorAll('.searchable-card');
      searchableCards.forEach(function (card) {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});

/**
 * Print medical report utility
 */
function printReport() {
  window.print();
}