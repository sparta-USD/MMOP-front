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
    const grade = document.querySelector('input[name="starpoint"]:checked').value;

    review_formData.append("good_content", good_content);
    review_formData.append("bad_content", bad_content);
    review_formData.append("review_image", review_image);
    review_formData.append("grade", grade);

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
        location.href="/mypage.html";
    })
    .catch(error => {
        alert("리뷰 작성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}