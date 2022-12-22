document.addEventListener("DOMContentLoaded", function(){
    handleBrandInfo()
});

// url을 불러오는 함수 
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

// 브랜드 정보 불러오기
async function handleBrandInfo(){
    // url이 ?perfume="perfume_id" 형태로 입력되지 않았을 때 에러메세지 출력
    url_detail_perfume = getParams("brand");
    if (url_detail_perfume == undefined){
        alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
        location.href="/index.html";
    }
    const response = await fetch('http://127.0.0.1:8000/perfume/brand/'+url_detail_perfume,{
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
        brand_info(response_json);  // 1. 기본 향수제품정보
        brand_perfume_list(response_json);  // 2. 브랜드 향수 목록 
    })
}

// 1. 기본 향수제품정보 불러오기
function brand_info(data){
    const element = document.querySelector(".container_brand_detail");
    const element2 = document.querySelector(".brand_desc_box");
    element.querySelector(".brand_image_box").innerHTML=`
        <img class="brand_image" src="${data['image']? data['image']: "/static/images/perfume.png"}">
    `;
    element.querySelector(".brand_id").innerText = "#"+data['id'];
    element.querySelector(".brand_title").innerText = data['title'];

    console.log(data['website']);
    // 웹사이트
    if(data['website']){
        element.querySelector(".col_website_1").innerHTML = `<a href="${data['website']}" target="_blank">${data['website']}</a>`
    }else{
        element.querySelector(".brand_website").remove();
    }
    
    // 설명
    if(data['brand_desc']){
        element2.querySelector(".tab_brand_desc").innerText = data['brand_desc'];
    }else{
        element2.querySelector(".tab_brand_desc").remove();
    }

    // 영문설명
    if(data['brand_desc_ko']){
        element2.querySelector(".tab_brand_desc_ko").innerText = data['brand_desc_ko'];
    }else{
        element2.querySelector(".tab_brand_desc_ko").remove();
    }
}

// 2. 브랜드의 향수 목록 불러오기
function brand_perfume_list(brand_data){
    let perfume_list = document.getElementById("brand_perfume_list");
    if(brand_data['brand_perfume'].length){
        perfume_list.innerHTML = '';
        brand_data['brand_perfume'].forEach(data => {
            let new_perfume_list = document.createElement('div');
            new_perfume_list.className = "col-lg-3 col-md-4 col-6";
            new_perfume_list.id = 'brand' + data['id'];
            new_perfume_list.innerHTML = `
                <a href="/perfume.html?perfume=${data['id']}">
                    <div class='item_card check_card'>
                        <div class="card_header list_profile">
                            <div class="item_image">
                                <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                            </div>
                        </div>
                        <div class="card_body">
                            <div class="card_content">
                                <p class="item_card_editor"><span class="brand">${data['brand_title']}</span></p>
                                <p class="item_card_title"><span class="title">${data['title']}</span></p>
                                <p class="item_card_tag">
                                ${append_notes(data)}
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            perfume_list.append(new_perfume_list);
        });
    }else{
        document.querySelector(".sec_brand_perfume").remove();
    }
}
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