document.addEventListener("DOMContentLoaded", function () {
    handleCategory()
});

// 용기 카테고리 , 선택한 용기 띄우기
async function handleCategory() {
    if(JSON.parse(sessionStorage.getItem("note01"))==null&&JSON.parse(sessionStorage.getItem("note02"))==null&&JSON.parse(sessionStorage.getItem("note03"))==null){
        alert("향을 선택하셔야 됩니다!")
        location.href="/custom_perfume_note.html"
    }else{
        const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
    }).then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인 유저만 접근 가능합니다.")
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;

        // 카테고리
        for(let i = 0; i<5; i++){
            document.getElementById(`tab_menu_0${i+1}`).innerText = response_json['package_category'][i]['name']
        }
        
        // 카테고리 별 용기 나누기
        for(let i = 1; i<6; i++){
            window['category'+i] = response_json['packages'].filter(function(item){
                return item.package_category == i
            });
        }

        // 카테고리 탭 선택시 용기 띄우기
        for(let i = 1; i<6; i++){
            window['package_list_'+i] = document.getElementById(`tab_0${i}`).querySelector(".row")
            append_package_list(window['category'+i],window['package_list_'+i], response_json)
        };

        // 용기 이미지
        if ( JSON.parse(sessionStorage.getItem("package")) != null ){
            $.each(response_json['packages'],function(idx,row){
                if(response_json['packages'][idx].id==JSON.parse(sessionStorage.getItem("package"))){
                    package_pick = response_json['packages'][idx]['image']
                }
            })
            document.getElementById("circle_image").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + package_pick + '"><button class="delete_button" onclick="handlePickDelete()">x'
        }
    
    }).catch(error => {
        console.warn(error.message)
    });
    }
    
}

// 용기 리스트
function append_package_list(dataset, element, response_json) {
    data = response_json
    element.innerHTML = '';
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
                        <p class="item_card_title"><span class="title">${data['name']}</span></p>
                        <p class="item_card_editor"><span class="brand"><button class="circle_pick" id="${data['id']}" onclick="handlePick(this.id, data)">+</span></p>  
                    </div>
                </div>
            </div>
        `;
        element.append(new_item);
    });
}

// 용기 선택
async function handlePick(clicked_id, response_json) {
    $.each(response_json['packages'],function(idx,row){
        if(response_json['packages'][idx].id==clicked_id){
            package_pick = response_json['packages'][idx]['image']
        }
    })
    if (JSON.parse(sessionStorage.getItem("package"))==null){
        document.getElementById("circle_image").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + package_pick + '"><button class="delete_button" onclick="handlePickDelete()">x'
        package_ = clicked_id
        sessionStorage.setItem("package", JSON.stringify(package_));
    } else{
        alert("더이상 추가할 수 없습니다.")
    }
}

// 용기 삭제
async function handlePickDelete(){
    document.getElementById("circle_image").innerText = "+"
    delete package_
    sessionStorage.removeItem("package")
}

// 다음 step 버튼
function handleNext(){
    if(JSON.parse(sessionStorage.getItem("package"))==null){
        alert("용기를 골라주세요!")
    }else{
        location.href="/custom_perfume_logo.html"  
    }
}
