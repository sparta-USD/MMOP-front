document.addEventListener("DOMContentLoaded", function () {
    handleCategory()
});

// 향 카테고리 , 선택한 향 띄우기
async function handleCategory() {
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
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

        
        document.getElementById("tab_menu_01").innerText = response_json['note_category'][0]['kor_name']
        document.getElementById("tab_menu_02").innerText = response_json['note_category'][1]['kor_name']
        document.getElementById("tab_menu_03").innerText = response_json['note_category'][2]['kor_name']
        document.getElementById("tab_menu_04").innerText = response_json['note_category'][3]['kor_name']
        document.getElementById("tab_menu_05").innerText = response_json['note_category'][4]['kor_name']
        document.getElementById("tab_menu_06").innerText = response_json['note_category'][5]['kor_name']
        document.getElementById("tab_menu_07").innerText = response_json['note_category'][6]['kor_name']
        document.getElementById("tab_menu_08").innerText = response_json['note_category'][7]['kor_name']
        document.getElementById("tab_menu_09").innerText = response_json['note_category'][8]['kor_name']
        document.getElementById("tab_menu_010").innerText = response_json['note_category'][9]['kor_name']
        document.getElementById("tab_menu_011").innerText = response_json['note_category'][10]['kor_name']
        document.getElementById("tab_menu_012").innerText = response_json['note_category'][11]['kor_name']
        
        
        var category1 = response_json['notes'].filter(function(item){
            return item.note_category == '1'
        });
        var category2 = response_json['notes'].filter(function(item){
            return item.note_category == '2'
        });
        var category3 = response_json['notes'].filter(function(item){
            return item.note_category == '3'
        });
        var category4 = response_json['notes'].filter(function(item){
            return item.note_category == '4'
        });
        var category5 = response_json['notes'].filter(function(item){
            return item.note_category == '5'
        });
        var category6 = response_json['notes'].filter(function(item){
            return item.note_category == '6'
        });
        var category7 = response_json['notes'].filter(function(item){
            return item.note_category == '7'
        });
        var category8 = response_json['notes'].filter(function(item){
            return item.note_category == '8'
        });
        var category9 = response_json['notes'].filter(function(item){
            return item.note_category == '9'
        });
        var category10 = response_json['notes'].filter(function(item){
            return item.note_category == '10'
        });
        var category11 = response_json['notes'].filter(function(item){
            return item.note_category == '11'
        });
        var category12 = response_json['notes'].filter(function(item){
            return item.note_category == '12'
        });


        let note_list_1 = document.getElementById("tab_01").querySelector(".row")
        append_note_list(category1,note_list_1)
        let note_list_2 = document.getElementById("tab_02").querySelector(".row")
        append_note_list(category2,note_list_2)
        let note_list_3 = document.getElementById("tab_03").querySelector(".row")
        append_note_list(category3,note_list_3)
        let note_list_4 = document.getElementById("tab_04").querySelector(".row")
        append_note_list(category4,note_list_4)
        let note_list_5 = document.getElementById("tab_05").querySelector(".row")
        append_note_list(category5,note_list_5)
        let note_list_6 = document.getElementById("tab_06").querySelector(".row")
        append_note_list(category6,note_list_6)
        let note_list_7 = document.getElementById("tab_07").querySelector(".row")
        append_note_list(category7,note_list_7)
        let note_list_8 = document.getElementById("tab_08").querySelector(".row")
        append_note_list(category8,note_list_8)
        let note_list_9 = document.getElementById("tab_09").querySelector(".row")
        append_note_list(category9,note_list_9)
        let note_list_10 = document.getElementById("tab_010").querySelector(".row")
        append_note_list(category10,note_list_10)
        let note_list_11 = document.getElementById("tab_011").querySelector(".row")
        append_note_list(category11,note_list_11)
        let note_list_12 = document.getElementById("tab_012").querySelector(".row")
        append_note_list(category12,note_list_12)
        
        // 향1 이미지
        $.each(response_json['notes'],function(idx,row){
            if(response_json['notes'][idx].id==JSON.parse(sessionStorage.getItem("note01"))){
                note01_pick = response_json['notes'][idx]['image']
            }
        })

        // 향2 이미지
        $.each(response_json['notes'],function(idx,row){
            if(response_json['notes'][idx].id==JSON.parse(sessionStorage.getItem("note02"))){
                note02_pick = response_json['notes'][idx]['image']
            }
        })

        // 향3 이미지
        $.each(response_json['notes'],function(idx,row){
            if(response_json['notes'][idx].id==JSON.parse(sessionStorage.getItem("note03"))){
                note03_pick = response_json['notes'][idx]['image']
            }
        })
        
        if ( JSON.parse(sessionStorage.getItem("note01")) != null ){
            document.getElementById("note01").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note01_pick + '" id="' + JSON.parse(sessionStorage.getItem("note01")) + '"><button class="delete_button" onclick="handlePickDelete1()">x'
        }
        if ( JSON.parse(sessionStorage.getItem("note02")) != null ){
            document.getElementById("note02").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note02_pick + '" id="' + JSON.parse(sessionStorage.getItem("note02")) + '"><button class="delete_button" onclick="handlePickDelete2()">x'
        }
        if ( JSON.parse(sessionStorage.getItem("note03")) != null ){
            document.getElementById("note03").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note03_pick + '" id="' + JSON.parse(sessionStorage.getItem("note03")) + '"><button class="delete_button" onclick="handlePickDelete3()">x'
        }
    
    }).catch(error => {
        console.warn(error.message)
    });
}

