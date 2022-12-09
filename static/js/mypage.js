window.addEventListener('scroll', function() {
    const scrollY = this.window.pageYOffset;
    var scrolled = scrollY >= 10; //스크롤된 상태; true or false
    document.querySelector("header").classList.toggle('header_sticky', scrolled);
});
// profile tab jquery
$('.tab_item').on("click",function(e){
    let target_content_id = $(this).find("a").attr("href").replace("#","#tab_");
    $(".tab_item").removeClass('active');
    $(this).addClass("active");
    $(".tab_content").removeClass("active");
    $(target_content_id).addClass("active");
})

$(".none_link").on("click",function(e){
    e.preventDefault();
});


document.addEventListener("DOMContentLoaded", function () {
    tab_change(getURL())
    handleMock()
});
// * url을 불러오는 함수 *
function getURL(){
    const url = window.location.href
    const get_url = url.split('#')[1]
    return get_url;
}
function tab_change(get_url){
    if(["my_perfume","my_review","like_perfume","profile_edit"].includes(get_url)){
        console.log(get_url)
        $(".tab_item").removeClass('active');
        $("#tab_menu_"+get_url).addClass("active");
        $(".tab_content").removeClass("active");
        $("#"+get_url).addClass("active");
    }else{
        $(".tab_item:first-child").addClass("active");
        $(".tab_content:first-child").addClass("active");
    }
}

async function handleMock() {
    const response = await fetch('http://127.0.0.1:8000/users/', {
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method: 'GET',
    }).then(response => {
        if(!response.ok){
            if(response.status==401){
                alert("로그인 유저만 접근 가능합니다.")
                location.href="/signin.html";
            }
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
        const response_json = result;
        console.log(response_json)

        document.getElementById("profile_phone_number").value = response_json['phone_number']
        document.getElementById("profile_username").value = response_json['username']
        document.getElementById("profile_email").value = response_json['email']
    
    }).catch(error => {
        console.warn(error.message)
    });
}
document.getElementById("btn_update_profile").addEventListener("click",function(){
    handleUpdateProfile(); 
});
async function handleUpdateProfile() {
    const username = document.getElementById("profile_username").value;
    console.log(username)
    const phone_number = document.getElementById("profile_phone_number").value;

    const profile_formData = new FormData();
    profile_formData.append("username",username);
    profile_formData.append("phone_number",phone_number);

    const response = await fetch('http://127.0.0.1:8000/users/',{
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("access"),
        },
        method:'PUT',
        body: profile_formData,
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`${response.status} 에러가 발생했습니다.`);    
        }
        return response.json()
    }).then(result => {
            alert("수정에 성공했습니다!")
    }).catch(error => {
        alert("수정에 실패하였습니다. \n 자세한 내용은 관리자에게 문의해주세요!");
        console.warn(error.message);
    });
}