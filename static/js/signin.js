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
            throw new Error(`${response.status} 에러가 발생했습니다.`)
        }
        return response.json()
    }).then(result => {
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
        alert("로그인에 실패하였습니다. 이메일과 비밀번호를 확인해주세요.")
    })
};