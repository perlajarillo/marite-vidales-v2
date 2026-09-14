import { useState, type SubmitEvent } from "react";
import { useAuth } from "../Login/AuthContext";
import { Link } from "react-router";
import intl from "../../locales/en.json";
import styles from "./PasswordReset.module.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resetPassword(email);
      setMessage(intl.resetLinkSent);
    } catch (err) {
      setError((err as Error).message || intl.failedToResetPassword);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetContainer}>
      <div className={styles.resetFormContainer}>
        <h2 className={styles.resetTitle}>{intl.resetPassword}</h2>

        {message && <div className={styles.resetMessage}>{message}</div>}

        {error && <div className={styles.resetError}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={styles.resetLabel}>{intl.Email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.resetInput}
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.resetButton}
          >
            {loading ? intl.sending : intl.sendResetLink}
          </button>
          <Link to="/login" className={styles.backToLoginLink}>
            {intl.backToLogin}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
