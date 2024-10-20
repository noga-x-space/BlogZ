import { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogin, setIsLogin] = useState(true);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [focusedButton, setFocusedButton] = useState("login");

  const history = useHistory();

  console.log(cookies, "cookies");

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });
    const data = await response.json();

    console.log("data token: ", data.token, " data: ", data);
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("UserName", data.userName);
      setCookie("AuthToken", data.token);

      console.log("you made it in");
      //refresh the page
      // window.location.reload();
      history.push("/");
    }
  };

  const handleButtonToggle = (button) => {
    setFocusedButton(button);
  };

  return (
    <div className="auth-container">
      {!cookies.UserName && (
        <>
          <form>
            <h2>{isLogin ? "Log in" : "Register"}</h2>
            <input
              type="text"
              placeholder="user name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <input
              type="submit"
              onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
              className="create"
              value="submit"
            />
            {error && <p>{error}</p>}
          </form>
          <div className="auth-options">
            <button
              className={focusedButton === "signup" ? "active" : ""}
              tabindex="0"
              onClick={() => {
                viewLogin(false);
                handleButtonToggle("signup");
              }}
            >
              Sign Up
            </button>
            <button
              tabindex="0"
              className={focusedButton === "login" ? "active" : ""}
              onClick={() => {
                viewLogin(true);
                handleButtonToggle("login");
              }}
            >
              Login
            </button>
          </div>
        </>
      )}
      {cookies.UserName && (
        <h3>
          You are currently logged in as{" "}
          <span
            style={{
              backgroundColor: "rgb(250,250,250)",
              color: "rgb(100,150,220)",
            }}
          >
            {cookies.UserName}
          </span>
          . Please logout before logging in with a different account.
        </h3>
      )}
    </div>
  );
};

export default Auth;
