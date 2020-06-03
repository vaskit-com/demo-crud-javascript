import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Employee } from '../models/employee.model';

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    /**
     * Records from server
     */
    arrRecords: Array<Employee> = [];

    /**
     * Record to edit
     */
    recordToEdit: Employee;


    constructor(
        private apiService: ApiService
    ) {}


    /**
     * Init here
     */
    ngOnInit(): void {
        this.getAllRecords();
    }


    /**
     * ADD / UPDATE RECORD
     */
    saveChanges() {

        /**
         * Get input from user. 
         * We use jquery for simplicity only
         */
        const name = $('#name').val();
        const age = $('#age').val();
        const position = $('#position').val();

        /**
         * Validate not empty
         */
        if (!name || !age || !position) {
            $('#addNewInfo').html('Please fill all fields');
            return;
        }

        /**
         * This is our data to save
         */
        const data = {
            name,
            age,
            position
        };

        if (this.recordToEdit) {

            /**
             * Update values
             */
            this.apiService.updateChanges(this.recordToEdit._id, data).subscribe( () => {
                this.getAllRecords();
                this.cancelAdd();
            });

        } else {

            /**
             * Insert new record
             */
            this.apiService.addRecord(data).subscribe( () => {
                this.getAllRecords();
                this.cancelAdd();
            });

        }

    }

    /**
     * GET ALL RECORDS FROM SERVER
     */
    getAllRecords() {
        this.apiService.getAllRecords().subscribe( (response: any) => {
            if (response.count) {
                this.arrRecords = response.data;
            }
        });
    }


    /**
     * DELETE RECORD
     */
    deleteRecord(id: string) {
        if (confirm('Are you sure?') === false) {
            return;
        }
        this.apiService.deleteRecord(id).subscribe( () => {
            this.getAllRecords();
        });
    }


    /**
     * FIND RECORD BY ID
     */
    getRecordById(id: string) {
        this.apiService.getRecordById(id).subscribe( (response: any) => {
            if (response.count) {
                this.recordToEdit = response.data[0];
                this.showAddNew();
            }
        });
    }


    /**
     * Simply shows a DIV
     */
    showAddNew() {
        $('#newRecordDiv').slideDown('fast');
    }

    /**
     * Simply hides a DIV
     */
    cancelAdd() {
        $('#id').val('');
        $('#name').val('');
        $('#age').val('');
        $('#position').val('');
        $('#recordId').hide();
        $('#newRecordDiv').slideUp('fast');
        this.recordToEdit = null;
    }

}

