import 'dotenv/config';

export default {
  expo: {
    name: "Raaga",
    slug: "mobileapp",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "mobileapp",
    userInterfaceStyle: "automatic",

    ios: {
      bundleIdentifier: "com.yourname.raaga.dev", // unique for dev/testing
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["audio"] // background music
      }
    },

    android: {
      package: "com.yourname.raaga.dev", // unique for dev/testing
      versionCode: 1,
      permissions: ["FOREGROUND_SERVICE"], // background music
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#E6F4FE"
      }
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],

    experiments: { typedRoutes: true },

    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
};
