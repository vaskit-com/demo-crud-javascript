package com.example.vaskitcrud;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    /**
     * List of your employees from server
     */
    JSONObject employees;

    /**
     * Common
     */
    ApiCall apiCall;

    /**
     * Elements from layout
     */
    LinearLayout layoutEmployeeList;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        /**
         * Layout where we will show the list of existing employees
         */
        this.layoutEmployeeList = (LinearLayout) findViewById(R.id.employeeList);

        /**
         * Class used to make requests to the server
         */
        this.apiCall = new ApiCall();

        /**
         * Start by getting employees
         */
        this.reloadEmployees();

    }

    /**
     * Get all the employees from the server
     * and show them on a list
     */
    private void reloadEmployees() {
        this.apiCall.getEmployees(this, this.responseGetEmployees);
    }


    /**
     * With all the employees from the server,
     * show them on the screen
     */
    VolleyCallback responseGetEmployees = new VolleyCallback() {
        @Override
        public void onVolleyResponse(JSONObject response) {
            try {
                JSONArray arrEmployees = response.getJSONArray("data");
                MainActivity.this.drawInfoOnScreen(arrEmployees);
            } catch(Exception e) {
                System.out.println(e.getLocalizedMessage());
            }
        }
    };

    /**
     * Draws employees on screen
     */
    private void drawInfoOnScreen(JSONArray arrEmployees) {
        try {
            final Context context = getApplicationContext();
            /**
             * Clear all the possible content on this layout
             */
            this.layoutEmployeeList.removeAllViews();

            /**
             * Loop the result and build the response
             */
            for (int i=0; i < arrEmployees.length(); i ++) {
                /**
                 * This is the record
                 */
                JSONObject o = arrEmployees.getJSONObject(i);
                Log.i("RECORD", o.toString());

                /**
                 * This is the record ID. We will use it to
                 * delete and/or modify this employee.
                 */
                final String _id = o.getString("_id");

                /**
                 * Inside the record, wwe have the employee fields
                 * we want to show on screen
                 */
                JSONObject data = o.getJSONObject("data");
                Log.i("DATA", data.toString());

                /**
                 * Let's add 3 TextView and show
                 * the records: name, age and position
                 */
                TextView tvName = new TextView(getApplicationContext());
                tvName.setText("Name: " + data.getString("name"));
                tvName.setTextSize(18);
                this.layoutEmployeeList.addView(tvName);

                TextView tvAge = new TextView(getApplicationContext());
                tvAge.setText("Age: " + data.getString("age"));
                tvAge.setTextSize(18);
                this.layoutEmployeeList.addView(tvAge);

                TextView tvPosition = new TextView(getApplicationContext());
                tvPosition.setText("Position: " + data.getString("position"));
                tvPosition.setTextSize(18);
                this.layoutEmployeeList.addView(tvPosition);

                /**
                 * Let's add 2 buttons: DELETE and EDIT
                 */
                LinearLayout layoutButtons = new LinearLayout(getApplicationContext());
                layoutButtons.setOrientation(LinearLayout.HORIZONTAL);
                this.layoutEmployeeList.addView(layoutButtons);

                /**
                 * Button for deleting this record
                 */
                Button butDelete = new Button(getApplicationContext());
                butDelete.setText("Delete");
                layoutButtons.addView(butDelete);
                butDelete.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        MainActivity.this.apiCall.deleteRecord(
                                context, _id, callbackAfterRecordWasDeleted);
                    }
                });

                /**
                 * Button for editing this record
                 */
                Button butEdit = new Button(getApplicationContext());
                butEdit.setText("Edit");
                layoutButtons.addView(butEdit);
                butEdit.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent i = new Intent(MainActivity.this, DetailsActivity.class);
                        i.putExtra("id", _id);
                        startActivity(i);
                    }
                });

                /**
                 * Simple trick to separate the next record
                 */
                TextView tvSeparator = new TextView(getApplicationContext());
                tvSeparator.setText("");
                tvSeparator.setTextSize(16);
                this.layoutEmployeeList.addView(tvSeparator);
            }
        } catch(Exception e) {
            System.out.println(e.getLocalizedMessage());
        }
    }


    /**
     * Run this after a record was deleted
     */
    VolleyCallback callbackAfterRecordWasDeleted = new VolleyCallback() {
        @Override
        public void onVolleyResponse(JSONObject response) {
            MainActivity.this.reloadEmployees();
        }
    };


    /**
     * Save new record
     */
    public void saveNewRecord(View view) {
        /**
         * Get a reference to the elements in the layout
         */
        final EditText editName = (EditText) findViewById(R.id.editName);
        final EditText editAge = (EditText) findViewById(R.id.editAge);
        final EditText editPosition = (EditText) findViewById(R.id.editPosition);

        /**
         * Get the information for creating new record
         */
        String name = editName.getText().toString();
        int age = Integer.parseInt( editAge.getText().toString() );
        String position = editPosition.getText().toString();

        /**
         * Send request to the server and add new record
         */
        this.apiCall.addNewEmployee(this, name, age, position, new VolleyCallback() {
            @Override
            public void onVolleyResponse(JSONObject response) {
                /**
                 * Clear input boxes
                 */
                editName.setText("");
                editAge.setText("");
                editPosition.setText("");
                /**
                 * Reload records on screen
                 */
                MainActivity.this.reloadEmployees();
            }
        });
    }



    @Override
    protected void onResume() {
        super.onResume();
        /**
         * Reload employees when the screen is called
         */
        this.reloadEmployees();
    }

}