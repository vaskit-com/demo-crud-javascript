package com.example.vaskitcrud;
import android.content.Context;
import android.util.Log;
import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class ApiCall {

    /**
     * Server endpoint
     */
    public static final String ENDPOINT = "https://vaskit.com";

    /**
     * This is your developer key.
     * Get your own from your dashboard at: https://vaskit.com/dashboard
     */
    public static final String DEVELOPER_KEY = "REPLACE WITH YOUR DEVELOPER KEY HERE";

    /**
     * In case of login, you need to send
     * a valid TOKEN for further responses.
     */
    public static String TOKEN = "";

    /**
     * Constructor
     */
    public ApiCall() {}


    /**
     * Add new record
     */
    public void addNewEmployee(
            Context context,
            final String name,
            final int age,
            final String position,
            final VolleyCallback callback
    ) {
        String url = this.ENDPOINT + "/record/api";

        StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonResponse = new JSONObject(response);
                            callback.onVolleyResponse(jsonResponse);
                        } catch (JSONException e) {
                            Log.e("ERROR", e.getLocalizedMessage());
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    JSONObject jsonBody = new JSONObject();

                    /**
                     * Define in your body the name of the table
                     * you want to permorm your find
                     */
                    jsonBody.put("table", "employees");

                    /**
                     * This is the content of our table
                     */
                    JSONObject data = new JSONObject();
                    data.put("name", name);
                    data.put("age", age);
                    data.put("position", position);
                    jsonBody.put("data", data);

                    /**
                     * We can also define security for this record
                     */
                    jsonBody.put("readPublic", true);
                    jsonBody.put("writePublic", true);

                    /** Your user's IDs who can read this record separated by comma */
                    jsonBody.put("readUsers", new JSONArray());

                    /** Your user's IDs who can write this record separated by comma */
                    jsonBody.put("writeUsers", new JSONArray());

                    String body = jsonBody.toString();
                    return body.getBytes("utf-8");

                } catch (Exception e) {
                    Log.e("Error: ", e.getLocalizedMessage());
                    return null;
                }
            }
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> params = new HashMap<>();

                /**
                 * Content type must be sent
                 */
                params.put("Content-Type", "application/json");
                /**
                 * Send your developer key
                 */
                params.put("key", ApiCall.DEVELOPER_KEY);

                /**
                 * This is the way you send your TOKEN
                 * if login is necessary
                 */
                params.put("Authorization", "jwt " + ApiCall.TOKEN);

                return params;
            }
        };
        Volley.newRequestQueue(context).add(postRequest);
    }




    /**
     * Get the list of employees from server
     */
    public void getEmployees(
            Context context,
            final VolleyCallback callback
    ) {
        String url = this.ENDPOINT + "/record/api/find";

        StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject employees = new JSONObject(response);
                            callback.onVolleyResponse(employees);
                        } catch (JSONException e) {
                            Log.e("ERROR", e.getLocalizedMessage());
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    JSONObject jsonBody = new JSONObject();

                    /**
                     * Define in your body the name of the table
                     * you want to permorm your find
                     */
                    jsonBody.put("table", "employees");

                    String body = jsonBody.toString();
                    return body.getBytes("utf-8");
                } catch (Exception e) {
                    Log.e("Error: ", e.getLocalizedMessage());
                    return null;
                }
            }
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> params = new HashMap<>();

                /**
                 * Content type must be sent
                 */
                params.put("Content-Type", "application/json");
                /**
                 * Send your developer key
                 */
                params.put("key", ApiCall.DEVELOPER_KEY);

                /**
                 * This is the way you send your TOKEN
                 * if login is necessary
                 */
                params.put("Authorization", "jwt " + ApiCall.TOKEN);

                return params;
            }
        };
        Volley.newRequestQueue(context).add(postRequest);
    }



    /**
     * Deletes a record from server
     */
    public void deleteRecord(
            Context context,
            String id,
            final VolleyCallback callback
    ) {
        String url = this.ENDPOINT + "/record/api/" + id;

        StringRequest postRequest = new StringRequest(Request.Method.DELETE, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        callback.onVolleyResponse(null);
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> params = new HashMap<>();

                /**
                 * Content type must be sent
                 */
                params.put("Content-Type", "application/json");
                /**
                 * Send your developer key
                 */
                params.put("key", ApiCall.DEVELOPER_KEY);

                /**
                 * This is the way you send your TOKEN
                 * if login is necessary
                 */
                params.put("Authorization", "jwt " + ApiCall.TOKEN);

                return params;
            }
        };
        Volley.newRequestQueue(context).add(postRequest);
    }




    /**
     * Search record from server by ID
     */
    public void getRecordById(
            Context context,
            String id,
            final VolleyCallback callback
    ) {
        String url = this.ENDPOINT + "/record/api/find/" + id;

        StringRequest postRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject employees = new JSONObject(response);
                            callback.onVolleyResponse(employees);
                        } catch (JSONException e) {
                            Log.e("ERROR", e.getLocalizedMessage());
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    JSONObject jsonBody = new JSONObject();

                    /**
                     * Define in your body the name of the table
                     * you want to permorm your find
                     */
                    jsonBody.put("table", "employees");

                    String body = jsonBody.toString();
                    return body.getBytes("utf-8");
                } catch (Exception e) {
                    Log.e("Error: ", e.getLocalizedMessage());
                    return null;
                }
            }
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> params = new HashMap<>();

                /**
                 * Content type must be sent
                 */
                params.put("Content-Type", "application/json");
                /**
                 * Send your developer key
                 */
                params.put("key", ApiCall.DEVELOPER_KEY);

                /**
                 * This is the way you send your TOKEN
                 * if login is necessary
                 */
                params.put("Authorization", "jwt " + ApiCall.TOKEN);

                return params;
            }
        };
        Volley.newRequestQueue(context).add(postRequest);
    }


    /**
     * Updates an existing record
     */
    public void updateRecord(
            Context context,
            String id,
            final String name,
            final int age,
            final String position,
            final VolleyCallback callback
    ) {
        String url = this.ENDPOINT + "/record/api/" + id;

        StringRequest postRequest = new StringRequest(Request.Method.PUT, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonResponse = new JSONObject(response);
                            callback.onVolleyResponse(jsonResponse);
                        } catch (JSONException e) {
                            Log.e("ERROR", e.getLocalizedMessage());
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                }
        ) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                try {
                    JSONObject jsonBody = new JSONObject();

                    /**
                     * Define in your body the name of the table
                     * you want to permorm your find
                     */
                    jsonBody.put("table", "employees");

                    /**
                     * This is the content of our table
                     */
                    JSONObject data = new JSONObject();
                    data.put("name", name);
                    data.put("age", age);
                    data.put("position", position);
                    jsonBody.put("data", data);

                    /**
                     * We can also define security for this record
                     */
                    jsonBody.put("readPublic", true);
                    jsonBody.put("writePublic", true);

                    /** Your user's IDs who can read this record separated by comma */
                    jsonBody.put("readUsers", new JSONArray());

                    /** Your user's IDs who can write this record separated by comma */
                    jsonBody.put("writeUsers", new JSONArray());

                    String body = jsonBody.toString();
                    return body.getBytes("utf-8");

                } catch (Exception e) {
                    Log.e("Error: ", e.getLocalizedMessage());
                    return null;
                }
            }
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> params = new HashMap<>();

                /**
                 * Content type must be sent
                 */
                params.put("Content-Type", "application/json");
                /**
                 * Send your developer key
                 */
                params.put("key", ApiCall.DEVELOPER_KEY);

                /**
                 * This is the way you send your TOKEN
                 * if login is necessary
                 */
                params.put("Authorization", "jwt " + ApiCall.TOKEN);

                return params;
            }
        };
        Volley.newRequestQueue(context).add(postRequest);
    }
}
