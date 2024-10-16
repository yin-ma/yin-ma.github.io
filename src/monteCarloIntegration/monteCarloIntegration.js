let elt = document.getElementById('calculator');
let calculator = Desmos.GraphingCalculator(elt, { expressions: true });
let ans = document.querySelector(".numerical-ans");
let imAns = document.querySelector(".im-numerical-ans");
let startButton = document.querySelector(".start");
let googleCharts = document.querySelector(".google-charts");

let result = [];
let graphArr = [];

startButton.addEventListener("click", () => {
  googleCharts.style.display = "flex";
  startButton.style.display = "none";
  result = [];
  graphArr = [];
  mcIntegrater(20000);
  imMcIntegrater(1);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(() => drawChart('curve_chart_1', graphArr));
  google.charts.setOnLoadCallback(() => drawChart('curve_chart_2', imGraphArr));

})


calculator.setExpression({id:'graph1', latex:'f\\left(x\\right)=x^{2}'});
calculator.setExpression({id:'graph2', latex:'\\left\\{f\\left(x\\right)>0:\\ 0,\\ f\\left(x\\right)<0:\\ f\\left(x\\right)\\right\\}<y<\\ \\left\\{f\\left(x\\right)>0:\\ f\\left(x\\right),\\ f\\left(x\\right)<0:\\ 0\\right\\}\\left\\{0<x<2\\right\\}'});
calculator.setMathBounds({
  left: -3,
  right: 3,
  bottom: -1,
  top: 5
});



function drawChart(chart, arr) {
  var data = google.visualization.arrayToDataTable([
    ['iteration', 'f(x)'],
    ...arr
  ]);

  var options = {
    title: 'Numerical solution over N iteration',
    curveType: 'function',
    chartArea: {'width': '85%', 'height': '85%'},
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById(chart));

  chart.draw(data, options);
}


function f(x) {
  return x**2;
}


function mcIntegrater(k) {
  for(i=0; i<k; i++) {
    x = Math.random() * 2;
    y = f(x);
    result.push([i+1, y]);
  }

  let sum = 0;

  result.forEach(i => {
    sum += i[1];
    if (i[0] % 100 == 0) {
      graphArr.push([i[0], (sum/uniform_pdf())/i[0]])
    }
  });

  ans.innerHTML = parseFloat(graphArr[graphArr.length-1][1]).toFixed(6);

}

function uniform_pdf() {
  return 1 / 2;
}

function im_pdf(x) {
  return (3 / 8) * x * x;
}


function icd(x) {
  return 8.0 * Math.pow(x, 1/3);
}


function imMcIntegrater(k) {
  temp = 0;
  for(i=0; i<k; i++) {
    x = icd(Math.random());
    y = f(x);
    temp = y/im_pdf(x);
  }

  imAns.innerHTML = parseFloat(temp).toFixed(6);

}