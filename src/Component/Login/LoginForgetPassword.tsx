import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '../../api/api';

const LoginForgotPassword = () => {
  /* Used to get the reference variable of the element. */
  // CPF_PC_78
  const loginInputRef = useRef<HTMLInputElement>(null);
  const loginSpanRef = useRef<HTMLInputElement>(null);
  const GenerateTemporaryButton = useRef<HTMLButtonElement>(null);
  const Popup = useRef<HTMLDivElement>(null);

  /* A hook that allows you to navigate to a different route. */
  // CPF_PC_79
  let navigate = useNavigate()
  /* A React Hook. It is used to declare a state variable. */
  // CPF_PC_80
  const [login, setlogin] = useState("");
  const [userEmail, setuserEmail] = useState("");


  /* Used to validate the email and numeric value. */
  const numericExp = new RegExp("^[0-9]*$");
  const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);


  /**
   * If the login Id or email Id are valid, return true, otherwise return
   * false.
   * @returns A boolean value.
   * CPF_PC_81 CPF_PC_82
   */
  const Validation = () => {

    if (loginInputRef.current != null && loginSpanRef.current != null) {
      if (login == "") {
        loginSpanRef.current.hidden = false;
        loginSpanRef.current.innerHTML = "Please enter the Login id/Email id";
        loginInputRef.current.style.borderColor = "red";
      }
      else if (!(numericExp.test(login) || emailExp.test(login))) {
        loginSpanRef.current.hidden = false;
        loginSpanRef.current.innerHTML = "Please enter the valid Login id/Email id";
        loginInputRef.current.style.borderColor = "red";
      }
      else if (((numericExp.test(login) || emailExp.test(login)) || login != "")) {
        loginInputRef.current.style.borderColor = "";
        loginSpanRef.current.hidden = true;
        loginSpanRef.current.innerHTML = "";
      }
    }

    return loginSpanRef.current?.hidden
  }

  /**
   * If the validation passes, then call the ForgotPassword function, and if the response is not 200,
   * then check if the response is 401 and the error message is "Invalid user", and if so, then show the
   * error message.
   * CPF_PC_83 CPF_PC_84
   */
  const generateTempPassClick = async () => {
    if (Validation()) {

      const response: any = await ForgotPassword(login)

      if (response.status != 200) {

        if (response.status == 401 && response.data.errors.message == "Invalid user"
          && loginSpanRef.current != null && loginInputRef.current != null) {
          loginSpanRef.current.hidden = false;
          loginInputRef.current.style.borderColor = "red";
          loginSpanRef.current.innerHTML = "Please enter the valid Login id/Email id";
        }
        if (response.status == 401 && response.data.errors.message == "Unauthorized User"
          && loginSpanRef.current != null && loginInputRef.current != null) {
          loginSpanRef.current.hidden = false;
          loginInputRef.current.style.borderColor = "red";
          loginSpanRef.current.innerHTML = "Unauthorized User";
        }
      }
      else {
        setuserEmail(response.data.emailId)
        if (Popup.current != null) {
          Popup.current.classList.add("show");
          Popup.current.style.display = "block";
        }
      }
    }
  }

  /* Returning the HTML code. CPF_PC_87 */
  return (
    <div>
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 col-12 bg-white container-height">
          <div className="mb-0 mt-4 data-label d-flex align-items-center"><a href='/login'><img src="Images/back-icon.svg" alt="back-icon" className="back-icon pointer" /></a>
            <span className="ms-2">Back</span>
          </div>
          <div className="row px-4 pt-5 justify-content-center">
            <div className="col-md-8 col-sm-11">
              <div className="row">
                <div className="d-lg-none mb-4 d-block text-center">
                  <img src="Images/MODE-logo.svg" alt="mode-logo" className="cp-logo-sty" />
                </div>
                <h5 className="page-header-txt mt-lg-5 mt-0 px-0">Forgot Password</h5>
                <p className="data-txt p-0 mt-1">A temporary password will be sent to the email address you entered and please use the same temporary password to sign In.</p>
                <div className="col-md-12 px-0 mt-3">
                  <label htmlFor="forgot-userName" className="form-label cp-form-label px-0">Login ID (or) Email ID</label>
                  <input type="text" className="form-control cp-form-field" id="forgot-userName" placeholder="Enter your login id (or) email id" name="LoginId" value={login} ref={loginInputRef} onChange={(event) => { setlogin(event.target.value) }} />
                  <span className="form-label cp-form-label px-0" ref={loginSpanRef} hidden={true} style={{ color: "red" }}></span>
                </div>
                <div className="px-0 mt-5 mb-3">
                  <button type="button" className="btn w-100 cp-btn-primary" ref={GenerateTemporaryButton} onClick={generateTempPassClick}>Generate Temporary Password</button>
                </div>
                <span className="data-txt p-0 mt-3">Forgot your Email ID? Reach out to <a /*CPF_PC_86*/ href="mailto:email@example.com" className="text-decoration-none link-color"> Admin</a></span>
              </div>
            </div>
            <div className="login-footer-width fixed-bottom">
              <p className="text-center">Copyright © 2023 Mode Transportation. All rights reserved.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-lg-block d-none login-bg-image container-height">
          <div className="row px-5 pt-5 mt-5 float-end align-self-center">
            <img src="Images/mode-white-logo.svg" className="login-logo-sty" alt="Mode-logo" />
          </div>
        </div>
      </div>
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={Popup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">E-mail Send Successfully!</h5>
              <p className="popup-txt">A Temporary Password has been sent to {userEmail}</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => {/* CPF_PC_85 */navigate('/login') }}>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForgotPassword