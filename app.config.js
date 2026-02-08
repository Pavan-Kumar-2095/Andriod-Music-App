export default {
  expo: {
    name: "Raaga",
    slug: "mobileapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "mobileapp",
    userInterfaceStyle: "automatic",

    ios: { supportsTablet: true, infoPlist: { UIBackgroundModes: ["audio"] } },
    android: {
      package: "com.anonymous.mobileapp",
      versionCode: 1,
      permissions: ["FOREGROUND_SERVICE"], // 🔹 Required for background playback
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
      router: {},
      eas: {
        projectId: "89628e76-6a53-4519-a81d-5377763fac76"
      },
      supabaseUrl: "https://pqsodsdarprppbvesfel.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc29kc2RhcnBycHBidmVzZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTYzMDUsImV4cCI6MjA4NTMzMjMwNX0.veXsW-48V44QOXw2AJ8_O5zNrNXIundIPGbe4zM96ts"
    }
  }
};