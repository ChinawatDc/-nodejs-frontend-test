"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./login.css";
const baseEndpoint = process.env.NEXT_PUBLIC_BASEURL_API;

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login";
      const response = await axios.post(`${baseEndpoint}${endpoint}`, formData);

      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        Cookies.set("access_token", response.data.access_token, {
          expires: 1,
          secure: true,
        });
        Cookies.set("refresh_token", response.data.refresh_token, {
          expires: 7,
          secure: true,
        });
        router.push("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Something went wrong"
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => {
      const newState = !prev;
      setFormData({ name: "", email: "", password: "" }); // รีเซ็ตค่า formData
      return newState;
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-switch">
        <label className="login-switch">
          <input
            type="checkbox"
            className="login-toggle"
            checked={isSignUp}
            onChange={toggleSignUp}
          />
          <span className="login-slider"></span>
          <span className="login-card-side"></span>
          <div
            className={`login-flip-card__inner ${
              isSignUp ? "login-flipped" : ""
            }`}
          >
            <div className="login-flip-card__front">
              <div className="login-title">Log in</div>
              <form className="login-flip-card__form" onSubmit={onSubmit}>
                <input
                  className="login-flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
                <input
                  className="login-flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
                {error && <p className="error">{error}</p>}
                <button className="login-flip-card__btn" disabled={loading}>
                  {loading ? "Logging in..." : "Let’s go!"}
                </button>
              </form>
            </div>
            <div className="login-flip-card__back">
              <div className="login-title">Sign up</div>
              <form className="login-flip-card__form" onSubmit={onSubmit}>
                <input
                  className="login-flip-card__input"
                  name="name"
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
                <input
                  className="login-flip-card__input"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
                <input
                  className="login-flip-card__input"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
                {error && <p className="error">{error}</p>}
                <button className="login-flip-card__btn" disabled={loading}>
                  {loading ? "Signing up..." : "Confirm!"}
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
