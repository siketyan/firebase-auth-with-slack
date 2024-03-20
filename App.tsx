import { initializeApp } from "firebase/app";
import { OAuthProvider, type User, getAuth, signInWithRedirect } from "firebase/auth";
import { type FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const firebaseAuth = getAuth(firebaseApp);

export const App: FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    return firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  const handleLogin = async () => {
    await signInWithRedirect(firebaseAuth, new OAuthProvider("oidc.slack"));
  };

  const handleLogout = async () => {
    await firebaseAuth.signOut();
  };

  if (!currentUser) {
    return (
      <div>
        <p>Not Logged In</p>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Logged In</p>
      {currentUser.photoURL && <img alt="" width={128} height={128} src={currentUser.photoURL} />}
      <dl>
        <dt>ID</dt>
        <dd>{currentUser.uid}</dd>
        <dt>Name</dt>
        <dd>{currentUser.displayName}</dd>
        <dt>Email Address</dt>
        <dd>{currentUser.email}</dd>
        <dt>Slack User ID</dt>
        <dd>{currentUser.providerData.find(p => p.providerId === 'oidc.slack')?.uid}</dd>
      </dl>
      <pre>
        {JSON.stringify(currentUser.providerData, null, 2)}
      </pre>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

// biome-ignore lint/style/noNonNullAssertion:
createRoot(document.getElementById("root")!).render(<App />);
