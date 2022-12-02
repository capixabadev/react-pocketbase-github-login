import { AuthProviderInfo } from "pocketbase";
import { useEffect, useMemo, useState } from "react";
import pb from "../lib/pocketbase";

function Home() {
  const [providers, setProviders] = useState<AuthProviderInfo[]>();

  useEffect(() => {
    pb.collection("users")
      .listAuthMethods()
      .then(({ authProviders }) => {
        setProviders(authProviders);
      });
  }, []);

  const isAuthenticated = useMemo(() => pb.authStore.isValid, []);

  const handleLogin = (provider: AuthProviderInfo) => {
    localStorage.setItem("provider", JSON.stringify(provider));
    location.href = provider.authUrl;
  };

  const handleLogout = () => {
    pb.authStore.clear();
    // refresh the page
    location.reload();
  };

  return (
    <div className="Home">
      <h1>Home</h1>

      {isAuthenticated && <h2>Olá, {pb.authStore.model?.name}</h2>}

      {!isAuthenticated ? (
        providers?.map((provider) => (
          <button key={provider.name} onClick={() => handleLogin(provider)}>
            Login com {provider.name}
          </button>
        ))
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}

export default Home;
