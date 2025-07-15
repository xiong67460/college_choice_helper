// chart.js
// 依赖Chart.js CDN

function renderScoreChart(years, scores, name) {
  const ctx = document.getElementById('scoreChart');
  if (!ctx) return;
  if (window.scoreChartInstance) {
    window.scoreChartInstance.destroy();
  }
  window.scoreChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: name + ' 历年分数线',
        data: scores,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.1)',
        fill: true
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
window.renderScoreChart = renderScoreChart; 