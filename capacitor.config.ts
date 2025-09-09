import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e255e4b01d404489a2036ee2f9bd5c75',
  appName: 'fin-guide-smart',
  webDir: 'dist',
  server: {
    url: 'https://e255e4b0-1d40-4489-a203-6ee2f9bd5c75.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1e293b",
      showSpinner: false
    }
  }
};

export default config;