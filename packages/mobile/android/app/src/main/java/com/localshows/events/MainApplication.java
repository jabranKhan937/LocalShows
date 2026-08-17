package com.localshows.events.events;

import androidx.multidex.MultiDexApplication;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import io.radar.react.RNRadarPackage;
import io.radar.sdk.Radar;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.reactnativecommunity.picker.RNCPickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnative.ivpusic.imagepicker.*;

import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import com.horcrux.svg.SvgPackage;

import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import android.os.Build;
import org.jetbrains.annotations.Nullable;
import android.content.BroadcastReceiver; 
import android.content.Intent; 
import android.content.IntentFilter;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
//import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;

// Added for Reanimated JSI
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here
          packages.add(new RNCWebViewPackage());
          packages.add(new RNCPickerPackage());
          packages.add(new ImagePickerPackage());
          packages.add(new RNAndroidLocationEnablerPackage());
          packages.add(new RNFusedLocationPackage());
          packages.add(new SvgPackage());
          packages.add(new RNGestureHandlerPackage());
          packages.add(new FastImageViewPackage());
          // packages.add(new AsyncStoragePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected JSIModulePackage getJSIModulePackage() {
          // Disabled to avoid potential startup crashes
          return null;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
      return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
    } else {
      return super.registerReceiver(receiver, filter);
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // try {
    //   Radar.initialize(this, "prj_live_pk_dc7bbaa26e61343e20a955965be95a7035dd611a");
    // } catch (Throwable t) {
    //   t.printStackTrace();
    // }
    SoLoader.init(this, /* native exopackage */ false);
    try {
      FacebookSdk.sdkInitialize(getApplicationContext());
    } catch (Throwable t) {
      t.printStackTrace();
    }
    
    // initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates.
   * Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        
        Class<?> aClass = Class.forName("com.myprojectname.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
