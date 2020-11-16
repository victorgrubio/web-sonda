<template>
  <canvas id="spatialComplexChart"></canvas>
</template>

<script>
  import Chart from 'chart.js';

  export default {
    props: ['data'],
    data() {
        return {
            myChart: '',
            maxPointsDisplayed: 60,            
            spatialComplexChartData: {
                labels: [],
                datasets: [
                    { 
                        data: [],
                        backgroundColor: ['#eda2a2'],
                        borderColor: ['#e54a4a'],
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
            if (this.myChart.data.labels.length >= this.maxPointsDisplayed) {
                this.myChart.data.labels.shift()
            }
            this.myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(data);
                if (dataset.data.length >= this.maxPointsDisplayed) {
                    dataset.data.shift()
                }
                
            });
            this.myChart.update();
        }
    },
    mounted() {
        this.createChart('spatialComplexChart', this.spatialComplexChartData);
    }
  }
</script>

<style scoped>
    canvas{
        width:150px !important;
        height:50px !important;
    }
</style>