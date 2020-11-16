<template>
  <canvas id="gopChart"></canvas>
</template>

<script>
  import Chart from 'chart.js';

  export default {
    props: ['data'],
    data() {
        return {
            myChart: '',
            gopChartData: {
                labels: ['0'],
                datasets: [
                    { 
                        data: [0],
                        backgroundColor: ['#d5daf3'],
                        borderColor: ['#30419b'],
                        borderWidth: 1,
                        fill: 'start'
                    }
                ]
            },
            histogramOptions: {
                lineTension: 1,
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                      gridLines: {
                        display: false,
                      },
                      ticks: {
                          display: false
                      }                      
                    }],
                    yAxes: [{
                      gridLines: {
                        display: false,
                      },
                      ticks: {
                          display: false
                      }
                    }],                    
                }
            }
        }
    },
    methods: {
        createChart(chartId, chartData) {
            this.myChart = new Chart(document.getElementById(chartId), {
                type: 'line',
                data: chartData,
                options: this.histogramOptions,
            });
        },
        addData(label, data) {
            this.myChart.data.labels.push(label);
            this.myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(data);
            });
            this.myChart.update();
        }
    },
    mounted() {
        this.createChart('gopChart', this.gopChartData);
    }
  }
</script>

<style scoped>
    canvas{
        width:150px !important;
        height:50px !important;
    }
</style>