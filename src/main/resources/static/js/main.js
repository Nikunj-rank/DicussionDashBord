'use strict';
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

var commonConstants = {
    sServiceLocation: ""
};

var oServiceGlobal = {
    oAjaxRequest: null
}

var oCommonObject = {
    /* Wrapper function to call specified method of the service with specified parameters, success and failure functions */
    callService: function (sWebMethodName, oParameters, onSuccess, onFailure, onBeforeSend, oParam) {
        if (typeof (oParameters) === 'string') {
            sData = oParameters;
        } else {
            sData = JSON.stringify(oParameters);
        }
        var sWebMethodUrl = commonConstants.sServiceLocation + "/" + sWebMethodName
            , sData;

        oServiceGlobal.oAjaxRequest = $.ajax({
            type: "POST",
            url: sWebMethodUrl,
            data: sData,
            contentType: "application/json;",

            success: function (result) {
                if ("function" === typeof (onSuccess)) {
                    if (oParam) {
                        var oFinalResult = { "Result": result, "oParam": oParam };
                        onSuccess(oFinalResult);
                    } else {
                        onSuccess(result);
                    }
                }
            },
            beforeSend: function (result) {
                if ("function" === typeof (onBeforeSend)) {
                    if (oParam) {
                        var oFinalResult = { "Result": result, "oParam": oParam };
                        onBeforeSend(oFinalResult);
                    } else {
                        onBeforeSend(result);
                    }
                }
            },
            error: function (result) {
                if ("function" === typeof (onFailure)) {
                    if (oParam) {
                        var oFinalResult = { "Result": result, "oParam": oParam };
                        onFailure(oFinalResult);
                    } else {
                        onFailure(result);
                    }
                }
            }
        });
    }
};

