// * url을 불러오는 함수 *
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

// 1. detail tab jquery
$('.tab_item').on("click",function(e){
    e.preventDefault(); 
    const target_content_id = $(this).find("a").attr("href");
    $(".tab_item").removeClass('active');
    $(this).addClass("active");
    $(".tab_content").removeClass("active");
    $(target_content_id).addClass("active");
})

// 2. 찜하기 버튼 클릭 시 하트 변경
var i = 0;
$('i').on('click',function(){
    if(i==0){
        $(this).attr('class','bi-suit-heart-fill');
        i++;
    }else if(i==1){
        $(this).attr('class','bi-suit-heart');
        i--;
    }
});