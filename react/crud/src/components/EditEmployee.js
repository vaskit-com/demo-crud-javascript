import React, { Component } from 'react';

export class EditEmployee extends Component {

    state = {}

    /**
     * Start here
     */
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                _id: this.props.employeeSelected._id,
                name: this.props.employeeSelected.data.name,
                age: this.props.employeeSelected.data.age,
                position: this.props.employeeSelected.data.position
            });
            console.dir(this.state);    
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.dir(this.state);
    }

    updateExistent = () => {
        this.props.updateExistent(this.state);
    }

    cancel = () => {
        this.props.cancel();
    }

    render() {
        return (
            <div className="mt-4 mb-4" align="center">
                <h3>
                    Edit Employee
                </h3>
                <hr />
                <table className="table table-borderless" style={{maxWidth: '400px'}}>
                    <tbody>
                        <tr id="recordId">
                            <td>Record ID:</td>
                            <td>
                                <input 
                                    type="text" 
                                    id="id" 
                                    disabled 
                                    className="form-control" 
                                    value={this.state._id}
                                />
                            </td>
                        </tr>
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
                                <button className="btn btn-secondary mr-2" 
                                    onClick={this.cancel}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" 
                                    onClick={this.updateExistent}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        )
    }    
}

export default EditEmployee
