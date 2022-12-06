window.addEventListener('scroll', function() {
    const scrollY = this.window.pageYOffset;
    var scrolled = scrollY >= 10; //스크롤된 상태; true or false
    document.querySelector("header").classList.toggle('header_sticky', scrolled);
});

// profile tab jquery
$('.tab_item').on("click",function(e){
    e.preventDefault(); 
    const target_content_id = $(this).find("a").attr("href");
    $(".tab_item").removeClass('active');
    $(this).addClass("active");
    $(".tab_content").removeClass("active");
    $(target_content_id).addClass("active");
})

$(".none_link").on("click",function(e){
    e.preventDefault();
});