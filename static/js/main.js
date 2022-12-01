window.addEventListener('scroll', function() {
    const scrollY = this.window.pageYOffset;
    var scrolled = scrollY >= 10; //스크롤된 상태; true or false
    document.querySelector("header").classList.toggle('header_sticky', scrolled);
});