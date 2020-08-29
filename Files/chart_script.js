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
  getAndSetPrice(id, edition, foil);
});

secondSelectedFalse.addEventListener("click", () => {
  foil = false;
  getAndSetPrice(id, edition, foil);
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
    getAndSetPrice(id, edition, foil);
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

week.addEventListener("click", () => {
  range = 'week'
  getAndSetPrice(id, edition, foil);
});

month.addEventListener("click", () => {
  range = 'month'
  getAndSetPrice(id, edition, foil);
});

async function getAndSetPrice(id, edition, foil) {

  foilStr = "";
  foilInt = 0;


  if (foil == true) {
    foilStr = "True"
    foilInt = 1
    gold.style.backgroundColor = '#eba82d'
    if (regular.style.backgroundColor = '#414b57') {
      regular.style.backgroundColor = ''
    }
  }
  else if (foil == false) {
    foilStr = "False"
    foilInt = 0
    regular.style.backgroundColor = '#414b57'
    if (gold.style.backgroundColor = '#414b57') {
      gold.style.backgroundColor = ''
    }
  }

  if (range == "week") {
    if (month.style.backgroundColor = '#525861') {
      month.style.backgroundColor = ''
    }
    week.style.backgroundColor = '#525861'
  }
  else if (range == "month") {
    if (week.style.backgroundColor = '#525861') {
      week.style.backgroundColor = ''
    }
    month.style.backgroundColor = '#525861'
  }

  datesArray = [];
  priceHistory = [];
  weekArray = [];
  monthArray = [];

  var cardCred = [];

  var card = {};
  
  card.id = id;
  card.foil = foilInt;
  card.edition = edition;

  cardCred.push(card);

  $(document).ready(function () {

    $.ajax({
      url: "http://localhost/SplintX/SplintX-PriceHistory/Files/db.php",
      method: "POST",
      data: {card : JSON.stringify(cardCred)},
      success: function(data){
        dataArray = JSON.parse(data);
        priceHistory = dataArray[1];
        datesArray = dataArray[0];
        for (var i in datesArray) {
          datesArray[i] = datesArray[i].slice(0, datesArray[i].length - 11);
        }
        if (range == 'week') {
          monthArray.splice(0, monthArray.length)

          if (monthArray.length == 0) {
            for (var i = 0; l = 7, i < l; i++) {
              weekArray.push(datesArray[datesArray.length - i - 1]);
            }
            datesArray = weekArray;
          }
        }
        else if (range == 'month') {
          weekArray.splice(0, weekArray.length)
          if (weekArray.length == 0) {
            for (var i = 0; l = 31, i < l; i++) {
              monthArray.push(datesArray[datesArray.length - i - 1]);
            }
            datesArray = monthArray;
          }
        }

        //Chart configurations
        config = {
          type: 'line',
          data: {
            labels: datesArray,
            datasets: [{
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              pointBorderColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 3,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointHoverRadius: 6,
              pointHoverBackgroundColor: ['rgba(255, 99, 132, 1)'],
              label: 'Price(USD)',
              data: priceHistory
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                ticks: {
                  suggestedMin: 0
                }
              }]
            }
          }
        }
        var graphCanvas = $('#myChartCanvas');
        var context = graphCanvas.get(0).getContext("2d");

        if(window.bar != undefined){
          window.bar.destroy();
        }

        window.bar = new Chart(context, config)
        updateChart(window.bar)
      },
      error: function(data){console.log(data)}
    });
  });
}



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
      getAndSetPrice(id, edition, foil)
    }
  }
}

getAndSetPrice(id, edition, foil);