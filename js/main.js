var btnSearch = document.querySelector('.search-box-btn')
btnSearch.addEventListener('click', function () {
   this.parentElement.classList.toggle('open')
   this.previousElementSibling.focus();
})

var layer = document.querySelector('.layer')
function rand() {
   return Math.random() * 100
}

function addRain() {
   for (let i = 0; i < 20; i++) {
      let rain = document.createElement('div')
      rain.classList.add('rain-drop')
      rain.style.left = `${rand()}%`
      rain.style.animation = 'rainFall .' + rand().toFixed() + 's 3s linear infinite';
      layer.appendChild(rain)
   }
}
addRain()