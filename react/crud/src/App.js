import React, { Component } from 'react';
import './App.css';
import Employees from './components/Employees';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import axios from 'axios';

class App extends Component {

    /**
     * Main configuration here
     */
    state = {
        /**
         * VASKIT API endpoint
         */
        ENDPOINT: 'https://vaskit.com',
        /**
         * Replace here with your developer key
         */
        DEVELOPER_KEY: 'REPLACE WITH A VALID DEVELOPER KEY HERE',

        employees: [],

        employeeSelected: null
    }

    /**
     * Start here
     */
    componentDidMount() {
        this.getAllRecords();
    }

    /**
     * GET ALL RECRODS FROM VASKIT
     */
    getAllRecords = () => {
        axios({
            method: 'post',
            url: this.state.ENDPOINT + '/record/api/find',
            data: {
                table: 'employees'
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'jwt ',
                'key': this.state.DEVELOPER_KEY
            }
        }).then( response => {
            this.setState({
                employees: response.data.data
            })
        })
    }


    /**
     * SAVE NEW RECORD AT VASKIT
     */
    saveNew = (employee) => {
        axios({
            method: 'post',
            url: this.state.ENDPOINT + '/record/api',
            data: {
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
                    name: employee.name, 
                    age: employee.age,
                    position: employee.position
                },

                /**
                 * You can define this record security
                 */
                readPublic: true,
                writePublic: true,
                readUsers: [/** Your user's IDs who can read this record separated by comma */],
                writeUsers: [/** Your user's IDs who can write this record separated by comma */]

            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'jwt ',
                'key': this.state.DEVELOPER_KEY
            }
        }).then( () => {
            this.getAllRecords();
        })
    }


    /**
     * DELETE RECORD FROM VASKIT
     */
    deleteRecord = (id) => {
        if (window.confirm('Are you sure?') === false) return;
        axios({
            method: 'delete',
            url: this.state.ENDPOINT + '/record/api/' + id,
            data: {
                table: 'employees'
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'jwt ',
                'key': this.state.DEVELOPER_KEY
            }
        }).then( response => {
            this.getAllRecords();
        })
    }

    selectEmployee = (id) => {
        this.setState({
            employeeSelected: this.state.employees.find( item => {
                return item._id == id
            })
        })
    }

    updateExistent = (data) => {
        axios({
            method: 'put',
            url: this.state.ENDPOINT + '/record/api/' + data._id,
            data: {
                table: 'employees',
                data
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'jwt ',
                'key': this.state.DEVELOPER_KEY
            }
        }).then( () => {
            this.getAllRecords();
            this.setState({
                employeeSelected: null
            })
        })
    }

    cancel = () => {
        this.setState({
            employeeSelected: null
        })
    }

    render() {
        return (
            <div className="container mt-4">

                <div className="card border-0 shadow">
                    <div className="card-header">
                        <h5>CRUD Demo App - Vaskit</h5>
                    </div>
                    <div className="card-body">
                        <p className="card-text">
                            Welcome! This demo app shows how you can use VASKIT to
                            create, remove, update and delete records.
                        </p>
                        <div className="card-text mt-4">
                            <h5>Things you will need:</h5>
                        </div>
                        <ul className="list-group mt-4">
                            <li className="list-group-item">
                                1) A VASKIT account. Go <a href="https://vaskit.com">here</a> 
                                to get one.
                            </li>
                            <li className="list-group-item">
                                2) Your DEVELOPER KEY. You get this from your 
                                <a href="https://vaskit.com/dashboard">Dashboard</a>
                            </li>
                            <li className="list-group-item">
                                3) From your 
                                <a href="https://vaskit.com/dashboard">Dashboard</a>, 
                                create a table called employees
                            </li>
                            <li className="list-group-item">
                                Click <a href="https://vaskit.com/doc">here</a>&nbsp;
                                and learn about users and records security to make them private
                                or accessible to certain users only.
                                Learn how to send <b>PUSH</b> messages and use <b>SOCKET</b> 
                                communication.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card border-0 shadow mt-4 mb-4">
                    <div className="card-header">
                        <h5>List of Employees</h5>
                    </div>
                    <div className="card-body">
                        <p className="card-text">
                            For this demo we will run CRUD operations 
                            for a group of employees.
                        </p>
                        <table className="table border">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Position</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="employeesList">
                                <Employees 
                                    employees={this.state.employees}
                                    deleteRecord={this.deleteRecord} 
                                    selectEmployee={this.selectEmployee}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>

                { this.state.employeeSelected ? (
                    <EditEmployee 
                        employeeSelected={this.state.employeeSelected}
                        updateExistent={this.updateExistent} 
                        cancel={this.cancel}
                    />
                ) : (
                    <AddEmployee 
                        saveNew={this.saveNew} 
                    />
                )}

            </div>
        );
    }
}

export default App;
