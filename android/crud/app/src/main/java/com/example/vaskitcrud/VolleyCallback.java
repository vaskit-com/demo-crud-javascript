package com.example.vaskitcrud;
import org.json.JSONObject;
/**
 * Simple interface for calling back responses
 * from the server using Volley
 */
public interface VolleyCallback {
    public void onVolleyResponse(JSONObject response);
}
