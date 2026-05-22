import { useEffect, useState } from 'react';
import { consumePendingLoginNext, sanitizeNextPath } from '../authRouting';
import { clearStoredTokens, getCurrentUser, storeTokens } from '../authApi';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const setErrorSafe = (value: string) => {
      if (!isMounted) return;
      setError(value);
      setIsProcessing(false);
    };

    const handleCallback = async () => {
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      const searchParams = new URLSearchParams(window.location.search);
      const errorParam = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');

      if (errorParam) {
        setErrorSafe(errorDesc || errorParam);
        return;
      }

      if (!accessToken || !refreshToken) {
        setErrorSafe('Missing authentication tokens');
        return;
      }

      const searchNextPath = searchParams.get('next');
      const pendingNextPath = consumePendingLoginNext();
      const nextPath = sanitizeNextPath(searchNextPath ?? pendingNextPath ?? '/dashboard');

      try {
        storeTokens({
          accessToken,
          refreshToken,
          tokenType: 'Bearer',
          expiresIn: 3600,
        });

        await getCurrentUser();
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.replace(nextPath);
      } catch (err) {
        clearStoredTokens();
        setErrorSafe(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, []);

  const shellClassName = 'ff-public-shell ff-public-app-shell fixed inset-0 flex items-center justify-center px-4 py-10 text-white';

  if (error) {
    return (
      <div data-testid="auth-callback-shell" className={shellClassName}>
        <div data-testid="auth-callback-panel" className="ff-public-page-panel-strong w-full max-w-md rounded-[28px] p-8 shadow-2xl text-center">
          <h2 className="font-public text-2xl font-bold tracking-[-0.04em] text-white mb-3">Authentication Error</h2>
          <p className="mb-6 text-sm text-red-100/90">{error}</p>
          <button
            onClick={() => window.location.assign('/login')}
            className="ff-public-cta-primary w-full px-4 py-3 text-base"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="auth-callback-shell" className={shellClassName}>
      <div data-testid="auth-callback-panel" className="ff-public-page-panel w-full max-w-sm rounded-[28px] p-8 shadow-2xl text-center">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-blue-300" />
        <p className="font-public text-lg font-semibold tracking-[-0.03em] text-white">
          {isProcessing ? 'Completing sign in...' : 'Redirecting...'}
        </p>
        <p className="mt-2 text-sm text-slate-300">Bringing your FlyingForge workspace online.</p>
      </div>
    </div>
  );
}
