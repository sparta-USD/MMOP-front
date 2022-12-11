document.addEventListener("DOMContentLoaded", function () {
    handlePackage()
});

async function handlePackage() {
    const response = await fetch('http://127.0.0.1:8000/custom_perfume/custom/', {
        method: 'GET',
        headers: {
        },
    }).then(response => {
        return response.json()
    }).then(result => {
        const response_json = result;
        document.getElementById("package").innerHTML = '<img class="package" id="package" aria-hidden="false" draggable="false" loading="lazy" src="'+response_json['packages'][JSON.parse(sessionStorage.getItem("package_"))-1]['image']+'">'
    })
}

var formData = new FormData();

function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
            const previewImage = document.getElementById("logo")
            previewImage.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
        formData.append("logo", input.files[0])
        sessionStorage.setItem("formData", JSON.stringify(formData));
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        console.log(input.files[0])
        console.log(formData)
        // sessionStorage.setItem("formData", new Blob([ JSON.stringify(logo) ], {type : "application/json"}));
    }
}
const inputImage = document.getElementById("input-file")
inputImage.addEventListener("change", e => {
  readImage(e.target)
})

function handleNext(){
    location.href="/custom_perfume_name.html"
}
