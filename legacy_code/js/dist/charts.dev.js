"use strict";

var xhttp;
xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);
    var ctx = document.getElementById("logistic-pie-chart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data['labels'],
        datasets: [{
          data: data['values'],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)"
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10
        },
        legend: {
          display: true,
          position: 'bottom',
          usePointStyle: true
        },
        cutoutPercentage: 80
      }
    });
  }
};

xhttp.open("GET", '/dataQuery.php?method=getLastWSStock', true);
xhttp.send();