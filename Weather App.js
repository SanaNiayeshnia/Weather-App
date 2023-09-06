let searchInput=document.getElementById('searchInput');
let searchIcon=document.getElementById('searchIcon');
let cityName=document.getElementById('cityName');
let date=document.getElementById('date');
let weatherTemperature=document.getElementById('weatherTemp');
let weatherStatus=document.getElementById('weatherStatus');
let weatherIcon=document.getElementById('weatherIcon');
let highLow=document.getElementById('high-low');
let weatherInfoBox=document.getElementsByClassName('weatherInfoBox');
let loadingIcon=document.getElementById('loadingIcon');
let errorModal=document.getElementById("error-modal");
let errCode;

window.addEventListener("load", ()=>{
searchInput.focus();
});

function loadWeatherData(){
    //hiding weatherinfoBox
    if(weatherInfoBox[0].classList.contains('active')){
    weatherInfoBox[0].classList.remove('active');
    weatherInfoBox[0].style.opacity='0'}

    //Starting to run the loader
    loadingIcon.style.display='block';

    //getting data
    let city=searchInput.value;
    let apiURL=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5ac3e73e53080b89b62a768f306153c7`;
    fetch(apiURL)
    .then(res=>{
        if(res.status===404)
        errCode=404; //for using later in errorModal(city not found)
        else if(res.status===400)
        errCode=400; //for using later in errorModal(nothing to geocode)
        else if(res.status===200) //fetching was successFul
        {//stopping the loader
            loadingIcon.style.display='none'; }
        return res.json()}
        ).then(data=>{
            console.log(data)
            //loading data on the fields
            cityName.innerHTML=data.name; 
            weatherStatus.innerHTML=data.weather[0].main;
            //calculating the temperature
            weatherTemperature.innerHTML=Math.floor(data.main.temp - 273.15) + "°C";
            highLow.innerHTML=`${Math.floor(data.main.temp_min -273.15)}°C/${Math.round(data.main.temp_max -273.15)}°C`;
            //setting a weatherIcon
           weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
           //local date
            date.innerHTML=showDate();

           //showing weatherinfoBox
            if(!weatherInfoBox[0].classList.contains('active')){
                weatherInfoBox[0].style.opacity='1'
                weatherInfoBox[0].classList.add('active');
             }

            })
    .catch(err=>{
        console.log(err);
        //stopping the loader
        loadingIcon.style.display='none';
        //setting an error text for errorModal
        if(errCode===400 & !searchInput.value)
        errorModal.innerHTML="The Search Box is Empty! Enter the name of a city please :)";
        else if (errCode===404)
        errorModal.innerHTML="city not found!";
        else 
        errorModal.innerHTML="An unexpected error accured!";

        //showing the error modal
        errorModal.style.display='flex';
        errorModal.className='active';
        setTimeout(()=>{
        errorModal.className='inactive';

        }, 3500);
        
    })

}

searchInput.addEventListener('keydown', (e)=>{
if(e.keyCode===13){
loadWeatherData();
}
});

searchIcon.addEventListener('click',loadWeatherData );

function showDate(){
    let months=['January','February', 'March', 'April','May','June','July', 'August','September', 'October','November','December'];
    let days=['Monday', 'Tuesday','Wendesday','Thursday','Friday','Saturday','Sunday'];
    let localDate=new Date();
    let weekDay=days[localDate.getDay()];
    let month=months[localDate.getMonth()];
    let year=localDate.getFullYear();
    let day=localDate.getDate();
    let date=weekDay+" "+day+" "+month+" "+year;
    return date;

}

