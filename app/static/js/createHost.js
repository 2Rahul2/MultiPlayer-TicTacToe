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


let hostBtn = document.getElementById('host')
let url = ''
let CodeUrl = ''
hostBtn.addEventListener('click' ,createRoom)
let roomList = document.getElementById("appendRoom")
function getCodes(){
    CodeUrl = `http://127.0.0.1:8000/room-list/`
    fetch(CodeUrl ,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
    }).then((Response)=>
    Response.json()
    ).then((data)=>{
        for(let i = 0;i<data.length;i++){
            roomList.innerHTML +=`
            <p>Code ${data[i].roomCode} | Users: ${data[i].usersConnected}<a href='/game/${data[i].roomCode}' style="margin-left: 2rem;">Join</a></p>
            `
        }
        console.log("Length :  "+data.length)
    })
}
getCodes()

function createRoom(){
    console.log("creating")
    url = `http://127.0.0.1:8000/create-room/`
    fetch(url ,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
       
    }).then((Response)=>
        Response.json()
        ).then((RoomData)=>{
            console.log(RoomData)
            appendRoomId(RoomData)
    })
}

function appendRoomId(RoomData){
    console.log(RoomData)
    roomList.innerHTML += `
    <p>${RoomData.roomCode}<button style="margin-left: 2rem;">Join</button></p>
    `
}