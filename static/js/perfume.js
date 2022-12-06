// detail tab jquery
$('.tab_item').on("click",function(e){
    e.preventDefault(); 
    console.log(this);
    console.log($(this).find("a").attr("href"));
    const target_content_id = $(this).find("a").attr("href");
    $(".tab_item").removeClass('active');
    $(this).addClass("active");
    $(".tab_content").removeClass("active");
    $(target_content_id).addClass("active");
})

// 찜하기 버튼 클릭 시 하트 변경
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