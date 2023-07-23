



let Room_ID = document.getElementById('roomID').value
console.log(Room_ID)
let removeChoice = document.getElementById('selectChoice')
removeChoice.style.display = 'none'

let username = document.getElementById('name').value
let url = `ws://${window.location.host}/ws/socket-server/${Room_ID}/`
console.log("hello")
const XoSocket =  new WebSocket(url)
XoSocket.onerror = function(errorEvent){
    console.log("error")
    window.location.href = `/room/${username}`
}
let keyX = document.getElementById('Xkey')
let keyY = document.getElementById('Ykey')
let widget = ''

let beginMatch = false
let yourTurn = false
let win=false
let myKey = ''

let box1=document.getElementById('box1')
let box2=document.getElementById('box2')
let box3=document.getElementById('box3')
let box4=document.getElementById('box4')
let box5=document.getElementById('box5')
let box6=document.getElementById('box6')
let box7=document.getElementById('box7')
let box8=document.getElementById('box8')
let box9=document.getElementById('box9')

let boxList = [[box1 ,box2,box3] , [box4 ,box5 ,box6] ,[box7 ,box8 ,box9]]
let WinIndexes = []
XoSocket.onmessage = function(e){
    let data = JSON.parse(e.data)
    console.log(data)
    if(data.type == "connection_failed"){
        let Url = `/room/${username}`
        window.location.href = Url
        console.log("Room is been full or other errors")
    }else if(data.type == 'connnection_established'){
        console.log("DATA:   " ,data)
    }else if(data.type == 'playerKey'){
        let msg = data.message
        console.log(data)
        console.log(username)
        if(username != data.userName){
            if(data.key == 'X'){
                myKey = 'O'
                widget = `
                    <h2>${username} Chose O</h2>
                `
            }else{
                myKey ='X'
                widget = `
                <h2>${username} Chose X</h2>
                `
            }
        }else{
            myKey = data.key
            widget = `
                <h2>${msg}</h2>
            `
            yourTurn=true
        }
        removeChoice.style.display = 'none'
        document.getElementById('roles').innerHTML = widget
        beginMatch=true
    }else if(data.type == 'enableChoice'){
        removeChoice.style.display = 'block'

    }else if(data.type == 'keyMove'){
        console.log("KEY MOVES DATA:    "+data)
        if(data.user != username){
            yourTurn=true
            document.getElementById('whoseTurn').innerHTML = 'Your Turn'
        }else{
            document.getElementById('whoseTurn').innerHTML = 'Opponents Turn'
            yourTurn=false
        }
        document.getElementById(`${data.boxno}`).innerHTML = `${data.myKey}`
        checkWinStatus()
    }else if(data.type == 'WinStatus'){
        console.log(data)
        let index = data.win_index
        if(data.user != username){
            boxList[index[0][0]][index[0][1]].style.backgroundColor = 'red'
            boxList[index[1][0]][index[1][1]].style.backgroundColor = 'red'
            boxList[index[2][0]][index[2][1]].style.backgroundColor = 'red'    

            // boxList[index[0][0]][index[0][1]].innerHTML = ''
            // boxList[index[1][0]][index[1][1]].innerHTML = ''
            // boxList[index[2][0]][index[2][1]].innerHTML = ''  
        }else{
            boxList[index[0][0]][index[0][1]].style.backgroundColor = 'green'
            boxList[index[1][0]][index[1][1]].style.backgroundColor = 'green'
            boxList[index[2][0]][index[2][1]].style.backgroundColor = 'green'

            // boxList[index[0][0]][index[0][1]].innerHTML = ''
            // boxList[index[1][0]][index[1][1]].innerHTML = ''
            // boxList[index[2][0]][index[2][1]].innerHTML = ''
        }
        document.getElementById('winmsg').innerHTML = ''
        beginMatch=false

    }else if(data.type == 'replay'){
        // if(data.user!=username){
        //     yourTurn=false
        // }else{
        //     yourTurn=true
        // }
        for(let i = 0;i<boxList.length ; i++){
            for(let j = 0;j<3;j++){
                boxList[i][j].style.backgroundColor = 'rgb(228, 228, 228)'
                boxList[i][j].innerHTML = ''
            }
        }
        document.getElementById('winmsg').innerHTML =`${user} WIN`

        WinIndexes.length = 0
        beginMatch=true

    }
}



