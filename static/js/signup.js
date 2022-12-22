document.addEventListener('DOMContentLoaded', function() {
    
});

async function handleSignup(){
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const phone_number = document.getElementById("phone_number").value;

    if(!email){
        alert("이메일 필드는 빈칸일 수 없습니다.");
        return false;
    }else if(!username){
        alert("닉네임 필드는 빈칸일 수 없습니다.");
        return false;
    }else if(!password){
        alert("비밀번호 필드는 빈칸일 수 없습니다.");
        return false;
    }else if(!password2){
        alert("비밀번호 확인 필드는 빈칸일 수 없습니다.");
        return false;
    }else if(!agree.checked){
        alert("약관 동의 체크는 필수입니다!");
        agree.focus();
        return false;
    }
    const loader = document.getElementById("page-loader")
    loader.className += 'show';
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
    loader.classList.remove('show');
    if(response.ok){
        alert("회원가입이 완료되었습니다.\n이메일 인증 메일이 발송되었습니다. 이메일 인증 후 로그인을 시도해주세요. \n‼️이메일이 도착하지 않았을 경우 스팸함을 확인해주세요")
        return location.href = "signin.html";
    }else{
        if(response_json.email){
            return alert(response_json.email)
        }else if(response_json.username){
            return alert(response_json.username)
        }else if(response_json.phone_number){
            return alert(response_json.phone_number)
        }else if(response_json.password){
            return alert(response_json.password)
        }else if(response_json.password2){
            return alert(response_json.password2)
        }
    }

};

const REST_API_KEY = "0240e7e88dd3a8d26072a3070fda2b02";
const REDIRECT_URI = "https://mmop-perfume.com/users/signin.html";

function kakaoSignin(){
    location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
};