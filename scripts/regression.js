window.onload = function() {
    for (let i=0; i<=97; i++) {
        addrow('',false);
    }
}

const table = document.getElementById("maintable");
const tablecontainer = document.getElementById("regressiontable");
const inputcontainer = document.getElementById("regressioninput");

const submitbutton = document.getElementById("submitbutton");
const select = document.getElementById("selecttest");
const confidencelevel = document.getElementById("confidence");

const df = document.getElementById("df");
const teststatistic = document.getElementById("teststatistic");
const pvalue = document.getElementById("pvalue");

function switchinput() {
    if (select.value == "data") {
        console.log("switch")
        inputdata();
    }
    else {
        inputstats();
    }
}

function inputdata() {
    tablecontainer.style.display = "block";
    inputcontainer.style.display = "none";
}

function inputstats() {
    inputcontainer.style.display = "block";
    tablecontainer.style.display = "none";
}

function results() {
    let data = getdata();
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

    console.log(`y = ${slope}x + ${intercept}`);
    console.log(slope-error, slope+error);
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

function getdata() {
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

function round(number) {
    return Math.round(number*10000)/10000; 
}