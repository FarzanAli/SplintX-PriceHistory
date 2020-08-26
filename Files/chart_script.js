let id = 1;
let foil = false;
let edition = 0;
let range = 'week';

const selected = document.querySelector(".selected-card");

const secondSelectedTrue = document.querySelector(".foil-options .true-option")
const secondSelectedFalse = document.querySelector(".foil-options .false-option")
const thirdSelected = document.querySelector(".edition-selected");

const optionsContainer = document.querySelector(".card-options-container");
const thirdOptionsContainer = document.querySelector(".edition-options-container");

const searchBox = document.querySelector(".search-box input");
const thirdSearchBox = document.querySelector(".edition-search-box input");

const optionsList = document.querySelectorAll(".option");
const thirdOptionsList = document.querySelectorAll(".edition-option");

let gold = document.querySelector(".true-option");
let regular = document.querySelector(".false-option");

let week = document.querySelector(".week-option");
let month = document.querySelector(".month-option");


selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
  searchBox.value = "";
  filterList("");
  if (optionsContainer.classList.contains("active")) {
    searchBox.focus();
  }
});

optionsList.forEach(o => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    cardDetails(selected.innerHTML)
    optionsContainer.classList.remove("active");
    getAndSetPrice();
  });
});

searchBox.addEventListener("keyup", function (e) {
  filterList(e.target.value);
});

const filterList = searchTerm => {
  searchTerm = searchTerm.toLowerCase();
  optionsList.forEach(option => {
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) { option.style.display = "block"; }
    else { option.style.display = "none"; }
  });
};

//Foil(second)
secondSelectedTrue.addEventListener("click", () => {
  foil = true;
  getAndSetPrice();
});

secondSelectedFalse.addEventListener("click", () => {
  foil = false;
  getAndSetPrice();
});
//Edition(third)

thirdSelected.addEventListener("click", () => {
  thirdOptionsContainer.classList.toggle("active");
  thirdSearchBox.value = "";
  thirdFilterList("");
  if (thirdOptionsContainer.classList.contains("active")) {
    thirdSearchBox.focus();
  }
});

thirdOptionsList.forEach(o => {
  o.addEventListener("click", () => {
    thirdSelected.innerHTML = o.querySelector("label").innerHTML;

    if (thirdSelected.innerHTML == "Alpha") { edition = 0; }
    else if (thirdSelected.innerHTML == "Beta") { edition = 1; }
    else if (thirdSelected.innerHTML == "Promo") { edition = 2; }
    else if (thirdSelected.innerHTML == "Reward") { edition = 3; }
    else if (thirdSelected.innerHTML == "Untamed") { edition = 4; }

    thirdOptionsContainer.classList.remove("active");
    getAndSetPrice();
  });
});

thirdSearchBox.addEventListener("keyup", function (e) {
  thirdFilterList(e.target.value);
});

const thirdFilterList = searchTerm => {
  searchTerm = searchTerm.toLowerCase();
  thirdOptionsList.forEach(option => {
    let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
    if (label.indexOf(searchTerm) != -1) { option.style.display = "block"; }
    else { option.style.display = "none"; }
  });
};

week.addEventListener("click", () =>{
  range = 'week'
  getAndSetPrice();
});

month.addEventListener("click", () =>{
  range = 'month'
  getAndSetPrice();
});

labelArray = [];
data = [];

data_url = 'http://18.223.152.60:8080/history'

async function getAndSetPrice() {
  data.splice(0, data.length)
  labelArray.splice(0, labelArray.length)

  const response = await fetch(data_url);
  const dataJSON = await response.json();

  foilStr = "";

  if (foil == true) {
    foilStr = "True"
    gold.style.backgroundColor = '#eba82d'
    if (regular.style.backgroundColor = '#414b57') {
      regular.style.backgroundColor = ''
    }
  }
  else if (foil == false) {
    foilStr = "False"
    regular.style.backgroundColor = '#414b57'
    if (gold.style.backgroundColor = '#414b57') {
      gold.style.backgroundColor = ''
    }
  }

  if(range == 'week'){
    if(month.style.backgroundColor = '#525861'){
      month.style.backgroundColor = '';
    }
    week.style.backgroundColor = '#525861';
  }
  else if(range == 'month'){
    if(week.style.backgroundColor = '#525861'){
      week.style.backgroundColor = ''
    }
    month.style.backgroundColor = '#525861'
  }

  for (i = 0; i < dataJSON.length; i++) {

    if (dataJSON[i].target == "sm.card_value.card_id=" + id + ";edition=" + edition + ";gold=" + foilStr) {
      if (data.length == 0 && labelArray.length == 0) {
        for (j = 0; j < dataJSON[i].datapoints.length; j++) {
          milliseconds = dataJSON[i].datapoints[j][1] * 1000;
          date = new Date(milliseconds).toLocaleDateString('en-US', { timeZone: 'GMT' });
          labelArray.push(date);

          data.push({ y: dataJSON[i].datapoints[j][0] })
        }
      }
    }
  }
  updateChart(myChart);
}

//Chart configurations


config = {
  type: 'line',
  data: {
    labels: labelArray,
    datasets: [{
      label: 'Price(USD)',
      data: data,
      fill: false,
      borderColor: ['rgba(255, 99, 132, 1)'],
      borderWidth: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true
  }
}

//Context
let ctx = document.getElementById('myChart').getContext('2d');

//Chart
let myChart = new Chart(ctx, config)

function updateChart(chart) {
  chart.update();
}

async function cardDetails(givenName) {
  url = 'https://steemmonsters.com/cards/get_details'
  const response = await fetch(url);
  const data = await response.json();
  for (i = 0; i < data.length; i++) {
    if (data[i].name == givenName) {
      id = data[i].id;
    }
  }
}

getAndSetPrice();