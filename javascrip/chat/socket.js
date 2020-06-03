
socketConfig = {
    token: getToken(),
    connected: socketConnected,
    disconnected: socketDisconnected,
    socketLogin: socketLoggedIn,
    socketLogout: socketLoggedOut,
    newMessageFromServer: socketNewMessage,
    listOfConnectedUsers: showConnectedClients,
    infoAboutUser: showInfoAboutConnectedUser,
    newMessageReceivedFromUser: showNewMessageReceived,
    userAddedToGroup: showUserAddedToGroup,
    newMessageFromUserInGroup: showNewMessageFromGroup,
}


/**
 * Function called when we get a connection with VASKIT
 */
function socketConnected() {
    console.log('Socket connected');
} 

/**
 * Function called when we disconnect from VASKIT
 */
function socketDisconnected() {
    console.log('Socket disconnected');
} 

/**
 * Function called when a successfull login 
 * was performed in VASKIT using the TOKEN
 * we sent for logging in.
 */
function socketLoggedIn(success, message) {
    if (success) {
        console.log('Socket login success');
        $('#stocketStatus').html('Chat connected');
    } else {
        console.log('Socket login error');
        $('#stocketStatus').html('Chat connection error: ' + message);
    }
}

/**
 * Function called when a successfull logout
 * was performed in VASKIT.
 */
function socketLoggedOut() {
    console.log('I am logged out');
    $('#stocketStatus').html('Disconnected from chat');
}


/**
 * Function called when a new message from 
 * the server is received.
 */
function socketNewMessage(data) {
    /**
     * Show for debug purposes only
     */
    console.log('New message: ' + data);
}


/**
 * We received here the list of our
 * connected users at VASKIT SOCKET.
 */
function showConnectedClients(clients) {
    console.log('User list need to update');
}

/**
 * Function triggered when we receive information
 * about a connected user from the server
 */
function showInfoAboutConnectedUser(data) {
    console.log('Info requested about one of the connected users: ' + data);
}


/**
 * A new message was received from one 
 * of the users in my room.
 */
function showNewMessageReceived(data, userId) {
    console.log('New message received from ' + userId + ': ' + data);
    if (SELECTED_USER) {
        /**
         * Reload the list of messages
         */
        userSelectedFromList(SELECTED_USER);
    } else {
        /**
         * Inform at the top that we 
         * have a new message from this user
         */
        informNewMessageArrived(data, userId);
    }
}

function showUserAddedToGroup() {

}

function showNewMessageFromGroup() {

}

