addEventListener("keydown", focuscell);

// Modfying table

function addrow(text,limit) {
    console.log(text);
    if (table.rows.length >= 10 && limit){
        return;
    }
    let row = document.createElement("tr");
    table.appendChild(row);
    let cols = table.rows[0].cells.length;
    let rows = table.rows.length;

    for (let i=0; i<cols; i++){
        addcell(row);
    }
    table.rows[rows-1].cells[0].innerText = `${text}${rows-1}`;
}

function deleterow() {
    let rows = table.rows.length;
    if (rows <= 3){
        return;
    }
    table.rows[rows-1].remove();
}

function addcolumn() {
    let rows = table.rows.length;
    let cols = table.rows[0].cells.length;
    if (cols >= 10){
        return;
    }
    let headerrow = table.rows[0];
    let header = document.createElement("th");
    headerrow.appendChild(header);
    header.textContent = `Category ${cols}`;

    for (let i=1; i<rows; i++){
        addcell(table.rows[i]);
    }
}

function deletecolumn() {
    let rows = table.rows[0].cells.length;
    if (rows <= 3){
        return;
    }
    for (let row of table.rows){
        row.deleteCell(-1);
    }
}

function addcell(row) {
    let cell = document.createElement("td");
    cell.innerHTML = "<input type='text'>";
    row.appendChild(cell);
}

function clearinputs() {
    let inputs = document.querySelectorAll("input");
    for (let input of inputs){
        input.value = '';
    }
}


// Moving through table

function getcell() {
    let element = document.activeElement.parentElement;
    let row = element.parentElement.rowIndex;
    let column = element.cellIndex;
    return [row,column]
}

function focuscell(event) {
    let coords = getcell();
    let row = coords[0];
    let column = coords[1];
    if (event.key == "Enter" || event.key == "ArrowDown"){
        downfocus(row,column)
    }
    else if (event.key == "ArrowUp"){
        upfocus(row,column)
    }
    else if (event.key == "ArrowLeft"){
        leftfocus(row,column)
    }
    else if (event.key == "ArrowRight"){
        rightfocus(row,column)
    }
}

function upfocus(row,column) {
    if (row > 1){
        table.rows[row-1].cells[column].querySelector("input").focus();
    }
}

function downfocus(row,column) {
    if (row < table.rows.length-1){
        table.rows[row+1].cells[column].querySelector("input").focus();
    }
}

function leftfocus(row,column) {
    if (column > 1){
        table.rows[row].cells[column-1].querySelector("input").focus();
    }
}

function rightfocus(row,column) {
    if (column < table.rows[0].cells.length-1){
        table.rows[row].cells[column+1].querySelector("input").focus();
    }
}