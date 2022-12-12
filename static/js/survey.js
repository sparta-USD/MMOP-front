document.addEventListener("DOMContentLoaded", function(){
    handlePerfumeRandom()
});
// 1. 랜덤 추천 목록 불러오기
async function handlePerfumeRandom(){
    const response = await fetch('http://127.0.0.1:8000/perfume/random/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    }).then(response => {
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
        const response_json = result;
        let element_perfume_list = document.getElementById("survey_perfume_list").querySelector(".row")
        append_perfume_card_list(response_json, element_perfume_list)
    }).catch(error => {
        console.warn(error.message)
    });
}
function append_perfume_card_list(dataset,element){
    element.innerHTML='';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-3 col-md-4 col-6';
        new_item.innerHTML = `
            <div class='item_card check_card'>
                <div class="card_header list_profile">
                    <div class="item_image">
                        <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                    </div>
                </div>
                <div class="card_body">
                    <div class="card_content">
                        <p class="item_card_editor"><span class="brand">${data['brand'] ? data['brand'] : "" }</span></p>
                        <p class="item_card_title"><span class="title">${data['title']}</span></p>
                    </div>
                </div>
                <div class="card_footer">
                    <input class="form-check-input mt-0" type="checkbox" id="perfume_${data['id']}" value="${data['id']}" name="survey_perfume">
                    <label for="perfume_${data['id']}"><span class="btn_check"><i class="bi bi-check-lg"></i></span></label>
                </div>
            </div>
        `;
        element.append(new_item);
    });
}

// 2. 설문조사하기
document.getElementById("btn_survey_skip").addEventListener("click",function(){
    location.href="/recommend.html";
});
document.getElementById("btn_survey_submit").addEventListener("click",function(){
    handleSurveySubmit()
});
async function handleSurveySubmit(){
    let survey = []
    const survey_checked_perfume = document.querySelectorAll("input[type=checkbox][name=survey_perfume]:checked")
    for(var i=0; i<survey_checked_perfume.length; i++){
        survey.push(Number(survey_checked_perfume[i].value));
    }
    const response = await fetch('http://127.0.0.1:8000/perfume/survey/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "perfume_id" : survey
        }),
    }).then(response => {
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
        const response_json = result;
        if(response_json.length == survey.length){
            location.href="/recommend.html";
        }
       
    }).catch(error => {
        console.warn(error.message)
    });
}