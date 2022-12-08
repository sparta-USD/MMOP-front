document.addEventListener('DOMContentLoaded', function() {
    
});

async function handleSignup(){
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const phone_number = document.getElementById("phone_number").value;
    const response = await fetch("http://127.0.0.1:8000/users/signup/", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password": password,
            "password2": password2,
            "phone_number": phone_number,
        })
    });
    let response_json = await response.json();
    if(response.ok){
        alert("회원가입이 완료되었습니다.");
        alert("이메일이 발송되었습니다. 확인해주세요!")
        return location.href = "signin.html";
    }else{
        if(response_json.email){
            return alert(response_json.email)
        }else if(response_json.username){
            return alert(response_json.username)
        }else if(response_json.phone_number){
            return alert(response_json.phone_number.message)
        }else if(response_json.password){
            return alert(response_json.password.message)
        }else if(response_json.password2){
            return alert(response_json.password2)
        }
    }
};