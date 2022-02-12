//** tipos de mensagem **//
const STATUS_MESSAGE = "status"
const PUBLIC_MESSAGE = "message"
const PRIVATE_MESSAGE = "private_message"

const MESSAGES_REPO = "https://mock-api.driven.com.br/api/v4/uol/messages"
const CLIENTS_REPO = "https://mock-api.driven.com.br/api/v4/uol/participants"

let VISIBILITY = 'public' 
let CURRENT_USER = null
let RECIPIENT = null

function loadMessages(){
const content = axios.get(MESSAGES_REPO)
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
        if(isPrivateMesssage && message.from === RECIPIENT){
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
        <div class="setting contact" onClick="selectOnSidebar(this)">
        <ion-icon name="person-circle-outline"></ion-icon>
                <span>${contact.from}</span>
        </div>`
        document.querySelector('.setting').innerHTML += newContact
    });
}

/*
function selectContact(div){
    const span = div.getElementsByTagName("span")
    const contactName = span[0].innerText
    RECIPIENT = contactName
}
*/

function selectOnSidebar(div){
    const isContact = div.classList.contains('contact')
    const isVisibility = div.classList.contains('visibility')
    const span = div.getElementsByTagName("span")

    if (isContact){
        const contactName = span[0].innerText
        RECIPIENT = contactName
    }
    if (isVisibility){
        const visibility = span[0].innerText
        VISIBILITY = visibility
    }
}

function askUserName(){
    return prompt('Qual seu lindo nome?')
}

function verifyUserName(name){
    const user = {name: name()}
    const promise = axios.post(CLIENTS_REPO, user)
    promise.then(() =>{
        CURRENT_USER = user.name
        loadMessages()
        console.log(CURRENT_USER)
    })
    promise.catch(handleError)
}

function handleError(error){
    const errorCode = error.response.status;
    if (errorCode === 400){
        alert('Esse nome já está em uso. Entre com outro nome')
        verifyUserName(askUserName)
    } else {
        alert(`O servidor retornou com o seguinte erro: ${errorCode}. 
        Informe-o para o técnico de suporte.`)
    }
}



verifyUserName(askUserName)

//let a = {"from":"gfg","to":"Todos","text":"sai da sala...","type":"status","time":"04:21:30"}


