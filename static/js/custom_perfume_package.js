document.addEventListener("DOMContentLoaded", function () {
    handleCategory()
});

// 용기 카테고리 , 선택한 용기 띄우기
async function handleCategory() {
    if(sessionStorage.length==1){
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

        
        document.getElementById("tab_menu_01").innerText = response_json['package_category'][0]['name']
        document.getElementById("tab_menu_02").innerText = response_json['package_category'][1]['name']
        document.getElementById("tab_menu_03").innerText = response_json['package_category'][2]['name']
        document.getElementById("tab_menu_04").innerText = response_json['package_category'][3]['name']
        document.getElementById("tab_menu_05").innerText = response_json['package_category'][4]['name']
        
        
        var category1 = response_json['packages'].filter(function(item){
            return item.package_category == '1'
        });
        var category2 = response_json['packages'].filter(function(item){
            return item.package_category == '2'
        });
        var category3 = response_json['packages'].filter(function(item){
            return item.package_category == '3'
        });
        var category4 = response_json['packages'].filter(function(item){
            return item.package_category == '4'
        });
        var category5 = response_json['packages'].filter(function(item){
            return item.package_category == '5'
        });


        let package_list_1 = document.getElementById("tab_01").querySelector(".row")
        append_package_list(category1,package_list_1)
        let package_list_2 = document.getElementById("tab_02").querySelector(".row")
        append_package_list(category2,package_list_2)
        let package_list_3 = document.getElementById("tab_03").querySelector(".row")
        append_package_list(category3,package_list_3)
        let package_list_4 = document.getElementById("tab_04").querySelector(".row")
        append_package_list(category4,package_list_4)
        let package_list_5 = document.getElementById("tab_05").querySelector(".row")
        append_package_list(category5,package_list_5)

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
function append_package_list(dataset, element) {
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
                        <p class="item_card_editor"><span class="brand"><button class="circle_pick" id="${data['id']}" onclick="handlePick(this.id)">+</span></p>  
                    </div>
                </div>
            </div>
        `;
        element.append(new_item);
    });
}

// 용기 선택
async function handlePick(clicked_id) {
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;

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
    })
}

// 용기 삭제
async function handlePickDelete(){
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("circle_image").innerText = "+"
        delete package_
        sessionStorage.removeItem("package")
    })
    
}

// 다음 step 버튼
function handleNext(){
    if(JSON.parse(sessionStorage.getItem("package"))==null){
        alert("용기를 골라주세요!")
    }else{
        location.href="/custom_perfume_logo.html"  
    }
}
