let k = 0;

let kInput = document.getElementById('kInput');
let content = document.getElementById('content');
let summary = document.getElementById('summary');
let calc = document.getElementById('calculations')

let values = Array();

kInput.addEventListener('change', (event) => {
    k = parseInt(event.target.value);
    calc.innerHTML = ''
    summary.style.display = 'none';

    values = new Array(k).fill(0).map(() => new Array(k).fill(0));

    let table = document.createElement('table');
    // generate horizontal header
    let tr = table.appendChild(document.createElement('tr'));
    tr.appendChild(document.createElement('th'));
    for (let x = 1; x < k + 1; x++) {
        let th = document.createElement('th');
        th.innerHTML = x;
        tr.appendChild(th);
    }

    //generate vertical header and data cells
    for (let y = 1; y < k + 1; y++) {
        // create new row
        tr = table.appendChild(document.createElement('tr'));
        let th = document.createElement('th');
        th.innerHTML = y;
        tr.appendChild(th);
        // generate cells
        for (let x = 1; x < k + 1; x++) {
            let td = document.createElement('td');
            let input = document.createElement('input');
            setAttributes(input, {
                type: 'number',
                id: `input-${y}-${x}`,
                value: 0,
                min: 0,
                onchange: 'updateCell(event)'
            });

            td.appendChild(input);
            tr.appendChild(td);
        }
        // create output cell
        let td = document.createElement('td');
        setAttributes(td, { 'class': 'output', 'id': `output-h-${y}` })
        td.innerHTML = '0'
        tr.appendChild(td);
    }
    // generate output on bottom row

    content.innerHTML = '';
    content.appendChild(table);
    tr = table.appendChild(document.createElement('tr'));
    let th = document.createElement('th');
    th.setAttribute('class', 'clear');
    tr.appendChild(th);
    for (let x = 1; x < k + 1; x++) {
        let td = document.createElement('td');
        setAttributes(td, { class: 'output', id: `output-v-${x}` });
        td.innerHTML = '0'
        tr.appendChild(td);
    }

    let td = document.createElement('td');
    setAttributes(td, { class: 'output', id: 'output' });
    td.innerHTML = '0'
    tr.appendChild(td);
});

function updateCell(event) {
    let value = event.target.value;
    let id = event.target.id.split('-');
    // change value in array
    values[id[1] - 1][id[2] - 1] = parseInt(value);

    console.log();
    // update outputs
    let arraySum = sumArray(values)

    document.getElementById(`output-v-${id[2]}`).innerHTML = sumCol(values, parseInt(id[2] - 1))
    document.getElementById(`output-h-${id[1]}`).innerHTML = sumRow(values, parseInt(id[1] - 1))
    document.getElementById('output').innerHTML = arraySum;

    summary.style.display = 'block';

    // handle proper display
    if (value == 0) {
        event.target.value = 0;
    } else if (value < 0) event.target.value = 0;
    // delete leading 0

    event.target.value = event.target.value.match(new RegExp('[1-9][0-9]*'))[0]
}

function setAttributes(element, attributes) {
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function sumRow(array, rowId) {
    return array[rowId].reduce((prev, curr, id, array) => {
        return prev + curr;
    })
}

function sumCol(array, colId) {
    let sum = 0
    array.forEach(element => {
        sum += element[colId]
    });
    return sum
}

function sumArray(array) {
    let sum = 0
    array.forEach(element => {
        element.forEach(number => {
            sum += number
        })
    });
    return sum
}

function calculate() {
    let diagonalSum = 0;
    for (i = 0; i < values.length; i++) {
        diagonalSum += values[i][i]
    }
    let displayInPercentages = (value) => { return `${parseFloat((value * 100).toPrecision(4))}%` }
    // overall accuracy
    calc.innerHTML = `<h3>Trafność ogólna</h3>
    <p><sup>${diagonalSum}</sup> &#8260; <sub>${sumArray(values)}</sub> = ${displayInPercentages(diagonalSum / sumArray(values))}</p>`

    calc.appendChild(generateTabsForAllClasses())

    document.getElementById('class0').classList.add('active')
    document.getElementById('button0').classList.add('active')
}
function generateTabsForAllClasses() {
    let tabs = document.createElement('div')
    tabs.classList.add('tabs')

    let tabsNavigation = document.createElement('div')
    tabsNavigation.classList.add('tabs-nav')

    let tabsContent = document.createElement('div')
    tabsContent.classList.add('tabs-content')

    for (let x = 0; x < k; x++) {
        tabsNavigation.appendChild(createTabButtonForClass(x))
        tabsContent.appendChild(createTabContentForClass(x))
    }
    tabs.appendChild(tabsNavigation)
    tabs.appendChild(tabsContent)

    return tabs;
}

function createTabButtonForClass(classNumber) {
    let button = document.createElement('div')
    setAttributes(button, { class: 'tab-button', id: `button${classNumber}`, onclick: `openTab('${classNumber}')` })
    button.innerHTML = `Klasa ${classNumber}`

    return button;
}

function createTabContentForClass(classNumber) {
    let tab = document.createElement('div')
    setAttributes(tab, { class: 'tab', id: `class${classNumber}` })

    let displayInPercentages = (value) => { return `${parseFloat((value * 100).toPrecision(4))}%` }

    let falsePositives = sumRow(values, classNumber) - values[classNumber][classNumber];
    let falseNegatives = sumCol(values, classNumber) - values[classNumber][classNumber];
    let trueNegatives = sumArray(values) - sumCol(values, classNumber) - sumRow(values, classNumber) + values[classNumber][classNumber];
    // accuracy for k
    let accuracy = displayInPercentages((trueNegatives + values[classNumber][classNumber]) / sumArray(values))
    // specificity for k
    let specificity = displayInPercentages(values[classNumber][classNumber] / (values[classNumber][classNumber] + falsePositives))
    //precision for k
    let precision = displayInPercentages(trueNegatives / (trueNegatives + falseNegatives))

    tab.innerHTML += `<h4>Dla k=${classNumber + 1}</h4>
    <p>Trafność: <sup>${trueNegatives + values[classNumber][classNumber]}</sup> &#8260; <sub>${sumArray(values)}</sub> = ${accuracy}</p>
    <p>Czułość: <sup>${values[classNumber][classNumber]}</sup> &#8260; <sub>${values[classNumber][classNumber] + falsePositives}</sub> = ${specificity}</p>
    <p>Swoistość: <sup>${trueNegatives}</sup> &#8260; <sub>${trueNegatives + falseNegatives}</sub> = ${precision}</p>`

    return tab;
}


function openTab(tabId) {
    //show appropriate tab
    let newTab = document.getElementById(`class${tabId}`)
    let newButton = document.getElementById(`button${tabId}`)

    let activeTab = document.getElementsByClassName('tab active')[0]
    let activeButton = document.getElementsByClassName('tab-button active')[0]

    if (activeTab) activeTab.classList.remove('active')
    if (activeButton) activeButton.classList.remove('active')

    newButton.classList.add('active')
    newTab.classList.add('active')
}

