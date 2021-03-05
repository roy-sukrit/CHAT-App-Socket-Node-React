import React, {useState,useEffect} from 'react'
// data from url
import queryString from 'query-string';
// client socket
import io from 'socket.io-client'
import './Chat.css'
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


//socket
let socket;



const Chat = ({location}) => {
    const [name, setName] = useState('')
    const [users, setUsers] = useState('');
    const [room, setRoom] = useState('')
    //everymsg
    const [message, setMessage] = useState('')
    //all msg
    const [messages, setMessages] = useState([])

    //enter your url
    const ENDPOINT = 'localhost:8000'
    

    useEffect(() => {
        //location object
        const {name,room} = queryString.parse(location.search)
        //getiing data from params 
        // console.log("name , room ",name,room)

        setName(name);
        setRoom(room);

        //socket connection
    
        socket = io(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']})
        socket.emit("join", {name,room}, ()=> {

        })
        // console.log("SOCKET",socket)
        //when you disconnect, unmout
         return () =>{
             socket.emit("disconnect")
             socket.off()
         }
    }, [ENDPOINT,location.search   ])


    //for handling messgaes 
    useEffect(() => {
        socket.on('message',(message)=>{
            setMessages([...messages,message])

        })
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });

    }, [messages])

   const sendMessage =(e) => {
       e.preventDefault()
       if(message){
           socket.emit('sendMessage',message,()=> setMessage(''))
       }
   }

   console.log(message,messages)



    return (
        
       
    <div className="outerContainer">
    <div className="container">
    {/*  <input value={message} onChange={(e) => setMessage(e.target.value)}
         onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
    />*/}
        <InfoBar room={room} />
        <Messages messages={messages} name={name}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
    </div>
    <TextContainer users={users} />

  </div>
    )
}

export default Chat
