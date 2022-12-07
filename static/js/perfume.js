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
        perfume_detail_tab(response_json)
        pertume_review_tab_info(response_json)

    }).catch(error => {
        console.warn(error.message)
    });
}

// 3-1. 기본 향수제품정보 불러오기
function perfume_detail(data){
    const element = document.querySelector(".container_perfume_detail");
    element.querySelector(".perfume_image").setAttribute('src', data['image']);
    element.querySelector(".perfume_id").innerText = "#"+data['id'];
    element.querySelector(".perfume_brand").innerText = data['brand'];
    element.querySelector(".perfume_title").innerText = data['title'];
    element.querySelector(".col_gender_1").innerText = data['gender'];
    element.querySelector(".col_price_1").innerText = data['price'];
    element.querySelector(".col_launch_1").innerText = data['launch_date'];
}

// 3-2. 제품정보 탭 불러오기
function perfume_detail_tab(data){
    const element = document.querySelector(".perfume_detail_tab_content");
    element.querySelector(".tab_perfume_brand").innerText = data['brand'];
    element.querySelector(".tab_perfume_title").innerText = data['title'];
    element.querySelector(".tab_perfume_image").setAttribute('src', data['image']);

    element.querySelector(".col_top_note").innerText = data['top_notes'];
    element.querySelector(".col_heart_note").innerText = data['heart_notes'];
    element.querySelector(".col_base_note").innerText = data['base_notes'];
    element.querySelector(".col_none_note").innerText = data['none_notes'];
}

// 3-3. 리뷰 탭 - 리뷰 정보 불러오기
function pertume_review_tab_info(data){
    const element = document.querySelector(".container_review_tab");
    element.querySelector(".tab_review_count").innerText = data['perfume_reviews'].length;
    element.querySelector(".review_avg_grade").innerText = data['avg_grade'];
    
    let avg_grade_star = document.getElementById("avg_grade_star");
    avg_grade_star.innerHTML = '';
    avg_grade = document.createElement("div");
    avg_grade.className = "starpoint_wrap";
    avg_grade.innerHTML = `
                        <div class="starpoint_box star_${data['avg_grade']*20}">
                        <label for="starpoint_1" class="label_star" title="0.5"><span class="blind">0.5점</span></label>
                        <label for="starpoint_2" class="label_star" title="1"><span class="blind">1점</span></label>
                        <label for="starpoint_3" class="label_star" title="1.5"><span class="blind">1.5점</span></label>
                        <label for="starpoint_4" class="label_star" title="2"><span class="blind">2점</span></label>
                        <label for="starpoint_5" class="label_star" title="2.5"><span class="blind">2.5점</span></label>
                        <label for="starpoint_6" class="label_star" title="3"><span class="blind">3점</span></label>
                        <label for="starpoint_7" class="label_star" title="3.5"><span class="blind">3.5점</span></label>
                        <label for="starpoint_8" class="label_star" title="4"><span class="blind">4점</span></label>
                        <label for="starpoint_9" class="label_star" title="4.5"><span class="blind">4.5점</span></label>
                        <label for="starpoint_10" class="label_star" title="5"><span class="blind">5점</span></label>
                        <span class="starpoint_bg"></span>
                        </div>
                         `;
    avg_grade_star.append(avg_grade);
}