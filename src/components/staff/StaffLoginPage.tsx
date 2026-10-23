import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { adminPage, forgotPasswordPage } from "../site/navigation";
import { AuthLayout } from "./AuthLayout";
import { goTo, simulatedRequest } from "./session";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { email?: string; password?: string };

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {};
    if (!email.trim()) found.email = "Enter your work email address.";
    else if (!emailPattern.test(email.trim())) found.email = "Enter a valid email address.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    if (found.email || found.password) {
      document.getElementById(found.email ? "staff-email" : "staff-password")?.focus();
      return;
    }
    setSubmitting(true);
    await simulatedRequest();
    goTo(adminPage);
  };

  return (
    <AuthLayout
      title="Staff sign in"
      intro="Welcome back. Sign in with your Sentinel Africa work account to open the staff console."
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label htmlFor="staff-email">Work email</label>
          <input
            id="staff-email"
            type="email"
            autoComplete="username"
            placeholder="name@sentinelafricaconsulting.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "staff-email-error" : undefined}
          />
          {errors.email && (
            <p className="auth-error" id="staff-email-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="staff-password">Password</label>
            <a href={forgotPasswordPage}>Forgot password?</a>
          </div>
          <div className="auth-password">
            <input
              id="staff-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "staff-password-error" : undefined}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="auth-error" id="staff-password-error">
              {errors.password}
            </p>
          )}
        </div>
        <label className="auth-check">
          <input type="checkbox" name="remember" />
          Keep me signed in on this device
        </label>
        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle className="auth-spin" size={17} aria-hidden="true" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <p className="auth-note">
        Need an account? Ask the console administrator to invite you with your work email.
      </p>
    </AuthLayout>
  );
}
