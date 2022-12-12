document.addEventListener("DOMContentLoaded", function () {
    handleCategory()
});

// 카테고리 및 목록 띄우기
async function handleCategory() {
    if(sessionStorage.length < 4){
        alert("이전 step을 완료 해야됩니다!")
        location.href="/custom_perfume_note.html"
    }else{
        const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            // "Authorization": "Bearer " + localStorage.getItem("access"),
        },
    }).then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인 유저만 접근 가능합니다.")
                history.back()
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
        append_note_list(category1,package_list_1)
        let package_list_2 = document.getElementById("tab_02").querySelector(".row")
        append_note_list(category2,package_list_2)
        let package_list_3 = document.getElementById("tab_03").querySelector(".row")
        append_note_list(category3,package_list_3)
        let package_list_4 = document.getElementById("tab_04").querySelector(".row")
        append_note_list(category4,package_list_4)
        let package_list_5 = document.getElementById("tab_05").querySelector(".row")
        append_note_list(category5,package_list_5)
    
    }).catch(error => {
        console.warn(error.message)
    });
    }
    
}

function append_note_list(dataset, element) {
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

async function handlePick(clicked_id) {
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        if (sessionStorage.length == 4){
            document.getElementById("circle_image").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + response_json['packages'][clicked_id-1]['image'] + '"><button class="delete_button" onclick="handlePickDelete()">x'
            package_ = clicked_id
            sessionStorage.setItem("package", JSON.stringify(package_));
        } else{
            alert("더이상 추가할 수 없습니다.")
        }
    })
}
async function handlePickDelete(){
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
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

function handleNext(){
    if(sessionStorage.length == 4){
        alert("용기를 골라주세요!")
    }else{
        location.href="/custom_perfume_logo.html"  
    }
}
