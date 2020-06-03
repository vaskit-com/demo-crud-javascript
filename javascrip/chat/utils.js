

/**
 * Sends a HTTP request to VASKIT
 */
function sendRequest(method, uri, body, callback) {
    fetch(ENDPOINT + uri, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'key': DEVELOPER_KEY,
            'Authorization': 'jwt ' + getToken()
        },    
        body:JSON.stringify( body )
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response);
        }
    }).then(function(data) {
        callback(true, data);
    }).catch( err => {
        callback(false, err.message);
    });
}



/**
 * Validates current session token.
 * If invalid, you should redirect to the login page.
 */
function doVaskitMe(callback) {
    sendRequest('post', '/user/api/me', {}, (success, response) => {
        if (success) {
            callback(true, response.user);
        } else {
            callback(false, null);
        }
    });
}


/**
 * Sends Email and password to VASKIT 
 * server and tries a login.
 */
function doVaskitLogin(email, password, callback) {
    /**
     * Build body
     */
    const body = {
        email,
        password
    }
    /**
     * Send request to VASKIT
     */
    sendRequest('post', '/user/api/login', body, (success, response) => {
        if (success) {
            setToken(response.token);
            callback(true, response.token);
        } else {
            callback(false, null);
        }
    })
}



/**
 * Gets the login token from persistence
 */
function getToken() {
    return localStorage.getItem('token');
}



/**
 * Sets the login token to persistence
 */
function setToken(token) {
    localStorage.setItem('token', token);
}



/**
 * Removes the login token from persistence
 */
function doVaskitLogout() {
    localStorage.removeItem('token');
    location.reload();
}



