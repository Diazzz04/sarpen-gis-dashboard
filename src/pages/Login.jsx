import { useState } from "react";
import { useAuth } from "../AuthContext";
import { LogIn, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

export default function Login({
  onRegister,
  onForgotPassword,
}) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      setError(error.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <LogIn size={24} />
          </div>

          <h1>SARpen GIS</h1>
          <p>Power Supply Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

        </form>

        <button
          className="forgot-button"
          onClick={onForgotPassword}
        >
          Lupa password?
        </button>

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <div className="register-text">
          Belum memiliki akun?
          <button onClick={onRegister}>
            Register
          </button>
        </div>

      </div>
    </div>
  );
}