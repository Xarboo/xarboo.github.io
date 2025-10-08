//zegar
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    clockElement.textContent = timeString;
}


setInterval(updateClock, 1000);

updateClock();


//licznik do 24.11.2025
function startCountdown() {

    var targetDate = new Date("Nov 24, 2025 00:00:00").getTime();

    var x = setInterval(function() {
        

        var now = new Date().getTime();
        

        var distance = targetDate - now;
        

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        

        document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
        

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 1000);
}
