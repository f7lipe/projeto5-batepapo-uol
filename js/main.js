//** tipos de mensagem **//
const STATUS_MESSAGE = "status"
const PUBLIC_MESSAGE = "message"
const PRIVATE_MESSAGE = "private_message"

const API_REPO = "https://mock-api.driven.com.br/api/v4/uol/messages"

let VISIBILITY = 'public' 
let CURRENT_USER = null
let RECIPIENT = null

function loadAPIContent(){
const content = axios.get(API_REPO)
content.then(filterMessages)
content.then(renderContacts)
}

function filterMessages(messages){
    const messageData = messages.data
    let messageType = null
    let messageBody = null
    let filtered = []

    messageData.forEach(message => {
        const isStatusMessage = message.type === STATUS_MESSAGE
        const isPublicMessage = message.type === PUBLIC_MESSAGE
        const isPrivateMesssage = message.type === PRIVATE_MESSAGE

        if(isStatusMessage){
            messageType = STATUS_MESSAGE
            messageBody = `${message.text}`
        } 
        if(isPublicMessage){
            messageType = PUBLIC_MESSAGE 
            messageBody = `para <b>${message.to}</b>: ${message.text} `
        }
        if(isPrivateMesssage & message.from === RECIPIENT){
            messageType = PRIVATE_MESSAGE
            messageBody = `reservadamente para <b>${message.to}</b>: ${message.text} `
        }
        const filteredMessage = `
            <div class="message ${messageType}">
                <span class="time">(${message.time})</span>
                <p class="message-content"> <b>${message.from}</b> ${messageBody}</p>
            </div>`

        filtered.push(filteredMessage)

    });
    renderMessages(filtered)
}

function renderMessages(messages){
    messages.forEach(message =>
        document.querySelector('.messages').innerHTML += message)
}

function renderContacts(contacts){
    const data = contacts.data
    data.forEach(contact => {
        const newContact =  `    
        <div class="setting">
        <ion-icon name="person-circle-outline"></ion-icon>
                <span>${contact.from}</span>
        </div>`
        document.querySelector('.setting').innerHTML += newContact
    });
}


loadAPIContent()