package br.com.furb.facialrecognition;

//This sample uses Apache HttpComponents:
//http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/
//https://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/

import java.net.URI;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class CompareFaceService {
	// Replace <Subscription Key> with your valid subscription key.
	private static final String subscriptionKey = "e8b2471724f84e96bc8c9534165aceab";

	// NOTE: You must use the same region in your REST call as you used to
	// obtain your subscription keys. For example, if you obtained your
	// subscription keys from westus, replace "westcentralus" in the URL
	// below with "westus".
	//
	// Free trial subscription keys are generated in the westcentralus region. If
	// you
	// use a free trial subscription key, you shouldn't need to change this region.
	private static final String uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify";

	public static Boolean compare(String faceId1, String faceId2) throws Exception {
		String faceIds = "{\"faceId1\":" + faceId1 + ", \"faceId2\":\"" + faceId2 + "\"}";
		HttpClient httpclient = HttpClientBuilder.create().build();

		try {
			URIBuilder builder = new URIBuilder(uriBase);

			// Prepare the URI for the REST API call.
			URI uri = builder.build();
			HttpPost request = new HttpPost(uri);

			// Request headers.
			request.setHeader("Content-Type", "application/json");
			request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

			// Request body.
			StringEntity reqFaceIds = new StringEntity(faceIds);
			request.setEntity(reqFaceIds);

			// Execute the REST API call and get the response entity.
			HttpResponse response = httpclient.execute(request);
			HttpEntity entity = response.getEntity();

			if (entity != null) {
				// Format and display the JSON response.
				System.out.println("REST Response:\n");

				String jsonString = EntityUtils.toString(entity).trim();
				if (jsonString.charAt(0) == '[') {
					JSONArray jsonArray = new JSONArray(jsonString);
					System.out.println(jsonArray.toString(2));
					throw new Exception("Fail comparing faces");
				} else if (jsonString.charAt(0) == '{') {
					JSONObject jsonObject = new JSONObject(jsonString);
					System.out.println(jsonObject.toString(2));
					JsonElement root = new JsonParser().parse(jsonString);
					return root.getAsJsonObject().get("isIdentical").toString().equals("true");
				} else {
					System.out.println(jsonString);
					throw new Exception("Fail comparing faces");
				}
			}
			throw new Exception("Fail comparing faces");
		} catch (Exception e) {
			// Display error message.
			System.out.println(e.getMessage());
			throw new Exception("Fail comparing faces", e);
		}		
	}
}