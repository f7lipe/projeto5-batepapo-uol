//** tipos de mensagem **//
const STATUS_MESSAGE = "status"
const PUBLIC_MESSAGE = "message"
const PRIVATE_MESSAGE = "private_message"

const PARTICIPANTS_REPO = "https://mock-api.driven.com.br/api/v4/uol/participants"
const MESSAGES_REPO = "https://mock-api.driven.com.br/api/v4/uol/messages"
const STATUS_REPO = "https://mock-api.driven.com.br/api/v4/uol/status"

let TYPE = 'message'
let CURRENT_USER = null
let TO = 'Todos'

function askUserName() {
    return prompt('Qual seu lindo nome?')
}

function verifyUserName(name) {
    const user = { name: name() }
    const promise = axios.post(PARTICIPANTS_REPO, user)
    promise.then(() => {
        CURRENT_USER = user.name
        loadFunctions()
    })
    promise.catch(handleError)
}

function keepConnected(){
    const user = {name: CURRENT_USER}
    const promise = axios.post(STATUS_REPO, user)
    promise.catch(handleError)
}

function loadMessages() {
    const promise = axios.get(MESSAGES_REPO) 
    promise.then(filterMessages)
    
}

function filterMessages(messages) {
    let filteredArray = []
    const messagesData = messages.data
    let type = null
    let text = null

    messagesData.forEach(message => {
        const isStatusMessage = message.type === STATUS_MESSAGE
        const isPublicMessage = message.type === PUBLIC_MESSAGE
        const isPrivateMesssage = message.type === PRIVATE_MESSAGE

        if (isStatusMessage) {
            type = STATUS_MESSAGE
            text = `${message.text}`
        }
        if (isPublicMessage) {
            type = PUBLIC_MESSAGE
            text = `para <b>${message.to}</b>: ${message.text} `
        }
        if (isPrivateMesssage && message.from === TO) {
            type = PRIVATE_MESSAGE
            text = `reservadamente para <b>${message.to}</b>: ${message.text} `
        }
        const filteredMessage = `
            <div class="message ${type}" data-identifier="message">
                <span class="time">(${message.time})</span>
                <p class="message-content"> <b>${message.from}</b> ${text}</p>
            </div>`

                filteredArray.push(filteredMessage)
            
    });
    renderMessages(filteredArray)
    
}

function renderMessages(filteredMessages) {
    let messagesDiv = document.querySelector('.messages')
    messagesDiv.innerHTML = ''
    filteredMessages.forEach(message =>
        messagesDiv.innerHTML += message)
        //rola para a última mensagem
        document.querySelector('.message:last-child').scrollIntoView()
}

function loadContacts(){
    const promise = axios.get(PARTICIPANTS_REPO) 
    promise.then(renderContacts)
}

function renderContacts(participants) {
    const contacts = participants.data
    let contactsDiv = document.querySelector('.personal-settings')
    contactsDiv.innerHTML = ''
    contacts.forEach(contact => {
        const newContact = `    
        <div class="setting contact" onClick="selectOnSidebar(this)">
        <ion-icon name="person-circle-outline"></ion-icon>
                <span>${contact.name}</span>
        </div>`
        contactsDiv.innerHTML += newContact

    });
}

function toggleSidebar() {
    const div = document.getElementsByClassName('sidebar-background')
    div[0].classList.toggle('hidden')
}

function selectOnSidebar(div) {
    const isContact = div.classList.contains('contact')
    const isVisibility = div.classList.contains('visibility')
    const span = div.getElementsByTagName("span")

    if (isContact) {
        const contactName = span[0].innerText
        TO = contactName
    }
    if (isVisibility) {
        const visibility = span[0].innerText
        TYPE = visibility
    }
}

function sendMessage() {
    if (checkSending()) {
        const inputMessage = document.querySelector('input')
        const newMessage = {
            from: CURRENT_USER,
            to: TO,
            text: inputMessage.value,
            type: TYPE // ou "private_message" para o bônus
        }

        const promise = axios.post(MESSAGES_REPO, newMessage)
        promise.then(loadMessages)
        promise.catch(handleError)
        clearInput(inputMessage)
    }
}

function checkSending() {
    const isEmptyInput = document.getElementsByTagName('input').value === ''
    const isEmptyRecipient = TO === null
    const isEmptyVisibility = TYPE === null

    if (isEmptyInput) {
        alert('Você ainda não digitou')
        return false
    } else if (isEmptyRecipient) {
        alert('Você não selecionou o/a destinatiE')
        return false
    } else if (isEmptyVisibility) {
        alert('Você precisa informar a visibilidade da mensagem')
        return false
    } else {
        return true
    }
}

function clearInput(input){
    input.value = ''
}

function loadFunctions(){
        //Carrega assim que a função é invocada
        loadMessages()
        loadContacts()
        keepConnected()
        //Agenda para o intervalo definido 
        setInterval(keepConnected, 5000)
        setInterval(loadMessages, 3000)
        setInterval(loadContacts, 10000)

}

function handleError(error) {
    const errorCode = error.response.status;
    if (errorCode === 400) {
        alert('Esse nome já está em uso. Entre com outro nome')
        verifyUserName(askUserName)
    } else {
        alert(`Poxa... que pena... O servidor retornou com o seguinte erro: ${errorCode}. 
        Informe-o para o técnico de suporte.`)
        window.location.reload()
    }
}

verifyUserName(askUserName)
