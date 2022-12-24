document.addEventListener("DOMContentLoaded", function () {
    handleEmailValid()
    
});

function getParams(params){
    const url = window.location.href
    const urlParams = new URL(url).searchParams;
    const get_urlParams = urlParams.get(params);
    return get_urlParams;
}
async function handleEmailValid(){
    let url_uidb64 = getParams("uidb64");
    let url_token = getParams("token");

    const response = await fetch('https://api.mmop-perfume.com/users/activate/'+ url_uidb64 +'/'+url_token,{
        headers: {
            "content-type": "application/json",
        },
        method:'GET',

    }).then(response => {
        return response.json()

    }).then(result => {
        const response_json = result;
        document.getElementById("email_title").innerText = '이메일 인증 완료!';
        document.getElementById("txt_1").innerText = '이메일이 인증되었습니다';
        document.getElementById("txt_2").innerText = '로그인을 진행해주세요';

    }).catch(error => {
        document.getElementById("email_title").innerText = '만료된 토큰!';
        document.getElementById("txt_1").innerText = '이미 인증을 완료했습니다!';
        document.getElementById("txt_2").innerText = '로그인을 진행해주세요';
    });
}