//  main.js - navbar 스크롤
window.addEventListener('scroll', function() {
    const scrollY = this.window.pageYOffset;
    var scrolled = scrollY >= 10; //스크롤된 상태; true or false
    document.querySelector("header").classList.toggle('header_sticky', scrolled);
});
// // a태그 안에서 버튼 만들때 사용하는 클래스
$(".none_link").on("click",function(e){ 
    e.preventDefault();
});
// DateTime 타입 YYYY-MM-DD HH:MM:SS 변환
function changeDateTimeFormat(datetime){
    const TIME_ZONE = 3240 * 10000;
    const date = new Date(datetime)
    return new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, '');
}



document.addEventListener("DOMContentLoaded", function () {
    get_url = getParamsSharp();
    tabChange(get_url);
    handleMypage()
});
// 탭 - 클릭 내용 변경
$('.tab_item').on("click",function(e){
    let target_content_id = $(this).find("a").attr("href").replace("#",""); // 형태를 getParamsSharp()과 동일하게 맞춤. #my_perfume -> my_perfume
    tabChange(target_content_id)
})
// * url을 불러오는 함수(mypage.html#ABC) *
function getParamsSharp(){
    const url = window.location.href
    const get_url = url.split('#')[1]
    return get_url;
}
function tabChange(tab_menu){
    if(["my_perfume","my_review","like_perfume","profile_edit","password_reset"].includes(tab_menu)){
        // tab_menu에 active 추가
        $(".tab_item").removeClass('active');
        $("#tab_menu_"+tab_menu).addClass("active");
        // tab_content에 active 추가
        $(".tab_content").removeClass("active");
        $("#tab_"+tab_menu).addClass("active");
    }else{
        // 잘못된 경로 입력시 첫번째 탭에 active 추가
        $(".tab_item:first-child").addClass("active");
        $(".tab_content:first-child").addClass("active");
    }
}



