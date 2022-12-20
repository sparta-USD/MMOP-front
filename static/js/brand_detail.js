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
    // url_detail_perfume = getParams("brand");
    // if (url_detail_perfume == undefined){
    //     alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
    //     location.href="/index.html";
    // }
    const response = await fetch('http://127.0.0.1:8000/perfume/brand/1/',{
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
        console.log(response_json)
        brand_info(response_json);  // 1. 기본 향수제품정보
    })
}
// 1. 기본 향수제품정보 불러오기
function brand_info(data){
    const element = document.querySelector(".container_brand_detail");
    element.querySelector(".brand_image_box").innerHTML=`
        <img class="brand_image" src="${data['image']? data['image']: "/static/images/perfume.png"}">
    `;
    element.querySelector(".brand_id").innerText = "#"+data['id'];
    element.querySelector(".brand_title").innerText = data['title'];

    // 웹사이트
    if(data['website']){
        element.querySelector(".col_website_1").innerText = data['website'];
    }else{
        element.querySelector(".brand_website").remove();
    }
    
    // 설명
    if(data['brand_desc']){
        element.querySelector(".col_desc_1").innerText = data['brand_desc'];
    }else{
        element.querySelector(".brand_desc_2").remove();
    }

    // 영문설명
    if(data['brand_desc_ko']){
        element.querySelector(".col_desc_ko_1").innerText = data['brand_desc_ko'];
    }else{
        element.querySelector(".brand_desc_ko").remove();
    }
}
