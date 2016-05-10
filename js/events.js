/**
 * Created by Teplov on 09.05.2016.
 */
let Login = require('login');
let Chat = require('chat');
let PageLoader = require('pageLoader');
let Notifier = require('notifier');
let previewHtml = require('../templates/preview.html');
let mustache = require('mustache');

const uploadString = 'http://localhost:8000/upload';

class Events {
    constructor(options) {
        this.options = options;
        this.methods = [];
    }

    setEvents(typeEvents) {
        this.removeEvents();
        let options = this.options,
            _this = this;
        if (typeEvents === 'login') {
            let login = new Login(options.nameId, options.nickNameId),
                loginButtonMethod = function (e) {
                    if (e.target.getAttribute("id") && e.target.getAttribute("id") === options.loginButtonId) {
                        login.login();
                    }
                };
            this.methods.push({type: 'click', value: loginButtonMethod});
            document.addEventListener('click', loginButtonMethod);
            login.login(true);
        } else if (typeEvents === 'chat') {
            let connection = options.connection,
                usersArray = options.initialData.users,
                token = options.initialData.token,
                userLogin = options.regData.nickname,
                chat = new Chat(options.chatContainerId, options.onlineUsersId, options.textFieldId, userLogin, token);
            //recieve messages
            connection.onmessage = function (event) {
                try {
                    let jsonData = JSON.parse(event.data);
                    if (jsonData.op === 'user-enter') {
                        if (!usersArray.some((el) => {
                                return jsonData.user.login === el.login;
                            })) {
                            usersArray.push(jsonData.user);
                            chat.addUserToOnlineList(jsonData.user.name, jsonData.user.login);
                        }
                    } else if (jsonData.op === 'user-out') {
                        usersArray.forEach((el, i) => {
                            if (el.login === jsonData.user.login) {
                                usersArray.splice(i, 1);
                                chat.removeUserFromOnlineList(jsonData.user.login);
                            }
                        });
                    } else if (jsonData.op === 'message') {
                        chat.addMessageToBoard(jsonData);
                    } else if (jsonData.op === 'user-change-photo') {
                        console.log(jsonData);
                        chat.changeImages(jsonData.user.login);
                    }
                } catch (e) {
                    console.error(e);
                }
            };

            //send messages events
            let sendMessageAction = function (e) {
                if (e.target.getAttribute("id") && e.target.getAttribute("id") === options.sendButtonId) {
                    chat.sendMessage(connection);
                } else if (e.keyCode && e.keyCode === 13 && document.activeElement.getAttribute('id') &&
                    document.activeElement.getAttribute('id') === options.textFieldId && !e.shiftKey) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    chat.sendMessage(connection);
                }
            }

            this.methods.push({type: 'click', value: sendMessageAction});
            document.addEventListener('click', sendMessageAction);

            this.methods.push({type: 'keydown', value: sendMessageAction});
            document.addEventListener('keydown', sendMessageAction);

            //Foto

            let fileObject = null;

            let fotoClickFunction = function (e) {
                if (e.target.classList && e.target.classList.contains('user-image')) {
                    document.getElementById('load-file-panel').classList.remove('hide');
                }
            }

            this.methods.push({type: 'click', value: fotoClickFunction});
            document.addEventListener('click', fotoClickFunction);

            let closeFilePanel = function (e, noEvent) {
                if (noEvent || (e.target.classList && e.target.classList.contains('close-file-panel'))) {
                    let closeElement = document.getElementById('load-file-panel');;
                    closeElement.querySelectorAll('.drop-area')[0].innerHTML = 'Перетащите сюда файлы';
                    closeElement.classList.add('hide');
                    fileObject = null;
                }
            }

            this.methods.push({type: 'click', value: closeFilePanel});
            document.addEventListener('click', closeFilePanel);

            //dnd file

            let handleFileSelect = function (e) {
                e.stopPropagation();
                e.preventDefault();

                let file = e.dataTransfer.files[0]; // FileList object.

                if (file.type !== 'image/jpeg') {
                    Notifier.show('Загрузить можно только фотографию в формате JPG', 'alarm');
                } else if (file.size / 1024 > 512) {
                    Notifier.show('Размер фото не должен превышать 512 кб', 'alarm');
                }

                let reader = new FileReader();

                reader.onload = function (e) {
                    let previewImage = mustache.render(previewHtml, {
                            src: e.target.result,
                            text: file.name.trim() + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' мб)'
                        })
                        ;
                    dropZone.innerHTML = previewImage;
                    fileObject = file;
                };

                // Read in the image file as a data URL.
                reader.readAsDataURL(file);

            }

            let handleDragOver = function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            }

            let dropZone = document.getElementsByClassName('drop-area')[0];
            dropZone.addEventListener('dragover', handleDragOver, false);
            dropZone.addEventListener('drop', handleFileSelect, false);

            let buttonLoadImageFunction = function (e) {
                if (e.target.getAttribute("id") && e.target.getAttribute("id") === 'loadFotoButton' && fileObject) {
                    //send file object here;
                    let data = new FormData();
                    data.append('photo', fileObject);
                    data.append('token', token);

                    fetch(uploadString, {method: 'POST', body: data}).then(function (response) {
                        closeFilePanel(null, true);
                    }).catch(console.log);

                }
            }

            this.methods.push({type: 'click', value: buttonLoadImageFunction});
            document.addEventListener('click', buttonLoadImageFunction);

        }
    }

    removeEvents() {
        this.methods.forEach((el) => {
            document.removeEventListener(el.type, el.value);
        });
    }
}

module.exports = Events;