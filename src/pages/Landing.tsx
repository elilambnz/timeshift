import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { supabase } from "../lib/supabase";

import { Spotlight } from "../components/Spotlight";
import clsx from "clsx";

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [redirectUrl, setRedirectUrl] = useState<string>();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check to see if we have a redirect URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setLoginError(undefined);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl
            ? `${window.location.origin}${redirectUrl}`
            : `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setLoginError(error.message);
      }
      console.error(
        "Error logging in:",
        error.error_description || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid-white/[0.02] relative flex h-screen min-h-[40rem] w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className=" relative z-10  mx-auto w-full max-w-7xl  p-4 pt-20 md:pt-0">
        <div className="flex justify-center">
          <img src="/icon.png" alt="Timeshift" className="h-48 w-48" />
        </div>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
          Ever asked yourself if your international team or jet-setting friends
          are awake? This is the place to check!
        </p>
        <div className="mt-8 flex justify-center">
          <button
            className={clsx(
              "animate-shimmer inline-flex h-12 items-center justify-center gap-3 rounded-md border border-neutral-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50",
              loading && "cursor-not-allowed opacity-50",
            )}
            onClick={handleLogin}
            disabled={loading}
          >
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>

      {loginError && (
        <p className="mt-10 text-center text-sm text-red-600">{loginError}</p>
      )}
    </div>
  );
}
