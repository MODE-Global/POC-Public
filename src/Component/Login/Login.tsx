import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { GetUserDetail, GetLoginDetail } from '../../api/api';
import ReCAPTCHA from "react-google-recaptcha";
import { UserContext } from "../../app/Context";
import ChangePasswordComponent from './ChangePswValidation';
import LoginRegisterOTP from './LoginRegisterOTP';
var CryptoJS = require("crypto-js");

/* The below code is a React component of login screen. */
// CPF_PC_02
const LoginComponent = () => {
  const context = useContext(UserContext);

  /* Creating a reference variable to the HTML elements. */
  // CPF_PC_03
  const loginInputRef = useRef<HTMLInputElement>(null);
  const loginSpanRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordSpanRef = useRef<HTMLInputElement>(null);
  const signButtonRef = useRef<HTMLButtonElement>(null);

  /* Creating a new regular expression that will only match numbers. */
  const numericExp = new RegExp("^[0-9]*$");
  /* Creating a regular expression for email validation. */
  const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);


  /* Using the useNavigate hook to navigate to a different page. */
  /* Using the useParams hook to get the destination from the URL. */
  /* Getting the current credential from local storage. */
  // CPF_PC_04
  let navigate = useNavigate()
  const destination = useParams();
  const currentCrendential: any = (window.localStorage.getItem("SED"))
  let splitData;


  /* Decrypting the data and splitting it into an array. */
  if (currentCrendential != undefined) {

    var bytes = CryptoJS.AES.decrypt(currentCrendential, '');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    splitData = decryptedData.split(":")
  }
  /* Assigning the value of splitData to loginId if splitData is not null, otherwise it is assigning
  an empty string. */
  // CPF_PC_05
  let signObj: any = {
    loginId: splitData ? splitData[0] : "",
    password: splitData ? splitData[1] : "",
    checkKeepMe: false
  }
  /* Declaring a variable called sign and setting it equal to the signObj. */
  const [sign, setSign] = useState(signObj);

  let userResObj: any = {
    userEmail: "",
    userPhoneNumber: 0,
    verifyEmail: 0,
    verifyPhone: 0
  }
  /* Declaring a variable called userRes and setting it to the value of userResObj for the setstate the value of input. */
  const [userRes, setuserRes] = useState(userResObj);
  const currentCount: any = Number(window.localStorage.getItem("SC"))
  const [signCount, setSignCount] = useState(currentCount);
  const [checkCapcha, setCheckCapcha] = useState(true);

  /* Checking if the loginId and password are not empty, then it will call the signInClick function. */
  // CPF_PC_06
  useEffect(() => {
    if (sign.loginId != "" && sign.password != "") {
      signInClick()
    }
  }, [])

  /* Setting the signCount to the local storage. */
  /* Checking if the signCount is 3 and the checkCapcha is true disables the sign Button. */
  // CPF_PC_06
  useEffect(() => {
    window.localStorage.setItem("SC", signCount.toString())
    if (signCount == 3 && checkCapcha && signButtonRef.current != null) {
      setCheckCapcha(false)
      signButtonRef.current.style.backgroundColor = "#115E67"
      signButtonRef.current.style.color = "white"
      signButtonRef.current.style.opacity = ".7"
      signButtonRef.current.disabled = true
    }
  }, [signCount])

  /**
   * OnValueChange is a function that takes an event as an argument and returns a new object with the
   * same properties as the sign object, except for the property that matches the event's target name,
   * which is set to the event's target value.
   * @param {any} event - any - this is the event that is triggered when the user types in the input
   * field.
   * CPF_PC_07
   */

  const onValueChange = (event: any) => {
    setSign({ ...sign, [event.target.name]: event.target.value })
  }

  /**
   * If the login and password are valid and the captcha is checked, return true, otherwise return
   * false.
   * @returns A boolean value.
   * CPF_PC_08 CPF_PC_09
   */
  const Validation = () => {
    if (loginInputRef.current != null && loginSpanRef.current != null
      && passwordInputRef.current != null && passwordSpanRef.current != null) {

      if (sign.loginId == "") {
        loginSpanRef.current.hidden = false;
        loginSpanRef.current.innerHTML = "Please enter the Login id/Email id";
        loginInputRef.current.style.borderColor = "red";
      }
      else if (!(numericExp.test(sign.loginId) || emailExp.test(sign.loginId))) {
        loginSpanRef.current.hidden = false;
        loginSpanRef.current.innerHTML = "Please enter the valid Login id/Email id";
        loginInputRef.current.style.borderColor = "red";
      }
      else if (((numericExp.test(sign.loginId) || emailExp.test(sign.loginId)) || sign.loginId != "") && loginInputRef.current != null && loginSpanRef.current != null) {
        loginInputRef.current.style.borderColor = "";
        loginSpanRef.current.hidden = true;
        loginSpanRef.current.innerHTML = "";
      }

      if (sign.password == "") {
        passwordInputRef.current.style.borderColor = "red";
        passwordSpanRef.current.hidden = false;
        passwordSpanRef.current.innerHTML = "Please enter the password ";
      }
      else if (sign.password != "" && passwordInputRef.current != null && passwordSpanRef.current != null) {
        passwordInputRef.current.style.borderColor = "";
        passwordSpanRef.current.hidden = true;
        passwordSpanRef.current.innerHTML = "";
      }
    }
    return (passwordSpanRef.current?.hidden && loginSpanRef.current?.hidden && checkCapcha ? true : false)
  }


  /**
   * Using React Router to navigate to the child component.
   * 
   * Using React Context to pass the value from the parent component to the child component.
   * 
   * Using React Hooks to set the value of the variable in the parent component from the child
   * component.
   */
  const signInClick = async () => {
    if (Validation()) {

      // CPF_PC_10
      const request = {
        ID: sign.loginId,
        password: sign.password
      }

      const response: any = await GetLoginDetail(request)

      // CPF_PC_11
      if (response.status != 200) {
        if (signCount < 3) {
          setSignCount((PrevCount: number) => PrevCount + 1)
        }

        if (response.status == 401 && response.data.errors.message == "Unauthorized User"
          && loginSpanRef.current != null && loginInputRef.current != null) {
          loginSpanRef.current.hidden = false;
          loginInputRef.current.style.borderColor = "red";
          loginSpanRef.current.innerHTML = "Please enter the valid Login id/Email id";
        }
        else if (response.status == 401 && response.data.errors.message == "Invalid Parameter, Password"
          && passwordSpanRef.current != null && passwordInputRef.current != null) {
          if (signCount >= 3 && signButtonRef.current != null) {
            resetCaptcha();
            signButtonRef.current.disabled = true
          }
          passwordSpanRef.current.hidden = false;
          passwordSpanRef.current.innerHTML = "Invalid password";
          passwordInputRef.current.style.borderColor = "red";
        }
      }
      else {
        // CPF_PC_12
        setSignCount(0);

        if (sign.checkKeepMe == true) {
          const KeepMeSignedIn: any = (request.ID + ":" + request.password)
          var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(KeepMeSignedIn), '').toString();
          window.localStorage.setItem("SED", ciphertext)
        }

        window.localStorage.setItem("userId", (response.data.userId).toString())

        // CPF_PC_13
        const userResponse: any = await GetUserDetail(response.data.userId)

        if (userResponse.status == 200) {
          let PermissionArray: any = userResponse.data.menuPermission;
          context.SetScreenListArray(PermissionArray)
          var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(PermissionArray), '').toString();
          window.localStorage.setItem("PM", ciphertext)

          setuserRes({
            ...userRes,
            ['userEmail']: userResponse.data.userEmail,
            ['userPhoneNumber']: userResponse.data.userPhoneNumber,
            ['verifyEmail']: userResponse.data.verifyEmail,
            ['verifyPhone']: userResponse.data.verifyPhone
          })
          context.SetMenuData({
            ...userRes,
            ['userEmail']: userResponse.data.userEmail,
            ['cropName']: userResponse.data.cropName,
            ['userFirstName']: userResponse.data.userFirstName
          })
          // store the menudata in local storage
          var cipherMneuData = CryptoJS.AES.encrypt(JSON.stringify({
            ...userRes,
            ['userEmail']: userResponse.data.userEmail,
            ['cropName']: userResponse.data.cropName,
            ['userFirstName']: userResponse.data.userFirstName
          }), '').toString();
          window.localStorage.setItem("menuData", cipherMneuData)

          if (userResponse.data.changePassword == 1) {
            navigate(`/login/${'changePassword'}`)
          }
          else if (userResponse.data.verifyEmail == 1 || userResponse.data.verifyPhone == 1) {
            navigate(`/login/${'verifyEmailPhone'}`);
          }
          else {
            window.sessionStorage.setItem("session", "1");
            window.localStorage.setItem("UCS", "1")
            context.setCurrentuserValue();
            navigate('/loadsearch')
          }
        }
      }
    }

  }

  /**
   * If the sign Button is not null, then if the event is true, set the checkCapcha to true,
   * and enable the signButtonRef.current. If the event is false, set the checkCapcha to false, and
   * disable the signButtonRef.current.
   * @param {any} event - any -&gt; the event that is triggered when the user clicks on the checkbox.
   * CPF_PC_14
   */
  const onRecaptchaChange = (event: any) => {

    if (signButtonRef.current != null) {
      if (event) {
        setCheckCapcha(true);
        signButtonRef.current.disabled = false
        signButtonRef.current.style.opacity = ""
      }
      else {
        setCheckCapcha(false);
        signButtonRef.current.style.backgroundColor = "#115E67"
        signButtonRef.current.style.color = "white"
        signButtonRef.current.style.opacity = ".7"
        signButtonRef.current.disabled = true
      }
    }

  }


  let captcha: any;

  const setCaptchaRef = (ref: any) => {
    if (ref) {
      return captcha = ref;
    }
  };

  const resetCaptcha = () => {
    // maybe set it till after is submitted
    captcha.reset();
  }
  /* Checking if the destination.slug is equal to changePassword. If it is, it will return the
  ChangePasswordComponent. CPF_PC_15*/
  if (destination.slug == 'changePassword') {

    return (
      <div>
        <ChangePasswordComponent
          verifyEmail={userRes.verifyEmail}
          verifyPhone={userRes.verifyPhone} />
      </div>
    )
  }
  /* Checking if the destination.slug is equal to verifyEmailPhone. If it is, it will return the
  LoginRegisterOTP. CPF_PC_16*/
  else if (destination.slug == 'verifyEmailPhone') {

    return (
      <div>
        <LoginRegisterOTP
          verifyEmail={userRes.verifyEmail}
          verifyPhone={userRes.verifyPhone}
          userEmail={userRes.userEmail == null ? "" : userRes.userEmail}
          userPhoneNumber={userRes.userPhoneNumber} />
      </div>
    )
  }
  /* else, it will return the LoginComponent. CPF_PC_17*/
  else {
    return (
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 col-12 bg-white container-height">
          <div className="row px-4 pt-5 mt-4 justify-content-center">
            <div className="col-md-8 col-sm-11">
              <div className="row">
                <div className="d-lg-none mb-4 d-block text-center">
                  <img src="Images/MODE-logo.svg" alt="mode-logo" className="cp-logo-sty" />
                </div>
                <h5 className="page-header-txt mt-lg-5 mt-0 px-0">Sign In</h5>
                <div className="col-md-12 col-12 px-0 mt-4">
                  <label htmlFor="userName" className="form-label cp-form-label px-0">Login ID (or) Email ID</label>
                  <input type="text" className="form-control cp-form-field" id="userName" placeholder="Enter your login id (or) email id" name="loginId" value={sign.loginId} ref={loginInputRef} onChange={(event) => { onValueChange(event) }} />
                  <span className="form-label cp-form-label px-0" ref={loginSpanRef} hidden={true} style={{ color: "red" }}></span>
                </div>
                <div className="col-md-12 col-12 px-0 mt-3">
                  <label htmlFor="cp-login-password" className="form-label cp-form-label px-0">Password</label>
                  <input type="password" className="form-control cp-form-field" id="cp-login-password" placeholder="Enter your password" name="password" value={sign.password} ref={passwordInputRef} onChange={(event) => { onValueChange(event) }} />
                  <span className="form-label cp-form-label px-0" ref={passwordSpanRef} hidden={true} style={{ color: "red" }}></span>
                </div>
                <div className="mt-3 px-0 d-flex width-sty justify-content-between">
                  <div className="login-btn-order mb-2">
                    <input className="form-check-input me-2 cp-checkbox" type="checkbox" id="cp-keep-signedin" onChange={(event) => { setSign({ ...sign, ["checkKeepMe"]: event.target.checked }) }} />
                    <label className="form-check-label cp-form-label" htmlFor="cp-keep-signedin">
                      Keep me signed in
                    </label>
                  </div>
                  <a href="/ForgotPassword" className="mb-3 forget-ps-sty cp-link"> Forgot Password ?</a>
                </div>
                <div className="px-0 mt-4" hidden={signCount >= 3 ? false : true}>
                  <ReCAPTCHA
                    ref={(event: any) => setCaptchaRef(event)}
                    sitekey={`${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`}
                    onChange={(value) => { onRecaptchaChange(value) }}>
                  </ReCAPTCHA>
                </div>
                <div className="px-0 mt-4">
                  <button type="button" className="btn w-100 cp-btn-primary" ref={signButtonRef} onClick={() => { signInClick() }}>Sign In</button>
                </div>
                <div className="login-footer-width fixed-bottom">
                  <p className="text-center">Copyright © 2023 Mode Transportation. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-lg-block d-none login-bg-image container-height">
          <div className="row px-5 pt-5 mt-5 float-end align-self-center">
            <img src="Images/mode-white-logo.svg" className="login-logo-sty" alt="Mode-logo" />
          </div>
        </div>
      </div >
    )
  }
}
export default LoginComponent