keyX.addEventListener('click' ,function(event){
    console.log("X")
    keyChoose(event ,'X')
})

keyY.addEventListener('click' ,function(event){
    keyChoose(event ,'O')
})

function keyChoose(event ,key){
    let keyChosen = {
        'type':'decide',
        'Key':key,
        'user':username,
    }
    XoSocket.send(JSON.stringify(keyChosen))
}


box1.addEventListener('click' ,()=>{
    keyPressed('box1')
})
box2.addEventListener('click' ,()=>{
    keyPressed('box2')
})
box3.addEventListener('click' ,()=>{
    keyPressed('box3')
})
box4.addEventListener('click' ,()=>{
    keyPressed('box4')
})
box5.addEventListener('click' ,()=>{
    keyPressed('box5')
})
box6.addEventListener('click' ,()=>{
    keyPressed('box6')
})
box7.addEventListener('click' ,()=>{
    keyPressed('box7')
})
box8.addEventListener('click' ,()=>{
    keyPressed('box8')
})
box9.addEventListener('click' ,()=>{
    keyPressed('box9')
})
// let horiTrue=false
// let veriTrue=false
function checkWinStatus(){
    horizontal()
    if(!win){
        vertical()
    }
    if(!win){
        LRDiagonal()
    }
    if(!win){
        RLDiagonal()
    }
    if(win){
        // send win status to server
        let WinMsg = {
            'type':'win',
            'user':username,
            'indexes':WinIndexes,
        }
        console.log(WinMsg)
        XoSocket.send(JSON.stringify(WinMsg))
    }
}
// LR diagonal
function LRDiagonal(){
    if(box1.innerText == myKey && box5.innerText == myKey && box9.innerText == myKey){
        console.log(`${username} WINS`)
        win=true
        WinIndexes = [[0,0] ,[1 ,1] ,[2,2]]
    }
}

function RLDiagonal(){
    if(box3.innerText == myKey && box5.innerText == myKey && box7.innerText == myKey){
        console.log(`${username} WINS`)
        win=true
        WinIndexes = [[0,2] ,[1,1],[2,0]]
    }
}

function horizontal(){
    let horiCount = 0
    // FIRST ROW
    WinIndexes.length = 0
    for(let i = 0;i<3;i++){
        horiCount = 0
        for(let j = 0;j<3;j++){
            if(boxList[i][j].innerHTML == myKey){
                WinIndexes.push([i ,j])
                horiCount += 1
            }
        }
        if(horiCount>=3){
            win=true
            
            console.log(`${username} WINS`)
            for(let k = 0;k<3;k++){
                // make Green BOXES
            }
            break
        }else{
            WinIndexes.length = 0
            horiCount=0
        }
    }
    console.log(WinIndexes)
}
function vertical(){
    let veriCount = 0
    // FIRST ROW
    WinIndexes.length = 0
    for(let i = 0;i<3;i++){
        veriCount = 0
        for(let j = 0;j<3;j++){
            if(boxList[j][i].innerHTML == myKey){
                WinIndexes.push([j ,i])
                veriCount += 1
            }
        }
        if(veriCount>=3){
            win=true
            console.log(`${username} WINS`)
            for(let k = 0;k<3;k++){
                // make Green BOXES
            }
            break
        }else{
            WinIndexes.length = 0
            veriCount=0
        }
    }
}
let replayButtonTag =  document.getElementById('replay')
replayButtonTag.addEventListener('click' ,()=>{
    replayButton()
})
function replayButton(){
    win=false
    // yourTurn=false
    let replayMessage = {
        'type':'replay',
        'user':username ,
    }
    XoSocket.send(JSON.stringify(replayMessage))

    
}

function keyPressed(keyID){
    if(beginMatch){
        if(yourTurn){
            console.log(keyID)
            let msgtoSent = {
                'type':'game',
                'boxNo':keyID,
                'myKey':myKey,
                'user':username,
                
            }
            // document.getElementById(keyID).innerText = myKey
            XoSocket.send(JSON.stringify(msgtoSent))
            yourTurn=false
        }

    }
}
