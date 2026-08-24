/**
 * Enterprise Data Visualizations via Chart.js
 * Renders interactive procurement charts, spend analysis, order distributions, and dark mode palette synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
});

let spendChart, categoryChart, performanceChart, adminRevenueChart;

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#9ca3af' : '#64748b',
    grid: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(226, 232, 240, 0.8)',
    accentGold: '#d97706',
    accentEmerald: '#059669',
    accentIndigo: '#6366f1',
    accentSlate: isDark ? '#e2e8f0' : '#0f172a'
  };
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  const colors = getChartColors();

  // 1. Monthly Spend Trend Line Chart
  const spendCtx = document.getElementById('monthlySpendChart')?.getContext('2d');
  if (spendCtx) {
    spendChart = new Chart(spendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Corporate Spend (₹ In Lakhs)',
          data: [12.4, 18.2, 15.6, 24.8, 31.0, 28.4, 42.5, 48.2],
          borderColor: colors.accentGold,
          backgroundColor: 'rgba(217, 119, 6, 0.12)',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
        }
      }
    });
  }

  // 2. Spending by Category Doughnut Chart
  const categoryCtx = document.getElementById('categoryDistributionChart')?.getContext('2d');
  if (categoryCtx) {
    categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Executive Kits', 'Tech Accessories', 'Stationery', 'Apparel', 'Eco Hampers'],
        datasets: [{
          data: [35, 25, 15, 15, 10],
          backgroundColor: ['#d97706', '#059669', '#6366f1', '#3b82f6', '#ec4899'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.text, font: { family: 'Plus Jakarta Sans' } } }
        }
      }
    });
  }

  // 3. Delivery Performance Bar Chart
  const perfCtx = document.getElementById('deliveryPerformanceChart')?.getContext('2d');
  if (perfCtx) {
    performanceChart = new Chart(perfCtx, {
      type: 'bar',
      data: {
        labels: ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'],
        datasets: [
          { label: 'On Time (%)', data: [98, 96, 94, 97, 99], backgroundColor: colors.accentEmerald, borderRadius: 6 },
          { label: 'SLA Days (Avg)', data: [2.1, 2.4, 2.8, 2.2, 1.9], backgroundColor: colors.accentIndigo, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text } } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
        }
      }
    });
  }

  // 4. Admin Enterprise Revenue Analytics Chart
  const adminCtx = document.getElementById('adminRevenueChart')?.getContext('2d');
  if (adminCtx) {
    adminRevenueChart = new Chart(adminCtx, {
      type: 'bar',
      data: {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
        datasets: [{
          label: 'Platform Revenue (₹ Cr)',
          data: [1.8, 2.4, 3.1, 4.8, 5.2, 6.7],
          backgroundColor: 'rgba(217, 119, 6, 0.85)',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text } } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
        }
      }
    });
  }

  // Listen for theme changes to update chart colors dynamically
  window.addEventListener('themeChanged', () => {
    const newColors = getChartColors();
    [spendChart, categoryChart, performanceChart, adminRevenueChart].forEach(chart => {
      if (chart) {
        if (chart.options.scales?.x) {
          chart.options.scales.x.grid.color = newColors.grid;
          chart.options.scales.x.ticks.color = newColors.text;
        }
        if (chart.options.scales?.y) {
          chart.options.scales.y.grid.color = newColors.grid;
          chart.options.scales.y.ticks.color = newColors.text;
        }
        if (chart.options.plugins?.legend?.labels) {
          chart.options.plugins.legend.labels.color = newColors.text;
        }
        chart.update();
      }
    });
  });
}
