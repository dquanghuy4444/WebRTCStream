var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.set("views", "./views");

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3000);

const arrUser = [];
io.on("connection" , (socket) =>{
    console.log(socket.id);


    socket.on('client-send-signup' , (data) =>{
        const isExist = arrUser.some(user => user.name === data.name);
        if(isExist){
            socket.emit('server-send-regfail');
        } else{
            socket.peerId = data.id;
            arrUser.push(data);
            socket.emit("server-send-listusers" , arrUser);
            socket.broadcast.emit("server-send-newuser" , data);
        }
    })

    socket.on("disconnect" , () =>{
        const idx = arrUser.fill(user => user.id === socket.peerId);
        arrUser.splice(idx,1);
        io.emit("server-send-removeuser" , socket.peerId);
    })
})
app.get("/", (req, res) => {
    res.render("index");
})