$(document).ready(function(){
    var searchInputBox = $('#search');
    $('#search-format').change(function(){              //switching placeholder when changing the option value
        if($('#search-format').val() == "city") {
            searchInputBox.attr('placeholder', 'Exp: London');
        }
        else if($('#search-format').val() == "coordinates") {
            searchInputBox.attr('placeholder', 'Exp: 35,139 (lat,lon)');
        }
        else {
            searchInputBox.attr('placeholder', 'Exp: 67211');
        }
    });
    $('#submit').on('click', function(){  
        var wantedFormatIn, units = "&units=imperial";              //parameters of url query
        const key = "&APPID=1498bed46b956aa47fc7d61fef70fa32";
        var userValue = $('#search').val();
        if($('#search-format').val() == "city") {                    //switching the url search config base on search format
            wantedFormatIn = "http://api.openweathermap.org/data/2.5/weather?q=";
        }
        else if($('#search-format').val() == "coordinates") {
            var latCoord = userValue.split(",")[0];
            var lonCoord = userValue.split(",")[1];
            wantedFormatIn = "http://api.openweathermap.org/data/2.5/weather?lat="+latCoord+"&lon="+lonCoord;
            userValue = "";
        }
        else {
            wantedFormatIn = "http://api.openweathermap.org/data/2.5/weather?zip=";
        }
        var targetUrl = wantedFormatIn+userValue+key+units;           //full url build base on user inputs
        $.ajax({
            method: 'get',
            url: targetUrl,
            success: function(data){
                getWeather(data);
            }
        })                                        //function that return current time of that location
    }); 
});
function getWeather(data){
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var pressure = data.main.pressure;
    var windSpeed = data.wind.speed;
    var weatherDescription = data.weather[0].description;
    var iconCode = data.weather[0].icon;
    var cityName = data.name;
    var iconUrl = "http://openweathermap.org/img/w/"+iconCode+".png";
    $('#location-info').html(cityName);
    $('#weather-description').html(weatherDescription);
    $('#temperature h1').html(Math.round(temp));
    $('#humidity span').html('Humidity: ' + humidity + '%');
    $('#wind-speed span').html('Wind: '+ windSpeed + " MPH");
    $('#icon').css('background-image', 'url('+iconUrl+')');
    $('main').removeClass('hide');
    $('span.b1').on('click', function(){                         //switching degree and the math to convert 
        if($('.b2').hasClass('active')){
            $('.b2').removeClass('active');
            $('.b1').addClass('active');
            $('#temperature h1').html(Math.round(temp));
        }
    });
    $('span.b2').on('click', function(){
        if($('.b1').hasClass('active')){
            $('.b1').removeClass('active');
            $('.b2').addClass('active');
        }
        $('#temperature h1').html(Math.round((temp-32)*(5/9)));
    });
    timeInfo(lat,lon); 
}
function timeInfo(lat, lon){
    var currentTimeInSec = Math.round(new Date().getTime()/1000);
    const googlePrototypeUrl = "https://maps.googleapis.com/maps/api/timezone/json?";
    const location = "location="+lat+","+lon;
    const timeStamp = "&timestamp="+currentTimeInSec;
    const key = "&key=AIzaSyDPLledCWfdfdmt0L4k_7chldSYd5tCATs";
    var googleTimeZoneUrl = googlePrototypeUrl+location+timeStamp+key;
    $.ajax({
        method: 'get',
        url: googleTimeZoneUrl,
        success: function(data){
            getCurrentTime(data);
        }
    });
 }

function getCurrentTime(data){
    var hoursDifferent = (data.rawOffset+data.dstOffset)/3600;
    var currentHours = function(){
        var UTCHours = new Date().getUTCHours();
        if(UTCHours >= 0  && UTCHours < 12 && hoursDifferent < 0) {
            return Math.round((UTCHours+24)+hoursDifferent);
        }
        else 
        {
            return Math.round(UTCHours+hoursDifferent);
        }
    }
    var currentMinutes = new Date().getMinutes();
    if(currentHours() > 12) {                                     //24hours format time (solution)
        if (currentMinutes < 10){                                 //single digit cases 
            $('#time-info').html(currentHours()%12+":0"+currentMinutes+" PM");
        }
        else {
            $('#time-info').html(currentHours()%12+":"+currentMinutes+" PM");
        }
    }
    else {
        if (currentMinutes < 10){
            $('#time-info').html(currentHours()+":0"+currentMinutes+" AM");
        }
        else {
            $('#time-info').html(currentHours()+":"+currentMinutes+" AM");  
        }
    }
}
