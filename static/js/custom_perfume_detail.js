document.addEventListener('DOMContentLoaded', function() {
    handleCustomDetail()
});

function changeDateTimeFormat(datetime){
    const TIME_ZONE = 3240 * 10000;
    const date = new Date(datetime)
    return new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, '');
}

// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

async function handleCustomDetail(){
    get_custom_perfume = getParams("custom_perfume");
    if (get_custom_perfume == undefined){
        alert("경로가 잘못되었습니다! 다시 입력해주세요 :)")
        history.back();
    }
    const response = await fetch(`http://127.0.0.1:8000/custom_perfume/${get_custom_perfume}/`, {
        headers: {
            "content-type": "application/json",
        },
        method: "GET",
    }).then(response => {
        if(!response.ok){
            throw new Error(`${response.status}`)
        }
        return response.json()
    }).then(result => {
        document.querySelector(".perfume_image").src = result.package.image
        document.querySelector(".logo_image img").src = `http://127.0.0.1:8000${result.logo}`
        document.querySelector(".perfume_creator").innerText = result.creator_username
        document.querySelector(".perfume_title").innerText = result.title
        document.querySelector(".perfume_create").innerText = changeDateTimeFormat(result.created_at)
        document.querySelector(".pakage_name").innerText = result.package.name

        // 노트 이미지 넣기
        let materials_box = document.querySelector(".materials");
        materials_box.innerHTML = ""
        let material = document.createElement("div");
        material.innerHTML = `
        ${result["note01"]? `<div class="perfume_images material"><img src="${result["note01"]["image"]}"></div>` : ``}
        ${result["note02"]? `<div class="perfume_images material"><img src="${result["note02"]["image"]}"></div>` : ``}
        ${result["note03"]? `<div class="perfume_images material"><img src="${result["note03"]["image"]}"></div>` : ``}
        `
        materials_box.append(material);

        // 노트 이름 넣기
        let note_name_box = document.querySelector(".custom_note_name_box");
        note_name_box.innerHTML = "";
        let note_name = document.createElement("div");
        note_name.innerHTML = `
        ${result["note01"]? `<div class="row custom_note_box"><p class="custom_note">${result["note01"]["kor_name"]}</p></div>` : `<div class="row custom_note_box"><p class="custom_note">&nbsp</p></div>`}
        ${result["note02"]? `<div class="row custom_note_box"><p class="custom_note">${result["note02"]["kor_name"]}</p></div>` : `<div class="row custom_note_box"><p class="custom_note">&nbsp</p></div>`}
        ${result["note03"]? `<div class="row custom_note_box"><p class="custom_note">${result["note03"]["kor_name"]}</p></div>` : `<div class="row custom_note_box"><p class="custom_note">&nbsp</p></div>`}
        `
        note_name_box.append(note_name);
    }).catch(error => {
        console.error(error)
    })
};