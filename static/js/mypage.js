document.addEventListener("DOMContentLoaded", function () {
    handleMock()
});

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