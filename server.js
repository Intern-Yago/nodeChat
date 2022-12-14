const express = require('express')
const path = require('path')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "https://node-chat-six.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true
  })

var messages = []
let conectados = 0

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/public'))
app.engine('html', require('ejs').renderFile)
app.set("view engine", 'html')

app.get('/', (req,res)=> res.sendFile(__dirname+"/public/home.html"))

io.on('connection', socket=>{
    socket.emit('previousMessages', messages)
    conectados = conectados + 1
    socket.on('sendMessage', data =>{
        messages.push(data)
        socket.broadcast.emit('receiveMessage', data)
    })

    socket.on('disconnect', function(){
        conectados = conectados - 1
        if(conectados === 0)
            messages = []
        
      })
})


server.listen(process.env.PORT || 3000, ()=>{
    console.log("Servidor rodando!\nVisit: http://localhost:3000\n")
})
