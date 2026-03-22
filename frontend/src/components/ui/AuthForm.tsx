import { useRef, useState } from "react";
import { InputBox } from "../../config/config";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import signUpUser from "../../utils/signUpUser";
import signInUser from "../../utils/signInUser";
import { useDispatch } from "react-redux";
import requestPasswordResetOtp from "../../utils/requestPasswordResetOtp";
import resetPasswordWithOtp from "../../utils/resetPasswordWithOtp";

interface authFormPropsType {
  isSignUpPage: boolean;
  switchTab: () => void;
}

const AuthForm = ({ isSignUpPage, switchTab }: authFormPropsType) => {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [inputErrorMsg, setInputErrorMsg] = useState<string>("");
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<
    "requestOtp" | "resetPassword"
  >("requestOtp");
  const [forgotPasswordErrorMsg, setForgotPasswordErrorMsg] = useState("");
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [isForgotPasswordHidden, setIsForgotPasswordHidden] = useState(true);
  const [isForgotConfirmPasswordHidden, setIsForgotConfirmPasswordHidden] =
    useState(true);
  const dispatch = useDispatch();

  function switchIsHidden() {
    setIsHidden((curr) => !curr);
  }

  function resetForgotPasswordState() {
    setIsForgotPasswordView(false);
    setForgotPasswordStep("requestOtp");
    setForgotPasswordErrorMsg("");
    setForgotPasswordData({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setIsForgotPasswordHidden(true);
    setIsForgotConfirmPasswordHidden(true);
  }

  function openForgotPasswordView() {
    setInputErrorMsg("");
    setIsForgotPasswordView(true);
    setForgotPasswordErrorMsg("");
  }

  function closeForgotPasswordView() {
    resetForgotPasswordState();
  }

  function handleSwitchTab() {
    resetForgotPasswordState();
    setInputErrorMsg("");
    switchTab();
  }

  function updateForgotPasswordData(
    field: "email" | "otp" | "password" | "confirmPassword",
    value: string
  ) {
    setForgotPasswordData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleRequestOtp() {
    const didSendOtp = await requestPasswordResetOtp(
      forgotPasswordData.email,
      setForgotPasswordErrorMsg
    );

    if (didSendOtp) {
      setForgotPasswordStep("resetPassword");
    }
  }

  async function handleResetPassword() {
    const didResetPassword = await resetPasswordWithOtp({
      email: forgotPasswordData.email,
      otp: forgotPasswordData.otp,
      password: forgotPasswordData.password,
      confirmPassword: forgotPasswordData.confirmPassword,
      setErrorMsg: setForgotPasswordErrorMsg,
    });

    if (didResetPassword) {
      closeForgotPasswordView();
    }
  }

  return (
    <div className="flex w-full max-w-[600px] flex-col justify-evenly rounded-md bg-bg-surface px-8 p-8 text-text-primary shadow-lg sm:w-3/4 md:w-5/12 lg:w-4/12">
      <div className="pb-4">
        {isForgotPasswordView ? (
          <div>
            <h1 className="text-2xl font-semibold">
              {forgotPasswordStep === "requestOtp"
                ? "Forgot password"
                : "Reset password"}
            </h1>
            <p className="text-sm pt-1">
              {forgotPasswordStep === "requestOtp"
                ? "We'll send a one-time OTP to your Gmail."
                : "Enter the OTP from Gmail and choose a new password."}{" "}
              <span
                className="text-text-secondaryBtn underline cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                onClick={closeForgotPasswordView}
              >
                Back to sign in
              </span>
            </p>
          </div>
        ) : isSignUpPage ? (
          <div>
            <h1 className="text-2xl font-semibold">Sign up</h1>
            <p className="text-sm pt-1">
              Create an account or{" "}
              <span
                className="text-text-secondaryBtn underline cursor-pointer opacity-80 hover:opacity-100 transition-opacity "
                onClick={handleSwitchTab}
              >
                sign in
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="text-sm pt-1">
              Already an existing user or {""}
              <span
                className="text-text-secondaryBtn underline cursor-pointer opacity-80 hover:opacity-100 transition-opacity "
                onClick={handleSwitchTab}
              >
                sign up
              </span>
            </p>
          </div>
        )}
      </div>

      <div className=" w-full  flex flex-col gap-4">
        {isForgotPasswordView ? (
          <>
            <InputBox
              placeholder="Email"
              val={forgotPasswordData.email}
              onChangeHandler={(e) =>
                updateForgotPasswordData("email", e.target.value)
              }
            />

            {forgotPasswordStep === "resetPassword" && (
              <>
                <InputBox
                  placeholder="Enter OTP"
                  val={forgotPasswordData.otp}
                  onChangeHandler={(e) =>
                    updateForgotPasswordData("otp", e.target.value)
                  }
                />

                <InputBox
                  placeholder="New Password"
                  val={forgotPasswordData.password}
                  onChangeHandler={(e) =>
                    updateForgotPasswordData("password", e.target.value)
                  }
                  isPassInput={true}
                  isHidden={isForgotPasswordHidden}
                  switchIsHidden={() =>
                    setIsForgotPasswordHidden((current) => !current)
                  }
                />

                <InputBox
                  placeholder="Confirm Password"
                  val={forgotPasswordData.confirmPassword}
                  onChangeHandler={(e) =>
                    updateForgotPasswordData("confirmPassword", e.target.value)
                  }
                  isPassInput={true}
                  isHidden={isForgotConfirmPasswordHidden}
                  switchIsHidden={() =>
                    setIsForgotConfirmPasswordHidden((current) => !current)
                  }
                />

                <span className="text-xs text-text-secondary">
                  Check Gmail for the 6-digit OTP, then enter a strong new
                  password.
                </span>
              </>
            )}

            {forgotPasswordErrorMsg && (
              <span className="text-sm text-red-400">
                {forgotPasswordErrorMsg}
              </span>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {forgotPasswordStep === "resetPassword" && (
                <Button
                  name="Resend OTP"
                  type="secondary"
                  onClickHandler={() => {
                    void handleRequestOtp();
                  }}
                />
              )}

              <Button
                name={
                  forgotPasswordStep === "requestOtp"
                    ? "Send OTP"
                    : "Reset Password"
                }
                onClickHandler={() => {
                  if (forgotPasswordStep === "requestOtp") {
                    void handleRequestOtp();
                    return;
                  }

                  void handleResetPassword();
                }}
              />
            </div>
          </>
        ) : (
          <>
            <InputBox
              placeholder={`${isSignUpPage ? "Username" : "Username or Email"}`}
              reference={usernameRef}
            />

            {inputErrorMsg.includes("username") && (
              <span className="text-sm text-red-400">{inputErrorMsg}</span>
            )}

            {isSignUpPage && (
              <InputBox placeholder={"Email"} reference={emailRef} />
            )}

            {inputErrorMsg.includes("email") && (
              <span className="text-sm text-red-400">{inputErrorMsg}</span>
            )}

            <InputBox
              placeholder={"Password"}
              reference={passwordRef}
              isPassInput={true}
              isHidden={isHidden}
              switchIsHidden={switchIsHidden}
            />

            {inputErrorMsg.includes("password") && (
              <span className="text-sm text-red-400">{inputErrorMsg}</span>
            )}

            {!isSignUpPage && (
              <span
                className="cursor-pointer text-sm text-text-secondaryBtn underline opacity-80 transition-opacity hover:opacity-100"
                onClick={openForgotPasswordView}
              >
                Forgot password?
              </span>
            )}

            <Button
              name={isSignUpPage ? "Sign Up" : "Sign In"}
              onClickHandler={
                isSignUpPage
                  ? () =>
                      signUpUser(
                        usernameRef,
                        emailRef,
                        passwordRef,
                        setInputErrorMsg,
                        handleSwitchTab
                      )
                  : () =>
                      signInUser(
                        usernameRef,
                        passwordRef,
                        setInputErrorMsg,
                        navigate,
                        dispatch
                      )
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
