var btnSearch = document.querySelector('.search-box-btn')
btnSearch.addEventListener('click', function () {
   this.parentElement.classList.toggle('open')
   this.previousElementSibling.focus();
})  