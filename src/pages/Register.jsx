import { useState } from "react";
import { useAuth } from "../AuthContext";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

export default function Register({ onLogin }) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(
        fullName,
        email,
        password
      );

      if (!data.session) {
        setSuccess(
          "Registrasi berhasil. Silakan cek email Anda untuk melakukan verifikasi."
        );
      }
    } catch (error) {
      setError(
        error.message || "Registrasi gagal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <UserPlus size={24} />
          </div>

          <h1>Buat Akun</h1>
          <p>SARpen GIS Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Nama Lengkap</label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
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

          <div className="auth-field">
            <label>Konfirmasi Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? (
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

          {success && (
            <div
              className="auth-error"
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Membuat akun..."
              : "Register"}
          </button>

        </form>

        <div className="register-text" style={{ marginTop: 22 }}>
          Sudah punya akun?

          <button onClick={onLogin}>
            Login
          </button>
        </div>

      </div>
    </div>
  );
}