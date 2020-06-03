package com.example.vaskitcrud;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONObject;

public class DetailsActivity extends AppCompatActivity {

    /**
     * Class used to send requests to the server.
     */
    private ApiCall apiCall;

    /**
     * Components used to show and ask
     * for new information to update
     */
    EditText editName;
    EditText editAge;
    EditText editPosition;

    /**
     * This is the ID we use to update
     * the existing record
     */
    String idToModify;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);

        /**
         * Get reference to elements on the layout
         */
        this.editName = (EditText)findViewById(R.id.editName);
        this.editAge = (EditText)findViewById(R.id.editAge);
        this.editPosition = (EditText)findViewById(R.id.editPosition);

        /**
         * Create new instance.
         */
        apiCall = new ApiCall();

        /**
         * Load record by ID we received from
         * MainActivity.
         */
        this.loadRecordById();
    }



    /**
     * Goes to the server and get a record from ID.
     */
    private void loadRecordById() {

        Intent i = getIntent();

        /**
         * Send the ID of the record to modify
         */
        this.idToModify = i.getStringExtra("id");

        /**
         * Do the call
         */
        this.apiCall.getRecordById(this, this.idToModify, new VolleyCallback() {
            @Override
            public void onVolleyResponse(JSONObject response) {
                /**
                 * Show the information on screen to users
                 */
                DetailsActivity.this.drawContentOnScreen(response);
            }
        });
    }




    /**
     * Draws on screen the content of the record obtained
     * from the server.
     */
    private void drawContentOnScreen(JSONObject response) {
        try {
            JSONArray arrEmployees = response.getJSONArray("data");

            /**
             * Loop the result and build the response
             */
            for (int i = 0; i < arrEmployees.length(); i++) {
                /**
                 * This is the record
                 */
                JSONObject o = arrEmployees.getJSONObject(i);
                Log.i("RECORD", o.toString());

                /**
                 * "data" is the JSON onject containing
                 * the values of our table
                 */
                JSONObject data = o.getJSONObject("data");
                Log.i("DATA", data.toString());

                /**
                 * Let's show the information of
                 * this record: name, age and position
                 */
                this.editName.setText(data.getString("name"));
                this.editAge.setText(data.getString("age"));
                this.editPosition.setText(data.getString("position"));
            }

        } catch(Exception e) {
            Log.e("Error", e.getLocalizedMessage());
            e.printStackTrace();
        }
    }




    /**
     * Update records on the server
     */
    public void updateRecord(View view) {
        /**
         * Get input data: name, age and position
         */
        String name = this.editName.getText().toString();
        int age = Integer.parseInt( this.editAge.getText().toString() );
        String position = this.editPosition.getText().toString();

        /**
         * Send the request to update this field
         */
        this.apiCall.updateRecord(this, this.idToModify, name, age, position, new VolleyCallback() {
            @Override
            public void onVolleyResponse(JSONObject response) {
                /**
                 * Show a simple success message
                 */
                Toast.makeText(getApplicationContext(),"Record updated!", Toast.LENGTH_SHORT).show();
            }
        });
    }

}