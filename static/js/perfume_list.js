const ordering_fields = ['-launch_date','-likes_count','-avg_reviews_grade','-reviews_count']
let ordering="-launch_date"
let page=1;

document.addEventListener("DOMContentLoaded", function(){
    if(ordering_fields.includes(getParams("ordering"))){
        ordering = getParams("ordering")   
    }
    document.getElementById("sorting_option_"+ordering.slice(1)).setAttribute("checked","checked")
    if(getParams("page")){
        page = getParams("page")
    }
    handlePerfumeList()
});
// url을 불러오는 함수 
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

// radio 선택
document.getElementById("sorting_option_likes_count").addEventListener("change", function(e){
    ordering = this.value
    handlePerfumeList()

});
document.getElementById("sorting_option_launch_date").addEventListener("change", function(e){
    ordering = this.value
    handlePerfumeList()
});
document.getElementById("sorting_option_avg_reviews_grade").addEventListener("change", function(e){
    ordering = this.value
    handlePerfumeList()
});
document.getElementById("sorting_option_reviews_count").addEventListener("change", function(e){
    ordering = this.value
    handlePerfumeList()
});



// 1. 전체 목록 불러오기
async function handlePerfumeList(){
    const response = await fetch(`http://127.0.0.1:8000/perfume/?ordering=${ordering}&page=${page}`,{
        headers: {
            
        },
        method: 'GET',
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        let element_perfume_list = document.getElementById("perfume_list").querySelector(".row")
        append_perfume_card_list(response_json['results'], element_perfume_list)

        // 페이지네이션
        document.querySelector(".first_page a").setAttribute("href",`/perfume_list.html?ordering=${ordering}&page=1`);
        document.querySelector(".last_page a").setAttribute("href",`/perfume_list.html?ordering=${ordering}&page=${response_json['last']}`);
        document.querySelector(".next_page a").setAttribute("href",`/perfume_list.html?ordering=${ordering}&page=${response_json['next']?response_json['next']: response_json['last']}`);
        document.querySelector(".prev_page a").setAttribute("href",`/perfume_list.html?ordering=${ordering}&page=${response_json['previous']?response_json['previous']: 1}`);
        curr_page = Number(page)
        for(i=-2; i<3; i++){
            document.querySelector(`.page_${i} a`).setAttribute("href",`/perfume_list.html?ordering=${ordering}&page=${curr_page+i}`);
            document.querySelector(`.page_${i} a`).innerText= curr_page+i

            if(curr_page+i<1){
                document.querySelector(`.page_${i}`).style.display="none"
            }
            if(curr_page+i<=1){ //왼쪽 ... 1,2,3 페이지에는 안보임
                document.querySelector(`.leftdots_page`).style.display="none"
            }
            
            if(curr_page+i>response_json['last']){
                document.querySelector(`.page_${i}`).style.display="none"
            }
            if(curr_page+i>=response_json['last']){  //오른쪽 ... last-2,last-1,last 페이지에는 안보임
                document.querySelector(`.rightdots_page`).style.display="none"
            }
        }
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