// 향 리스트
function append_note_list(dataset, element) {
    element.innerHTML = '';
    dataset.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'col-lg-1 col-md-4 col-6';
        new_item.innerHTML = `
            <div class='item_card check_card'>
                <div class="card_header list_profile">
                    <div class="item_image">
                        <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
                    </div>
                </div>
                <div class="card_body">
                    <div class="card_content">
                        <p class="item_card_title"><span class="title">${data['kor_name']}</span></p>
                        <p class="item_card_editor"><span class="brand"><button class="circle_pick" id="${data['id']}" onclick="handlePick(this.id)">+</span></p>     
                    </div>
                </div>
            </div>
        `;
        element.append(new_item);
    });
}

// 향 선택
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

        // 선택한 id값과 같은 id값의 이미지 불러오기
        $.each(response_json['notes'],function(idx,row){
            if(response_json['notes'][idx].id==clicked_id){
                note_pick = response_json['notes'][idx]['image']
            }
        })

        if ( JSON.parse(sessionStorage.getItem("note01")) == null ) {
            if ( JSON.parse(sessionStorage.getItem("note02")) == clicked_id || JSON.parse(sessionStorage.getItem("note03")) == clicked_id ){
                alert("동일한 향은 선택하실 수 없습니다.")
            }else{
                document.getElementById("note01").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note_pick + '" id="' + clicked_id + '"><button class="delete_button" onclick="handlePickDelete1()">x'
                note01 = clicked_id
                sessionStorage.setItem("note01", JSON.stringify(note01));
            }
        } else if ( JSON.parse(sessionStorage.getItem("note02")) == null ) {
            if ( JSON.parse(sessionStorage.getItem("note01")) == clicked_id || JSON.parse(sessionStorage.getItem("note03")) == clicked_id ){
                alert("동일한 향은 선택하실 수 없습니다.")
            }else{
                document.getElementById("note02").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note_pick + '" id="' + clicked_id + '"><button class="delete_button" onclick="handlePickDelete2()">x'
                note02 = clicked_id
                sessionStorage.setItem("note02", JSON.stringify(note02));
            }
        } else if ( JSON.parse(sessionStorage.getItem("note03")) == null ) {
            if (JSON.parse(sessionStorage.getItem("note01")) == clicked_id || JSON.parse(sessionStorage.getItem("note02")) == clicked_id ){
                alert("동일한 향은 선택하실 수 없습니다.")
            }else{
                document.getElementById("note03").innerHTML = '<img aria-hidden="false" draggable="false" loading="lazy" class="note" src="' + note_pick + '" id="' + clicked_id + '"><button class="delete_button" onclick="handlePickDelete3()">x'
                note03 = clicked_id
                sessionStorage.setItem("note03", JSON.stringify(note03));
            }
        } else {
            alert("더이상 추가할 수 없습니다.")
        }
        
    })
}

// 향1 삭제
async function handlePickDelete1(){
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("note01").innerText = "+"
        delete note01
        sessionStorage.removeItem("note01")
    })
    
}

// 향2 삭제
async function handlePickDelete2(){
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("note02").innerText = "+"
        delete note02
        sessionStorage.removeItem("note02")
    })
    
}

// 향3 삭제
async function handlePickDelete3(){
    const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("note03").innerText = "+"
        delete note03
        sessionStorage.removeItem("note03")
    })
    
}

// 다음 step 버튼
function handleNext(){

    var sum = !!JSON.parse(sessionStorage.getItem("note01")) + !!JSON.parse(sessionStorage.getItem("note02")) + !!JSON.parse(sessionStorage.getItem("note03"))

    // 하나도 없을 때
    if (sum == 0) {
        $("#Modal").modal("show");
        document.getElementById("Modal").querySelector(".next_guide").innerHTML = `향을 한가지 이상 선택해주세요.`;
        document.getElementById("Modal").querySelector(".modal-footer").innerHTML = `
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">확인</button>
        `;
    }

    // 한개나 두개 골랐을 때,
    if (0 < sum <= 2) {
        $("#Modal").modal("show");
        document.getElementById("Modal").querySelector(".next_guide").innerHTML = `향을 ${sum}가지만 선택하셨습니다<br><br>정말 다음 단계로 가시겠습니까?`;
        document.getElementById("Modal").querySelector(".modal-footer").innerHTML = `
                <button type="button" class="btn btn-primary" onclick="handleOk()">네</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">아니요</button>
            `;
    }
    
    // 다 골랐을 때
    if (sum == 3) {
        location.href = "/custom_perfume_package.html"
    }
}

// 모달창에서 다음 step 버튼 
function handleOk(){
    location.href="/custom_perfume_package.html"
}