module.exports = {
  expo: {
    name: "Raaga",
    slug: "musicapp",
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
      package: "com.pavankumar.raaga2",
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
      supabaseUrl:"https://pqsodsdarprppbvesfel.supabase.com",
      supabaseAnonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxc29kc2RhcnBycHBidmVzZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTYzMDUsImV4cCI6MjA4NTMzMjMwNX0.veXsW-48V44QOXw2AJ8_O5zNrNXIundIPGbe4zM96ts"
    }
  }
};
