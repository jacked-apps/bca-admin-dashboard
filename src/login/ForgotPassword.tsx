import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./login.css";
import { TextInput } from "../components/TextInput";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset Password email sent!");
      navigate("/login");
    } catch (error) {
      console.error("Error sending reset password email", error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="login-form">
      <h2>Forgot Password</h2>
      <TextInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <div style={{ fontSize: "12px", maxWidth: "70%" }}>
        Enter your email address. An Email will be sent with instructions to
        reset your password.
      </div>
      <button className="mt-4 mb-12" type="submit">
        Reset Password
      </button>

      <Link to="/login" style={{ marginTop: "45px" }}>
        Back To Login
      </Link>
    </form>
  );
};
