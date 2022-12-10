document.addEventListener("DOMContentLoaded", function(){
    handleTopPerfume()

});


// 1. top20 향수 불러오기 API 통신
async function handleTopPerfume(){
    const response = await fetch('http://127.0.0.1:8000/perfume/random/',{
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
        append_top_perfume_list(response_json)
        
    }).catch(error => {
        console.warn(error.message)
    });
}
// 1-1. top20 향수 불러오기
function append_top_perfume_list(top_data,element){
    let top_perfume_list = document.getElementById("top_item_list");
    top_perfume_list.innerHTML = '';
    top_data.forEach(data => {
        let top_list = document.createElement('div');
        top_list.className = 'col-lg-3 col-md-4 col-6';
        top_list.id = 'custom_perfume_'+data['id'];
        top_list.innerHTML = `
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
                        </div>
                    </div>
                </div>
            </a>
        `;
        top_perfume_list.append(top_list);
    });
}



