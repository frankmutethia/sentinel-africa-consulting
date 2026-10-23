import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle, MailCheck } from "lucide-react";
import { staffLoginPage } from "../site/navigation";
import { AuthLayout } from "./AuthLayout";
import { simulatedRequest } from "./session";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const found = !value
      ? "Enter your work email address."
      : emailPattern.test(value)
        ? ""
        : "Enter a valid email address.";
    setError(found);
    if (found) {
      event.currentTarget.querySelector("input")?.focus();
      return;
    }
    setSubmitting(true);
    await simulatedRequest();
    setSubmitting(false);
    setSentTo(value);
  };

  if (sentTo)
    return (
      <AuthLayout
        title="Check your inbox"
        intro="If this address belongs to a staff account, a link to choose a new password will arrive shortly."
      >
        <div className="auth-sent" role="status">
          <span>
            <MailCheck size={22} aria-hidden="true" />
          </span>
          <p>
            Sent to <strong>{sentTo}</strong>. If it hasn’t arrived within a few minutes, check your
            spam folder.
          </p>
        </div>
        <a className="auth-submit" href={staffLoginPage}>
          <ArrowLeft size={17} aria-hidden="true" /> Back to sign in
        </a>
        <button type="button" className="auth-text-button" onClick={() => setSentTo("")}>
          Use a different email address
        </button>
      </AuthLayout>
    );

  return (
    <AuthLayout
      title="Reset your password"
      intro="Enter the work email you sign in with and we’ll send you a link to choose a new password."
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field">
          <label htmlFor="reset-email">Work email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="username"
            placeholder="name@sentinelafricaconsulting.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "reset-email-error" : undefined}
          />
          {error && (
            <p className="auth-error" id="reset-email-error">
              {error}
            </p>
          )}
        </div>
        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle className="auth-spin" size={17} aria-hidden="true" /> Sending link…
            </>
          ) : (
            <>
              Send reset link <ArrowRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <a className="auth-return" href={staffLoginPage}>
        <ArrowLeft size={15} aria-hidden="true" /> Back to sign in
      </a>
    </AuthLayout>
  );
}
