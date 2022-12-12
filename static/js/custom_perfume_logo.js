document.addEventListener("DOMContentLoaded", function () {
    handlePackage()
});

async function handlePackage() {
    if(JSON.parse(sessionStorage.getItem("package"))==null){
        alert("용기를 선택하셔야 됩니다!")
        location.href="/custom_perfume_package.html"
    }
    else if(JSON.parse(sessionStorage.getItem("note01"))==null&&JSON.parse(sessionStorage.getItem("note02"))==null&&JSON.parse(sessionStorage.getItem("note03"))==null){
        alert("향을 선택하셔야 됩니다!")
        location.href="/custom_perfume_note.html"
    }
    else{
        const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
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
            document.getElementById("package").innerHTML = '<img class="package" id="package" aria-hidden="false" draggable="false" loading="lazy" src="'+response_json['packages'][JSON.parse(sessionStorage.getItem("package"))-1]['image']+'">'
            if(JSON.parse(sessionStorage.getItem("note01"))!=null){
                document.getElementById("note01").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note01"))-1]['image']+'">'
            }else{
                document.getElementById("note01").innerHTML = '<div></div>'
            }
            if(JSON.parse(sessionStorage.getItem("note02"))!=null){
                document.getElementById("note02").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note02"))-1]['image']+'">'
            }else{
                document.getElementById("note02").innerHTML = '<img>'
            }
            if(JSON.parse(sessionStorage.getItem("note03"))!=null){
                document.getElementById("note03").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note03"))-1]['image']+'">'
            }else{
                document.getElementById("note03").innerHTML = '<img>'
            }
        })
    }
    
}

function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
            const previewImage = document.getElementById("logo")
            previewImage.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
}
const inputImage = document.getElementById("input-file")
inputImage.addEventListener("change", e => {
  readImage(e.target)
})

async function handleCreateMmop() {

    const custom_perfume_formData = new FormData();

    const title = document.getElementById("title").value;
    const logo = document.getElementById("input-file").files[0];

    custom_perfume_formData.append("title", title);
    if (JSON.parse(sessionStorage.getItem("note01"))!=null){
        custom_perfume_formData.append("note01", JSON.parse(sessionStorage.getItem("note01")));
    }
    if (JSON.parse(sessionStorage.getItem("note02"))!=null){
        custom_perfume_formData.append("note02", JSON.parse(sessionStorage.getItem("note02")));
    }
    if (JSON.parse(sessionStorage.getItem("note03"))!=null){
        custom_perfume_formData.append("note03", JSON.parse(sessionStorage.getItem("note03")));
    }
    custom_perfume_formData.append("package", JSON.parse(sessionStorage.getItem("package")));
    custom_perfume_formData.append("logo", logo);

    if (title == "" || logo == "") {
        alert("빈칸을 채워주세요!")
    }
    else {
        const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/',{
            method: 'POST',
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("access"),
            },
            body: custom_perfume_formData,
        }).then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} 에러가 발생했습니다.`);
            }
            return response.json()
        }).then(result => {
            alert("향수 생성에 성공했습니다!")
            sessionStorage.clear()
            location.href="/custom_perfume_complete.html?custom_perfume="+result.id
        }).catch(error => {
            alert("향수 생성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
            console.warn(error.message);
        });
    }
}

document.getElementById("create_button").addEventListener("click", function () {
    handleCreateMmop();
});

