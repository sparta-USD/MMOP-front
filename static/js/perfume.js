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
        method: 'GET',
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    })
    .then(result => {
        const response_json = result;
        const notes_id = []

        perfume_info(response_json);  // 1. 기본 향수제품정보
        perfume_detail_tab(response_json); // 2. 제품정보 탭
        perfume_review_tab(response_json); // 3. 리뷰 탭
        
        // 향 id값 리스트에 담기
        for(let i = 0; i<response_json['top_notes'].length; i++){
            if(response_json['top_notes'][i]['id']<=973){
                notes_id.push(response_json['top_notes'][i]['id'])
            } 
        }
        for(let i = 0; i<response_json['heart_notes'].length; i++){
            if(response_json['heart_notes'][i]['id']<=973){
                notes_id.push(response_json['heart_notes'][i]['id'])
            } 
        }
        for(let i = 0; i<response_json['base_notes'].length; i++){
            if(response_json['base_notes'][i]['id']<=973){
                notes_id.push(response_json['base_notes'][i]['id'])
            } 
        }
        for(let i = 0; i<response_json['none_notes'].length; i++){
            if(response_json['none_notes'][i]['id']<=973){
                notes_id.push(response_json['none_notes'][i]['id'])
            } 
        }

        // url로 향 id값 전송
        if(notes_id.length != 0){
            document.getElementById("custom_perfume").addEventListener('click', () => {
                location.href = `custom_perfume_note.html?${notes_id}?${response_json['title']}`;
            })
        }
        else{
            document.getElementById("custom_perfume").addEventListener('click', () => {
                handleCustom();
            })
        }
        
    })
}

// 1. 기본 향수제품정보 불러오기
function perfume_info(data){
    const element = document.querySelector(".container_perfume_detail");
    element.querySelector(".perfume_image_box").innerHTML=`
        <img class="perfume_image" src="${data['image']? data['image']: "/static/images/perfume.png"}">
    `;
    element.querySelector(".perfume_id").innerText = "#"+data['id'];
    element.querySelector(".perfume_brand").innerText = data['brand'];
    element.querySelector(".perfume_title").innerText = data['title'];
    element.querySelector(".likes_count").innerText = "  " +data['likes_count'];
    if(data['price']){
        element.querySelector(".col_price_1").innerText = data['price'] + " " + data['price_unit'];
    }else{
        element.querySelector(".detail_price").remove();
    }
    
    // 출시일자
    if(data['launch_date']){
        element.querySelector(".col_launch_1").innerText = data['launch_date'].split("-")[0]+"년";
    }else{
        element.querySelector(".detail_launch").remove();
    }
    // 성별
    gender = "UNISEX";
    if(data['gender']=="F"){
        gender = "FEMALE";
    }else if(data['gender']=="M"){
        gender = "MALE";
    }
    element.querySelector(".col_gender_1").innerText  = gender;

    // 찜 상태 표시
    const user_email = localStorage.getItem("email");
    let is_like = data['likes'].includes(user_email); // 현재 로그인한 유저의 이메일이 likes에 있는지 체크/ 찜 상태 : T/F
    document.getElementById("btn_heart").classList = is_like ? "bi bi-suit-heart-fill" : "bi bi-suit-heart"; // 삼항연산자 사용!
    
    // 리뷰 작성하기 버튼 활성화/비활성화(작성 여부에 따라)
    review_create_go(data);
}
// * 1-2. 지금 로그인한 유저가 리뷰를 작성했는지 여부에 따라 리뷰작성하기 버튼 활성화/비활성화하는 함수 *
function review_create_go(data){
    const user = localStorage.getItem("username")
    // 이 제품에 리뷰를 작성한 사용자 리스트 불러오기
    let reviewer = []
    for(var i=0; i<data['perfume_reviews'].length; i++){
        reviewer.push(data['perfume_reviews'][i]['user'])
    }

    // 지금 로그인한 유저가 리뷰 작성자 리스트에 있으면 
    if (reviewer.includes(user)) {
        document.querySelector(".btn_create_review").innerText = "리뷰 작성 완료";
        document.querySelector(".btn_create_review").style.backgroundColor = "var(--base-gray-999)";
        document.querySelector(".btn_create_review").setAttribute("href","#");
    }
    else { // 없으면 현재 보고있는 제품(perfume_id)의 리뷰작성 페이지로 이동
        document.querySelector(".btn_create_review").setAttribute("href","/create_review.html?perfume="+data['id']);
    }
}



