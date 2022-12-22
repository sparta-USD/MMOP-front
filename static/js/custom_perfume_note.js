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

        // 비슷한 향수 만들기
        if (location.href.split('?')[1] != null){

            
            // url로 전송된 향 id값
            var url_data = location.href.split('?')[1].split(',')
            var note_data = response_json['notes'].filter(function(item){
                return item
            });

            // url로 전송된 추천 향수 이름
            document.getElementById('recommend_name').innerText = decodeURI(location.href.split('?')[2])+' 향수와 같은 향';
            
            // 추천 향 리스트
            let recommend_note_list = document.getElementById("card")
            append_recommend_note_list(note_data, url_data, recommend_note_list)
            
        }

        // 카테고리
        for(let i = 0; i<12; i++){
            document.getElementById(`tab_menu_0${i+1}`).innerText = response_json['note_category'][i]['kor_name']
        }

        // 카테고리 별 향 나누기
        for(let i = 1; i<13; i++){
            window['category'+i] = response_json['notes'].filter(function(item){
                return item.note_category == i
            });
        }

        // 카테고리 탭 선택시 향 띄우기
        for(let i = 1; i<13; i++){
            window['note_list_'+i] = document.getElementById(`tab_0${i}`).querySelector(".row")
            append_note_list(window['category'+i],window['note_list_'+i])
        };
        
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

// 추천 향 리스트
function append_recommend_note_list(dataset, url_data, element) {
    var recommend = []
    for (let i = 0; i < 313; i++) {
        for (let j = 0; j < url_data.length; j++) {
            if (String(dataset[i]['id']) == url_data[j]) {
                recommend.push(dataset[i])
            }
        }
    }
    element.innerHTML = '';
    recommend.forEach(data => {
        let new_item = document.createElement('div');
        new_item.className = 'card';
        new_item.innerHTML = `
            <div class="image">
                <img aria-hidden="false" draggable="false" loading="lazy" src="${data['image']}">
            </div>
            <div class="title">
                <div class="name">${data['kor_name']}</div>
            </div>
            <button class="circle_pick" id="${data['id']}" onclick="handlePick(this.id)">+
        `;
        element.append(new_item);
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
    if (sum > 0 && sum <= 2) {
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