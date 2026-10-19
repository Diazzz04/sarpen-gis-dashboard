import { useState } from "react";
import {
  Lock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";

function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError(
        "Password dan konfirmasi password wajib diisi."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password minimal 6 karakter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "Gagal mengubah password:",
        error
      );

      setError(
        error.message ||
        "Gagal mengubah password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon">
            <Lock size={26} />
          </div>

          <h1>
            Reset Password
          </h1>

          <p>
            Masukkan password baru untuk akun Anda.
          </p>

        </div>


        {success ? (

          <div className="auth-success">

            <CheckCircle size={42} />

            <h3>
              Password berhasil diubah
            </h3>

            <p>
              Password Anda sudah diperbarui.
              Silakan login menggunakan password baru.
            </p>

            <button
              type="button"
              className="auth-button"
              onClick={onBackToLogin}
            >
              Kembali ke Login
            </button>

          </div>

        ) : (

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <label>
              Password Baru
            </label>

            <div className="auth-input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={loading}
              />

            </div>


            <label>
              Konfirmasi Password
            </label>

            <div className="auth-input-wrapper">

              <Lock size={18} />

              <input
                type="password"
                placeholder="Masukkan kembali password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={loading}
              />

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
              {loading
                ? "Menyimpan..."
                : "Simpan Password Baru"}
            </button>


            <button
              type="button"
              className="auth-back-button"
              onClick={onBackToLogin}
            >
              <ArrowLeft size={16} />
              Kembali ke Login
            </button>

          </form>

        )}

      </div>

    </div>
  );
}

export default ResetPassword;