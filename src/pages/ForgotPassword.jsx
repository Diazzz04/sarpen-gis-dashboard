import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "Gagal mengirim email reset password:",
        error
      );

      setError(
        error.message ||
        "Gagal mengirim email reset password."
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
            <Mail size={26} />
          </div>

          <h1>
            Lupa Password
          </h1>

          <p>
            Masukkan email akun Anda untuk
            mendapatkan link reset password.
          </p>

        </div>


        {success ? (

          <div className="auth-success">

            <CheckCircle size={42} />

            <h3>
              Email berhasil dikirim
            </h3>

            <p>
              Jika email tersebut terdaftar,
              link untuk mengatur ulang password
              telah dikirim.
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
              Email
            </label>

            <div className="auth-input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
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
                ? "Mengirim..."
                : "Kirim Link Reset Password"}
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

export default ForgotPassword;