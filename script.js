var cityInput = document.querySelector('#cityInput');
var searchBtn = document.querySelector('#searchBtn');
var apiKey = '87ab883bd75cec93beb0320f1dec02b5';
var cities = [];

// Function for displaying today's forecast
function displayToday() {
    $('.clears').empty();
    $('.singleDay').append($('<h4>').text('Today:'));
    var city = cityInput.value.trim();
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},{state}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(res) {
        var display = $('.singleDay');
        var date = moment().format('l');
        var temp = ((res.main.temp - 273.15) * 9 / 5 + 32).toFixed(1);

        $('#today').append(date);
        display.append($('<h5>').text(res.name));
        display.append($('<p>').text('Temperature: ' + temp + ' \xB0F'));
        display.append($('<p>').text('Humidity: ' + res.main.humidity + '%'));
        display.append($('<p>').text('Wind Speed: ' + res.wind.speed + ' MPH'));
});
}

// Function for displaying 5 day forecast
function displayFiveDay() {
    $('#fiveDayHead').append($('<h4>').text('5-Day Forecast:'));
    var city = cityInput.value.trim();
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},{state}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(res) {
        var display = $('.fiveDay');
        for (i = 0; i < 5; i++) {
            var cardDiv = $('<div>');
            var temp = ((res.list[i + 7].main.temp - 273.15) * 9 / 5 + 32).toFixed(1);
            var weather = res.list[i + 7].weather[0].main;

            cardDiv.addClass('card text-white bg-primary mb-3');
            cardDiv.attr('style', 'max-width: 170px; margin: 10px; padding: 0 10px;');

            var head = $('<div>').addClass('card-header').text(moment().add(i + 1, 'days').format('l'));
            var tempText = $('<p>').addClass('card-text').text('Temp: ' + temp + ' \xB0F');
            var humText = $('<p>').addClass('card-text').text('Humidity: ' + res.list[i + 7].main.humidity + '%');

            // Adding an icon of weather condition
            if(weather === 'Clouds') {
                weather = $('<i>').addClass('fas fa-cloud');
            } else if (weather === 'Rain') {
                weather = $('<i>').addClass('fas fa-cloud-showers-heavy');
            } else if (weather === 'Clear') {
                weather = $('<i>').addClass('fas fa-sun');
            } else if (weather === 'Snow') {
                weather = $('<i>').addClass('far fa-snowflake');
            }
            weather.attr('style', 'margin: 20px 10px;');

            cardDiv.append(head);
            cardDiv.append(weather);
            cardDiv.append(tempText);
            cardDiv.append(humText);
            display.append(cardDiv);
        }
    });
}

// Appends cities array
function searchedList() {
    for (i = 0; i < cities.length; i++){
        $('.list-group').append($('<li>').text(cities[i]).addClass('list-group-item'));
    }
    $('.list-group-item').on('click', clickList);
}

// Appends previously searched words if any
function init() {
    var initCity = JSON.parse(localStorage.getItem('cities'));
    if(initCity !== null){
        cities = initCity;
        searchedList();
        $('#cityInput').val(cities[cities.length - 1]);
        displayToday();
        displayFiveDay();
    } else {
        $('#fiveDayHead').append($('<h4>').text('5-Day Forecast:'));
    }
}

// Pushes the newly searched city into a city array and local storage
function saveCities() {
    event.preventDefault();
    cities.push(cityInput.value.trim());
    $('.list-group').empty();
    searchedList();
    localStorage.setItem('cities', JSON.stringify(cities));
}

// Clicking previously searched cities and appending forecasts to page
function clickList() {
    event.preventDefault();
    $('#cityInput').val($(this)[0].innerText);
    cities.push($(this)[0].innerText);
    $('.list-group').empty();
    searchedList();
    localStorage.setItem('cities', JSON.stringify(cities));
    displayToday();
    displayFiveDay();
}

init();
searchBtn.addEventListener('click', saveCities);
searchBtn.addEventListener('click', displayToday);
searchBtn.addEventListener('click', displayFiveDay);
