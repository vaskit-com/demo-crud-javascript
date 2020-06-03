/**
 * VASKIT API endpoint
 */
const ENDPOINT = 'https://vaskit.com';

/**
 * VASKIT developer key
 */
let DEVELOPER_KEY = null;

/**
 * Store your logged user here.
 */
var LOGGED_USER = null;

/**
 * Selected user from the left list 
 * of users
 */
var SELECTED_USER = null;


/**
 * Table where we save our messages
 * This is a private table.
 */
const TABLE_CHAT = 'chat-messages';


/**
 * This is the list of my users
 * 
 * Users are attached to your DEVELOPER KEY
 * and you can define from your Dashboard if 
 * users will be opened to read for anybody 
 * or only by you (https://vaskit.com/dashboard)
 * 
 */
var arrUsers = [];


/**
 * Add users to the list and create 
 * a new room.
 */
var arrUsersAddedForRoom = [];


/**
 * All the video chat groups received from the server
 */
var arrMyVideoChatGroups = [];


/**
 * Get the information from my user, 
 * based on my saved token.
 * 
 * If no saved or invalid token, show
 * users the LOGIN form.
 */
function me() {
    doVaskitMe((success, user) => {
        if (success) {
            /**
             * I'm logged in
             */
            LOGGED_USER = user;
            showChat();            
        } else {
            /**
             * Token is invalid or 
             * does not exist
             */
            LOGGED_USER = null;
            showLogin();
        }
    });
}


function showLogin() {
    /**
     * Show the form to do login
     */
    $('#loginForm').show();

    /**
     * Hide the card where we send chats
     */
    $('#chat').hide();

    /**
     * Clear logged user's email
     */
    $('#userEmail').html('');
}




/**
 * Shows the chat panel
 * Load user list
 */
function showChat() {
    /**
     * Hide the form to do login
     */
    $('#loginForm').hide();

    /**
     * Show the card where we send chats
     */
    $('#chat').show();

    /**
     * Go to the server and load our 
     * users
     */
    loadUserList();

    /**
     * Write logged user's email
     * to identify this user on screen
     */
    $('#userEmail').html( LOGGED_USER.email );
}



/**
 * Go to the server and load my users
 */
function loadUserList() {
    sendRequest('post', '/user/api/find', {}, (success, response) => {
        arrUsers = response.users;
        showUserLitstOnScreen();
        /**
         * Load manager related only
         */
        if (LOGGED_USER.isManager) {
            $('#managerPanel').show();
            populateSelectWithMyUsers();
            loadMyVideoChatRooms();
            drawVideoChatGroupsOnScreen();    
        } else {
            $('#signedUserPanel').show();
            loadChatTokensForThisUser();
        }
    })
}




/**
 * For non-manager suers, list all the 
 * channels this user can access to.
 */
function loadChatTokensForThisUser() {
    sendRequest('get', '/meet/my_groups', {}, (success, response) => {
        if (success) {
            console.dir(response);
            const arrLinks = response.groups;
            drawTokensForThisGroup(arrLinks);
        }
    })
}




/**
 * List of groups this user can get into
 */
function drawTokensForThisGroup(arrLinks) {
    let out = `
        <table class="table">
            <thead>
                <tr>
                    <th>Group Name</th>
                    <th>Video Chat Group Link</th>
                </tr>
            </thead>
            <tbody>
    `;
    arrLinks.forEach( item => {
        out += `
            <tr>
                <td>${ item.groupName }</td>
                <td>
                    <a href="${ item.videoChatGroupLink }" target="_blank">
                        Access to video chat group
                    </a>
                </td>
            </tr>
        `;
    })
    out += `
            </tbody>
        </table>
    `;
    $('#myVideoChatGroups').html(out);
}





/**
 * A user is selected from the list. 
 * We will get all messages sent 
 * privatelly.
 */
function userSelectedFromList(userId) {
    /**
     * Define this user as selected
     */
    SELECTED_USER = userId;
    /**
     * Get all messages sent and received for this user
     */
    const body = {
        table: TABLE_CHAT,
        filters: [{
            key: "$or",
            value: [{
                "data.from": SELECTED_USER, 
                "data.to": LOGGED_USER._id
            }, {
                "data.from": LOGGED_USER._id, 
                "data.to": SELECTED_USER
            }]
        }]
    }
    console.dir(body);
    /**
     * Request the data using custom filters!
     */
    sendRequest('post', '/record/api/custom-filter', body, (success, response) => {
        if (success) {
            const arrData = response.data;
            drawListOfMessagesFromUser(arrData);    
        }
    })
    /**
     * Show as selected the user 
     * form the list on the left
     */
    showUserLitstOnScreen(SELECTED_USER);
}


