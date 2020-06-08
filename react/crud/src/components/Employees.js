import React, { Component } from 'react';
import Employee from './Employee';

export class Employees extends Component {
    render() {
        return this.props.employees.map( employee => (
            <Employee 
                key={employee._id} 
                employee={employee} 
                deleteRecord={this.props.deleteRecord} 
                selectEmployee={this.props.selectEmployee}
            />
        ))
    }
}

export default Employees;
