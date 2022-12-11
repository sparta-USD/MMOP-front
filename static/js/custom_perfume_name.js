document.addEventListener("DOMContentLoaded", function () {
    handleCustomPerfume()
});

document.getElementById("create_button").addEventListener("click", function () {
    handleCreateUnft();
});

async function handleCustomPerfume() {
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
        method: 'GET',
        headers: {
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("package").innerHTML = '<img class="package" id="package" aria-hidden="false" draggable="false" loading="lazy" src="'+response_json['packages'][JSON.parse(sessionStorage.getItem("package_"))-1]['image']+'">'
        document.getElementById("note01").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note01"))-1]['image']+'">'
        document.getElementById("note02").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note02"))-1]['image']+'">'
        document.getElementById("note03").innerHTML = '<img class="note" src="'+response_json['notes'][JSON.parse(sessionStorage.getItem("note03"))-1]['image']+'">'
    })
}

async function handleCreateUnft() {

    const custom_perfume_formData = new FormData();

    const title = document.getElementById("title").value;

    custom_perfume_formData.append("title", title);
    custom_perfume_formData.append("note01_id", JSON.parse(sessionStorage.getItem("note01")));
    custom_perfume_formData.append("note02_id", JSON.parse(sessionStorage.getItem("note02")));
    custom_perfume_formData.append("note03_id", JSON.parse(sessionStorage.getItem("note03")));
    custom_perfume_formData.append("package_id", JSON.parse(sessionStorage.getItem("package_")));
    custom_perfume_formData.append("logo", JSON.parse(sessionStorage.getItem("formData")));
    console.log(title)
    console.log(JSON.parse(sessionStorage.getItem("package_")))
    if (title == "") {
        alert("빈칸을 채워주세요!")
    }
    else {
        const loader = document.getElementById("page-loader")
        loader.className += 'show';
        const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
            method: 'POST',
            headers: {
                // "Authorization":"Bearer " + localStorage.getItem("access"),
            },
            body: custom_perfume_formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} 에러가 발생했습니다.`);
                }
                return response.json()
            })
            .then(result => {
                alert("U-NFT 생성에 성공했습니다!")
                location.href = "/unft.html?unft=" + result["id"];
            })
            .catch(error => {
                alert("U-NFT 생성에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
                console.warn(error.message);
                loader.classList.remove('show');
            });
    }
}