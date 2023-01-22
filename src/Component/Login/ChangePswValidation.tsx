import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChangePassword } from '../../api/api';
import { UserContext } from "../../app/Context";

export type ChangeComponentprops = {
  verifyEmail?: any;
  verifyPhone?: any;
};

const ChangePasswordComponent = (props: ChangeComponentprops) => {
  /* The above code is using the useContext hook to access the UserContext. */
  const context = useContext(UserContext);

  /* The above code is declaring three variables. The first variable is a regular expression that looks
  for a number. The second variable is a regular expression that looks for an uppercase letter. The
  third variable is a regular expression that looks for a special character. */
  var oneNumberRegex = /\d/g;
  let UpperCaseRegex = /[A-Z]/;
  let specialRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  /* The Below code is creating references to the HTML elements. */
  // CPF_PC_28
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const oldPasswordSpanRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordSpanRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordSpanRef = useRef<HTMLInputElement>(null);
  const EightCharcterImgRef = useRef<HTMLImageElement>(null);
  const oneNumberImgRef = useRef<HTMLImageElement>(null);
  const oneUpperCaseImgRef = useRef<HTMLImageElement>(null);
  const oneSpecialCaseImgRef = useRef<HTMLImageElement>(null);
  const EightCharcterParaRef = useRef<HTMLParagraphElement>(null);
  const oneNumberParaRef = useRef<HTMLParagraphElement>(null);
  const oneUpperCaseParaRef = useRef<HTMLParagraphElement>(null);
  const oneSpecialCaseParaRef = useRef<HTMLParagraphElement>(null);
  const Popup = useRef<HTMLDivElement>(null);

  /* Using the useNavigate hook to navigate to a different page. */
  // CPF_PC_29
  let navigate = useNavigate()
  /* Setting the userId to the value of the userId in local storage. */
  const userId: any = (window.localStorage.getItem("userId"))

  /* Creating a state object called password and setting it to the passwordObj object. */
  // CPF_PC_30
  let passwordObj: any = { oldPassword: "", newPassword: "", confirmPassword: "", }
  const [password, setpassword] = useState(passwordObj);
  const [ValidationNewPassword, setValidationNewPassword] = useState(false);

  /**
   * "If the input field is newPassword, and all the refs are not null, then if the input field is 8
   * characters or more, set the image to active, and the paragraph to active, and set EightCharcter to
   * true, else set the image to inactive, and the paragraph to inactive, and set EightCharcter to false.
   * @param {any} event - any - the event that triggered the function
   * CPF_PC_31
   */
  const onValueChange = (event: any) => {
    let EightCharcter = false
    let oneNumber = false
    let oneUpperCase = false
    let oneSpecialCase = false
    setpassword({ ...password, [event.target.name]: event.target.value })

    if (event.target.name == "newPassword" && EightCharcterImgRef.current != null &&
      oneNumberImgRef.current != null && oneUpperCaseImgRef.current != null &&
      oneSpecialCaseImgRef.current != null && EightCharcterParaRef.current != null &&
      oneNumberParaRef.current != null && oneUpperCaseParaRef.current != null &&
      oneSpecialCaseParaRef.current != null) {

      if ((event.target.value).length >= 8) {
        EightCharcterImgRef.current.src = "../Images/validate-icon-active.svg";
        EightCharcterImgRef.current.alt = "validate-active";
        EightCharcterParaRef.current.classList.add("pwd-validation-complete");
        EightCharcter = true
      }
      else {
        EightCharcterImgRef.current.src = "../Images/validate-icon-inactive.svg";
        EightCharcterImgRef.current.alt = "validate-inactive";
        EightCharcterParaRef.current.classList.remove("pwd-validation-complete");
        EightCharcter = false
      }

      if (oneNumberRegex.test(event.target.value)) {
        oneNumberImgRef.current.src = "../Images/validate-icon-active.svg";
        oneNumberImgRef.current.alt = "validate-active";
        oneNumberParaRef.current.classList.add("pwd-validation-complete");
        oneNumber = true
      }
      else {
        oneNumberImgRef.current.src = "../Images/validate-icon-inactive.svg";
        oneNumberImgRef.current.alt = "validate-inactive";
        oneNumberParaRef.current.classList.remove("pwd-validation-complete");
        oneNumber = false
      }

      if (UpperCaseRegex.test(event.target.value)) {
        oneUpperCaseImgRef.current.src = "../Images/validate-icon-active.svg";
        oneUpperCaseImgRef.current.alt = "validate-active";
        oneUpperCaseParaRef.current.classList.add("pwd-validation-complete");
        oneUpperCase = true
      }
      else {
        oneUpperCaseImgRef.current.src = "../Images/validate-icon-inactive.svg";
        oneUpperCaseImgRef.current.alt = "validate-inactive";
        oneUpperCaseParaRef.current.classList.remove("pwd-validation-complete");
        oneUpperCase = false
      }

      if (specialRegex.test(event.target.value)) {
        oneSpecialCaseImgRef.current.src = "../Images/validate-icon-active.svg";
        oneSpecialCaseImgRef.current.alt = "validate-active";
        oneSpecialCaseParaRef.current.classList.add("pwd-validation-complete");
        oneSpecialCase = true
      }
      else {
        oneSpecialCaseImgRef.current.src = "../Images/validate-icon-inactive.svg";
        oneSpecialCaseImgRef.current.alt = "validate-inactive";
        oneSpecialCaseParaRef.current.classList.remove("pwd-validation-complete");
        oneSpecialCase = false
      }

      EightCharcter && oneNumber && oneUpperCase && oneSpecialCase ? setValidationNewPassword(true) : setValidationNewPassword(false)
    }


  }


  /**
   * If the new password and confirm password are not empty, and they match, and the new password is
   * valid, and the old password is not empty, then return true.
   * @returns A boolean value.
   * CPF_PC_32 CPF_PC_33 CPF_PC_33 CPF_PC_35
   */
  const Validation = () => {

    let IsValid = false;

    if (newPasswordInputRef.current != null && confirmPasswordInputRef.current != null
      && newPasswordSpanRef.current != null && confirmPasswordSpanRef.current != null
      && oldPasswordSpanRef.current != null && oldPasswordInputRef.current != null) {

      if (password.newPassword == "") {
        newPasswordSpanRef.current.hidden = false;
        newPasswordSpanRef.current.innerHTML = "Please enter the New Password";
        newPasswordInputRef.current.style.borderColor = "red";

      }
      else if (password.newPassword == password.oldPassword && password.newPassword.length > 0) {
        newPasswordSpanRef.current.hidden = false;
        newPasswordSpanRef.current.innerHTML = "New password you entered is the same as your old password";
        newPasswordInputRef.current.style.borderColor = "red";
      }
      else if (!ValidationNewPassword) {
        newPasswordSpanRef.current.hidden = false;
        newPasswordSpanRef.current.innerHTML = "Invalid New Password";
        newPasswordInputRef.current.style.borderColor = "red";
      }
      else {
        newPasswordSpanRef.current.hidden = true;
        newPasswordSpanRef.current.innerHTML = "";
        newPasswordInputRef.current.style.borderColor = "";
      }

      if (password.oldPassword == "") {
        oldPasswordSpanRef.current.hidden = false;
        oldPasswordSpanRef.current.innerHTML = "Please enter the old Password";
        oldPasswordInputRef.current.style.borderColor = "red";

      }
      else if (password.oldPassword != "") {
        oldPasswordSpanRef.current.hidden = true;
        oldPasswordSpanRef.current.innerHTML = "";
        oldPasswordInputRef.current.style.borderColor = "";

      }

      if (password.confirmPassword == "") {
        confirmPasswordSpanRef.current.hidden = false;
        confirmPasswordSpanRef.current.innerHTML = "Please enter the Confirm Password";
        confirmPasswordInputRef.current.style.borderColor = "red";

      }
      else if (password.confirmPassword != "") {
        confirmPasswordSpanRef.current.hidden = true;
        confirmPasswordSpanRef.current.innerHTML = "";
        confirmPasswordInputRef.current.style.borderColor = "";


        if (password.newPassword != password.confirmPassword) {

          confirmPasswordSpanRef.current.hidden = false;
          confirmPasswordSpanRef.current.innerHTML = "Password does not match";
          confirmPasswordInputRef.current.style.borderColor = "red";

        }
        else if (password.newPassword == password.confirmPassword) {

          confirmPasswordInputRef.current.style.borderColor = "";
          confirmPasswordSpanRef.current.hidden = true;
          confirmPasswordSpanRef.current.innerHTML = "";

        }
      }

      if (newPasswordSpanRef.current.hidden && oldPasswordSpanRef.current.hidden && confirmPasswordSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        IsValid = false
      }
    }

    return IsValid && ValidationNewPassword
  }

  /**
   * If the validation is successful, then make a request to the server, and if the response is not 200,
   * then if the response is 401 and the error message is "Invalid Password", then set the border color
   * of the old password input to red, and set the innerHTML of the old password span to "Password is In
   * Correct".
   * CPF_PC_34 CPF_PC_35
   */
  const changePassClick = async () => {
    if (Validation()) {

      const request = {
        userId: Number(userId),
        oldPassword: password.oldPassword,
        NewPassword: password.newPassword,
      }

      const response = await ChangePassword(request)

      if (response.status != 200) {
        if (response.status == 401 && response.data.errors.message == "Invalid Parameter, Old Password"
          && oldPasswordSpanRef.current != null && oldPasswordInputRef.current != null) {
          oldPasswordInputRef.current.style.borderColor = "red";
          oldPasswordSpanRef.current.hidden = false;
          oldPasswordSpanRef.current.innerHTML = "Password is incorrect";
        }
      }
      else {
        if (Popup.current != null) {
          Popup.current.classList.add("show");
          Popup.current.style.display = "block";
        }
      }
    }
  }

  /**
   * When the user clicks the back button, the current user value is set to null and the user is
   * navigated back to the home page.
   */
  const ClickBack = () => {
    context.setCurrentuserValue();
    navigate("/")
  }

  /**
   * If the user has verified their email or phone number, navigate to the verifyEmailPhone page.
   * Otherwise, set the current user value and navigate to the al-grid page.
   * CPF_PC_36
   */
  const OnclickOk = () => {
    if (props.verifyEmail == 1 || props.verifyPhone == 1) {
      navigate(`/login/${'verifyEmailPhone'}`);
    }
    else {
      if (props.verifyPhone != null && props.verifyPhone != undefined) {
        window.sessionStorage.setItem("session", "1");
        window.localStorage.setItem("UCS", "1")
      }
      context.setCurrentuserValue();
      navigate('/loadsearch')
    }
  }
  /* A React component written in TypeScript. */
  // CPF_PC_37
  return (
    <div className="row container-height">
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 bg-white ">
        {props.verifyEmail == undefined &&
          <div className="mb-0 mt-4 data-label d-flex align-items-center"><img src="../Images/back-icon.svg" alt="back-icon" className="back-icon pointer" onClick={() => ClickBack()} />
            <span className="ms-2">Back</span>
          </div>
        }
        <div className="row px-4 pt-5 justify-content-center">
          <div className="col-md-9 col-sm-11">
            <div className="row">
              <div className="d-lg-none mb-4 d-block text-center">
                <img src="../Images/MODE-logo.svg" alt="mode-logo" className="cp-logo-sty" />
              </div>
              <h5 className="page-header-txt mt-0 px-0">Change Password</h5>
              <p className="data-txt p-0 mt-1">Make sure to save your password in a password manager!</p>
              <div className="col-md-12 col-12 px-0 mt-4">
                <label htmlFor="old-pass" className="form-label cp-form-label px-0">Old Password</label>
                <input type="password" className="form-control cp-form-field" id="old-pass" placeholder="Enter your old password" ref={oldPasswordInputRef} name="oldPassword" value={password.oldPassword} onChange={(event) => { onValueChange(event) }} />
                <span className="form-label cp-form-label px-0" ref={oldPasswordSpanRef} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-md-12 col-12 px-0 mt-3">
                <label htmlFor="new-pass" className="form-label cp-form-label px-0">New Password</label>
                <input type="password" className="form-control cp-form-field" id="new-pass" placeholder="Enter your new password" ref={newPasswordInputRef} name="newPassword" value={password.newPassword} onChange={(event) => { onValueChange(event) }} />
                <span className="form-label cp-form-label px-0" ref={newPasswordSpanRef} hidden={true} style={{ color: "red" }}></span>
              </div>
              <h5 className="mt-3 cp-form-label px-0">The password must have at least :</h5>
              <div className="col-md-6 col-sm-12 my-1">
                <p ref={EightCharcterParaRef} className="mb-0 data-txt"><span className="me-2"><img ref={EightCharcterImgRef} src="../Images/validate-icon-inactive.svg" alt="validate-active" className="validate-icon" /></span>8 charcters</p>
              </div>
              <div className="col-md-6 col-sm-12 my-1">
                <p ref={oneNumberParaRef} className="mb-0 data-txt"><span className="me-2"><img ref={oneNumberImgRef} src="../Images/validate-icon-inactive.svg" alt="validate-inactive" className="validate-icon" /></span>one number</p>
              </div>
              <div className="col-md-6 col-sm-12 my-1">
                <p ref={oneUpperCaseParaRef} className="mb-0 data-txt"><span className="me-2"><img ref={oneUpperCaseImgRef} src="../Images/validate-icon-inactive.svg" alt="validate-inactive" className="validate-icon" /></span>one uppercase letter</p>
              </div>
              <div className="col-md-6 col-sm-12 my-1">
                <p ref={oneSpecialCaseParaRef} className="mb-0 data-txt"><span className="me-2"><img ref={oneSpecialCaseImgRef} src="../Images/validate-icon-inactive.svg" alt="validate-inactive" className="validate-icon" /></span>one special character</p>
              </div>
              <div className="col-md-12 col-12 px-0 my-2">
                <label htmlFor="c-n-pass" className="form-label cp-form-label px-0 mt-3">Confirm New Password</label>
                <input type="password" className="form-control cp-form-field" id="c-n-pass" placeholder="Please re-enter your new password to confirm" ref={confirmPasswordInputRef} name="confirmPassword" value={password.confirmPassword} onChange={(event) => { onValueChange(event) }} />
                <span className="form-label cp-form-label px-0 mt-3" ref={confirmPasswordSpanRef} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="px-0 my-5">
                <button type="button" className="btn w-100 mb-3 cp-btn-primary" onClick={changePassClick}>Change Password</button>
              </div>
            </div>
          </div>
          <div className="footer-pos-abs">
            <p className="text-center">Copyright © 2023 Mode Transportation. All rights reserved.</p>
          </div>
        </div>
      </div>
      <div className="col-lg-6 d-lg-block d-none login-bg-image ">
        <div className="row px-5 pt-5 mt-5 float-end align-self-center">
          <img src="../Images/mode-white-logo.svg" className="login-logo-sty" alt="Mode-logo" />
        </div>
      </div>
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={Popup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">Password Change Success!</h5>
              <p className="popup-txt">Your Password has been changed successfully and you can use your New Password to sign In</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { OnclickOk() }}>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordComponent