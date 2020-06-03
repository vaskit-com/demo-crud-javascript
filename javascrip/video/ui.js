
function showUserLitstOnScreen(userIdSelected = null) {
    if (!arrUsers) {
        return;
    }
    /**
     * Start preparing the output
     */
    let out = ``;
    /**
     * Loop all users
     */
    for (let u of arrUsers) {
        if (u.email !== LOGGED_USER.email) {
            /**
             * We can select one of the rows
             */
            let activeClass= '';
            if (userIdSelected && userIdSelected == u._id) {
                activeClass= ' active ';
            }
            /**
             * Build the output
             */
            out += `
            <li class="list-group-item ${ activeClass }">
                <div style="cursor:pointer" onclick="userSelectedFromList('${ u._id }')">
                    ${ u.name } ${ u.surname }
                </div>
                <div class="mt-2 text-info" id="last-message-${ u._id }">
                    <!-- last message sent by this user -->
                </div>
                <div class="mt-2 text-muted small" id="status-${ u._id }">
                    <!-- populated from javascript -->
                </div>
            </li>                
            `;    
        }
    }
    /**
     * If no users, then set a special message
     */
    if (arrUsers.length === 0) {
        out = `
        <li class="list-group-item">
            You have no users. Create from your <a href="https://vaskit.com/dashboard">Dashboard</a>
        </li>        
        `;
    } 
    /**
     * Render all to screen
     */
    $('#usersList').html(out);
}


/**
 * Draw a box saying that a new message has arrived.
 * Show a button and let users click to see the entire 
 * message history.
 */
function informNewMessageArrived(data, userId) {
    if (arrUsers) {
        const user = arrUsers.find( item => item._id == userId);
        if (user) {
            /**
             * Show the panel
             */
            $('#newMessage').show();
            /**
             * Show the message and this
             * user's name and surname too
             */
            $('#userNameWithMessageSent').html(`
                New message: "${ data }"
                <div class="small">
                    Sent by: ${ user.name } ${ user.surname }
                </div>
            `);
            /**
             * Draw a button
             */
            $('#newMessageButton').html(`
                <button class="btn btn-secondary btn-sm" onclick="userSelectedFromList('${ user._id }')">
                    View message
                </button>            
            `);
        }
    }
}


/**
 * Once we received the list of messages sent 
 * by a user id, draw the data on screen.
 */
function drawListOfMessagesFromUser(arrData) {

    let out = ``;

    arrData.forEach( m => {

        let textPosition = '';

        if (m.data.from == LOGGED_USER._id) {
            userFullName = 'Me';
            textPosition = ' text-right ';
        }

        /**
         * Message date and time
         */
        const dateTimeSent = new Date( m.createdAt ).toLocaleDateString() + 
        ' - ' + new Date( m.createdAt ).toLocaleTimeString();

        out += `
        <li class="list-group-item ${ textPosition }">
            ${ m.data.text }
            <div class="small text-muted">
                ${ dateTimeSent }
            </div>
        </li>
        `;        
    })

    /**
     * If no messages, then set a special message
     */
    if (arrData.length === 0) {
        out = `
        <li class="list-group-item">
            No messages to show.
        </li>        
        `;
    } 

    /**
     * Show this info
     */
    $('#messagesList').html( out );

    /**
     * Scroll to the bottom of the list
     */
    scrollBottomOf('messagesList');

    /**
     * Hide the notice about new message arrived
     */
    $('#newMessage').hide();

}



/**
 * Helper function to get a value
 * from inside the array "arrUsers"
 */
function getUserFrom(userId) {
    try {
        return arrUsers.find( u => u._id == userId );
    } catch (err) {
        return 'User not found';
    }
}



function scrollTopOf(divId) {
    $("html, body").animate({ scrollTop: $('#' + divId).offset().top }, "slow");
}

function scrollBottomOf(divId) {
    var d = $('#' + divId); d.scrollTop (d[0].scrollHeight - d.height ());
}
