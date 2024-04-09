import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

type LogOutProps = {
  type?: "small" | "text" | "default";
};

export const LogoutButton = ({ type = "default" }: LogOutProps) => {
  const classString = type && type !== "default" ? `${type}-button` : "";

  const handleLogOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      toast.info("User logged out");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <button className={classString} onClick={handleLogOut}>
      Log Out
    </button>
  );
};
