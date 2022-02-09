//** tipos de mensagem **//
const STATUS_MESSAGE = "status"
const PUBLIC_MESSAGE = "message"
const PRIVATE_MESSAGE = "private_message"

const MESSAGES_REPO = "https://mock-api.driven.com.br/api/v4/uol/messages"


function loadMessages(){
const messages = axios.get(MESSAGES_REPO)
messages.then(filterMessage)
}

function filterMessage(message){
    const messageData = message.data
    let messageType = null
    let filtered = []

    messageData.forEach(message => {
        if(message.type === STATUS_MESSAGE){
            messageType = STATUS_MESSAGE
        } 
        if(message.type === PUBLIC_MESSAGE){
            messageType = PUBLIC_MESSAGE 
        }
        if(message.type === PRIVATE_MESSAGE){
            messageType = PRIVATE_MESSAGE
        }
        const filteredMessage = `
            <div class="message ${messageType}">
                <span class="time">(${message.time})</span>
                <p class="message-content"> <b>${message.from}</b> ${message.text}</p>
            </div>`

        filtered.push(filteredMessage)

    });
    renderMessages(filtered)
}

function renderMessages(messages){
    messages.forEach(message =>
        document.querySelector('.messages').innerHTML += message)
}

loadMessages()