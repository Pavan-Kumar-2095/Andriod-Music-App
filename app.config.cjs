module.exports = {
  expo: {
    name: "Raaga",
    slug: "mobileapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "mobileapp",
    userInterfaceStyle: "automatic",

    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["audio"]
      }
    },

    android: {
      package: "com.pavankumar.raaga",
      versionCode: 1,
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

    experiments: {
      typedRoutes: true
    },

    extra: {
      router: {},
      eas: {
        projectId:"449314a1-8e01-474c-8006-037d2eac90bd"
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
};
