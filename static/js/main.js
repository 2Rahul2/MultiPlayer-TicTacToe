function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

let username = ''
function sendName(){
    let url = '/'
    fetch(url ,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({
            'name':username,
        })
    }).then(Response=>Response.json()).then(data=>{
        console.log("redirecting")
        window.location.href = `room/${username}`
    })
}

console.log("working")
let subBtn = document.getElementById('subB')
subBtn.addEventListener('click' ,clickedbtn)
function clickedbtn(){
    username = document.getElementById('name').value
    sendName()
    // if(username != ''){
    //     let Url = `/room/${username}`
    //     console.log("clicked  " + Url)
    //     window.location.href = Url
    // }else{
    //     alert('enter your username')
    // }
}