// 2. 제품정보 탭 불러오기
function perfume_detail_tab(data){
    const element = document.querySelector(".perfume_detail_tab_content");
    element.querySelector(".tab_perfume_brand").innerText = data['brand'];
    element.querySelector(".tab_perfume_title").innerText = data['title'];
    element.querySelector(".tab_perfume_desc").innerText = data['desc'];
    element.querySelector(".tab_perfume_desc_ko").innerText = data['desc_ko'];
    // note 이름 불러오기
    append_detail_notes(data);
}
// 2-1. note 의 name 불러오는 함수 * 
function append_detail_notes(data){
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
    avg_grade_star.querySelector(".review_avg_grade_star").innerText = data['avg_grade'];
    avg_grade_star.querySelector(".starpoint_bg").style=`width:${data['avg_grade']*20}%;`
    perfume_review_tab_review_list(data['perfume_reviews']);
}
// 3-2. 리뷰 탭 - 이 제품에 작성된 리뷰 보여주기
function perfume_review_tab_review_list(review_data){
    let review_list_tab = document.getElementById("review_list_tab");
    if(review_data.length){
        review_list_tab.innerHTML = '';
        review_data.forEach(data => {
            let review_list = document.createElement('div');
            review_list.className = 'review_card';
            review_list.id = 'review_'+data['id'];
            review_list.innerHTML = `
                <div class="review_card_head">
                    <div class="review_head_userinfo">
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
                <div class="review_card_body">
                    <div class="review_body_content" ${data["good_content"]=='' && data["bad_content"]=='' ? `style="display:none"` : ``}>
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
                    ${data['image'] ? `<div class="review_result_image_box"><img class="review_result_image" src="http://127.0.0.1:8000${data['image']}" alt="No Image"></div>` : ""}
                </div>
            `;
            review_list_tab.append(review_list);
        });
    }else{
        review_list_tab.innerHTML =`

        <div class="none_result_list">
            <h3>아직 작성된 리뷰가 없습니다.</h3>
        </div>
        `
    }
}


// 4. 추천탭 - 추천제품 불러오기 API 통신
async function handleRecommend() {
    url_detail_perfume = getParams("perfume");
    const response = await fetch('http://127.0.0.1:8000/perfume/'+url_detail_perfume+'/recommend/', {
        headers: {
            "content-type": "application/json",
        },
        method: 'GET',
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    })
    .then(result => {
        const response_json = result;
        perfume_recommend_tab(response_json); 
    })
    .catch(error => {
        console.warn(error.message)
    });
}
// 4-1. 추천제품 card 뿌려주기
function perfume_recommend_tab(recommend_data){
    let recommend_list = document.getElementById("recommend_list");
    recommend_list.innerHTML = '';
    recommend_data.forEach(data => {
        let new_recommend_list = document.createElement('div');
        new_recommend_list.className = 'col-lg-2 col-md-2 col-6';
        new_recommend_list.id = 'perfume_'+data['id'];
        new_recommend_list.innerHTML = `
            <a href="/perfume.html?perfume=${data['id']}">
                <div class='item_card check_card'>
                    <div class="card_header list_profile">
                        <div class="item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                        </div>
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="item_card_editor"><span class="brand">${data['brand']}</span></p>
                            <p class="item_card_title"><span class="title">${data['title']}</span></p>
                            <p class="item_card_tag">
                                ${append_notes(data)}
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        `;
        recommend_list.append(new_recommend_list);
    });
}
function append_notes(data){
    note_type_list = ["top", 'heart', 'base', 'none']
    let note_html = ``
    let count =0;
    note_type_list.forEach(note_type => {
        const note_data = data[note_type+'_notes'];
        note_data.forEach(note => {
            note_html +=`<span class="tag">#${note['name']}</span>`;
        });
    });
    return note_html
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
                alert("로그인한 유저만 접근 가능합니다! 로그인 후 이용해주세요 :)")
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

function handleCustom(){

    $("#Modal").modal("show");
    document.getElementById("Modal").querySelector(".next_guide").innerHTML = `현재 향수와 비슷한 향을 고를 수가 없습니다.<br><br>그래도 향수를 만드시겠습니까?`;
    document.getElementById("Modal").querySelector(".modal-footer").innerHTML = `
        <button type="button" class="btn btn-primary" onclick="handleOk()">네</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">아니요</button>
    `;

}

// 모달창에서 다음 step 버튼 
function handleOk(){
    location.href="/custom_perfume_note.html"
}