
import { useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, Eye, EyeOff,
  HeartPulse, LockKeyhole, Mail, Phone, UserRound,
  CalendarDays, ShieldCheck, Sparkles
} from "lucide-react";
import "./PatientAuth.css";

const API = "http://127.0.0.1:8000";

export default function PatientAuth({ onBack, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: ""
  });

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "signup" ? "/auth/register" : "/auth/login";

      const payload =
        mode === "signup"
          ? {
              ...form,
              age: Number(form.age)
            }
          : {
              email: form.email,
              password: form.password
            };

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Authentication failed."
        );
      }

      if (mode === "signup") {
        setMode("login");
        setForm((previous) => ({ ...previous, password: "" }));
        setError("");
        return;
      }

      if (!data.access_token) {
        throw new Error("Login response did not include a token.");
      }

      onSuccess(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="patient-auth">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <header className="auth-navbar">
        <button className="auth-brand" onClick={onBack}>
          <span className="auth-brand-icon"><Activity size={23} /></span>
          <span>MediQueue</span>
        </button>
        <button className="auth-back" onClick={onBack}>
          <ArrowLeft size={17} /> Back to Home
        </button>
      </header>

      <main className="auth-container">
        <section className="auth-intro">
          <div className="auth-pill">
            <Sparkles size={15} /> YOUR HEALTHCARE COMPANION
          </div>

          <h1>
            Healthcare,
            <br />
            <span>reimagined.</span>
          </h1>

          <p>
            Your personal gateway to smarter appointments,
            transparent waiting times, and effortless hospital visits.
          </p>

          <div className="auth-benefits">
            <div>
              <span><CalendarDays size={22} /></span>
              <div>
                <strong>Effortless Appointments</strong>
                <small>Book consultations in just a few clicks.</small>
              </div>
            </div>
            <div>
              <span><HeartPulse size={22} /></span>
              <div>
                <strong>Real-Time Queue Tracking</strong>
                <small>Stay informed about your waiting time.</small>
              </div>
            </div>
            <div>
              <span><ShieldCheck size={22} /></span>
              <div>
                <strong>Private Account Access</strong>
                <small>Your account is protected by secure login.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-icon"><UserRound size={25} /></div>
            <span>PATIENT ACCESS</span>
          </div>

          <h2>
            {mode === "signup" ? "Establish Profile" : "Welcome Back"}
          </h2>
          <p className="auth-subtitle">
            {mode === "signup"
              ? "Create your patient account to begin your healthcare journey."
              : "Sign in to access your personal patient dashboard."}
          </p>

          <div className="auth-switch">
            <button
              type="button"
              className={mode === "signup" ? "selected" : ""}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={mode === "login" ? "selected" : ""}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <label>Full Name</label>
                <div className="auth-input">
                  <UserRound size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
              </>
            )}

            <label>Email Address</label>
            <div className="auth-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="auth-input">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === "signup" && (
              <>
                <div className="auth-two-columns">
                  <div>
                    <label>Age</label>
                    <div className="auth-input">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Your age"
                        value={form.age}
                        onChange={(e) => update("age", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label>Gender</label>
                    <div className="auth-input">
                      <select
                        value={form.gender}
                        onChange={(e) => update("gender", e.target.value)}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <label>Phone Number</label>
                <div className="auth-input">
                  <Phone size={18} />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit phone number"
                    required
                  />
                </div>
              </>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create Patient Account"
                : "Sign In to Dashboard"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-bottom">
            {mode === "signup"
              ? "Already have an account?"
              : "New to MediQueue?"}
            <button
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setError("");
              }}
            >
              {mode === "signup" ? "Sign In" : "Create Account"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
