document.addEventListener("DOMContentLoaded", function(){
    handlePerfumeInfo()
    handleRecommend()
});

// url을 불러오는 함수 
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

// 향수 정보 불러오기
async function handlePerfumeInfo(){
    // url이 ?perfume="perfume_id" 형태로 입력되지 않았을 때 에러메세지 출력
    url_detail_perfume = getParams("perfume");
    if (url_detail_perfume == undefined){
        alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
        location.href="/index.html";
    }
    const response = await fetch('http://127.0.0.1:8000/perfume/'+url_detail_perfume,{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
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
        perfume_info(response_json);  // 1. 기본 향수제품정보
        perfume_detail_tab(response_json); // 2. 제품정보 탭
        perfume_review_tab(response_json); // 3. 리뷰 탭
        // perfume_recommend_tab(response_json); // 3. 추천 탭
    })
}

// 1. 기본 향수제품정보 불러오기
function perfume_info(data){
    const element = document.querySelector(".container_perfume_detail");
    element.querySelector(".perfume_image").setAttribute('src', data['image']);
    element.querySelector(".perfume_id").innerText = "#"+data['id'];
    element.querySelector(".perfume_brand").innerText = data['brand'];
    element.querySelector(".perfume_title").innerText = data['title'];
    element.querySelector(".likes_count").innerText = "  " +data['likes_count'];
    element.querySelector(".col_gender_1").innerText = data['gender'];
    element.querySelector(".col_price_1").innerText = data['price'];
    element.querySelector(".col_launch_1").innerText = data['launch_date'];

    // 찜 상태 표시
    const user_email = localStorage.getItem("email"); // 
    let is_like = user_email in data['likes']; // 현재 로그인한 유저의 이메일이 likes에 있는지 체크/ 찜 상태 : T/F
    document.getElementById("btn_heart").classList.add(is_like ? "bi-suit-heart-fill" : "bi-suit-heart"); // 삼항연산자 사용!

    // 리뷰작성 버튼 링크 수정 : 현재 보고있는 제품(perfume_id)의 리뷰작성 페이지로 이동
    document.querySelector(".btn_create_review").setAttribute("href","/create_review.html?perfume="+data['id']);
}


// 2. 제품정보 탭 불러오기
function perfume_detail_tab(data){
    const element = document.querySelector(".perfume_detail_tab_content");
    element.querySelector(".tab_perfume_brand").innerText = data['brand'];
    element.querySelector(".tab_perfume_title").innerText = data['title'];
    element.querySelector(".tab_perfume_image").setAttribute('src', data['image']);
    // note 이름 불러오기
    append_notes(data);
}
// 2-1. note 의 name 불러오는 함수 * 
function append_notes(data){
    console.log(data)
    note_type_list = ["top", 'heart', 'base', 'none']
    note_type_list.forEach(note_type => {
        const note_data = data[note_type+'_notes'];
        const note_el =  document.querySelector(`.col_${note_type}_note`);

        let note_html = ''
        note_data.forEach(note => {
            note_html += note['name']+', ';
        });
        note_el.innerHTML = note_html;
    });
}



// 3-1. 리뷰 탭 - 리뷰 정보 불러오기
function perfume_review_tab(data){
    const element = document.querySelector(".container_review_tab");
    element.querySelector(".tab_review_count").innerText = data['perfume_reviews'].length;
    
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
    perfume_review_tab_review_list(data['perfume_reviews']);
}
// 3-2. 리뷰 탭 - 이 제품에 작성된 리뷰 보여주기
function perfume_review_tab_review_list(review_data){
    let review_list_tab = document.getElementById("review_list_tab");
    review_list_tab.innerHTML = '';
    review_data.forEach(data => {
        let review_list = document.createElement('div');
        review_list.className = 'container_review_body';
        review_list.id = 'review_'+data['id'];
        review_list.innerHTML = `
            <div class="sec_review_head">
                <div class="sec_review_userinfo">
                    <div class="review_user_info">
                        <div class="review_username">
                        ${data['user']}
                        </div>
                        <div class="review_created_time">${data['created_at'].split('T')[0]}</div>
                    </div>
                    <div class="review_star_grade">
                        <div class="starpoint_wrap">
                            <div class="starpoint_box star_${data['grade']*20}">
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
                        </div>
                        <span class="review_user_grade">${data['grade']}</span>
                    </div>
                </div>
            </div>
            <div class="sec_review_body">
                <div class="review_body_content">
                    <div class="review_good">
                        <div class="review_good_image">
                            <i id="emoji_good" class="bi bi-emoji-smile"></i>
                        </div>
                        <div class="review_good_content">
                            ${data['good_content']}
                        </div>
                    </div>
                    <div class="review_bad">
                        <div class="review_bad_image">
                            <i id="emoji_bad" class="bi bi-emoji-frown"></i>
                        </div>
                        <div class="review_bad_content">
                            ${data['bad_content']}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="review_result_image_box">
                        <img class="review_result_image" src="${data['image']}" alt="No Image">
                    </div>
                </div>
            </div>
            <hr/>
        `;
        review_list_tab.append(review_list);
    });
}


// 4. 추천탭 - 추천제품 불러오기 API 통신
async function handleRecommend() {
    const response = await fetch('http://127.0.0.1:8000/perfume/recommend/', {
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
        body: JSON.stringify({
            "perfume_id" : id,
        })
    })
    .then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인 유저만 접근 가능합니다.")
                location.href="/signin.html";
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    })
    .then(result => {
        const response_json = result;
        
    })
    .catch(error => {
        console.warn(error.message)
    });
}



// 5. 찜하기 버튼 클릭 시 handlePerfumeLike() 호출
document.getElementById("btn_heart").addEventListener("click",function(){
    handlePerfumeLike()
});
async function handlePerfumeLike() { // 5-1. 찜하기 버튼 클릭 시 상태변경 API 통신
    // * url이 ?perfume="perfume_id" 형태로 입력되지 않았을 때 에러메세지 출력 *
    url_detail_perfume = getParams("perfume");
    if (url_detail_perfume == undefined){
       alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
       location.href="/index.html";
    }
    const response = await fetch('http://127.0.0.1:8000/perfume/'+url_detail_perfume+'/like/', {
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
    })
    .then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인한 유저만 접근 가능합니다! 로그인해주세요 :)")
                // location.href="/signin.html";
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
        perfumeLike()
    })
}
function perfumeLike() { // 5-2. 찜하기 버튼 클릭 시 하트 색상 변경
    current_is_like = document.getElementById("btn_heart").classList.contains("bi-suit-heart-fill"); // 현재 찜상태
    is_like = !current_is_like; // 찜 상태 변경
    likes_count = document.querySelector(".likes_count").innerText;
    if(is_like){ // 현재 찜 상태가 아니라면 빨간 하트로 변경(add('bi-suit-heart-fill')
        document.getElementById("btn_heart").classList.remove('bi-suit-heart');
        document.getElementById("btn_heart").classList.add('bi-suit-heart-fill');
        likes_count++;  // 찜 상태이기 때문에 likes_count +1
    }else { // 현재 찜 상태이면 빈 하트로 변경(add('bi-suit-heart')
        document.getElementById("btn_heart").classList.remove('bi-suit-heart-fill');
        document.getElementById("btn_heart").classList.add('bi-suit-heart');
        likes_count--;  // 찜 해제이기 때문에 likes_count -1
    }
    document.querySelector(".likes_count").innerText = likes_count;  // 변경된 likes_count 반영해서 찜 갯수 출력
}