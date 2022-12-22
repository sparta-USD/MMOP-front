document.addEventListener("DOMContentLoaded", function () {
    handlePackage()
});

// 선택한 향, 용기 띄우기
async function handlePackage() {
    if(JSON.parse(sessionStorage.getItem("note01"))==null&&JSON.parse(sessionStorage.getItem("note02"))==null&&JSON.parse(sessionStorage.getItem("note03"))==null){
        alert("향을 선택하셔야 됩니다!")
        location.href="/custom_perfume_note.html"
    }else if(JSON.parse(sessionStorage.getItem("package"))==null){
        alert("용기를 선택하셔야 됩니다!")
        location.href="/custom_perfume_package.html"
    }else{
        const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/', {
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

            // 용기 이미지
            $.each(response_json['packages'],function(idx,row){
                if(response_json['packages'][idx].id==JSON.parse(sessionStorage.getItem("package"))){
                    package_pick = response_json['packages'][idx]['image']
                }
            })

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

            document.getElementById("package").innerHTML = '<img class="package" id="package" aria-hidden="false" draggable="false" loading="lazy" src="' + package_pick + '">'
            
            if(JSON.parse(sessionStorage.getItem("note01"))!=null){
                document.getElementById("note01").innerHTML = '<div class="circle1"><img class="note" src="' + note01_pick + '"></div>'
            }else{
                document.getElementById("note01").innerHTML = '<div></div>'
            }

            if(JSON.parse(sessionStorage.getItem("note02"))!=null){
                if (JSON.parse(sessionStorage.getItem("note01"))!=null){
                    document.getElementById("note02").innerHTML = '<div class="circle2"><img class="note" src="' + note02_pick + '"></div>'
                }
                if (JSON.parse(sessionStorage.getItem("note01"))==null){
                    document.getElementById("note02").innerHTML = '<div class="circle1"><img class="note" src="' + note02_pick + '"></div>'
                }
            }else{
                document.getElementById("note02").innerHTML = '<div></div>'
            }
            if(JSON.parse(sessionStorage.getItem("note03"))!=null){
                if (JSON.parse(sessionStorage.getItem("note01"))!=null && JSON.parse(sessionStorage.getItem("note02"))!=null){
                    document.getElementById("note03").innerHTML = '<div class="circle3"><img class="note" src="' + note03_pick + '"></div>'
                }
                if (JSON.parse(sessionStorage.getItem("note01"))!=null && JSON.parse(sessionStorage.getItem("note02"))==null){
                    document.getElementById("note03").innerHTML = '<div class="circle2"><img class="note" src="' + note03_pick + '"></div>'
                }
                if (JSON.parse(sessionStorage.getItem("note01"))==null && JSON.parse(sessionStorage.getItem("note02"))!=null){
                    document.getElementById("note03").innerHTML = '<div class="circle2"><img class="note" src="' + note03_pick + '"></div>'
                }
                if (JSON.parse(sessionStorage.getItem("note01"))==null && JSON.parse(sessionStorage.getItem("note02"))==null){
                    document.getElementById("note03").innerHTML = '<div class="circle1"><img class="note" src="' + note03_pick + '"></div>'
                }
            }else{
                document.getElementById("note03").innerHTML = '<div></div>'
            }
        })
    }
    
}

// 로고 미리보기
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

// 향수 제작 하기
async function handleCreateMmop() {

    const custom_perfume_formData = new FormData();
    const custom_perfume_json = new Object();

    const title = document.getElementById("title").value;
    const logo = document.getElementById("input-file").files[0];

    // 로고가 있을때
    if(logo!=undefined){
        if (JSON.parse(sessionStorage.getItem("note01"))!=null){
            custom_perfume_formData.append("note01", JSON.parse(sessionStorage.getItem("note01")));
        }
        if (JSON.parse(sessionStorage.getItem("note02"))!=null){
            custom_perfume_formData.append("note02", JSON.parse(sessionStorage.getItem("note02")));
        }
        if (JSON.parse(sessionStorage.getItem("note03"))!=null){
            custom_perfume_formData.append("note03", JSON.parse(sessionStorage.getItem("note03")));
        }
        custom_perfume_formData.append("title", title);
        custom_perfume_formData.append("package", JSON.parse(sessionStorage.getItem("package")));
        custom_perfume_formData.append("logo", logo);
    }

    // 로고가 없을때 
    else{
        if (JSON.parse(sessionStorage.getItem("note01"))!=null){
            custom_perfume_json.note01=JSON.parse(sessionStorage.getItem("note01"));
        }
        if (JSON.parse(sessionStorage.getItem("note02"))!=null){
            custom_perfume_json.note02=JSON.parse(sessionStorage.getItem("note02"));
        }
        if (JSON.parse(sessionStorage.getItem("note03"))!=null){
            custom_perfume_json.note03=JSON.parse(sessionStorage.getItem("note03"));
        }
        custom_perfume_json.title=title;
        custom_perfume_json.package=JSON.parse(sessionStorage.getItem("package"));
    }

    if (title == "") {
        alert("빈칸을 채워주세요!")
    }

    // 로고가 있을때 POST (FormData 형태)
    else if(logo!=undefined){
        const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/',{
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

    // 로고가 없을때 POST (JSON 형태)
    else {        
        const response = await fetch('https://api.mmop-perfume.com/custom_perfume/custom/',{
            method: 'POST',
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("access"),
                "content-type": "application/json",
            },
            body: JSON.stringify(custom_perfume_json),
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

// 향수 제작하기 버튼
document.getElementById("create_button").addEventListener("click", function () {
    handleCreateMmop();
});

