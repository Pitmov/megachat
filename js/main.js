/**
 * Created by Teplov on 09.05.2016.
 */
require("../css/megachat.css");
require("../css/bootstrap.css");
require("../css/bootstrap.min.css");
let PageLoader = require('pageLoader');

document.addEventListener("DOMContentLoaded", function () {
    let pageLoader = new PageLoader('main-container');
    pageLoader.setPage('login', {
        loginButtonId: 'loginBtn',
        nameId: 'fio',
        nickNameId: 'nick'
    });

    document.addEventListener('registrationSuccessful', function (event) {
        let connection = event.detail.connection,
            data = event.detail.data,
            regData = event.detail.regData;
        pageLoader.setPage('chat', {
            logoutButtonId: 'logoutBtn',
            textFieldId: 'messageField',
            initialData: data,
            regData: regData,
            connection: connection,
            sendButtonId: 'sendMessageButton',
            chatContainerId: 'messageBoard',
            onlineUsersId: 'onlineUsers'
        });
    });

    document.addEventListener('connectionClosed', function (event) {
        pageLoader.setPage('login', {
            loginButtonId: 'loginBtn',
            nameId: 'fio',
            nickNameId: 'nick'
        });
    });

});