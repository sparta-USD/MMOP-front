document.addEventListener("DOMContentLoaded", function () {
    handleCustomPerfume()
});

document.getElementById("complete_button").addEventListener("click", function () {
    location.href="/custom_perfume.html?custom_perfume="+url_param
});

function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

async function handleCustomPerfume() {
    url_param = getParams("custom_perfume");
    if (url_param == undefined){
        url_param = localStorage.getItem("custom_perfume");
    }
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/'+url_param+'/', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
        },
    }).then(response => {
        if (!response.ok) {
            if (response.status == 401) {
                alert("로그인 유저만 접근 가능합니다.")
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("package").innerHTML = '<img class="package" aria-hidden="false" draggable="false" loading="lazy" src="' + response_json['package']['image'] + '">'
        document.getElementById("note01").innerHTML = '<img class="note" src="' + response_json['note01']['image'] + '">'
        document.getElementById("note02").innerHTML = '<img class="note" src="' + response_json['note02']['image'] + '">'
        document.getElementById("note03").innerHTML = '<img class="note" src="' + response_json['note03']['image'] + '">'
        document.getElementById("logo").innerHTML = '<img class="logo"aria-hidden="false" draggable="false" loading="lazy" src="http://127.0.0.1:8000'+response_json['logo']+'">'
        document.getElementById("name").innerText = response_json['title']
    })
}
