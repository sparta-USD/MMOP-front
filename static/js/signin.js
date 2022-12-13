async function handleSignin(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password){
        return alert("이메일 또는 비밀번호가 비어있습니다.")
    }

    const response = await fetch("http://127.0.0.1:8000/users/signin/", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    }).then(response => {
        if(!response.ok){
            return response.json().then(res => {
                alert(res.detail)
                throw new Error(`${response.status}에러 발생했습니다.`)
            })
        }
        return response.json()
    }).then(result => {
        localStorage.setItem("refresh", result.refresh);
        localStorage.setItem("access", result.access);

        const base64Url = result.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
        localStorage.setItem("payload", jsonPayload);
        localStorage.setItem("email", JSON.parse(jsonPayload).email);
        localStorage.setItem("username", JSON.parse(jsonPayload).username);
        localStorage.setItem("user_id", JSON.parse(jsonPayload).user_id);

        alert("로그인 되었습니다!");
        location.href = "/";
    }).catch(error => {
        console.warn(error.message)
    })
};

const REST_API_KEY = "0240e7e88dd3a8d26072a3070fda2b02";
const REDIRECT_URI = "http://127.0.0.1:5500/users/signin.html";

function kakaoSignin(){
    location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
};

window.onload = async () => {
    let params = new URL(window.location.href).searchParams;
    // 인가코드 받아왔을 때
    if(params.has("code")){
        const response = await fetch("http://127.0.0.1:8000/users/oauth/callback/kakao/", {
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "code":params.get("code"),
            })
        }).then(response => {
            // 카카오 access토큰 요청/유저정보 요청 중에 에러발생시
            if(!response.ok){
                return response.json().then(error_json => {throw new Error(`${error_json.error_code} 에러 발생했습니다.`)})
            }
            return response.json()
        }).then(result => {
            localStorage.setItem("refresh", result.refresh);
            localStorage.setItem("access", result.access);
    
            const base64Url = result.access.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(""));
            localStorage.setItem("payload", jsonPayload);
            localStorage.setItem("email", JSON.parse(jsonPayload).email);
            localStorage.setItem("username", JSON.parse(jsonPayload).username);
            localStorage.setItem("user_id", JSON.parse(jsonPayload).user_id);
            
            alert("로그인 되었습니다!");
            location.href = "/";
        }).catch(error => {
            console.error(error.message+" 운영자에게 문의해주세요.")
        })
        // 인가코드 요청시 오류발생 했을 때
    }else if(params.has("error")){
        let error_code = params.get("error");
        alert("카카오 로그인에 실패했습니다.")
        console.error(`에러코드: ${error_code} 운영자에게 문의해주세요.`)
    }
};