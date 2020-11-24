const socket = io('https://powebrtcstream.herokuapp.com');

socket.on("server-send-listusers" , (listusers) =>{
    $("#videocall").show();
    $("#right").show();
    $('#ulUser').html("");
    listusers.forEach(user =>{
        $('#ulUser').append(`<li id=${user.id}>${user.name}</li>`);
    })

    socket.on("server-send-newuser" , newuser =>{
        $('#ulUser').append(`<li id=${newuser.id}>${newuser.name}</li>`);
    });

    socket.on("server-send-removeuser" , id =>{
        $(`#${id}`).remove();
    });
})

socket.on("server-send-regfail" , () =>{
    alert("Username has exist");
});

$(document).ready(() =>{
    // $("#btn_call").click(() =>{
    //     const remoteid = $("#remoteid").val();
    //     if(remoteid !== ""){
    //         openStream()
    //         .then(stream =>{
    //             playStream('localStream' , stream);
    //             const callevent = peer.call(remoteid , stream);
    //             callevent.on("stream" , remoteStream => playStream("remoteStream" , remoteStream));
    //         })
    //     }
    // })

    $("#btn_signup").click(() =>{
        const username = $("#txt_username").val();
        if(username !== ""){
            socket.emit('client-send-signup' , {id:peer.id,name:username});
        }
    })

    $("#ulUser").on('click' , 'li' , function(){
        const remoteid = $(this).attr("id");

        openStream()
        .then(stream =>{
            playStream('localStream' , stream);
            const callevent = peer.call(remoteid , stream);
            callevent.on("stream" , remoteStream => playStream("remoteStream" , remoteStream));
        })
    })
})


const openStream = () =>{
    const config = { audio : false , video : true};
    return navigator.mediaDevices.getUserMedia(config);
}

const playStream= (idVideoTag , stream) =>{
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

var peer = new Peer({key : 'peerjs' , host : 'powebrtcstream.herokuapp.com' , secure : true , port : 443});

peer.on('open' , id => {
    $("#yourid").append(id);
});

peer.on('call' , call =>{
    openStream()
    .then(stream =>{
        call.answer(stream);
        playStream('localStream' , stream);
        call.on('stream' , remoteStream => playStream('remoteStream' , remoteStream));
    })
})

