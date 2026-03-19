import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, SignIn, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

const TokenDisplay = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState("");

  return (
    <div>
      <button onClick={async () => setToken(await getToken() ?? "")}>
        Get Token
      </button>
      {token && (
        <textarea
          style={{ width: "100%", height: 200, marginTop: 10 }}
          value={token}
          readOnly
        />
      )}
    </div>
  );
};

import { useState } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <TokenDisplay />
      </SignedIn>
    </ClerkProvider>
  </StrictMode>
);