// Mypage 연결 
async function handleMypage() {
    const response = await fetch('http://127.0.0.1:8000/users/', {
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    }).then(response => {
        if(!response.ok){
            if(response.status==401){
                location.href="/users/signin.html";
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        // 1. 커스텀 탭 - 커스텀 향수 리스트 삽입
        let element_my_custom_perfume_list = document.getElementById("my_custom_perfume_list").querySelector(".row")
        appendMyCustomList(response_json['custom_perfume'], element_my_custom_perfume_list)
        
        // 2. 리뷰 탭 - 리뷰 리스트 삽입
        let element_my_review_list = document.getElementById("my_review_list").querySelector(".row")
        appendMyReviewList(response_json['user_reviews'], element_my_review_list)

        // 3. 찜 탭 - 찜한 향수 리스트 삽입
        let element_like_perfume_list = document.getElementById("like_perfume_list").querySelector(".row")
        appendLikePerfumeList(response_json['like_perfume'],element_like_perfume_list)
        
        // 4. 프로필 탭 - 프로필 정보 삽입
        appendUserProfile(response_json)

        // 5. 비밀번호 변경 탭 - 로그인방식별 화면 처리
        let element_password_tab = document.getElementById("password_reset_box")
        kakaoPasswordTab(response_json, element_password_tab)


    }).catch(error => {
        console.warn(error.message)
    });
}



// 1. 커스텀 탭 - 커스텀 향수 리스트 삽입
function appendMyCustomList(dataset, element){
    if(dataset.length){
        element.innerHTML = '';
        dataset.forEach(data => {
            let new_item = document.createElement('div');
            new_item.className = 'col-lg-4 col-md-4 col-6';
            new_item.id = `custom_${data["id"]}`;
            new_item.innerHTML = `
            <div class='item_card custom_perfume_card' id="custom_${data["id"]}">
                <a href="/custom_perfume_detail.html?custom_perfume=${data['id']}">
                    <div class="card_header list_profile" >
                        <div class="item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="${data["package"]["image"]}">
                        </div>
                        <div class="logo_image">
                            ${data["logo"]? `<img aria-hidden="false" draggable="false" loading="lazy" src="http://127.0.0.1:8000${data["logo"]}">` : ``}
                        </div>
                        <div class="materials">
                        ${data["note01"]? `<div class="perfume_images material"><img src="${data["note01"]["image"]}"></div>` : ``}
                        ${data["note02"]? `<div class="perfume_images material"><img src="${data["note02"]["image"]}"></div>` : ``}
                        ${data["note03"]? `<div class="perfume_images material"><img src="${data["note03"]["image"]}"></div>` : ``}
                        </div>
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="item_card_editor"><span class="username">${data['creator_username']}</span></p>
                            <p class="item_card_title"><span class="title">${data["title"]}</span></p>
                            <p class="item_card_tag">
                                ${data["note01"]? `<span class="tag">#${data["note01"]["name"]}</span>` : ``}
                                ${data["note02"]? `<span class="tag">#${data["note02"]["name"]}</span>` : ``}
                                ${data["note03"]? `<span class="tag">#${data["note03"]["name"]}</span>` : ``}
                            </p>
                        </div>
                    </div>
                    <div class="card_footer">
                        <div class="card_btn_wrap">
                            <button type="button" class="btn btn_default btn_custom_perfume_delete" onclick="openModal(event,this)"data-bs-toggle="modal" data-bs-target="#deleteModal" >삭제</button>
                        </div>
                    </div>
                </a>
            </div>
            `;
            element.append(new_item);
        });
    }else{
        element.innerHTML =`
            <div class="none_result_list">
                <h3>제작하신 커스텀 향수가 없습니다.</h3>
                <p>당신의 취향과 라이프 스타일에 맞는 커스텀 향수를 제작해보세요!</p>
                <div class="btn_wrap">
                    <a href="/custom_perfume_note.html" class="btn btn_default btn_border">향수 제작하기</a>
                </div>
            </div>
        `
    }
}
// 1-1. 커스텀 탭 - 삭제 모달
$('#deleteModal').on('show.bs.modal', function(event) {
    target_id = $(event.relatedTarget).closest(".item_card").attr('id').split("_")[1]
    $(this).find(".btn_delete").attr("onclick","DeleteCustomPerfume("+target_id+")");
});
// 1-1. 커스텀 탭 - 커스텀 퍼퓸 삭제
async function DeleteCustomPerfume(custom_perfume_id) {
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/'+custom_perfume_id+'/',{
        method:'DELETE',
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response;
    }).then(async result => {
        alert("삭제에 성공했습니다!");
        document.getElementById("custom_"+custom_perfume_id).remove();
        let my_custom_perfume_list = document.getElementById("my_custom_perfume_list").querySelector(".row");
        if(!my_custom_perfume_list.innerHTML){
            my_custom_perfume_list.innerHTML =`
            <div class="none_result_list">
                <h3>제작하신 커스텀 향수가 없습니다.</h3>
                <p>당신의 취향과 라이프 스타일에 맞는 커스텀 향수를 제작해보세요!</p>
                <div class="btn_wrap">
                    <a href="/custom_perfume_note.html" class="btn btn_default btn_border">향수 제작하기</a>
                </div>
            </div>
            `;
        }
    }).catch(async error => {
        alert("삭제에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}


// 2. 리뷰 탭 - 리뷰 리스트 삽입
function appendMyReviewList(dataset, element) {
    if(dataset.length){
        element.innerHTML = '';
        dataset.forEach(data => {
                let new_item = document.createElement('div');
                new_item.className = 'accordion-item';
                new_item.id = `review_${data["id"]}`;
                new_item.innerHTML = `
                    <h2 class="accordion-header" id="flush-heading${data["id"]}">
                        <div class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${data["id"]}" aria-expanded="false" aria-controls="flush-collapse${data["id"]}">
                            <div class="review_header_box">
                                <div class="review_header_first">
                                    <div>
                                        <a href="/perfume.html?perfume=${data["perfume"]['id']}">
                                            <div class="review_perfume_image_box">
                                                <img class="review_perfume_result_image" src="${data["perfume"]["image"]}">
                                            </div>
                                            ${data['survey']==true ? `<span class="review_survey">설문</span>` : ``}
                                        </a>
                                    </div>
                                    <div class="review_header">
                                        <div class="review_header_title">
                                            <a href="/perfume.html?perfume=${data["perfume"]['id']}">
                                                <p>${data["perfume"]["title"]}</p>
                                            </a>
                                            <div class="review_star_grade">
                                                <div class="starpoint_wrap">
                                                    <div class="starpoint_box star_${data["grade"]*20}">
                                                        <label for="starpoint_1" class="label_star" title="0.5"><span
                                                                class="blind">0.5점</span></label>
                                                        <label for="starpoint_2" class="label_star" title="1"><span
                                                                class="blind">1점</span></label>
                                                        <label for="starpoint_3" class="label_star" title="1.5"><span
                                                                class="blind">1.5점</span></label>
                                                        <label for="starpoint_4" class="label_star" title="2"><span
                                                                class="blind">2점</span></label>
                                                        <label for="starpoint_5" class="label_star" title="2.5"><span
                                                                class="blind">2.5점</span></label>
                                                        <label for="starpoint_6" class="label_star" title="3"><span
                                                                class="blind">3점</span></label>
                                                        <label for="starpoint_7" class="label_star" title="3.5"><span
                                                                class="blind">3.5점</span></label>
                                                        <label for="starpoint_8" class="label_star" title="4"><span
                                                                class="blind">4점</span></label>
                                                        <label for="starpoint_9" class="label_star" title="4.5"><span
                                                                class="blind">4.5점</span></label>
                                                        <label for="starpoint_10" class="label_star" title="5"><span
                                                                class="blind">5점</span></label>
                                                        <span class="starpoint_bg"></span>
                                                    </div>
                                                </div>
                                                <span class="review_user_grade">${data["grade"]}</span>
                                            </div>
                                        </div>
                                        <div class="sec_review_userinfo">
                                            <div class="review_user_info">
                                                <div class="review_username">
                                                ${data["user"]}
                                                </div>
                                                <div class="review_created_time">${changeDateTimeFormat(data["created_at"])}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sec_review_head">
                                    <div class="review_btn_wrap">
                                        <button class="btn btn_default btn_border review-edit-button" type="button" data-bs-toggle="modal" data-bs-target="#editModal" data-bs-whatever="@mdo">수정</button>
                                        <button class="btn btn_default review-delete-button" type="button" data-bs-toggle="modal" data-bs-target="#reviewDeleteModal" data-bs-whatever="@mdo">삭제</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </h2>
                    <div id="flush-collapse${data["id"]}" class="accordion-collapse collapse" aria-labelledby="flush-heading${data["id"]}" data-bs-parent="#accordionFlushExample" >
                        <div class="accordion-body" ${data["good_content"]=='' && data["bad_content"]=='' ? `style="display:none"` : ``}>
                            <div class="sec_review_body">
                                <div class="review_body_content">
                                    <div class="review_good">
                                        <div class="review_good_image">
                                            <i class="bi bi-emoji-smile"></i>
                                        </div>
                                        <div class="review_good_content">
                                            ${data["good_content"]}
                                        </div>
                                    </div>
                                    <div class="review_bad">
                                        <div class="review_bad_image">
                                            <i class="bi bi-emoji-frown"></i>
                                        </div>
                                        <div class="review_bad_content">
                                            ${data["bad_content"]}
                                        </div>
                                    </div>
                                </div>
                            <div class="review_image_box">
                                <div class="review_result_image_box">
                                    ${data["image"] ? ` <img class="review_result_image" src="http://127.0.0.1:8000${data["image"]}"}` : ``}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            element.append(new_item);
        });
    }else{
        element.innerHTML =`
            <div class="none_result_list">
                <h3>작성된 리뷰가 없습니다.</h3>
                <p>당신이 선호하는 향수에 리뷰를 남겨주세요.<br>
                    MMOP만의 완벽한 추천 공식으로 당신에게 어울리는 향수를 추천해드립니다.</p>
                <div class="btn_wrap">
                    <a href="/" class="btn btn_default btn_border">리뷰 작성하기</a>
                </div>
            </div>
        `
    }
}
// 2-1. 리뷰 탭 - 수정 모달
$('#editModal').on('show.bs.modal', function(event) {
    target_id = $(event.relatedTarget).closest(".accordion-item").attr('id').split("_")[1]
    $(this).find(".btn_edit").attr("onclick","EditReview("+target_id+")");
});
// // 2-1. 리뷰 탭 - 리뷰 수정
async function EditReview(review_id) {
    
    let good_content = document.getElementById("good_content").value;
    let bad_content = document.getElementById("bad_content").value;
    let image = document.getElementById("review_image").files[0];
    let grade = document.querySelector('input[name="starpoint"]:checked').value;

    const review_formData = new FormData();
    review_formData.append("good_content",good_content);
    review_formData.append("bad_content",bad_content);
    if(image){
        review_formData.append("image", image);
    }
    review_formData.append("grade", grade);

    if (good_content == "" || bad_content == "" || grade == ""){
        alert("빈칸을 채워주세요!")
    }
    else if (good_content.length <= 10 || good_content.length > 500) {
        alert("최소 10자 이상 - 500자 이내로 작성해주세요!")
    }
    else if (bad_content.length <= 10 || bad_content.length > 500) {
        alert("최소 10자 이상 - 500자 이내로 작성해주세요!")
    }
    else{
    const response = await fetch('http://127.0.0.1:8000/perfume/reviews/'+review_id+'/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method:'PUT',
        body: review_formData,
    })
    
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        alert("수정에 성공했습니다!");
        $('#editModal').modal("hide");

        document.getElementById("review_"+review_id).querySelector("h2 .review_star_grade .review_user_grade").innerText = result['grade']
        document.getElementById("review_"+review_id).querySelector("h2 .review_star_grade .starpoint_box").className = `starpoint_box star_${result['grade']*20}`
        document.getElementById("review_"+review_id).querySelector(".review_good_content").innerText = result["good_content"]
        const element = document.getElementById("review_"+review_id).querySelector(".accordion-body");
        element.style.display = 'block';
        document.getElementById("review_"+review_id).querySelector(".review_bad_content").innerText = result['bad_content']

        document.getElementById("review_"+review_id).querySelector(".review_result_image_box").innerHTML =`
            ${result["image"] ? `<img class="review_result_image" src="http://127.0.0.1:8000${result["image"]}">` : ``}
        ` 

    }).catch(error => {
        alert("수정에 실패하였습니다. \n자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
    }
}

// 2-2. 리뷰 탭 - 리뷰 삭제 모달
$('#reviewDeleteModal').on('show.bs.modal', function(event) {
    target_id = $(event.relatedTarget).closest(".accordion-item").attr('id').split("_")[1]
    $(this).find(".btn_delete").attr("onclick","DeleteReviewPerfume("+target_id+")");
});
// 2-2. 리뷰 탭 - 리뷰 삭제
async function DeleteReviewPerfume(review_id) {
    const response = await fetch('http://127.0.0.1:8000/perfume/reviews/'+review_id+'/',{
        method:'DELETE',
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response;
    }).then(async result => {
        alert("삭제에 성공했습니다!");
        document.getElementById("review_"+review_id).remove();
        let my_review_list = document.getElementById("my_review_list").querySelector(".row");
        if(!my_review_list.innerHTML){
            my_review_list.innerHTML =`
            <div class="none_result_list">
                <h3>작성된 리뷰가 없습니다.</h3>
                <p>당신이 선호하는 향수에 리뷰를 남겨주세요.<br>
                    MMOP만의 완벽한 추천 공식으로 당신에게 어울리는 향수를 추천해드립니다.</p>
                <div class="btn_wrap">
                    <a href="/" class="btn btn_default btn_border">리뷰 작성하기</a>
                </div>
            </div>
            `;
        }
    }).catch(async error => {
        alert("삭제에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}

// 3. 찜 탭 - 찜한 향수 리스트 삽입
function appendLikePerfumeList(dataset, element) {
    if(dataset.length){
        element.innerHTML = '';
        dataset.forEach(data => {
            note_html = append_notes(data);

            let new_item = document.createElement('div');
            new_item.className = 'col-lg-4 col-md-4 col-6 card_wrap';
            new_item.innerHTML = `
                <a href="/perfume.html?perfume=${data['id']}">
                    <div class='item_card check_card' id='like_perfume_${data['id']}'>
                        <div class="card_header list_profile">
                            <div class="item_image">
                                <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                            </div>
                            <button type="button" class="perfume_card_heart btn_like" onclick="clickLike(event,this);">
                                <i class="bi bi-suit-heart-fill"></i>
                            </button>
                        </div>
                        <div class="card_body">
                            <div class="card_content">
                                <p class="item_card_editor"><span class="brand">${data['brand_title']}</span></p>
                                <p class="item_card_title"><span class="title">${data['title']}</span></p>
                                <p class="item_card_tag">
                                    ${note_html}
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            element.append(new_item);
        });
    }else{
        element.innerHTML =`
            <div class="none_result_list">
                <h3>찜한 향수가 없습니다.</h3>
                <p>관심있는 향수를 찜해두면<br>
                    Mypage에서 편하게 확인하고 관리 할 수 있습니다.</p>
                <div class="btn_wrap">
                    <a href="/" class="btn btn_default btn_border">향수 구경하기</a>
                </div>
            </div>
        `
    }
}
// 3-1. note 의 name 불러오는 함수 * 
function append_notes(data){
    note_type_list = ["top", 'heart', 'base', 'none']
    let note_html = ``
    note_type_list.forEach(note_type => {
        const note_data = data[note_type+'_notes'];
        note_data.forEach(note => {
            note_html +=`<span class="tag">#${note['name']}</span>`;
        });
    });
    return note_html
}


// 3-2. 찜 버튼 클릭 - 찜 해제 
async function clickLike(e,el){
    e.preventDefault();
    perfume_id = target = el.closest(".item_card").getAttribute("id").replace("like_perfume_","");

    const response = await fetch('http://127.0.0.1:8000/perfume/'+perfume_id+'/like/', {
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
    })
    .then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인한 유저만 접근 가능합니다! 로그인해주세요 :)")
                location.href="/users/signin.html";
            }
            else if(response.status==404){
                alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
                location.href="/index.html";
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        target = el.closest(".card_wrap");
        target.remove();
        let like_perfume_list = document.getElementById("like_perfume_list").querySelector(".row");
        if(!like_perfume_list.innerHTML){
            like_perfume_list.innerHTML =`
                <div class="none_result_list">
                    <h3>찜한 향수가 없습니다.</h3>
                    <p>관심있는 향수를 찜해두면<br>
                        Mypage에서 편하게 확인하고 관리 할 수 있습니다.</p>
                    <div class="btn_wrap">
                        <a href="/" class="btn btn_default btn_border">향수 구경하기</a>
                    </div>
                </div>
            `;
        }
    }).catch(error => {
        console.warn(error.message);
    });
}


// 4. 프로필 탭 - 프로필 정보 삽입
function appendUserProfile(response_json){
    document.getElementById("profile_phone_number").value = response_json['phone_number']
    document.getElementById("profile_username").value = response_json['username']
    document.getElementById("profile_email").value = response_json['email']
}
// 4. 프로필 탭 - 프로필 업데이트
document.getElementById("btn_update_profile").addEventListener("click",function(){
    handleUpdateProfile(); 
});
async function handleUpdateProfile() {
    const username = document.getElementById("profile_username").value;
    const phone_number = document.getElementById("profile_phone_number").value;
    
    const profile_formData = new FormData();
    profile_formData.append("username",username);
    profile_formData.append("phone_number",phone_number);
    
    const response = await fetch('http://127.0.0.1:8000/users/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method:'PUT',
        body: profile_formData,
    })
    .then(response => {
        if(!response.ok){
            if(response.status == 500){
                alert("프로필 변경에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            }
            return response.json().then(result => {
                for(key in result) {
                    alert(result[key]);
                }
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            })
        }
        return response.json()
    }).then(result => {
            alert("수정에 성공했습니다!")

    }).catch(error => {
        console.warn(error.message);
    });
}
// 5. 비밀번호 재설정 탭 - 로그인방식별 화면 처리 
function kakaoPasswordTab(dataset, element) {
    if (dataset['email_valid']==false){
        element.innerHTML = '';
        let password_reset_box = document.getElementById("password_reset_box");
        if(!password_reset_box.innerHTML){
            password_reset_box.innerHTML =`
            <div class="none_result_list">
                <h3>카카오 소셜 로그인을 하셨습니다.</h3>
                <p>카카오 소셜 로그인을 이용하시는 경우,<br>
                    카카오톡을 통하여 비밀번호 변경을 진행해주세요.</p>
            </div>
            `;
        }
    }
}

// 5. 비밀번호 재설정 탭 - 비밀번호 재설정
document.getElementById("btn_password_reset").addEventListener("click",function(){
    handlePasswordReset(); 
});

async function handlePasswordReset() {
    const origin_password = document.getElementById("origin_password").value;
    const password = document.getElementById("profile_password").value;
    const password2 = document.getElementById("profile_password2").value;
    if(origin_password==''){
        alert("기존 비밀번호를 입력해주세요.");
        return false;
    }
    else if(password=="" || password2==""){
        alert("변경하실 비밀번호 및 비밀번호 확인을 입력해주세요.");
        return false;
    }
    const profile_formData = new FormData();
    if(password){
        profile_formData.append("origin_password",origin_password);
        profile_formData.append("password",password);
        profile_formData.append("password2",password2);
    }
    
    const response = await fetch('http://127.0.0.1:8000/users/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method:'PUT',
        body: profile_formData,
    })
    .then(response => {
        if(!response.ok){
            if(response.status == 500){
                alert("비밀번호 변경에 실패하였습니다. \n자세한 내용은 관리자에게 문의해주세요!");
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            }
            return response.json().then(result => {
                for(key in result) {
                    alert(result[key]);
                }
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            })
        }
        return response.json()
        
    }).then(result => {
        alert("비밀번호가 변경되었습니다.")
        document.getElementById("origin_password").value ='';
        document.getElementById("profile_password").value ='';
        document.getElementById("profile_password2").value ='';
    }).catch(error => {
        console.warn(error.message);
    });
}


function openModal(e, el){
    e.preventDefault();
}
