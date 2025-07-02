import { App } from "@/app/app";
import { AuthProvider } from "@/lib/auth-provider";

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
