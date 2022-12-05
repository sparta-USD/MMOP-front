// 1. create_review.html에서 작성완료 버튼을 누르면 handleCreateReview() 호출
document.getElementById("btn_review_ok").addEventListener("click",function(){
    handleCreateReview();
});

document.addEventListener("DOMContentLoaded", function(){
    handlePerfumeInfo()
});


// 2. 제품 정보 불러오기
async function handlePerfumeInfo(){

    const response = await fetch('http://127.0.0.1:8000/perfume/3', {
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

        let review_perfume_detail = document.getElementById("review_perfume_detail");
        review_perfume_detail.innerHTML= '';

        let perfume_detail = document.createElement('div');
        perfume_detail.className = 'sec_create_review_body';
        perfume_detail.innerHTML = `
        <div class="create_review_body_title">
            <div class="review_image_box">
                <img class="review_image" src="${perfume['image']}">
            </div>
            <div class="review_body_desc_box">
                <div class="desc_box_brand">
                    <p>${perfume['brand']}</p>
                </div>
                <div class="desc_box_name">
                    <p>${perfume['title']}</p>
                </div>
            </div>
        </div>
        `;
        review_perfume_detail.append(perfume_detail);
    })
}

// 3. 리뷰 작성하기
async function handleCreateReview() {

    const review_formData = new FormData();
    const good_content = document.getElementById("good_content").value;
    const bad_content = document.getElementById("bad_content").value;
    const review_image = document.getElementById("review_image").files[0];

    review_formData.append("good_content", good_content);
    review_formData.append("bad_content", bad_content);
    review_formData.append("review_image", review_image);

    const response = await fetch('http://127.0.0.1:8000/perfume/3/reviews/', {
        method: 'POST',
        headers: {
            "Authorization":"Bearer" + localStorage.getItem("access"),
        },
        body: review_formData,
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    })
    .then(result => {
        alert("리뷰 작성에 성공했습니다!")
        // location.href="/mypage.html?pefume=" + result["id"];
    })
    .catch(error => {
        alert("리뷰 작성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}

// 4. 별점 체크 부분
// (1) 별점 마킹 모듈 프로토타입으로 생성
function Rating(){};
Rating.prototype.rate = 0; // 선택한 별점 값을 저장하는 변수
Rating.prototype.setRate = function(newrate){ // 클릭한 별점을 포함해 그 왼쪽에 있는 모든 별점의 체크박스를 체크하는 기능
    // 별점 마킹 : 클릭한 별 이하 모든 별 체크 처리
    this.rate = newrate;
    document.querySelector('.starpoint_box').style.width = parseInt(newrate * 60) + 'px';
    let items = document.querySelectorAll('.star_radio');
    items.forEach(function(item, idx){
        if(idx < newrate){
            item.checked = true;
        }else{
            item.checked = false;
        }
    });
}
let rating = new Rating(); //별점 인스턴스 생성

// (2) 별점을 클릭하면 별점 모듈의 setRate() 메소드 호출
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.starpoint_box').addEventListener('click',function(e){
        let elem = e.target;
        if(elem.classList.contains('star_radio')){
            rating.setRate(parseInt(elem.value));
        }
    })
});