function connect() {
    username = localStorage.getItem('userName');

    if (username) {

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    // event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Channel
    stompClient.subscribe('/channel/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    )

    // connectingElement.classList.add('hidden');
}


function onError(error) {
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
}


function sendMessage(event, messageType,discussionIdValue) {
    if ("addDiscussion" == messageType) {
        var messageContent = $("#discussionDesc").val();

        if (messageContent && stompClient) {
            var chatMessage = {
                topicId:getUrlVars()["topicId"],
                post: messageContent,
                userName: username,
                commentList:null,
                listOfUserLiked:null,
                listOfUserDisLiked:null,
                dateTime:null,
                messageType:"DISCUSSION"

                // type: 'CHAT'
            };

            stompClient.send("/app/chat.addDiscussion", {}, JSON.stringify(chatMessage));
        }
    } else if ("addComment" == messageType) {
        var messageContent = $("#message"+discussionIdValue+"").val();

        if (messageContent && stompClient) {
            var chatMessage = {
                topicId:getUrlVars()["topicId"],
                discussionId:discussionIdValue,
                listOfUserLiked:null,
                listOfUserDisLiked:null,
                dateTime:null,
                userName: username,
                comment: messageContent,
                messageType:"COMMENT"
                // type: 'CHAT'
            };

            stompClient.send("/app/chat.addComment", {}, JSON.stringify(chatMessage));
        }
    } else if("addLike"==messageType){
        var chatMessage = {
                topicId:getUrlVars()["topicId"],
                discussionId:"",
                listOfUserLiked:[username],
                listOfUserDisLiked:null,
                dateTime:null,
                userName: username,
                comment: "",
                messageType:"TLIKE"
                // type: 'CHAT'
            };
            stompClient.send("/app/chat.topic.like", {}, JSON.stringify(chatMessage));

    }else if ("addDisLike"==messageType){
var chatMessage = {
                topicId:getUrlVars()["topicId"],
                discussionId:"",
                listOfUserLiked:null,
                listOfUserDisLiked:[username],
                dateTime:null,
                userName: username,
                comment: "",
                messageType:"TLIKE"
                // type: 'CHAT'
            };
            stompClient.send("/app/chat.topic.like", {}, JSON.stringify(chatMessage));
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    if (message.messageType == "COMMENT") {
        // if(message.type === 'JOIN') {
        //     messageElement.classList.add('event-message');
        //     message.content = message.sender + ' joined!';
        // } else if (message.type === 'LEAVE') {
        //     messageElement.classList.add('event-message');
        //     message.content = message.sender + ' left!';
        // } else {
        var MessageBox = "<li class='right clearfix'>" +
            "<span class='chat-img pull-right'>" +
            "<img src='http://placehold.it/50/FA6F57/fff&text=RGB' alt='User Avatar' class='img-circle' />" +
            "</span>" +
            "<div class='chat-body clearfix'>" +
            "<div class='header'>" +
            "<small class=' text-muted'><span class='glyphicon glyphicon-time'></span>15 mins ago</small>" +
            "<strong class='pull-right primary-font'>" + message.userName + "</strong>" +
            "</div>" +
            "<p>" + message.comment +
            "</p>" +
            "</div>" +
            "</li>";
        $(".discussion"+message.discussionId+"").append(MessageBox);
    } else if (message.messageType == "DISCUSSION") {
        var discussionChunk = "<li class='timeline-inverted'>" +
        "<div class='timeline-badge warning'><i class='glyphicon glyphicon-credit-card'></i></div>" +
        "<div class='timeline-panel'>" +
        "<div class='timeline-heading'>"+
                        "<h4 class='timeline-title'>"+message.userName+"</h4>"+
                        "<p><small class='text-muted'><i class='glyphicon glyphicon-time'/> 11/09/2014 </small></p>"+
                    "</div>"+
        "<div class='timeline-body'>" +
        "<p>"+message.post+
        "</div>" +
        "<hr/>" +
        "<div class='timeline-footer'>" +
        "<div class='panel panel-primary'>" +
        "<div class='panel-heading' id='accordion'>" +
        "<span class='label label-danger'>5</span>" +
        "<span class='glyphicon glyphicon-comment'></span> Comments" +
        "<div class='btn-group pull-right'>" +
        "<a type='button' class='btn btn-default btn-xs' data-toggle='collapse' data-parent='#accordion' href='#collapseOne"+message.discussionId+"'>" +
        "<span class='glyphicon glyphicon-chevron-down'></span>" +
        "</a>" +
        "</div>" +
        "</div>" +
        "<div class='panel-collapse collapse' id='collapseOne"+message.discussionId+"'>" +
        "<div class='panel-body'>" +
        "<ul class='chat discussion"+message.discussionId+"'>" +

        "</ul>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<div class='input-group'>" +
        "<input id='message"+message.discussionId+"' type='text' autocomplete='off' class='form-control input-sm' placeholder='Type your comment here...' />" +
        "<span class='input-group-btn'>" +
        "<button type='submit' data-discussionId='"+message.discussionId+"' class='btn btn-warning btn-sm btn-send-comment' >" +
        "Comment" +
        "</button>" +
        "</span>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</li>";
        $("#topicList").append(discussionChunk);

    } else if (message.messageType == "TLIKE"){
        if(null!==message.listOfUserLiked)
          $(".topicLikeCount").text(message.listOfUserLiked.Length);
        if(null!==message.listOfUserDisLiked)
          $(".topicDisLikeCount").text(message.listOfUserDisLiked.Length);
    }

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

function getPostSuccess(data) {
    var topicData = JSON.parse(data);
    var tableRow = "<tr>" +
        "<td><img src='http://placehold.it/140x100' alt=''></td>" +
        "<td>" +
        "<h4>" +
        "<a href='index?topicId={{tId}}'>{{topicName}}</a> " +
        "<span class='time'><sup>9 hours ago</sup></span>" +
        "</h4>" +
        "<p>{{topicDesc}}</p>" +
        "</td>" +
        "<td>{{topicLike}}</td>" +
        "<td>{{topicDisLike}}</td>" +
        "</tr>";
    if (data) {
        $.each(topicData, function (key, value) {
            var row = tableRow.replace("{{topicName}}", value.subject).replace("{{topicDesc}}", value.desc).replace("{{topicLike}}", value.listOfUserLiked.Length).replace("{{topicDisLike}}", value.listOfUserDisLiked.Length).replace("{{tId}}", value.topicId);
            $("#postTable").append(row);
        });
    }
}

function getPostFailure(data) {
    console.log(data);
}

function addTopicSuccess(data) {
    window.location.href = "dashboard";
}
function addTopicFailure(data) {
    console.log(data);
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getTopicListSuccess(data) {
    $("#topicName").text(data.subject);
    $("#topicDesc").text(data.desc);
     if(null!==data.listOfUserLiked)
        $(".topicLikeCount").text(message.listOfUserLiked.Length);
    else
        $(".topicLikeCount").text("0");
    if(null!==data.listOfUserDisLiked)
        $(".topicDisLikeCount").text(message.listOfUserDisLiked.Length);
    else
        $(".topicDisLikeCount").text("0");
       
    $.each(data.discussions,function(key,value){
        var discussionChunk = "<li class='timeline-inverted'>" +
        "<div class='timeline-badge warning'><i class='glyphicon glyphicon-credit-card'></i></div>" +
        "<div class='timeline-panel'>" +
        "<div class='timeline-heading'>"+
                        "<h4 class='timeline-title'>"+value.userName+"</h4>"+
                        "<p><small class='text-muted'><i class='glyphicon glyphicon-time'/> 11/09/2014 </small></p>"+
                    "</div>"+
        "<div class='timeline-body'>" +
        "<p>"+value.post+
        "</div>" +
        "<hr/>" +
        "<div class='timeline-footer'>" +
        "<div class='panel panel-primary'>" +
        "<div class='panel-heading' id='accordion'>" +
        "<span class='label label-danger'>5</span>" +
        "<span class='glyphicon glyphicon-comment'></span> Comments" +
        "<div class='btn-group pull-right'>" +
        "<a type='button' class='btn btn-default btn-xs' data-toggle='collapse' data-parent='#accordion' href='#collapseOne"+value.discussionId+"'>" +
        "<span class='glyphicon glyphicon-chevron-down'></span>" +
        "</a>" +
        "</div>" +
        "</div>" +
        "<div class='panel-collapse collapse' id='collapseOne"+value.discussionId+"'>" +
        "<div class='panel-body'>" +
        "<ul class='chat discussion"+value.discussionId+"'>" +
        "</ul>" +
        "</div>" +
        "<div class='panel-footer'>" +
        "<div class='input-group'>" +
        "<input id='message"+value.discussionId+"' type='text' autocomplete='off' class='form-control input-sm' placeholder='Type your comment here...' />" +
        "<span class='input-group-btn'>" +
        "<button type='submit' data-discussionId='"+value.discussionId+"' class='btn btn-warning btn-sm btn-send-comment'>" +
        "Comment" +
        "</button>" +
        "</span>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</li>";
        $("#topicList").append(discussionChunk);
        $.each(value.commentList,function(commentKey,commentValue){
             var MessageBox = "<li class='right clearfix'>" +
            "<span class='chat-img pull-right'>" +
            "<img src='http://placehold.it/50/FA6F57/fff&text=RGB' alt='User Avatar' class='img-circle' />" +
            "</span>" +
            "<div class='chat-body clearfix'>" +
            "<div class='header'>" +
            "<small class=' text-muted'><span class='glyphicon glyphicon-time'></span>15 mins ago</small>" +
            "<strong class='pull-right primary-font'>" + commentValue.userName + "</strong>" +
            "</div>" +
            "<p>" + commentValue.comment +
            "</p>" +
            "</div>" +
            "</li>";
        $(".discussion"+value.discussionId+"").append(MessageBox);
        });
    });
     
    connect();
    console.log(data);
}
function getTopicListFailure(data) {
    console.log(data);
}

$(document).ready(function () {
    //usernameForm.addEventListener('submit', connect, true);
    if (0 !== $("#dashboardPage").length) {
        oCommonObject.callService("topics", localStorage.getItem('userName'), getPostSuccess, getPostFailure, null, null);
    } else if (0 !== $("#indexPage").length) {
        var topicId = getUrlVars()["topicId"];
        if (null !== topicId && "" !== topicId) {
            oCommonObject.callService("topic/id", Number(topicId), getTopicListSuccess, getTopicListFailure, null, null);

        } else {
            window.location.href = "dashboard";
        }
    } else if (0 !== $("#addTopicPage").length) {

    }

    $(document).on('click','.btn-send-comment',function (event) {
        var discussionId = $(this).attr("data-discussionId");
        sendMessage(event, "addComment",discussionId);
    });

    $("#login-submit").on('click', function (event) {
        doLogin(event);
    });
    $("#newTopic").on('click', function (event) {
        window.location.href = "addTopic";
    });
    $("#createTopicButton").on('click', function (event) {
        var oTopicDetails = {
            // "id":1,
            "subject": $("#subjectName").val(),
            "tags": null,
            "keyWords": null,
            "desc": $("#description").val(),
            "url": "",
            "username": localStorage.getItem('userName'),
            "listOfUserLiked": null,
            "listOfUserDisLiked": null,
            "discussions": null,
            "dateTime": null
        };
        oCommonObject.callService("topic", oTopicDetails, addTopicSuccess, addTopicFailure, null, null);
    });

    $("#addNewDiscussion").on('click', function (event) {
        sendMessage(event, "addDiscussion","");

    });
    $(".likeIcon").on("click",function(event) {

        if(($(this).attr("class").indexOf("likeActive")!==-1)){
            $(this).removeClass("likeActive");
        }else{
             $(this).addClass("likeActive");
             if($(".likeDisIcon").attr("class").indexOf("disLikeActive")!==-1){
                 $(".likeDisIcon").removeClass("disLikeActive");
             }
        }
        sendMessage(event,"addLike","");
    });
     $(".likeDisIcon").on("click",function(event) {
         if(($(this).attr("class").indexOf("disLikeActive")!==-1)){
            $(this).removeClass("disLikeActives");
        }else{
             $(this).addClass("disLikeActive");
             if($(".likeIcon").attr("class").indexOf("likeActive")!==-1){
                 $(".likeIcon").removeClass("likeActive");
             }
        }
         sendMessage(event,"addDisLike","");
    });

    // messageForm.addEventListener('submit', sendMessage, true)
});

function doLogin(event) {
    localStorage.setItem("userName", $("#userNameId").val());
    var oLoginDetail = { "username": $("#userNameId").val(), "password": $("#passwordId").val() };
    console.log(oLoginDetail);
    post("login", oLoginDetail);
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
