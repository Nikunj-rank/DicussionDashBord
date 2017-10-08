'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
// var messageForm = document.querySelector('#messageForm');
 var messageInput = document.querySelector('#message');
 var messageArea = document.querySelector('#messageArea');
// var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {

        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Channel
    stompClient.subscribe('/channel/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    // connectingElement.classList.add('hidden');
}




function onError(error) {
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            userName: username,
            comment: messageInput.value
            // type: 'CHAT'
        };

        stompClient.send("/app/chat.addComment", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    // if(message.type === 'JOIN') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' joined!';
    // } else if (message.type === 'LEAVE') {
    //     messageElement.classList.add('event-message');
    //     message.content = message.sender + ' left!';
    // } else {
        var MessageBox = "<li class='right clearfix'>"+
        "<span class='chat-img pull-right'>"+
        "<img src='http://placehold.it/50/FA6F57/fff&text=RGB' alt='User Avatar' class='img-circle' />"+
        "</span>"+
        "<div class='chat-body clearfix'>"+
        "<div class='header'>"+
        "<small class=' text-muted'><span class='glyphicon glyphicon-time'></span>15 mins ago</small>"+
        "<strong class='pull-right primary-font'>"+message.userName+"</strong>"+
        "</div>"+
        "<p>"+message.comment+
        "</p>"+
        "</div>"+
        "</li>";
        $('#messageArea').append(MessageBox);

    //     messageElement.classList.add('chat-message');

    //     var avatarElement = document.createElement('i');
    //     var avatarText = document.createTextNode(message.sender[0]);
    //     avatarElement.appendChild(avatarText);
    //     avatarElement.style['background-color'] = getAvatarColor(message.sender);

    //     messageElement.appendChild(avatarElement);

    //     var usernameElement = document.createElement('span');
    //     var usernameText = document.createTextNode(message.sender);
    //     usernameElement.appendChild(usernameText);
    //     messageElement.appendChild(usernameElement);
    // // }

    // var textElement = document.createElement('p');
    // var messageText = document.createTextNode(message.content);
    // textElement.appendChild(messageText);

    // messageElement.appendChild(textElement);

    // messageArea.appendChild(messageElement);
    // messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

$(document).ready(function(){
//usernameForm.addEventListener('submit', connect, true);

$("#btn-send-comment").click(function(){
    sendMessage();
});

$("#login-submit").on('click',function(event){
    doLogin(event);
});

// messageForm.addEventListener('submit', sendMessage, true)
});

function doLogin(event){
    localStorage.setItem("userName",$("#userNameId").val());
    var oLoginDetail = {"username":$("#userNameId").val(),"password" : $("#passwordId").val()};
    console.log(oLoginDetail);
    post("login",oLoginDetail);
}

function post(path, params, method) {
    method = method || "post";

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
