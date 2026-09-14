import { useState, type SubmitEvent } from "react";
import { useAuth } from "./AuthContext";
import styles from "./Login.module.css";
import intl from "../locales/en.json";
import { useNavigate } from "react-router";

const EyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-eye-off h-5 w-5"
  >
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);
const Eye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-eye h-5 w-5"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/myseries", { replace: true }); // Redirect to the user's series page after successful login
    } catch (err) {
      setError("Failed to sign in. Check your credentials.");
      console.error(err);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>{intl.welcomeBack}</h2>

        {error && <div className={styles.loginError}>{intl.LoginError}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div>
            <label className={styles.loginLabel}>{intl.Email}</label>
            <input
              type="email"
              required
              className={styles.loginInput}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={styles.loginLabel}>{intl.Password}</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type={showPassword ? "text" : "password"}
                required
                className={styles.loginInput}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.loginEyeButton}
                aria-label={
                  showPassword ? intl.HidePassword : intl.ShowPassword
                }
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className={styles.loginButton}
          >
            {loading ? intl.SigningIn : intl.LoginButton}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
