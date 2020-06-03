
const ENDPOINT = 'https://vaskit.com';

let DEVELOPER_KEY = null;

/**
 * ADD
 */
function addRecord() {

    const recordId = $('#id').val();

    if (recordId) {
        
        updateChanges();

    } else {

        const name = $('#name').val();
        const age = $('#age').val();
        const position = $('#position').val();

        if (!name || !age || !position) {
            $('#addNewInfo').html('Please fill all fields');
            return;
        }

        sendRequest('post', '/record/api', {

            /**
             * Table name where this record will be inserterd.
             * You must create these tables from your Dashboard
             * https://vaskit.com/dashboard
             */
            table: 'employees',

            /**
             * This is the data to insert in your table
             */
            data: {
                name, 
                age,
                position
            },

            /**
             * You can define this record security
             */
            readPublic: true,
            writePublic: true,
            readUsers: [/** Your user's IDs who can read this record separated by comma */],
            writeUsers: [/** Your user's IDs who can write this record separated by comma */]

        }, (success, response) => {
            if (success) {
                getAllRecords();
                cancelAdd();
            } else {
                $('#addNewInfo').html('Error saving data');
            }
        })
    }
}



/**
 * SAVE CHANGES TO EXISTING RECORD
 */
function updateChanges() {

    const recordId = $('#id').val();
    const name = $('#name').val();
    const age = $('#age').val();
    const position = $('#position').val();

    if (!name || !age || !position) {
        $('#addNewInfo').html('Please fill all fields');
        return;
    }

    sendRequest('put', '/record/api/' + recordId, {
        
        /**
         * Table name where this record will be updated.
         * You must create these tables from your Dashboard
         * https://vaskit.com/dashboard
         */
        table: 'employees',

        /**
         * This is the data to update in your table
         */
        data: {
            name, 
            age,
            position
        },

        /**
         * You can define this record security
         */
        readPublic: true,
        writePublic: true,
        readUsers: [/** Your user's IDs who can read this record separated by comma */],
        writeUsers: [/** Your user's IDs who can write this record separated by comma */]

    }, (success, response) => {
        if (success) {
            getAllRecords();
            cancelAdd();
        } else {
            $('#addNewInfo').html('Error saving data');
        }
    })
}




/**
 * FIND ALL
 */
function getAllRecords() {

    sendRequest('post', '/record/api/find', {
        
        table: 'employees'

    }, (success, response) => {
        if (success) {
            buildResponseAndShowSearchResult(response.data);
        }
    })
    
}



/**
 * FIND BY ID
 */
function getRecordById(id) {

    sendRequest('post', '/record/api/find/' + id, {

        table: 'employees'

    }, (success, response) => {
        if (success && response.count) {
            showRecordAndEdit(response.data[0]);
        }
    })

}



/**
 * DELETE
 */
function deleteRecord(id) {

    if (confirm('Are you sure?') === false) return;

    sendRequest('delete', '/record/api/' + id, {}, () => {
        getAllRecords();
    })

}


/**
 * Check if we have a DEVELOPER KEY
 */
function checkDeveloperKey() {
    if (!DEVELOPER_KEY) {
        $('#askDeveloperKey').show();
    } else {
        $('#askDeveloperKey').hide();
        $('#mainPanel').show();
        getAllRecords();
    }
}

/**
 * Set a DEVELOPER KEY
 */
function setDeveloperKey() {
    DEVELOPER_KEY = document.getElementById('developerKey').value;
    if (DEVELOPER_KEY.trim() != '') {
        checkDeveloperKey();
    }
}

/**
 * SATART HERE
 */
$( document ).ready( () => {
    checkDeveloperKey();
})
