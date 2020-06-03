
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


function showAddNew() {
    $('#newRecordDiv').slideDown('fast');
}

function cancelAdd() {
    $('#id').val('');
    $('#name').val('');
    $('#age').val('');
    $('#position').val('');
    $('#recordId').hide();
    $('#newRecordDiv').slideUp('fast');
}

function getToken() {
    return localStorage.getItem('token');
}

function buildResponseAndShowSearchResult(arrEmployees) {
    let out = ``;
    arrEmployees.forEach( item => {
        // button for deleting this record
        const butDelete = `
            <button class="btn btn-danger" onclick="deleteRecord('${ item._id }')">
                Delete
            </button>
        `;
        // button for editing this record
        const butEdit = `
            <button class="btn btn-primary" onclick="getRecordById('${ item._id }')">Edit</button>
        `;
        out += `
        <tr>
            <td>${ item.data.name }</td>
            <td>${ item.data.age }</td>
            <td>${ item.data.position }</td>
            <td>
                ${ butDelete }
                ${ butEdit }
            </td>
        </tr>`
    })
    // no records?
    if (arrEmployees.length === 0) {
        out += `
        <tr>
            <td colspan="4">No records to show</td>
        `;
    }
    // close table and show all
    out += `</table>`;
    $('#employeesList').html( out );
}


function showRecordAndEdit(employee) {
    $('#id').val(employee._id);
    $('#name').val(employee.data.name);
    $('#age').val(employee.data.age);
    $('#position').val(employee.data.position);
    $('#recordId').show();
    showAddNew();
}