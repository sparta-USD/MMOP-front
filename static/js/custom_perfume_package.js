document.addEventListener("DOMContentLoaded", function () {
    handleCategory()
});

// 카테고리 및 목록 띄우기
async function handleCategory() {
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/', {
        method: 'GET',
        // headers: {
        //     "Authorization": "Bearer " + localStorage.getItem("access"),
        // },
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
                        <p class="item_card_editor"><span class="brand"><div class="circle_pick"><a href="#" class="circle_pick_plus">+</a></div></span></p>     
                    </div>
                </div>
            </div>
        `;
        element.append(new_item);
    });
}

document.getElementById("create_button").addEventListener("click",function(){
    a();
});

async function a() {
    console.log("1")
    console.log(document.getElementById("create_button"))
    console.log(document.getElementById("circle_pick"))
}

async function handleNote() {
    
    const note_formData = new FormData();

    const note01 = document.getElementById("note01").value;
    const note02 = document.getElementById("note02").value;
    const note03 = document.getElementById("note03").value;
    
    note_formData.append("note01", note01);
    note_formData.append("note02", note02);
    note_formData.append("note03", note03);

    console.log(note_formData)
    console.log(document.getElementById("note01"))

    if (note01 == "" || note02 == "" || note03 == "") {
        alert("향 3가지를 모두 골라주세요!")
    }
    else {

        const response = await fetch('http://127.0.0.1:8000/custom_perfume/', {
            method: 'POST',
            // headers: {
            //     "Authorization": "Bearer " + localStorage.getItem("access"),
            // },
            body: note_formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} 에러가 발생했습니다.`);
                }
                return response.json()
            })
            .then(result => {
                alert("U-NFT 생성에 성공했습니다!")
                // location.href="/unft.html?unft=" + result["id"];
            })
            .catch(error => {
                alert("U-NFT 생성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
                console.warn(error.message);
                loader.classList.remove('show');
            });
    }
}
