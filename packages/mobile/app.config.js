module.exports = {
  expo: {
    name: "COSMOS OS",
    slug: "cosmos-os",
    version: "5.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0A0E1A"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cosmos.os"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0A0E1A"
      },
      package: "com.cosmos.os"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-haptics"
    ],
    extra: {
      geminiApiKey: process.env.GEMINI_API_KEY || null,
      claudeApiKey: process.env.CLAUDE_API_KEY || null,
      eas: {
        projectId: "cosmos-os-project-id"
      }
    }
  }
};
