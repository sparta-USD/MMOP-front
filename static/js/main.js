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

async function handleSurveyCheck(){
    const response = await fetch('http://127.0.0.1:8000/perfume/survey/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        if(response_json.length){
            location.href="/recommend.html"
        }else{
            location.href="/survey.html"
        }
    }).catch(error => {
        console.warn(error.message)
    });
}