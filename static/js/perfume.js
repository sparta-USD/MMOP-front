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


// 3. handlePerfumeInfo() 함수 불러오기
document.addEventListener("DOMContentLoaded", function(){
    handlePerfumeInfo()
});

async function handlePerfumeInfo(){

    // url이 ?perfume="perfume_id" 형태로 입력되지 않았을 때 에러메세지 출력
    url_detail_perfume = getParams("perfume");
    if (url_detail_perfume == undefined){
        url_detail_perfume = localStorage.getItem("perfume");
    }

    const response = await fetch('http://127.0.0.1:8000/perfume/'+url_detail_perfume,{
        headers: {
            "Authorization":"Bearer" + localStorage.getItem("access"),
        },
        method: 'GET',
    })
    .then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인한 유저만 접근 가능합니다! 로그인해주세요 :)")
                location.href="/signin.html";
            }
            else if(response.status==404){
                alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
                location.href="/index.html";
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    })
    .then(result => {
        const response_json = result;
        let perfume = response_json;
        let review = response_json['perfume_reviews']; 

        perfume_detail(response_json)

    }).catch(error => {
        console.warn(error.message)
    });
}

// 3-1. 기본 향수제품정보 불러오기
function perfume_detail(data){
    console.log(data)
    const element = document.querySelector(".container_perfume_detail");
    element.querySelector(".perfume_image").setAttribute('src', data['image']);
    element.querySelector(".perfume_id").innerText = "#"+data['id'];
    element.querySelector(".perfume_brand").innerText = data['brand'];
    element.querySelector(".perfume_title").innerText = data['title'];
    element.querySelector(".col_gender_1").innerText = data['gender'];
    element.querySelector(".col_price_1").innerText = data['price'];
    element.querySelector(".col_launch_1").innerText = data['launch_date'];
}