package org.troynemul.app;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.ConsoleMessage;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;
import android.os.SystemClock;

import androidx.core.splashscreen.SplashScreen;

import android.os.Build;
import android.content.Context;
import android.graphics.Color;
import android.os.Handler;
import android.net.ConnectivityManager;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

// Function to load all URLs in same webview
class CustomWebViewClient extends WebViewClient {
  public boolean shouldOverrideUrlLoading(WebView view, String url) {
    if (!MainActivity.checkInternetConnection(view.getContext())) {
      view.loadUrl(MainActivity.NO_INTERNET_URL);

    } else {
      view.loadUrl(url);
    }
    return true;
  }

}

public class MainActivity extends AppCompatActivity {

  // Actualizar para modo offline
  //public static final String OFFLINE_URL = "file:///android_asset/index.html";
  public static final String ONLINE_URL = "https://www.troynemul.org/";
  public static final String NO_INTERNET_URL = "file:///android_asset/nointernet.html";
  public static final String KURI = "#000000";
  private final int SPLASH_SCREEN_DELAY = 500;
  private final int RELOAD_AFTER_IN_SECONDS = 60 * 60 * 24;

  public static WebView webView = null;
  public static WebSettings webSettings = null;

  public static boolean canGoBack = true;
  public static boolean updateTitle = true;
  public static String msgTitle = null;
  private boolean keepSplashScreen = true;
  private long startTime = SystemClock.elapsedRealtime();

  // Muestra splash screen por un rato
  @SuppressWarnings("deprecation")
  @SuppressLint({"SetJavaScriptEnabled"})
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    final SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    splashScreen.setKeepOnScreenCondition(() -> keepSplashScreen);

    new Handler().postDelayed(() -> {
      keepSplashScreen = false;
    }, SPLASH_SCREEN_DELAY);

    getSupportActionBar().hide();

    try {

      // Fondo de browser
      webView = findViewById(R.id.webview0);
      webView.setBackgroundColor(Color.parseColor(KURI));

      webView.setWebViewClient(new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
          return false;
        }
      });

      webView.setWebChromeClient(new WebChromeClient() {
        @Override
        public void onProgressChanged(WebView view, int progress) {
          if (!updateTitle) {
            return;
          }

          // Change the Title in ActionBar on changed
          getSupportActionBar().setTitle(view.getTitle());
          super.onProgressChanged(view, progress);
        }

        @Override
        public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
          Toast.makeText(getApplicationContext(), "[" + consoleMessage.messageLevel() + "] " + consoleMessage.message(), Toast.LENGTH_SHORT).show();
          return super.onConsoleMessage(consoleMessage);
        }

        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
          new AlertDialog.Builder(view.getContext())
            .setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message).setPositiveButton("OK",
            (dialogInterface, i) -> {
              result.confirm();
              dialogInterface.cancel();
            }).setOnCancelListener(dialogInterface -> result.cancel()).show();

          return true;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {

          new AlertDialog.Builder(view.getContext()).setCancelable(false)
            .setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message)
            .setPositiveButton("OK", (dialogInterface, i) -> {
              result.confirm();
              dialogInterface.cancel();
            })
            .setNegativeButton("CANCEL", (dialogInterface, i) -> {
              result.cancel();
              dialogInterface.cancel();
            }).show();

          return true;
        }

        @Override
        public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
          final EditText input = new EditText(view.getContext());
          input.setText(defaultValue);

          new AlertDialog.Builder(view.getContext()).setCancelable(false)
            .setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message)
            .setPositiveButton("OK", (dialogInterface, i) -> {
              result.confirm(input.getText().toString());
              dialogInterface.cancel();
            })
            .setNegativeButton("CANCEL", (dialogInterface, i) -> {
              result.cancel();
              dialogInterface.cancel();
            })
            .setView(input).show();

          return true;
        }
      });
      webSettings = webView.getSettings();

      boolean online = true;

      if (online) {
        final CustomWebViewClient c = new CustomWebViewClient();
        webView.setWebViewClient(c);
      }
      // Allows
      webSettings.setJavaScriptEnabled(true);
      webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
      webSettings.setSupportMultipleWindows(true);
      if (!online) {
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
      }
      webSettings.setDisplayZoomControls(false);
      webSettings.setAllowFileAccess(true);
      webSettings.setAllowFileAccessFromFileURLs(true);
      webSettings.setMediaPlaybackRequiresUserGesture(false);
      webSettings.setAllowContentAccess(true);
      webSettings.setDomStorageEnabled(true);
      webSettings.setDatabaseEnabled(true);
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
        String databasePath = this.getApplicationContext().getDir("databases", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
      }
      webSettings.setSupportMultipleWindows(true);
      webSettings.setPluginState(WebSettings.PluginState.ON);
      webSettings.setPluginState(WebSettings.PluginState.ON_DEMAND);
      webSettings.setJavaScriptEnabled(true);
      webSettings.setLoadWithOverviewMode(true);
      webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

      // Setup JavaScriptInterface
      webView.addJavascriptInterface(new JSInterface(this, webView, webSettings), "Android");

      // GO
      if (online) {
        if (!MainActivity.checkInternetConnection(webView.getContext())) {
          webView.loadUrl(NO_INTERNET_URL);
        } else {
          webView.loadUrl(ONLINE_URL);
        }
      } else {
        webView.loadUrl(ONLINE_URL);

      }

    } catch (Exception e) {
      showError("Exception", e.getMessage());
    }
  }

  public static boolean checkInternetConnection(Context context) {

    ConnectivityManager con_manager = (ConnectivityManager)
      context.getSystemService(Context.CONNECTIVITY_SERVICE);

    return (con_manager.getActiveNetworkInfo() != null
      && con_manager.getActiveNetworkInfo().isAvailable()
      && con_manager.getActiveNetworkInfo().isConnected());
  }

  @Override
  public void onResume() {
    super.onResume();

    // Recargar cada dia
    final long elapsedTime = SystemClock.elapsedRealtime() - startTime;
    if(elapsedTime > RELOAD_AFTER_IN_SECONDS * 1000) {
      startTime = SystemClock.elapsedRealtime();
      webView.loadUrl(ONLINE_URL);
    }
  }

  @Override
  public void onBackPressed() {
    if (canGoBack) {
      if (!webView.canGoBack()) {
        super.onBackPressed();
        return;
      }
      webView.goBack();
    }
  }


  // API
  public void showMessage(String title, String message) {
    new AlertDialog.Builder(this)
      .setTitle(title).setMessage(message).setPositiveButton("OK",
      (dialogInterface, i) -> dialogInterface.cancel()
    ).show();
  }

  public void showError(String title, String message) {
    new AlertDialog.Builder(this)
      .setTitle(title).setMessage(message).setPositiveButton("ABORT",
      (dialogInterface, i) -> finishAndRemoveTask()).setCancelable(false).show();
  }
}
