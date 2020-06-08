import React, { Component } from 'react';

export class AddEmployee extends Component {

    state = {
        name: '',
        age: '',
        position: ''
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.dir(this.state);
    }

    saveNew = () => {
        this.props.saveNew(this.state);
        this.setState({
            name: '',
            age: '',
            position: ''
        });
    }

    render() {
        return (
            <div className="mt-4 mb-4" align="center">
                <h3>
                    Add New Employee
                </h3>
                <hr />
                <table className="table table-borderless" style={{maxWidth: '400px'}}>
                    <tbody>
                        <tr>
                            <td>Name:</td>
                            <td>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="form-control" 
                                    value={this.state.name}
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Age:</td>
                            <td>
                                <input 
                                    type="number" 
                                    id="age" 
                                    className="form-control" 
                                    value={this.state.age}
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Position:</td>
                            <td>
                                <input 
                                    type="text" 
                                    id="position" 
                                    className="form-control" 
                                    value={this.state.position}
                                    onChange={this.onChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="table table-borderless" style={{maxWidth: '400px'}}>
                    <tbody>
                        <tr>
                            <td>
                                <div id="addNewInfo" className="text-info">
                                </div>
                            </td>
                            <td align="right" width="230">
                                <button className="btn btn-primary" 
                                    onClick={this.saveNew}>
                                    Save
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        )
    }    
}

export default AddEmployee
