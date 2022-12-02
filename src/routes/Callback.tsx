import { AuthProviderInfo } from "pocketbase";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import pb from "../lib/pocketbase";

function Callback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (pb.authStore.isValid) {
      console.log("Already logged in!");
      return;
    }

    const provider: AuthProviderInfo = JSON.parse(
      localStorage.getItem("provider") || "{}"
    );
    const redirectUrl = `${location.origin}/callback`;

    if (!searchParams.has("code")) {
      throw new Error("No code provided");
    }

    if (provider.state !== searchParams.get("state")) {
      throw new Error("Invalid state");
    }

    pb.collection("users")
      .authWithOAuth2(
        provider.name,
        searchParams.get("code") || "",
        provider.codeVerifier,
        redirectUrl
      )
      .then(({ record, meta }) => {
        pb.collection("users").update(record.id, {
          ...record,
          name: meta?.name || record.name,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [searchParams]);

  return (
    <div className="Callback">
      <h1>Callback</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default Callback;
