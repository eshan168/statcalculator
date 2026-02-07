window.onload = function() {
    for (let i=0; i<=97; i++) {
        addrow('',false);
    }
}

window.addEventListener("resize", () => {
    graph.resize();
});

let istable = true;
const textinput = document.getElementById("textinput");
const regressioninput = document.getElementById("regressiontable");
const tablebutton = document.getElementById("tablebutton");
const textbutton = document.getElementById("textbutton");

const table = document.getElementById("maintable");
const tablecontainer = document.getElementById("regressiontable");
const inputcontainer = document.getElementById("regressioninput");

const xinput = document.getElementById("xinput");
const yinput = document.getElementById("yinput");

const submitbutton = document.getElementById("submitbutton");
const confidencelevel = document.getElementById("confidence");
resultscontainer = document.getElementById("resultscontainer");

const ctx = document.getElementById("myChart");
let graph = null;

const equation = document.getElementById("equation");
const se = document.getElementById("se");
const r = document.getElementById("correl");

const standarddeviation = document.getElementById("stdev");
const margin = document.getElementById("marginoferror");
const interval = document.getElementById("interval");

const df = document.getElementById("df");
const teststatistic = document.getElementById("teststatistic");
const pvalue = document.getElementById("pvalue");

function switchinput() {
    if (select.value == "data") {
        console.log("switch")
        inputdata();
    } else {
        inputstats();
    }
}

function creategraph(data) {
    ctx.style.display = "block";
    let xyValues = [];
    for (let i=0; i<data[0].length; i++){
        xyValues.push({x : data[0][i], y : data[1][i]});
    }

    if (graph) {
        graph.destroy();
    }
    graph = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "rgb(0,0,255)",
            data: xyValues
          }]
        },
        options: {
          plugins: {
            legend: {display:false},
            title: {
              display: true,
              text: "Graph",
              font: {size:16}
            },
            responsive: false,
            maintainAspectRatio: true
          }
        }
      });
}

function results() {
    resultscontainer.style.display = "flex";

    let data;
    if (istable) {
        data = gettabledata();
    }
    else {
        data = getboxdata();
    }
    creategraph(data);

    let xm = jStat.mean(data[0]);
    let ym = jStat.mean(data[1]);
    let xs = jStat.stdev(data[0],true);
    let ys = jStat.stdev(data[1],true);

    let correl = correlation(data[0],data[1]);
    let slope = round(correl * ys/xs);
    let intercept = round(ym - slope*xm);

    let freedom = data[0].length - 2;
    let residualerror = standarderror(slope,intercept,data[0],data[1]);
    let stdev = round(residualerror / (xs * Math.sqrt(data[0].length - 1)));
    let criticalvalue = round(jStat.studentt.inv(confidencelevel.value,freedom));
    let error = round(stdev * criticalvalue);

    let tstat = round(slope/stdev);
    let proportion = round(1-jStat.studentt.cdf(Math.abs(tstat),freedom))*2;

    equation.innerHTML = `y = ${slope}x + ${intercept}`;
    se.innerHTML = "<strong>Standard Error: </strong>"+residualerror;
    r.innerHTML = "<strong>Correlation: </strong>"+correl;

    standarddeviation.innerHTML = "<strong>Standard Deviation of Slope: </strong>"+stdev;
    margin.innerHTML = `<strong>Margin of Error:</strong> ${slope} +- ${error}`;
    interval.innerHTML = `<strong>Interval: </strong>[${round(slope-error)}, ${round(slope+error)}]`;

    df.innerHTML = "<strong>Degrees of Freedom: </strong>"+freedom;
    teststatistic.innerHTML = "<strong>Degrees of Freedom: </strong>"+freedom;
    pvalue.innerHTML = "<strong>P Value: </strong>"+proportion;

}

function correlation(x,y) {
    let xm = jStat.mean(x);
    let ym = jStat.mean(y);
    let xs = jStat.stdev(x,true);
    let ys = jStat.stdev(y,true);
    let correl = 0;
    for (let i=0; i<x.length; i++){
        correl += (((x[i]-xm)/xs) * ((y[i]-ym)/ys)) / (x.length-1);
    }
    return round(correl);
}

function standarderror(slope,intercept,x,y) {
    if (x.length <= 2) return 0;
    let error = 0;
    for (let i=0; i<x.length; i++) {
        let predicted = slope*x[i] + intercept;
        error += (y[i]-predicted)**2 / (x.length-2);
    }
    return round(Math.sqrt(error));
}

function gettabledata() {
    let x = [];
    let y = [];
    for (let row=1; row<table.rows.length; row++){
        let inputs = table.rows[row].querySelectorAll("input");
        if (inputs[0].value.trim() == '' || inputs[1].value.trim() == ''){
            break
        }
        x.push(Number(inputs[0].value));
        y.push(Number(inputs[1].value));
    }
    return [x,y];
}

function getboxdata() {
    x = xinput.value.split("\n");
    y = yinput.value.split("\n");

    if (x[-1] == ""){
        x.pop();
    } if (y[-1] == ""){
        y.pop();
    }
    x = x.map(item => Number(item));
    y = y.map(item => Number(item));

    let length = Math.min(x.length,y.length);
    x = x.slice(0,length);
    y = y.slice(0,length);
    
    return [x,y];
}

function viewtable() {
    regressioninput.style.display = "inline-block";
    textinput.style.display = "none";
    tablebutton.style.background = "rgb(77, 151, 230)";
    textbutton.style.background = "white";
    istable = true;
}

function viewtextbox() {
    regressioninput.style.display = "none";
    textinput.style.display = "inline-block";
    tablebutton.style.background = "white";
    textbutton.style.background = "rgb(77, 151, 230)";
    istable = false;
}

function round(number) {
    return Math.round(number*10000)/10000; 
}