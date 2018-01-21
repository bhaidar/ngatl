# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/dick/Library/Android/sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

#-dontshrink
-dontobfuscate
#-dontoptimize
#-dontwarn **

-keepattributes *Annotation*, EnclosingMethod, Exceptions, InnerClasses, LineNumberTable, Signature, SourceFile

# :buildMetadata skips
-dontwarn com.google.android.gms.internal.zzak
-dontwarn com.google.android.gms.internal.zzan
-dontwarn com.google.android.gms.internal.zzao
-dontwarn com.squareup.picasso.OkHttpDownloader
-dontwarn com.zendesk.util.ColorUtils
#-dontwarn okio.Okio
-dontnote com.google.android.gms.internal.zzak
-dontnote com.google.android.gms.internal.zzan
-dontnote com.google.android.gms.internal.zzao
-dontnote com.squareup.picasso.OkHttpDownloader
-dontnote com.zendesk.util.ColorUtils
#-dontnote okio.Okio

# Proguard warnings
-dontwarn javax.annotation.**
-dontwarn okio.*
-dontwarn retrofit2.*
-dontnote javax.annotation.**
-dontnote okio.*
-dontnote retrofit2.*

# Proguard notes
-dontnote com.google.**.internal.*
-dontnote com.google.app*.api.**
-dontnote com.google.**.zz*
-dontnote com.google.zxing.**
-dontnote okhttp3.internal.**

-keep,includedescriptorclasses public class android.**
-keep,includedescriptorclasses public interface android.**
-keep,includedescriptorclasses public enum android.**

-keep,includedescriptorclasses public class com.android.**
-keep,includedescriptorclasses public interface com.android.**
-keep,includedescriptorclasses public enum com.android.**

-keep,includedescriptorclasses public class android.support.** { public *; }
-keep,includedescriptorclasses public interface android.support.** { *; }

-keep,includedescriptorclasses public class com.android.vending.** { public *; }
-keep,includedescriptorclasses public interface com.android.vending.** { *; }

-keep,includedescriptorclasses class com.tns.** { *; }
-keep,includedescriptorclasses public interface com.tns.** { *; }

-keep,includedescriptorclasses class io.nstudio.** { !private *; }
-keep,includedescriptorclasses public interface io.nstudio.** { *; }

-keep,includedescriptorclasses public class com.yalantis.ucrop.UCrop** { public *; }
-keep,includedescriptorclasses public interface com.yalantis.ucrop.** { *; }

-keep,includedescriptorclasses public class net.gotev.uploadservice.** { *; }
-keep,includedescriptorclasses public interface net.gotev.uploadservice.** { *; }
-keep,includedescriptorclasses public enum net.gotev.uploadservice.** { *; }

-keep,includedescriptorclasses class org.nativescript.** { !private *; }
-keep,includedescriptorclasses public interface org.nativescript.** { *; }

-keep,includedescriptorclasses public class com.facebook.shimmer.** { public *; }
-keep,includedescriptorclasses public interface com.facebook.shimmer.** { *; }

######### Camera Plus
-keep,includedescriptorclasses public class io.nstudio.**
-keep,includedescriptorclasses public interface io.nstudio.**


-keep public class * extends java.lang.Exception

######### Telerik
-keep,includedescriptorclasses public class com.telerik.widget.list.** { public *; }
-keep,includedescriptorclasses public interface com.telerik.widget.list.** { *; }
-keep,includedescriptorclasses public class com.telerik.android.primitives.widget.** { public *; }
-keep,includedescriptorclasses public interface com.telerik.android.primitives.widget.** { *; }
-keep,includedescriptorclasses public class com.telerik.localnotifications.** { public *; }
-keep,includedescriptorclasses public interface com.telerik.localnotifications.** { *; }
# for some reason
-dontwarn com.telerik.widget.feedback.**

######## ShowCase CoachMarks
# removed since not used right now however may bring back in Spring 2018
# -keep,includedescriptorclasses public class com.github.amlcurran.showcaseview.** { public *; }
# -keep,includedescriptorclasses public interface com.github.amlcurran.showcaseview.** { *; }