/**
 * User wants to send a private or public 
 * message
 */
function sendMessage() {
    /**
     * You can only send messages if 
     * you have a valid login
     */
    if (!LOGGED_USER) {
        logout();
        location.reload();
        return;
    }
    /**
     * Send the message now
     */
    if (SELECTED_USER) {
        /**
         * Send the private chat
         */
        sendPrivateChat();
        /**
         * Reload the list of messages
         */
        userSelectedFromList(SELECTED_USER);
    } else {
        /**
         * Send a message to all the users
         */
        sendGlobalChat();
    }
    
}



/**
 * You send a private message after
 * you select a user from the list 
 */
function sendPrivateChat() {
    /**
     * Get text message
     */
    const message = $('#message');
    /**
     * Validate not empty
     */
    if (message.val().trim() === '') {
        return;
    }
    /**
     * Send message using chat
     */
    sendMessageToUser( SELECTED_USER, message.val() );
    /**
     * Store this messsage
     */
    storeMessage(SELECTED_USER, message.val());
    /**
     * Clear input
     */
    message.val('');
}



/**
 * You send a message to all the users
 */
function sendGlobalChat() {
    if (arrUsers) {
        /**
         * Get message from user
         */
        const message = $('#message');
        /**
         * Validate not empty
         */
        if (message.val().trim() === '') {
            return;
        }
        /**
         * Send message using chat
         */
        sendMessageToUser(null, message.val());
        /**
         * Store this message to all the users
         */
        arrUsers.forEach( item => {
            storeMessage(item._id, message.val());
        })
        /**
          * Clear the input box
          */
        message.val('');    
    }
}



/**
 * Stores a message
 */
function storeMessage(toUserId, message) {
    const body = {
        /**
         * This is the table we will use to save our messages.
         * Manage your tables from: https://vaskit.com/dashboard
         */
        table: TABLE_CHAT,

        /**
         * This is the data to store
         */
        data: {
            from: LOGGED_USER._id,
            to: toUserId,
            text: message,
            visible: true    
        },

        /**
         * Set security for this record
         */
        readPublic: false,
        writePublic: false,

        /**
         * List of user id who can read and 
         * write this records
         */
        readUsers:  [ LOGGED_USER._id, toUserId ],
        writeUsers: [ LOGGED_USER._id, toUserId ]

    }
    sendRequest('post', '/record/api', body, () => {
        console.log('Message stored')
    })
}



/**
 * User clicks on the LOGIN button
 */
function login() {
    const email = $('#email');
    const password = $('#password');
    doVaskitLogin(email.val(), password.val(), (success, token) => {
        if (success) {
            setToken(token)
            location.reload();
        } else {
            alert('Invalid login!');
            arrUsers = [];
        }
    })
}


/**
 * User clicks on the LOGOUT button
 */
function logout() {
    doVaskitLogout();    
    location.reload();
}



function gotoChat() {
    if (LOGGED_USER) {
        /**
         * Ask for the redirect URL
         */
        sendRequest('post', '/meet/' + LOGGED_USER._id, {}, (success, response) => {
            console.dir(response);
            if (success) {
                location.href = response.redirect_url;
            }
        })
    }
}


/**
 * We need this list of users 
 * for creating rooms for users
 */
function populateSelectWithMyUsers() {
    let out = `
        <option value="">[ Select users ]</option>
    `;
    arrUsers.forEach( item => {
        out += `
        <option value="${ item._id }">${ item.name } ${ item.surname }</option>
        `;
    })
    $('#allMyUsers').html( out );
}



/**
 * One of the users from <select> was selected
 * and want to add to the list of users for a video chat room
 */
function addUserToRoom() {
    const userId = $('#allMyUsers').val();
    const userExists = arrUsersAddedForRoom.find( item => item._id == userId );
    if (!userExists) {
        const user = arrUsers.find( item => item._id == userId );
        arrUsersAddedForRoom.push( user );
    }
    drawAllSelectedUsers();
}


/**
 * Draw all selected users for the room
 */
