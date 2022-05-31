const socket = io()
const $formSelector = document.querySelector('#message-form')
const $formInputSelector = $formSelector.querySelector('input')
const $formButtonSelector = $formSelector.querySelector('button')
const $locationSelector = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessagesStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessagesStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight
    const totalHeight = $messages.scrollHeight

    const bottomPointer = $messages.scrollTop + visibleHeight
    if(totalHeight - newMessageHeight <= bottomPointer) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate,{
        username: message.username,
        message: message.message,
        time: moment(message.time).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render($locationTemplate,{
        username: url.username,
        url: url.url,
        time: moment(url.time).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomUsers',({room,users}) =>{
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    document.querySelector('.chat__sidebar').innerHTML = html
})

$formSelector.addEventListener('submit',(e) => {
    e.preventDefault()
    $formButtonSelector.setAttribute('disabled','disabled')
    const searchValue = e.target.elements.message.value
    if(searchValue == ''){
        $formButtonSelector.removeAttribute('disabled')
        $formInputSelector.value = ''
        $formInputSelector.focus()
        return console.log('enter a value')
    }
    socket.emit('sendMessage',searchValue,() => {
        $formButtonSelector.removeAttribute('disabled')
        $formInputSelector.value = ''
        $formInputSelector.focus()
        console.log('Delivered')
    })
})

$locationSelector.addEventListener('click',() => {
    if(!navigator.geolocation){
        alert('Geolocation not supported')
    }
    $locationSelector.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationSelector.removeAttribute('disabled')
            console.log('location sent!')
        } )

    })
})

socket.emit('join',{username,room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})