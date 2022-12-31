const express = require('express')
const path = require('path')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

var messages = []
let conectados = 0

app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set("view engine", 'html')

app.use(express.static(path.join(__dirname, ' public')))
app.use('/', (req,res)=> res.render('index.html'))

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
