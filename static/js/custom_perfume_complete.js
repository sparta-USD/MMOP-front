document.addEventListener("DOMContentLoaded", function () {
    handleCustomPerfume()
});

// url을 불러오는 함수
function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}

// 생성된 향수 띄우기
async function handleCustomPerfume() {
    url_param = getParams("custom_perfume");
    if (url_param == undefined){
        url_param = localStorage.getItem("custom_perfume");
    }
    const response = await fetch('http://3.39.240.251/custom_perfume/'+url_param+'/', {
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
        if (response_json['note01']!=null){
            document.getElementById("note01").innerHTML = '<div class="circle1"><img class="note" src="' + response_json['note01']['image'] + '"></div>'
        }else{
            document.getElementById("note01").innerHTML = '<div></div>'
        }
        
        if (response_json['note02']!=null){
            if (response_json['note01']!=null){
                document.getElementById("note02").innerHTML = '<div class="circle2"><img class="note" src="' + response_json['note02']['image'] + '"></div>'
            }
            if (response_json['note01']==null){
                document.getElementById("note02").innerHTML = '<div class="circle1"><img class="note" src="' + response_json['note02']['image'] + '"></div>'
            }
        }else{
            document.getElementById("note02").innerHTML = '<div></div>'
        }
        if (response_json['note03']!=null){
            if (response_json['note01']!=null && response_json['note02']!=null){
                document.getElementById("note03").innerHTML = '<div class="circle3"><img class="note" src="' + response_json['note03']['image'] + '"></div>'
            }
            if (response_json['note01']!=null && response_json['note02']==null){
                document.getElementById("note03").innerHTML = '<div class="circle2"><img class="note" src="' + response_json['note03']['image'] + '"></div>'
            }
            if (response_json['note01']==null && response_json['note02']!=null){
                document.getElementById("note03").innerHTML = '<div class="circle2"><img class="note" src="' + response_json['note03']['image'] + '"></div>'
            }
            if (response_json['note01']==null && response_json['note02']==null){
                document.getElementById("note03").innerHTML = '<div class="circle1"><img class="note" src="' + response_json['note03']['image'] + '"></div>'
            }
        }else{
            document.getElementById("note03").innerHTML = '<div></div>'
        }
        if (response_json['logo']!=null){
            document.getElementById("logo").innerHTML = '<img class="logo" aria-hidden="false" draggable="false" loading="lazy" src="http://3.39.240.251'+response_json['logo']+'">'
        }
        else{
            document.getElementById("logo").innerHTML = '<div></div>'
        }
        document.getElementById("name").innerText = response_json['title']
    })
}

// 완료 버튼
document.getElementById("complete_button").addEventListener("click", function () {
    location.href="/custom_perfume_detail.html?custom_perfume="+url_param
});