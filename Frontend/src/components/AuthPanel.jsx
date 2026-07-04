import { X } from "lucide-react";
import { useAuthPanelState } from "../context/userContext.js";

export default function AuthPanel({ onClose, variant = "dropdown" }) {
  const {
    authMode,
    setAuthMode,
    isLoggedIn,
    formData,
    handleChange,
    message,
    loading,
    handleSubmit,
    handleLogout,
  } = useAuthPanelState(onClose);

  return (
    <div
      className={
        variant === "modal"
          ? "w-full rounded-xl border border-border/80 bg-card shadow-2xl p-6 space-y-4"
          : "absolute right-0 top-full mt-2 w-72 rounded-xl border border-border/80 bg-card shadow-2xl p-6 space-y-4"
      }
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {isLoggedIn
            ? "Account"
            : authMode === "login"
              ? "Log in"
              : "Register"}
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close auth panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!isLoggedIn && (
        <div className="flex rounded-lg bg-muted/80 p-1 gap-1 border border-border/70">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              authMode === "login"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              authMode === "register"
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground"
            }`}
          >
            Register
          </button>
        </div>
      )}

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Log out
        </button>
      ) : (
        <form className="space-y-10" onSubmit={handleSubmit}>
          {authMode === "register" && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </>
          )}
          <input
            type={authMode === "login" ? "text" : "email"}
            name={authMode === "login" ? "username" : "email"}
            placeholder={authMode === "login" ? "Username" : "Email"}
            value={authMode === "login" ? formData.username : formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
          {message && (
            <p className="text-sm font-medium text-muted-foreground">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
          >
            {loading
              ? "Please wait..."
              : authMode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
