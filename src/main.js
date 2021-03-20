let k = 0

let kInput = document.getElementById('kInput')
let content = document.getElementById('content')

kInput.addEventListener('change', event => {
    k = parseInt(event.target.value);
    console.log(k+1);

    let table = document.createElement('table')
    // generate horizontal header
    let tr = table.appendChild(document.createElement('tr'))
    tr.appendChild(document.createElement('th'))
    for (let x = 1; x < k+1; x++){
        let th = document.createElement('th')
        th.innerHTML = x;
        tr.appendChild(th)
    }

    //generate vertical header and data cells
    for (let y = 1; y < k + 1; y++) {
     // create new row
        tr = table.appendChild(document.createElement('tr'))
        let th = document.createElement('th')
        th.innerHTML = y;
        tr.appendChild(th);
        // generate cells
        for (let x = 1; x < k + 1; x++) {

            let td = document.createElement('td');
            let input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('id', 'input-' + y + '-' + x)
            input.setAttribute('value', 0)
            input.setAttribute('min',0)
            input.setAttribute('onkeydown', 'if(event.keyCode==13){this.blur();checkCell(event)}')

            td.appendChild(input)
            tr.appendChild(td)
        }
        // create output cell
        let td = document.createElement('td')
        td.setAttribute('class', 'output')
        td.setAttribute('id', 'output-h-'+y)
        tr.appendChild(td)
    }
    // generate output on bottom row

    content.innerHTML = ''
    content.appendChild(table);
    tr = table.appendChild(document.createElement('tr'))
    let th = document.createElement('th')
    th.setAttribute('class','clear')
    tr.appendChild(th)
    for (let x = 1; x < k + 1; x++) {

        let td = document.createElement('td')
        td.setAttribute('class', 'output')
        td.setAttribute('id', 'output-v-'+x)
        tr.appendChild(td)
    }
});

function checkCell(event) {
    let value = event.target.value

    if (value == 0) {
        event.target.value = 0;
    }
    else if (value < 0) event.target.value = 0;
}