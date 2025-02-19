"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react"

import { setToken, setRefreshToken, deleteTokens, isTokenExpired } from "@/lib/authClient";
import { deleteTokens as deleteServerTokens } from "@/lib/authServer";

interface AuthContextProps {
    isAuthenticated: boolean
    authToken: string | null
    username: string
    login: (username?: string, role?: string, authToken?: string, refreshToken?: string) => void
    logout: () => void
    loginRequired: () => void
}

const AuthContext = createContext<AuthContextProps | null>(null)

const LOGIN_REDIRECT_URL = "/home"
const LOGOUT_REDIRECT_URL = "/login"
const LOGIN_REQUIRED_URL = "/login"

const LOCAL_STORAGE_KEY = "auth-token"
const LOCAL_USERNAME_KEY = "username"


interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const checkToken = async () => {
            const token = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (token) {
                if (isTokenExpired(token)) {
                    loginRequired();

                    return;
                }

                setIsAuthenticated(true);
                setAuthToken(token);
            } else {
                loginRequired();

                return;
            }

            const storedUsername = localStorage.getItem(LOCAL_USERNAME_KEY);

            if (storedUsername) {
                setUsername(storedUsername);
            }
        };

        checkToken();
    }, [isClient]);

    const login = (username?: string, authToken?: string, refreshToken?: string) => {
        if (!isClient) return;

        if (authToken) {
            setToken(authToken);
            setAuthToken(authToken);
            setIsAuthenticated(true);
        }
        if (refreshToken) {
            setRefreshToken(refreshToken);
        }

        if (username) {
            localStorage.setItem(LOCAL_USERNAME_KEY, username);
            setUsername(username);
        } else {
            localStorage.removeItem(LOCAL_USERNAME_KEY);
            setUsername("");
        }

        const nextUrl = searchParams.get("next");
        const invalidNextUrls = ["/login", "/logout", "/register"];
        const nextValidUrl = nextUrl && nextUrl.startsWith("/") && !invalidNextUrls.includes(nextUrl);

        if (nextValidUrl) {
            router.replace(nextUrl);
        } else {
            router.replace(LOGIN_REDIRECT_URL);
        }
    };

    const logout = () => {
        if (!isClient) return;

        setIsAuthenticated(false);
        deleteTokens();
        deleteServerTokens();
        localStorage.removeItem(LOCAL_USERNAME_KEY);

        router.replace(LOGOUT_REDIRECT_URL);
    };

    const loginRequired = () => {
        if (!isClient) return;

        setIsAuthenticated(false);
        deleteTokens();
        deleteServerTokens();
        localStorage.removeItem(LOCAL_USERNAME_KEY);
        const loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`;

        router.replace(loginWithNextUrl);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout, loginRequired, username }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}