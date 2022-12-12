document.addEventListener('DOMContentLoaded', function() {
    handleCustomDetail()
});

function changeDateTimeFormat(datetime){
    const TIME_ZONE = 3240 * 10000;
    const date = new Date(datetime)
    return new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, '');
}

async function handleCustomDetail(){
    const response = await fetch(`http://127.0.0.1:8000/custom_perfume/1`, {
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
        document.querySelector(".logo_image").src = `http://127.0.0.1:8000/${result.logo}`
        document.querySelector(".perfume_creator").innerText = result.creator_username
        document.querySelector(".perfume_title").innerText = result.title
        document.querySelector(".perfume_create").innerText = changeDateTimeFormat(result.created_at)
        document.querySelector(".note1").innerText = result.note01.kor_name
        document.querySelector(".note2").innerText = result.note02.kor_name
        document.querySelector(".note3").innerText = result.note03.kor_name
        document.querySelector(".note3").innerText = result.note03.kor_name
        document.querySelector(".pakage_name").innerText = result.package.name
        document.querySelector(".note_img1 img").src = result.note01.image
        document.querySelector(".note_img2 img").src = result.note02.image
        document.querySelector(".note_img3 img").src = result.note03.image
    }).catch(error => {
        console.error(error.message)
    })
};