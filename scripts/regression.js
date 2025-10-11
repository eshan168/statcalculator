window.onload = function() {
    for (let i=0; i<=97; i++) {
        addrow('',false);
    }
}

const table = document.getElementById("maintable");

const submitbutton = document.getElementById("submitbutton");
const select = document.getElementById("selecttest");
const buttoncontainer = document.getElementById("buttoncontainer");

const df = document.getElementById("df");
const teststatistic = document.getElementById("teststatistic");
const pvalue = document.getElementById("pvalue");

function results() {
    let data = getdata();
    let correl = correlation(data[0],data[1])
}

function correlation(x,y) {
    let xs = jStat.stdev(x,false);
    let ys = jStat.stdev(y,false);
    let xm = jStat.mean(x);
    let ym = jStat.mean(y);
    let teststatistic = 0;
    for (let i=0; i<=x.length; i++){
        teststatistic += (((x-xm)/xs) * ((x-ym)/ys)) / (x.length-1)
    }
    console.log(xs);
    return teststatistic;
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