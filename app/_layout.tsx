import AuthProvider, { useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (isMounted && !inAuthGroup && !user && !isLoadingUser) {
      router.replace("/auth");
    } else if (isMounted && user && inAuthGroup && !isLoadingUser) {
      router.replace("/"); // Redirect to home if user is authenticated and in auth group
    }
  }, [user, router, segments, isMounted, isLoadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </RouteGuard>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
