document.addEventListener("DOMContentLoaded", function(){
    handleBrandList()
});

// 브랜드 리스트 불러오기
async function handleBrandList(){
    
    const response = await fetch('http://127.0.0.1:8000/perfume/brand/',{
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

function brand_list(brand_data){
    let perfume_list = document.getElementById("brand_perfume_list");
    perfume_list.innerHTML = '';
    brand_data.forEach(data => {
        let new_perfume_list = document.createElement('div');
        new_perfume_list.className = "col-lg-2 col-md-2 col-6";
        new_perfume_list.id = 'brand' + data['id'];
        new_perfume_list.innerHTML = `
            <a href="/brand_detail.html?brand=${data['id']}">
                <div class='item_card brand_card'>
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