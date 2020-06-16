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
            vaskitSocketStart();
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
    })
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
    
    /**
     * Reload messages between me and this selected user
     */
    userSelectedFromList( SELECTED_USER );
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


function createUser() {
    const name = $('#newName');
    const surname = $('#newSurname');
    const email = $('#newEmail');
    const password = $('#newPassword');

    if (!name.val() || !surname.val() || !email.val() || !password.val()) {
        alert('Please fill all the fields');
        return;
    }

    const body = {
        name: name.val(),
        surname: surname.val(),
        email: email.val(),
        password: password.val()
    };

    sendRequest('post', '/user/api', body, (success, response) => {
        if (success) {
            alert('User created!');
            name.val('');
            surname.val('');
            email.val('');
            password.val('');
        }
    })
}

/**
 * User clicks on the LOGIN button
 */
function login() {
    const email = $('#email');
    const password = $('#password');
    /**
     * Go and do a vaskit login
     */
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


