import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  
  import {
    Navigate,
    Outlet,
    useLocation,
  } from "react-router-dom";
  
  import {
    apiRequest,
    clearToken,
    getToken,
    saveToken,
    SESSION_EXPIRED,
  } from "../api/client";
  
  const AuthContext = createContext(null);
  
  export function AdminAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const revision = useRef(0);
  
    const logout = useCallback(() => {
      revision.current += 1;
      clearToken();
      setUser(null);
      setError("");
      setLoading(false);
    }, []);
  
    const verifySession = useCallback(async () => {
      const current = ++revision.current;
  
      setLoading(true);
      setError("");
  
      try {
        if (!getToken()) {
          setUser(null);
          return;
        }
  
        const result = await apiRequest("/auth/me", {
          authenticated: true,
        });
  
        if (current !== revision.current) return;
  
        if (!result.data?._id) {
          throw new Error(
            "The server returned an invalid user profile."
          );
        }
  
        setUser(result.data);
      } catch (failure) {
        if (current !== revision.current) return;
  
        setUser(null);
  
        if (failure.status === 401 || failure.status === 403) {
          clearToken();
        } else {
          setError(failure.message);
        }
      } finally {
        if (current === revision.current) {
          setLoading(false);
        }
      }
    }, []);
  
    useEffect(() => {
      window.addEventListener(SESSION_EXPIRED, logout);
      verifySession();
  
      return () => {
        revision.current += 1;
        window.removeEventListener(SESSION_EXPIRED, logout);
      };
    }, [logout, verifySession]);
  
    const login = async (email, password) => {
      const current = ++revision.current;
  
      clearToken();
      setUser(null);
      setError("");
  
      try {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: {
            email: email.trim(),
            password,
          },
        });
  
        if (current !== revision.current) {
          throw new Error("Sign-in cancelled. Please try again.");
        }
  
        if (!result.data?.token) {
          throw new Error("No authentication token was returned.");
        }
  
        saveToken(result.data.token);
  
        const profile = await apiRequest("/auth/me", {
          authenticated: true,
        });
  
        if (current !== revision.current) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }
  
        if (!profile.data?._id || profile.data.role !== "admin") {
          throw new Error(
            "This portal requires an administrator account."
          );
        }
  
        setUser(profile.data);
      } catch (failure) {
        if (current === revision.current) {
          clearToken();
          setUser(null);
        }
  
        throw failure;
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          error,
          login,
          logout,
          verifySession,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAdminAuth() {
    return useContext(AuthContext);
  }
  
  export function ProtectedAdminRoute() {
    const {
      user,
      loading,
      error,
      logout,
      verifySession,
    } = useAdminAuth();
  
    const location = useLocation();
  
    if (loading) {
      return (
        <main style={{ padding: 40 }} role="status">
          Checking your session…
        </main>
      );
    }
  
    if (error) {
      return (
        <main style={{ padding: 40 }}>
          <p role="alert">{error}</p>
          <button onClick={verifySession}>Retry</button>{" "}
          <button onClick={logout}>Return to sign in</button>
        </main>
      );
    }
  
    if (!user) {
      return (
        <Navigate
          to="/admin/login"
          replace
          state={{ from: location.pathname }}
        />
      );
    }
  
    if (user.role !== "admin") {
      return (
        <main style={{ padding: 40 }}>
          <h1>Access denied</h1>
          <p>An administrator account is required.</p>
          <button onClick={logout}>Sign out</button>
        </main>
      );
    }
  
    return <Outlet />;
  }