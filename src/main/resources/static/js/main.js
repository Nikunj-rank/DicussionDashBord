'use strict';
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

var commonConstants = {
    sServiceLocation: "",
    sTopicId: ""
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
}


function onConnected() {
    // Subscribe to the Public Channel
    stompClient.subscribe('/channel/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    )

}


function onError(error) {
    console.log(error);
}


function sendMessage(event, messageType, discussionIdValue, chatMessage) {
    if ("addDiscussion" == messageType) {
        stompClient.send("/app/chat.addDiscussion", {}, JSON.stringify(chatMessage));
    } else if ("addComment" == messageType) {

        stompClient.send("/app/chat.addComment", {}, JSON.stringify(chatMessage));
    } else if ("addLike" == messageType) {

        stompClient.send("/app/chat.topic.like", {}, JSON.stringify(chatMessage));

    } else if ("addDisLike" == messageType) {

        stompClient.send("/app/chat.topic.like", {}, JSON.stringify(chatMessage));
    } else if ("addDiscussionLike" == messageType) {
        stompClient.send("/app/chat.discussion.like", {}, JSON.stringify(chatMessage));
    } else if ("addDiscussionDisLike" == messageType) {
        stompClient.send("/app/chat.discussion.like", {}, JSON.stringify(chatMessage));
    }
    event.preventDefault();

}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    if (message.messageType == "COMMENT") {
        var MessageBox = "<li class='comment'>" +
            "<a class='pull-left' href='#'>" +
            "<img class='avatar' src='http://bootdey.com/img/Content/user_1.jpg' alt='avatar'>" +
            "</a>" +
            "<div class='comment-body'>" +
            "<div class='comment-heading'>" +
            "<h4 class='user'>" + message.userName + "</h4>" +
            "<h5 class='time'>" + timeSince(new Date(message.dateTime)) + " ago</h5>" +
            "</div>" +
            "<p>" + message.comment + "</p>" +
            "</div>" +
            "</li>";
        $(".discussion" + message.discussionId + "").append(MessageBox);
    } else if (message.messageType == "DISCUSSION") {
        var discussionChunk = "<div class='panel panel-white post panel-shadow'>" +
            "<div class='post-heading'>" +
            "<div class='pull-left image'>" +
            "<img src='http://bootdey.com/img/Content/user_1.jpg' class='img-circle avatar' alt='user profile image'>" +
            "</div>" +
            "<div class='pull-left meta'>" +
            "<div class='title h5'>" +
            "<a href='#'><b>" + message.userName + "</b></a> replied on the post." +
            "</div>" +
            "<h6 class='text-muted time'>" + timeSince(new Date(message.dateTime)) + " ago</h6>" +
            "</div>" +
            "</div> " +
            "<div class='post-description'> " +
            "<p>" + message.post + "</p>" +
            "<div class='stats'>" +
            "<a href='#' data-topicId='" + commonConstants.sTopicId + "' data-discussionId='" + message.discussionId + "' class='btn btn-default stat-item discussionLikeIcon discussionLikeIconT" + commonConstants.sTopicId + "D" + message.discussionId + "'>" +
            "<i class='glyphicon glyphicon-thumbs-up'></i><span class='discussionLikeCountT" + commonConstants.sTopicId + "D" + message.discussionId + "'>" + ((null !== message.listOfUserLiked) ? message.listOfUserLiked.length : 0) + "</span>" +
            "</a>" +
            "<a href='#' data-topicId='" + commonConstants.sTopicId + "' data-discussionId='" + message.discussionId + "' class='btn btn-default stat-item discussionLikeDisIcon discussionDisLikeIconT" + commonConstants.sTopicId + "D" + message.discussionId + "'>" +
            "<i class='glyphicon glyphicon-thumbs-down'></i><span class='discussionDisLikeCountT" + commonConstants.sTopicId + "D" + message.discussionId + "'>" + ((null !== message.listOfUserDisLiked) ? message.listOfUserDisLiked.length : 0) + "</span>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "<div class='post-footer'>" +
            "<ul class='chat discussion" + message.discussionId + " comments-list'>" +
            "</ul>" +
            "<div class='input-group'> " +
            "<input data-discussionId='" + message.discussionId + "' id='message" + message.discussionId + "' class='form-control replyMessage' placeholder='Add a comment' type='text'>" +
            "<span class='input-group-addon'>" +
            "<a href='#' id='btn-send-comment"+message.discussionId+"' data-discussionId='" + message.discussionId + "' class='btn-send-comment'><i class='glyphicon glyphicon-edit'></i></a>" +
            "</span>" +
            "</div>" +  
            "</div>";
        $(".topicList .discussionList").prepend(discussionChunk);

    } else if (message.messageType == "TLIKE") {
        if (null !== message.listOfUserLiked)
            $(".topicLikeCount").text(message.listOfUserLiked.length);
        if (null !== message.listOfUserDisLiked)
            $(".topicDisLikeCount").text(message.listOfUserDisLiked.length);
    } else if (message.messageType == "DLIKE") {
        if (null !== message.listOfUserLiked)
            $(".discussionLikeCountT" + message.topicId + "D" + message.discussionId + "").text(message.listOfUserLiked.length);
        if (null !== message.listOfUserDisLiked)
            $(".discussionDisLikeCountT" + message.topicId + "D" + message.discussionId + "").text(message.listOfUserDisLiked.length);
    }
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
    var tableRow = "<div class='panel panel-white post panel-shadow {{background}}'>" +
        "<div class='post-heading'>" +
        "<div class='pull-left image'>" +
        "<img src='http://bootdey.com/img/Content/user_1.jpg' class='img-circle avatar' alt='user profile image'></img>" +
        "</div>" +
        "<div class='pull-left meta'>" +
        "<div class='title h5'>" +
        "<b>{{topicUserName}}</b> made a post. <span class='timeText'>{{topicTime}}  ago.</span>" +
        "</div>" +
        "<a href='index?topicId={{tId}}'><h4>{{topicName}}</h4></a>" +
        "</div>" +
        "</div>" +
        "<div class='post-description'>" +
        "<p>{{topicDesc}}</p>" +
        "<div class='stats likeTab'>" +
        "<a href='#' data-topicId='{{tId}}' class='disabled btn btn-default stat-item'>" +
        "<i class='glyphicon glyphicon-thumbs-up'></i><span>{{topicLike}}</span>" +
        "</a>" +
        "<a href='#' data-topicId='{{tId}}' class='disabled btn btn-default stat-item'>" +
        "<i class='glyphicon glyphicon-thumbs-down'></i><span>{{topicDisLike}}</span>" +
        "</a>" +
        "</div>" +
        "</div>" +
        "</div>";
    if (data) {
        var backgroundCounter = 1;
        if(topicData.length>0)
        {
        $("#postTable").text("");
        $.each(topicData, function (key, value) {
            var row = tableRow.replace("{{topicName}}", value.subject).replace("{{topicDesc}}", value.desc).replace("{{topicLike}}", value.listOfUserLiked.length).replace("{{topicDisLike}}", value.listOfUserDisLiked.length).replace(/{{tId}}/g, value.topicId).replace("{{topicUserName}}", value.userName).replace("{{topicTime}}", timeSince(new Date(value.dateTime)));
            if (backgroundCounter % 2 == 0) {
                row = row.replace("{{background}}", "");
            } else {
                row = row.replace("{{background}}", "bluebackground");
            }
            backgroundCounter++;
            $("#postTable").prepend(row);
        });
        }
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
    $("#topicUserName").text(data.userName);
    $("#topicDesc").text(data.desc);
    $("#topicTitle").text(data.subject);
    $(".timeText span").text(timeSince(new Date(data.dateTime)));
    if (null !== data.listOfUserLiked) {
        $(".topicLikeCount").text(data.listOfUserLiked.length);
    }
    else {
        $(".topicLikeCount").text("0");
    }
    if (null !== data.listOfUserDisLiked) {
        $(".topicDisLikeCount").text(data.listOfUserDisLiked.length);
    }
    else {
        $(".topicDisLikeCount").text("0");
    }
    if ($.inArray(localStorage.getItem('userName'), data.listOfUserLiked) !== -1) {
        $(".likeIcon").addClass("likeActive");
    }
    if ($.inArray(localStorage.getItem('userName'), data.listOfUserDisLiked) !== -1) {
        $(".likeDisIcon").addClass("disLikeActive");
    }
    $.each(data.discussions, function (key, value) {
        var discussionChunk = "<div class='panel panel-white post panel-shadow'>" +
            "<div class='post-heading'>" +
            "<div class='pull-left image'>" +
            "<img src='http://bootdey.com/img/Content/user_1.jpg' class='img-circle avatar' alt='user profile image'>" +
            "</div>" +
            "<div class='pull-left meta'>" +
            "<div class='title h5'>" +
            "<b>" + value.userName + "</b> replied on the post." +
            "</div>" +
            "<h6 class='text-muted time'>" + timeSince(new Date(value.dateTime)) + " ago</h6>" +
            "</div>" +
            "</div> " +
            "<div class='post-description'> " +
            "<p>" + value.post + "</p>" +
            "<div class='stats'>" +
            "<a href='#' data-topicId='" + data.topicId + "' data-discussionId='" + value.discussionId + "' class='btn btn-default stat-item discussionLikeIcon discussionLikeIconT" + data.topicId + "D" + value.discussionId + "'>" +
            "<i class='glyphicon glyphicon-thumbs-up'></i><span class='discussionLikeCountT" + data.topicId + "D" + value.discussionId + "'>" + ((null !== value.listOfUserLiked) ? value.listOfUserLiked.length : 0) + "</span>" +
            "</a>" +
            "<a href='#' data-topicId='" + data.topicId + "' data-discussionId='" + value.discussionId + "' class='btn btn-default stat-item discussionLikeDisIcon discussionDisLikeIconT" + data.topicId + "D" + value.discussionId + "'>" +
            "<i class='glyphicon glyphicon-thumbs-down'></i><span class='discussionDisLikeCountT" + data.topicId + "D" + value.discussionId + "'>" + ((null !== value.listOfUserDisLiked) ? value.listOfUserDisLiked.length : 0) + "</span>" +
            "</a>" +
            "</div>" +
            "</div>" +
            "<div class='post-footer'>" +
            "<ul class='chat discussion" + value.discussionId + " comments-list'>" +
            "</ul>" +
            "<div class='input-group'> " +
            "<input data-discussionId='" + value.discussionId + "' id='message" + value.discussionId + "' class='form-control replyMessage' placeholder='Add a comment' type='text'>" +
            "<span class='input-group-addon'>" +
            "<a href='#' id='btn-send-comment"+value.discussionId+"' data-discussionId='" + value.discussionId + "' class='btn-send-comment'><i class='glyphicon glyphicon-edit'></i></a>" +
            "</span>" +
            "</div>" +
            "</div>";
        $(".topicList .discussionList").prepend(discussionChunk);
        if ($.inArray(localStorage.getItem('userName'), value.listOfUserLiked) !== -1) {
            $(".discussionLikeIconT" + data.topicId + "D" + value.discussionId + "").addClass("likeActive");
        }
        if ($.inArray(localStorage.getItem('userName'), value.listOfUserDisLiked) !== -1) {
            $(".discussionDisLikeIconT" + data.topicId + "D" + value.discussionId + "").addClass("disLikeActive");
        }
        $.each(value.commentList, function (commentKey, commentValue) {
            var MessageBox = "<li class='comment'>" +
                "<a class='pull-left' href='#'>" +
                "<img class='avatar' src='http://bootdey.com/img/Content/user_1.jpg' alt='avatar'>" +
                "</a>" +
                "<div class='comment-body'>" +
                "<div class='comment-heading'>" +
                "<h4 class='user'>" + commentValue.userName + "</h4>" +
                "<h5 class='time'>" + timeSince(new Date(commentValue.dateTime)) + " ago</h5>" +
                "</div>" +
                "<p>" + commentValue.comment + "</p>" +
                "</div>" +
                "</li>";
            $(".discussion" + value.discussionId + "").append(MessageBox);
        });
    });

    connect();
    console.log(data);
}
function getTopicListFailure(data) {
    console.log(data);
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

$(document).ready(function () {
    if (0 !== $("#dashboardPage").length) {
        oCommonObject.callService("topics", localStorage.getItem('userName'), getPostSuccess, getPostFailure, null, null);
    } else if (0 !== $("#indexPage").length) {
        commonConstants.sTopicId = getUrlVars()["topicId"];
        if (null !== commonConstants.sTopicId && "" !== commonConstants.sTopicId) {
            oCommonObject.callService("topic/id", Number(commonConstants.sTopicId), getTopicListSuccess, getTopicListFailure, null, null);

        } else {
            window.location.href = "dashboard";
        }
    } else if (0 !== $("#addTopicPage").length) {

    }

    $(document).on('click', '.btn-send-comment', function (event) {
        var discussionId = $(this).attr("data-discussionId");
        var messageContent = $("#message" + discussionId + "").val();
        $("#message" + discussionId + "").val("");

        if (messageContent && stompClient) {
            var chatMessage = {
                topicId: commonConstants.sTopicId,
                discussionId: discussionId,
                listOfUserLiked: null,
                listOfUserDisLiked: null,
                dateTime: null,
                userName: username,
                comment: messageContent,
                messageType: "COMMENT"
            };

            sendMessage(event, "addComment", discussionId, chatMessage);
        }
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
            "tags": $("#tagList").tagsinput('items'),
            "keyWords": $("#keyWordList").tagsinput('items'),
            "desc": $("#description").val(),
            "url": "",
            "userName": localStorage.getItem('userName'),
            "listOfUserLiked": null,
            "listOfUserDisLiked": null,
            "discussions": null,
            "dateTime": null
        };
        oCommonObject.callService("topic", oTopicDetails, addTopicSuccess, addTopicFailure, null, null);
    });

    $("#addNewDiscussion").on('click', function (event) {
        var messageContent = $("#discussionDesc").val();

        if (messageContent && stompClient) {
            var chatMessage = {
                topicId: commonConstants.sTopicId,
                post: messageContent,
                userName: username,
                commentList: null,
                listOfUserLiked: null,
                listOfUserDisLiked: null,
                dateTime: null,
                messageType: "DISCUSSION"
            };

            sendMessage(event, "addDiscussion", "", chatMessage);
        }

        $("#discussionDesc").val("");

    });
    $(".likeIcon").on("click", function (event) {

        if (($(this).attr("class").indexOf("likeActive") !== -1)) {
            $(this).removeClass("likeActive");
        } else {
            $(this).addClass("likeActive");
            if ($(".likeDisIcon").attr("class").indexOf("disLikeActive") !== -1) {
                $(".likeDisIcon").removeClass("disLikeActive");
            }
        }
        var chatMessage = {
            topicId: commonConstants.sTopicId,
            discussionId: "",
            listOfUserLiked: [username],
            listOfUserDisLiked: null,
            dateTime: null,
            userName: username,
            comment: "",
            messageType: "TLIKE"
        };
        sendMessage(event, "addLike", "", chatMessage);
    });
    $(".likeDisIcon").on("click", function (event) {
        if (($(this).attr("class").indexOf("disLikeActive") !== -1)) {
            $(this).removeClass("disLikeActives");
        } else {
            $(this).addClass("disLikeActive");
            if ($(".likeIcon").attr("class").indexOf("likeActive") !== -1) {
                $(".likeIcon").removeClass("likeActive");
            }
        }
        var chatMessage = {
            topicId: commonConstants.sTopicId,
            discussionId: "",
            listOfUserLiked: null,
            listOfUserDisLiked: [username],
            dateTime: null,
            userName: username,
            comment: "",
            messageType: "TLIKE"
        };
        sendMessage(event, "addDisLike", "", chatMessage);
    });
    $(document).on('click', '.discussionLikeIcon', function (event) {
        if (($(this).attr("class").indexOf("likeActive") !== -1)) {
            $(this).removeClass("likeActive");
        } else {
            $(this).addClass("likeActive");
            if ($(this).parent().find(".discussionLikeDisIcon").attr("class").indexOf("disLikeActive") !== -1) {
                $(this).parent().find(".discussionLikeDisIcon").removeClass("disLikeActive");
            }
        }
        var chatMessage = {
            topicId: $(this).attr("data-topicId"),
            discussionId: $(this).attr("data-discussionId"),
            listOfUserLiked: [username],
            listOfUserDisLiked: null,
            dateTime: null,
            userName: username,
            comment: "",
            messageType: "DLIKE"
        };
        sendMessage(event, "addDiscussionLike", "", chatMessage);
    });

    $(document).on('click', '.discussionLikeDisIcon', function (event) {
        if (($(this).attr("class").indexOf("disLikeActive") !== -1)) {
            $(this).removeClass("disLikeActive");
        } else {
            $(this).addClass("disLikeActive");
            if ($(this).parent().find(".discussionLikeIcon").attr("class").indexOf("likeActive") !== -1) {
                $(this).parent().find(".discussionLikeIcon").removeClass("likeActive");
            }
        }
        var chatMessage = {
            topicId: $(this).attr("data-topicId"),
            discussionId: $(this).attr("data-discussionId"),
            listOfUserLiked: null,
            listOfUserDisLiked: [username],
            dateTime: null,
            userName: username,
            comment: "",
            messageType: "DLIKE"
        };
        sendMessage(event, "addDiscussionDisLike", "", chatMessage);
    });


    //List of Enter Key Events
    
    $("#discussionDesc").keyup(function(event){
    if(event.keyCode == 13){
        $("#addNewDiscussion").click();
    }
});

$(document).on('keyup', '.replyMessage', function (event) {
    if(event.keyCode == 13){
        var discussionId = $(this).attr("data-discussionId");
        $("#btn-send-comment"+discussionId).click();
    }
});

 $("#userNameId").keyup(function(event){
    if(event.keyCode == 13){
        $("#login-submit").click();
    }
});

 $("#passwordId").keyup(function(event){
    if(event.keyCode == 13){
        $("#login-submit").click();
    }
});

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
