package org.troynemul.app;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import android.content.Intent;
import android.net.Uri;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.PrintWriter;

public class JSInterface {

	public static final int uio_fullscreen =
			View.SYSTEM_UI_FLAG_LAYOUT_STABLE
					| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
					| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
					| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
					| View.SYSTEM_UI_FLAG_FULLSCREEN
					| View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
	public static int uio_default = 0;
	protected Context ctx;
	protected MainActivity activity;

	JSInterface(MainActivity activity, WebView webView, WebSettings webSettings) {
		this.activity = activity;
		this.ctx = (Context) activity;
		uio_default = activity.getWindow().getDecorView().getSystemUiVisibility();
	}

	//// JS API

	@JavascriptInterface
	public Activity getActivity() {
		return activity;
	}

	@JavascriptInterface
	public String getLocale() {
		return activity.getResources().getConfiguration().locale.toString();
	}

	@JavascriptInterface
	public void openURL(String url) {
	  Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
	  activity.startActivity(browserIntent);
	}

	// MESSAGES
	@JavascriptInterface
	public void showToast(String str, int len) {
		Toast.makeText(ctx, str, len).show();
	}

	@JavascriptInterface
	public void showMessage(String title, String message) {
		activity.showMessage(title, message);
	}

	@JavascriptInterface
	public int sendPostRequest(String sourceURL, String requestBody) {
        HttpURLConnection connection = null;

        try {
            // 1. Create a URL object
            URL url = new URL(sourceURL);

            // 2. Open a connection to the URL
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");

            // 4. Set headers using setRequestProperty()
            connection.setRequestProperty("Content-Type", "application/json"); // Example: Content-Type header
            connection.setRequestProperty("X-Api-Key", "marichiweuamulepetainweichan"); // Example: Authorization header

            // 5. Set timeouts (optional, but good practice)
            connection.setReadTimeout(5000); // 15 seconds read timeout
            connection.setConnectTimeout(5000); // 15 seconds connection timeout

             // 8. Get the OutputStream and write the request body
             OutputStream os = connection.getOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");
             osw.write(requestBody);
             osw.flush();
             osw.close();
             os.close();

            connection.connect();

            // 6. Get the response code
            int responseCode = connection.getResponseCode();
            //System.out.println("Response Code: " + responseCode);

            // 7. Read the response (for a GET request)
            if (responseCode == HttpURLConnection.HTTP_OK) { // Check if the request was successful
                InputStream inputStream = connection.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                String line;
                StringBuilder response = new StringBuilder();

                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }

                reader.close();
                inputStream.close();

                return responseCode;
            } else {
                return responseCode;
            }

        } catch (Exception e) {
        } finally {
            // 8. Disconnect the connection
            if (connection != null) {
                connection.disconnect();
            }
        }
        return -1;
	}

  private String getStackStrace(Exception e) {
      StringWriter sw = new StringWriter();
      PrintWriter pw = new PrintWriter(sw);
      e.printStackTrace(pw);
      String sStackTrace = sw.toString(); // stack trace as a string
      return sStackTrace;
  }

	@JavascriptInterface
	public void showError(String title, String message) {
		activity.showError(title, message);
	}

	@JavascriptInterface
	public String[] getMsgOptions() {
		return new String[]{MainActivity.msgTitle};
	}

	@JavascriptInterface
	public void setMsgOptions(String[] options) {
		MainActivity.msgTitle = options[0];
	}

	@JavascriptInterface
	public int getOrientation() {
		return activity.getRequestedOrientation();
	}

	// UI
	@JavascriptInterface
	public void setOrientation(int state) {
		activity.runOnUiThread(() -> {
			/*
				UNSPECIFIED     = -1
				LANDSCAPE       = 0
				PORTRAIT        = 1

				(Check ActivityInfo.SCREEN_ORIENTATION_...)
			 */
			activity.setRequestedOrientation(state);
		});
	}

	@JavascriptInterface
	public void showFullscreen(boolean state) {
		activity.runOnUiThread(() -> {
			if (state) {
				activity.getWindow().getDecorView().setSystemUiVisibility(uio_fullscreen);
			} else {
				activity.getWindow().getDecorView().setSystemUiVisibility(uio_default);
			}
		});
	}

	@JavascriptInterface
	public boolean isFullscreen() {
		return (uio_fullscreen == activity.getWindow().getDecorView().getSystemUiVisibility());
	}

	@JavascriptInterface
	public void showActionBar(boolean state) {
		if (isFullscreen()) {
			return;
		}

		activity.runOnUiThread(() -> {
			if (state) {
				if (activity.getSupportActionBar() != null && !activity.getSupportActionBar().isShowing()) {
					activity.getSupportActionBar().show();
				}
			} else {
				if (activity.getSupportActionBar() != null && activity.getSupportActionBar().isShowing()) {
					activity.getSupportActionBar().hide();
				}
			}
		});
	}

	@JavascriptInterface
	public boolean getActionBarVisibility() {
		return (activity.getSupportActionBar() != null && activity.getSupportActionBar().isShowing());
	}
}
