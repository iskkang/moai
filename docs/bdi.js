document.addEventListener('DOMContentLoaded', () => {
    loadChartData('BDI'); // 초기 로드 시 BDI 데이터 표시
});

async function loadChartData(type) {
    const response = await fetch('/data');
    if (response.ok) {
        const allData = await response.json();
        const dataset = allData.find(data => data.title === type);
        if (dataset) {
            displayChart(dataset);
        } else {
            console.error(`No data found for ${type}`);
        }
    } else {
        console.error('Failed to load data');
    }
}

function displayChart(dataset) {
    const ctx = document.getElementById('bdiChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataset.data.map(item => item[0]),
            datasets: [{
                label: dataset.title,
                data: dataset.data.map(item => item[1]),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // 비율 유지를 하지 않도록 설정
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'll',
                        displayFormats: {
                            day: 'YYYY-MM-DD'
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    });
}