function drawAllSelectedUsers() {
    let out = ``;
    arrUsersAddedForRoom.forEach( item => {
        out += `
            <button class="btn btn-secondary m-2">
                ${ item.name } ${ item.surname }
            </button>
        `;
    })
    $('#usersAdded').html(out);
}


/**
 * Sends to VASKIT this information to 
 * create new new video chat group.
 */
function createVideoChatGroup() {
    /**
     * Get the name of the group
     * and validate not empty
     */
    const name = $('#room');
    if (name.val().trim() == '') {
        return;
    }
    /**
     * Get the rest of the fields
     * to create a video chat group
     */
    const windowTitle = $('#windowTitle');
    const cssFile = $('#cssFile');
    const introductionText = $('#introductionText');
    const notifyViaEmail = document.getElementById('notifyViaEmail').checked;
     /**
      * Build the body to send
      */
    const body = {
        name: name.val(),
        windowTitle: windowTitle.val(),
        cssFile: cssFile.val(),
        introductionText: introductionText.val(),
        notifyViaEmail,
        usersInRoom: arrUsersAddedForRoom        
    };
    sendRequest('post', '/meet/group', body, (success, response) => {
        if (success) {
            /**
             * Clear input fields
             */
            name.val('');
            windowTitle.val('');
            cssFile.val('');
            introductionText.val('');
            /**
             * Reload all data
             */
            loadMyVideoChatRooms();
        }
    })
}


/**
 * Load all my video chat rooms created from 
 * the function "createVideoChatGroup()"
 */
function loadMyVideoChatRooms() {
    sendRequest('get', '/meet/group', null, (success, response) => {
        if (success) {
            arrMyVideoChatGroups = response.groups;
            drawVideoChatGroupsOnScreen();
        }
    })
}


/**
 * Draws inside the <select> all the video chat groups
 * received from the server
 */
function drawVideoChatGroupsOnScreen() {
    /**
     * Start building the output
     */
    let out = `<table class="table">
    <thead>
        <tr>
            <th>Group Name</th>
            <th>Users Allowed</th>
            <th>Video Chat Link</th>
            <th></th>
        </tr>
    </thead>    
    <tbody>`;
    /**
     * Loop all my video chat groups...
     */
    arrMyVideoChatGroups.forEach( item => {
        /**
         * Build a nice view for the users allowed
         * for this video chat group
         */
        let usersInRoom = `<table class="table table-borderless">`;
        item.usersInRoom.forEach( u => {
            usersInRoom += `
            <tr>
                <td>${ u.name } ${ u.surname }</td>
                <td>
                    <a href="${ u.videoChatGroupLink }" target="_blank">
                        Access Video Chat
                    </a>
                </td>
            </tr>
            `;
        });
        usersInRoom += `</table>`;
        /**
         * Draw button to delete this group
         */
        const butDeleteGroup = `
            <button class="btn btn-danger" onclick="removeGroup('${ item._id }')">
                Delete
            </button>
        `;
        /**
         * Build HTML for showing the data
         */
        out += `
            <tr>
                <td>${ item.name }</td>
                <td>
                    ${ usersInRoom }
                </td>
                <td>
                    ${ butDeleteGroup }
                </td>
            </tr>
        `;
    })
    out += `</tbody></table>`;
    /**
     * Finally show all together
     */
    $('#allMyVideoChatGroups').html(out);
}



/**
 * Removes a video chat group from the server
 */
function removeGroup(id) {
    if (confirm('Are you sure?') === false) return;
    sendRequest('delete', '/meet/group/' + id, {}, () => {
        loadMyVideoChatRooms();
    })
}





/**
 * Check if we have a DEVELOPER KEY
 */
function checkDeveloperKey() {
    if (!DEVELOPER_KEY) {
        const valueFromLocalStorage = localStorage.getItem('developer-key');
        if (valueFromLocalStorage) {
            DEVELOPER_KEY = valueFromLocalStorage;
            checkDeveloperKey();
        } else {
            $('#askDeveloperKey').show();
        }
    } else {
        $('#askDeveloperKey').hide();
        $('#mainPanel').show();
        me();
    }
}

/**
 * Set a DEVELOPER KEY
 */
function setDeveloperKey() {
    DEVELOPER_KEY = document.getElementById('developerKey').value;
    if (DEVELOPER_KEY.trim() != '') {
        localStorage.setItem('developer-key', DEVELOPER_KEY);
        checkDeveloperKey();
    }
}

/**
 * ALL STARTS HERE
 */
$( document ).ready( () => {
    checkDeveloperKey();
})

