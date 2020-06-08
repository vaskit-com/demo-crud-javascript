import React, { Component } from 'react';

export class Employee extends Component {
    render() {

        const { _id } = this.props.employee;
        
        const { name, age, position } = this.props.employee.data;

        return (
            <tr>
                <td>
                    { name }
                </td>
                <td>
                    { age }
                </td>
                <td>
                    { position }
                </td>
                <td>
                    <button 
                        className="btn btn-danger mr-2" 
                        onClick={this.props.deleteRecord.bind(this, _id)}
                    >
                        Delete
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={this.props.selectEmployee.bind(this, _id)}
                    >
                        Edit
                    </button>  
                </td>
            </tr>
        )
    }    
}

export default Employee
