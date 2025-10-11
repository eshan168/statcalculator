const table = document.getElementById("maintable");
const submitbutton = document.getElementById("submitbutton");
const select = document.getElementById("selecttest");

const buttoncontainer = document.getElementById("buttoncontainer");
const addcolumnbutton = document.getElementById("addcolumn");
const deletecolumnbutton = document.getElementById("deletecolumn");

const df = document.getElementById("df");
const teststatistic = document.getElementById("teststatistic");
const pvalue = document.getElementById("pvalue");

function tableresults(){
    displayresults(calculatetable());
}

function gofresults(){
    displayresults(calculategof());
}

function displayresults(result) {
    df.innerHTML = Math.round(result["df"]);
    teststatistic.innerHTML = Math.round(result["teststatistic"]*100000)/100000;
    pvalue.innerHTML = Math.round(result["pvalue"]*100000)/100000;
}

function calculatetable() {
    let data = getinputs();
    let rowtotals = [];
    let columntotals = new Array(data[0].length).fill(0);

    for (let nums of data){
        let sum = 0;
        for (let i=0; i<nums.length; i++){
            sum += nums[i];
            columntotals[i] += nums[i];
        }
        rowtotals.push(sum);
    }
    let teststatistic = chi_squaredstatistic(data,rowtotals,columntotals);
    let df = (rowtotals.length-1)*(columntotals.length-1);
    let pvalue = 1-jStat.chisquare.cdf(teststatistic,df);
    return {"df": df, "teststatistic": teststatistic, "pvalue": pvalue};
}

function chi_squaredstatistic(data,rowtotals,columntotals) {
    const total = eval(rowtotals.join('+'));
    let chi_squared = 0;

    for (let r=0; r<data.length; r++){
        for (let c=0; c<data[r].length; c++){
            let expected = (rowtotals[r]*columntotals[c])/total;
            let observed = data[r][c];
            chi_squared += (observed-expected)**2 / expected;
        }
    }
    return chi_squared;
}

function calculategof() {
    let data = getinputs();
    let teststatistic = chi_squaredgof(data);
    let df = data.length-1;
    let pvalue = 1-jStat.chisquare.cdf(teststatistic,df);
    return {"df": df, "teststatistic": teststatistic, "pvalue": pvalue};
}

function chi_squaredgof(data) {
    let chi_squared = 0;
    for (let pairs of data){
        let observed = pairs[0];
        let expected = pairs[1];
        chi_squared += (observed-expected)**2 / expected;
    }
    return chi_squared;
}

function getinputs() {
    let data = [];
    for (let row=1; row<table.rows.length; row++){
        let temp = [];
        let inputs = table.rows[row].querySelectorAll("input");
        for (let input of inputs) {
            temp.push(Number(input.value));
        }
        data.push(temp);
    }
    return data;
}

function changetable() {
    if (select.value == "independence" || select.value == "homogeneity"){
        independencetable();
    }
    else{
        goftable();
    }
}

function independencetable() {
    table.rows[0].cells[1].innerHTML = "Category 1";
    table.rows[0].cells[2].innerHTML = "Category 2";
    addcolumnbutton.style.display = "inline-block";
    deletecolumnbutton.style.display = "inline-block";
    buttoncontainer.style.justifyContent = "space-between";
    submitbutton.onclick = tableresults;
}

function goftable() {
    let len = table.rows[0].cells.length-3;
    table.rows[0].cells[1].innerHTML = "Observed";
    table.rows[0].cells[2].innerHTML = "Expected";
    addcolumnbutton.style.display = "none";
    deletecolumnbutton.style.display = "none";
    buttoncontainer.style.justifyContent = "center";
    submitbutton.onclick = gofresults;

    for (let row of table.rows){
        for (let i=0; i<len; i++){
            row.deleteCell(-1);
        }
    }
}
