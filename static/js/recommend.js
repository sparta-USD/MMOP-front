
document.addEventListener("DOMContentLoaded", function(){
    handlePerfumeRecommend()
});

// 1. 향수 추천 목록 불러오기
async function handlePerfumeRecommend(){
    const response = await fetch('http://127.0.0.1:8000/perfume/recommend/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        document.querySelector(".section_title .username").innerText = localStorage.getItem("username");
        let element_perfume_list = document.getElementById("recommend_perfume_list").querySelector(".row")
        append_perfume_card_list(response_json, element_perfume_list)
    }).catch(error => {
        console.warn(error.message)
    });
}
function append_perfume_card_list(dataset,element){
    let user_email = localStorage.getItem("email");
    element.innerHTML='';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-3 col-md-4 col-6';
        new_item.innerHTML = `
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
                                <p class="item_card_editor"><span class="brand">${data['brand'] ? data['brand'] : "" }</span></p>
                                <p class="item_card_title"><span class="title">${data['title']}</span></p>
                                <p class="item_card_tag">
                                    ${append_notes(data)}
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
        `;
        element.append(new_item);
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