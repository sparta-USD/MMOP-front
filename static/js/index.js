document.addEventListener("DOMContentLoaded", function(){
    handleTopPerfume()
    handleCustomPerfume()
    swiper()
    handleCustomPerfumeSwiper()
    handleBrandList()
});

// 뒤로가기 클릭 시 새로고침 되도록 이벤트 처리
window.onpageshow = function(event) {
    if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        location.reload()
    }
}


// 1. top20 향수 불러오기 API 통신
async function handleTopPerfume(){
    const response = await fetch('http://127.0.0.1:8000/perfume/?ordering=-likes_count',{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        append_top_perfume_list(response_json['results'])
    }).catch(error => {
        console.warn(error.message)
    });
}
// 1-1. top20 향수 불러오기
function append_top_perfume_list(top_data,element){
    let user_email = localStorage.getItem("email");
    let top_perfume_list = document.getElementById("top_item_list");
    top_perfume_list.innerHTML = '';
    top_data.forEach(data => {
        let top_list = document.createElement('div');
        top_list.className = 'col-lg-3 col-md-4 col-6';
        top_list.innerHTML = `
            <a href="/perfume.html?perfume=${data['id']}">
                <div class='item_card' id='perfume_${data['id']}'>
                    <div class="card_header list_profile">
                        <div class="item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                        </div>
                        <button type="button" class="perfume_card_heart none_link btn_like" onclick="clickLike(event,this);">
                            <i class="bi ${data['likes'].includes(user_email) ? "bi-suit-heart-fill" : "bi-suit-heart" } none_link btn_like"></i>
                        </button>
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="item_card_editor"><span class="brand">${data['brand']}</span></p>
                            <p class="item_card_title"><span class="title">${data['title']}</span></p>
                        </div>
                    </div>
                </div>
            </a>
        `;
        top_perfume_list.append(top_list);
    });
}


// 2. 최근 제작한 커스텀 향수 불러오기 API 통신
async function handleCustomPerfume(){
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/',{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        append_custom_perfume_list(response_json)
        
    }).catch(error => {
        console.warn(error.message)
    });
}
// 2-1. 최근 제작한 커스텀 향수 불러오기
function append_custom_perfume_list(custom_data){
    let custom_perfume_list = document.getElementById("custom_perfume_list");
    custom_perfume_list.innerHTML = '';
    custom_data.forEach(data => {
        let custom_list = document.createElement('div');
        custom_list.className = 'swiper-slide';
        custom_list.innerHTML = `
            <a href="/custom_perfume_detail.html?custom_perfume=${data['id']}">
                <div class='item_card check_card'>
                    <div class="card_header list_profile">
                        <div class="item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="${data['package']['image']}">
                        </div>
                        <div class="logo_image">
                            ${data["logo"]? `<img aria-hidden="false" draggable="false" loading="lazy" src="http://127.0.0.1:8000${data['logo']}">` : ``}
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
                            <p class="item_card_title"><span class="title">${data['title']}</span></p>
                            <p class="item_card_tag">
                                ${data["note01"]? `<span class="tag">#${data["note01"]["name"]}</span>` : ``}
                                ${data["note02"]? `<span class="tag">#${data["note02"]["name"]}</span>` : ``}
                                ${data["note03"]? `<span class="tag">#${data["note03"]["name"]}</span>` : ``}
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        `;
        custom_perfume_list.append(custom_list);
    });
}

// swiper
function swiper(){
    var swiper = new Swiper(".main_banner", {
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

function handleCustomPerfumeSwiper(){
    var swiper = new Swiper(".custom_perfume_swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 5,
        
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

// 3. 브랜드 리스트 불러오기 API통신
async function handleBrandList(){
    
    const response = await fetch('http://127.0.0.1:8000/perfume/brand/random/',{
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
        brand_list(response_json) // 브랜드 리스트 불러오기
    })
}
// 3-1. 브랜드 목록 불러오기
function brand_list(brand_data){
    let perfume_list = document.getElementById("brand_perfume_list");
    perfume_list.innerHTML = '';
    brand_data.forEach(data => {
        let new_perfume_list = document.createElement('div');
        new_perfume_list.className = "col-lg-3 col-md-4 col-6";
        new_perfume_list.id = 'brand' + data['id'];
        new_perfume_list.innerHTML = `
            <a href="/brand_detail.html?brand=${data['id']}">
                <div class='item_card check_card'>
                    <div class="card_header list_profile">
                        <div class="item_image">
                            <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                        </div>
                    </div>
                    <div class="card_body">
                        <div class="card_content">
                            <p class="item_card_title"><span class="title">${data['title']}</span></p>
                        </div>
                    </div>
                </div>
            </a>
        `;
        perfume_list.append(new_perfume_list);
    });
}
