import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CheckOtp, SendOtp } from '../../api/api';
import { UserContext } from '../../app/Context';

export type VerifyComponentprops = {
  verifyEmail: any;
  verifyPhone: any;
  userPhoneNumber: any;
  userEmail: any;
};

/* The above code is a React component which is used to verify the user email and phone number. */
const LoginRegisterOTP = (props: VerifyComponentprops) => {
  const context = useContext(UserContext);

  /* Using the useNavigate hook to navigate to a different page. */
  // CPF_PC_48
  let navigate = useNavigate()
  /* Getting the userId from localStorage and assigning it to the variable userId. */
  const userId: any = (window.localStorage.getItem("userId"))

  /* Creating a ref variable for each element in the form. */
  // CPF_PC_47
  const emailIdInputRef = useRef<HTMLInputElement>(null);
  const emailIdSpanRef = useRef<HTMLInputElement>(null);
  const emailIdDivRef = useRef<HTMLDivElement>(null);

  const emailOtpInputRef = useRef<HTMLInputElement>(null);
  const emailOtpSpanRef = useRef<HTMLInputElement>(null);
  const emailOtpDivRef = useRef<HTMLDivElement>(null);

  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileSpanRef = useRef<HTMLInputElement>(null);
  const mobileDivRef = useRef<HTMLDivElement>(null);


  const mobileOtpInputRef = useRef<HTMLInputElement>(null);
  const mobileOtpSpanRef = useRef<HTMLInputElement>(null);
  const mobileOtpDivRef = useRef<HTMLDivElement>(null);

  const requestButtonRef = useRef<HTMLButtonElement>(null);
  const verifyButtonRef = useRef<HTMLButtonElement>(null);

  const Popup = useRef<HTMLDivElement>(null);


  // CPF_PC_49
  let verifyObj: any = {
    emailId: (props.userEmail != "" && props.userEmail != null) ? props.userEmail : "",
    mobileNumber: (props.userPhoneNumber != "" && props.userPhoneNumber != null) ? props.userPhoneNumber : "",
    emailOtp: "",
    mobileOtp: "",
  }
  /* Setting the state of the component. */
  const [verify, setverify] = useState(verifyObj);
  const [emailCounter, setEmailCounter] = useState(0);
  const [phoneCounter, setPhoneCounter] = useState(0);

  /* Creating a regular expression for email validation. */
  const numericExp = new RegExp("^[0-9]*$");
  const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  /* A React Hook that is using the useEffect hook to set a timer that will decrement the emailCounter
  variable by 1 every second. */
  useEffect(() => {
    const emailTimer: any = emailCounter > 0 && setInterval(() => setEmailCounter(emailCounter - 1), 1000);
    return () => clearInterval(emailTimer);
  }, [emailCounter]);

  /* A React Hook that is using the useEffect hook to set a timer that will decrement the phoneCounter
  variable by 1 every second. */
  useEffect(() => {
    const phoneTimer: any = phoneCounter > 0 && setInterval(() => setPhoneCounter(phoneCounter - 1), 1000);
    return () => clearInterval(phoneTimer);
  }, [phoneCounter]);


  /**
   * If the type is "number" and the value matches the regular expression, then set the state.
   * 
   * If the type is "text", then set the state.
   * @param {any} event - any - the event that is triggered when the user types in the input field
   * @param {string} type - string
   * CPF_PC_50
   */
  const onValueChange = (event: any, type: string) => {
    if (type == "number" && numericExp.test(event.target.value)) {
      setverify({ ...verify, [event.target.name]: event.target.value })
    }
    else if (type == "text") {
      setverify({ ...verify, [event.target.name]: event.target.value })
    }
  }

  /**
   * It validates the email and mobile number and returns true if both are valid else returns false.
   * @returns A boolean value.
   * CPF_PC_51 CPF_PC_52 
   */
  const requestOtpValidation = () => {

    let IsValidEmail = false;
    let IsValidMobile = false;

    if (verify.emailId == ""
      && emailIdSpanRef.current != null
      && emailIdInputRef.current != null) {
      emailIdSpanRef.current.hidden = false;
      emailIdSpanRef.current.style.color = "red";
      emailIdSpanRef.current.innerHTML = "Please enter the Email id";
      emailIdInputRef.current.style.borderColor = "red";
      IsValidEmail = false;
    }
    else if (!emailExp.test(verify.emailId)
      && emailIdSpanRef.current != null
      && emailIdInputRef.current != null) {
      emailIdSpanRef.current.hidden = false;
      emailIdSpanRef.current.style.color = "red";
      emailIdSpanRef.current.innerHTML = "Please enter a valid Email id";
      emailIdInputRef.current.style.borderColor = "red";
      IsValidEmail = false;
    }
    else if ((emailExp.test(verify.emailId) || verify.emailId != "")
      && emailIdSpanRef.current != null
      && emailIdInputRef.current != null) {
      emailIdSpanRef.current.hidden = true;
      emailIdSpanRef.current.style.color = "";
      emailIdSpanRef.current.innerHTML = "";
      emailIdInputRef.current.style.borderColor = "";
      IsValidEmail = true;
    }


    if (verify.mobileNumber == ""
      && mobileSpanRef.current != null
      && mobileInputRef.current != null) {
      mobileSpanRef.current.hidden = false;
      mobileSpanRef.current.style.color = "red";
      mobileSpanRef.current.innerHTML = "Please enter the Phone";
      mobileInputRef.current.style.borderColor = "red";
      IsValidMobile = false;
    }
    else if ((verify.mobileNumber.length != 10)
      && mobileSpanRef.current != null
      && mobileInputRef.current != null) {
      mobileSpanRef.current.hidden = false;
      mobileSpanRef.current.style.color = "red";
      mobileSpanRef.current.innerHTML = "Please enter a valid Phone number";
      mobileInputRef.current.style.borderColor = "red";
      IsValidMobile = false;
    }
    else if ((numericExp.test(verify.mobileNumber) || verify.mobileNumber != "" || verify.mobileNumber.length == 10)
      && mobileSpanRef.current != null
      && mobileInputRef.current != null) {
      mobileSpanRef.current.hidden = true;
      mobileSpanRef.current.style.color = "";
      mobileSpanRef.current.innerHTML = "";
      mobileInputRef.current.style.borderColor = "";
      IsValidMobile = true;
    }

    return (IsValidEmail && IsValidMobile ? true : false)
  }

  /**
   * If the response is not 200 and the response is not 401 and the response data has errors message as
   * "Phone Number already exists" and if the mobileSpanRef.current is not null and mobileInputRef
   * CPF_PC_53 CPF_PC_54 CPF_PC_55
   */
  const requestOtpClick = async () => {
    setEmailCounter(60);
    setPhoneCounter(60);
    if (requestOtpValidation()) {

      let request: any;

      if (props.verifyEmail == 1 && props.verifyPhone == 1) {
        request = {
          emailId: verify.emailId,
          phoneNumber: verify.mobileNumber,
          userId: Number(userId)
        }
      }
      if (props.verifyEmail == 1 && props.verifyPhone == 0) {
        request = {
          emailId: verify.emailId,
          userId: Number(userId)
        }
      }
      if (props.verifyEmail == 0 && props.verifyPhone == 1) {
        request = {
          phoneNumber: verify.mobileNumber,
          userId: Number(userId)
        }
      }
      const response = await SendOtp(request)

      if (response.status != 200) {
        if (response.status == 401 && response.data.errors.message == "Email id already exists"
          && emailIdSpanRef.current != null && emailIdInputRef.current != null) {
          emailIdInputRef.current.style.borderColor = "red";
          emailIdSpanRef.current.hidden = false;
          emailIdSpanRef.current.innerHTML = "EmailId already exists";
          emailIdSpanRef.current.style.color = "red";
        }
        else if (response.status == 401 && response.data.errors.message == "Phone number already exists"
          && mobileSpanRef.current != null && mobileInputRef.current != null) {
          mobileInputRef.current.style.borderColor = "red";
          mobileSpanRef.current.hidden = false;
          mobileSpanRef.current.innerHTML = "Phone Number already exists";
          mobileSpanRef.current.style.color = "red";
        }
      }
      else {

        if (emailIdDivRef.current != null && emailOtpDivRef.current != null
          && mobileDivRef.current != null && mobileOtpDivRef.current != null
          && requestButtonRef.current != null && verifyButtonRef.current != null
          && emailIdInputRef.current != null && mobileInputRef.current != null) {


          if (props.verifyEmail == 1) {
            emailIdDivRef.current.className = "col-md-6 col-sm-12 col-lg-7 col-xl-7 mt-3 px-0";
            emailOtpDivRef.current.hidden = false;
            emailIdInputRef.current.disabled = true;
          }

          mobileDivRef.current.className = "col-md-6 col-sm-12 col-lg-7 col-xl-7 px-0 mt-0";
          mobileOtpDivRef.current.hidden = false;
          requestButtonRef.current.hidden = true;
          verifyButtonRef.current.hidden = false;
          mobileInputRef.current.disabled = true;

        }

      }

    }

  }

  /**
   * It returns true if the emailOtp and mobileOtp are valid, otherwise it returns false.
   * @returns A function that returns a boolean value.
   * CPF_PC_56 CPF_PC_57
   */
  const verifyOtpValidation = () => {

    let IsValidEmailOtp = false;

    if (props.verifyEmail == 1) {
      if ((verify.emailOtp == "" || verify.emailOtp.length != 6)
        && emailOtpSpanRef.current != null
        && emailOtpInputRef.current != null) {
        emailOtpSpanRef.current.hidden = false;
        emailOtpSpanRef.current.style.color = "red";
        emailOtpSpanRef.current.innerHTML = "Please enter the OTP";
        emailOtpInputRef.current.style.borderColor = "red";
        IsValidEmailOtp = false;
      }
      else if ((verify.emailOtp.length == 6 || verify.emailOtp != "")
        && emailOtpSpanRef.current != null
        && emailOtpInputRef.current != null) {
        emailOtpSpanRef.current.hidden = true;
        emailOtpSpanRef.current.style.color = "";
        emailOtpSpanRef.current.innerHTML = "";
        emailOtpInputRef.current.style.borderColor = "";
        IsValidEmailOtp = true;
      }
    }
    else {
      IsValidEmailOtp = true;

    }

    let IsValidMobileOtp = false;

    if ((verify.mobileOtp == "" || verify.mobileOtp.length != 6)
      && mobileOtpSpanRef.current != null
      && mobileOtpInputRef.current != null) {
      mobileOtpSpanRef.current.hidden = false;
      mobileOtpSpanRef.current.style.color = "red";
      mobileOtpSpanRef.current.innerHTML = "Please enter the OTP";
      mobileOtpInputRef.current.style.borderColor = "red";
      IsValidMobileOtp = false;
    }
    else if ((verify.mobileOtp != "" || verify.mobileOtp.length == 6)
      && mobileOtpSpanRef.current != null
      && mobileOtpInputRef.current != null) {
      mobileOtpSpanRef.current.hidden = true;
      mobileOtpSpanRef.current.style.color = "";
      mobileOtpSpanRef.current.innerHTML = "";
      mobileOtpInputRef.current.style.borderColor = "";
      IsValidMobileOtp = true;
    }

    return (IsValidEmailOtp && IsValidMobileOtp ? true : false)
  }

  /**
   * Trying to make a function that will send a request to the server and if the response is 200,
   * then it will set the state of the component.
   * CPF_PC_58 CPF_PC_59 CPF_PC_60 CPF_PC_61 CPF_PC_62
   */
  const verifyClick = async () => {

    if (requestOtpValidation() && verifyOtpValidation()) {

      let firstResponseStatus = true;
      let secondResponseStatus = false;
      if (props.verifyEmail == 1) {
        firstResponseStatus = false;
        const requestEmail = {
          userId: Number(userId),
          type: "verifyMail",
          OTP: verify.emailOtp
        }

        const emailOtpResponse = await CheckOtp(requestEmail)

        if (emailOtpResponse.status != 200) {
          if (emailOtpResponse.status == 401
            && emailOtpResponse.data.errors.message == "Invalid Parameter , OTP"
            && emailOtpSpanRef.current != null
            && emailOtpInputRef.current != null) {
            emailOtpSpanRef.current.hidden = false;
            emailOtpSpanRef.current.style.color = "red";
            emailOtpSpanRef.current.innerHTML = "Please enter a valid OTP";
            emailOtpInputRef.current.style.borderColor = "red";
          }
          if (emailOtpResponse.status == 401
            && emailOtpResponse.data.errors.message == "Your OTP has expired"
            && emailOtpSpanRef.current != null
            && emailOtpInputRef.current != null) {
            emailOtpSpanRef.current.hidden = false;
            emailOtpSpanRef.current.style.color = "red";
            emailOtpSpanRef.current.innerHTML = "Your OTP has expired";
            emailOtpInputRef.current.style.borderColor = "red";
          }
        }
        else {
          setEmailCounter(0);
          firstResponseStatus = true
        }
      }

      const requestMobile = {
        userId: Number(userId),
        type: "verifyPhone",
        OTP: verify.mobileOtp
      }

      const mobileOtpResponse = await CheckOtp(requestMobile)

      if (mobileOtpResponse.status != 200) {
        if (mobileOtpResponse.status == 401
          && mobileOtpResponse.data.errors.message == "Invalid Parameter , OTP"
          && mobileOtpSpanRef.current != null
          && mobileOtpInputRef.current != null) {
          mobileOtpSpanRef.current.hidden = false;
          mobileOtpSpanRef.current.style.color = "red";
          mobileOtpSpanRef.current.innerHTML = "Please enter a valid OTP";
          mobileOtpInputRef.current.style.borderColor = "red";
        }
        if (mobileOtpResponse.status == 401
          && mobileOtpResponse.data.errors.message == "Your OTP has expired"
          && mobileOtpSpanRef.current != null
          && mobileOtpInputRef.current != null) {
          mobileOtpSpanRef.current.hidden = false;
          mobileOtpSpanRef.current.style.color = "red";
          mobileOtpSpanRef.current.innerHTML = "Your OTP has expired";
          mobileOtpInputRef.current.style.borderColor = "red";
        }
      }
      else {
        setPhoneCounter(0);
        secondResponseStatus = true
      }



      if (firstResponseStatus && secondResponseStatus) {
        if (Popup.current != null) {
          Popup.current.classList.add("show");
          Popup.current.style.display = "block";
        }
      }
    }
  }



  /**
   * Going to set the emailCounter to 60, then Going to set the email Otp to an empty
   * string, then Going to call the SendOtp function with the request as an argument.
   * CPF_PC_63 CPF_PC_64
   */
  const emailResendOtp = async () => {
    setEmailCounter(60);
    const request = {
      emailId: verify.emailId,
      userId: Number(userId)
    }

    setverify({ ...verify, ['emailOtp']: "" })
    if (emailOtpSpanRef.current != null
      && emailOtpInputRef.current != null) {
      emailOtpSpanRef.current.hidden = true;
      emailOtpSpanRef.current.style.color = "";
      emailOtpSpanRef.current.innerHTML = "";
      emailOtpInputRef.current.style.borderColor = "";
    }

    const emailResendOtpResponse = await SendOtp(request)

    if (emailResendOtpResponse.status != 200) {
      if (emailResendOtpResponse.status == 401 && emailResendOtpResponse.data.errors.message == "Email id already exists"
        && emailIdSpanRef.current != null && emailIdInputRef.current != null) {
        emailIdInputRef.current.style.borderColor = "red";
        emailIdSpanRef.current.hidden = false;
        emailIdSpanRef.current.innerHTML = "EmailId already exists";
        emailIdSpanRef.current.style.color = "red";
      }
      else if (emailResendOtpResponse.status == 401 && emailResendOtpResponse.data.errors.message == "Phone number already exists"
        && mobileSpanRef.current != null && mobileInputRef.current != null) {
        mobileInputRef.current.style.borderColor = "red";
        mobileSpanRef.current.hidden = false;
        mobileSpanRef.current.innerHTML = "Phone Number already exists";
        mobileSpanRef.current.style.color = "red";
      }
    }
  }

  /**
   * Going to set the phone Counter to 60, then Going to set the mobile Otp to an empty
   * string, then Going to call the SendOtp function with the request as an argument.
   * CPF_PC_65 CPF_PC_66
   */
  const mobileResendOtp = async () => {
    setPhoneCounter(60);
    const request = {
      phoneNumber: verify.mobileNumber,
      userId: Number(userId)
    }
    setverify({ ...verify, ['mobileOtp']: "" })
    if (mobileOtpSpanRef.current != null
      && mobileOtpInputRef.current != null) {
      mobileOtpSpanRef.current.hidden = true;
      mobileOtpSpanRef.current.style.color = "";
      mobileOtpSpanRef.current.innerHTML = "";
      mobileOtpInputRef.current.style.borderColor = "";
    }
    const mobileResendOtpResponse = await SendOtp(request)

    if (mobileResendOtpResponse.status != 200) {
      if (mobileResendOtpResponse.status == 401 && mobileResendOtpResponse.data.errors.message == "Email id already exists"
        && emailIdSpanRef.current != null && emailIdInputRef.current != null) {
        emailIdInputRef.current.style.borderColor = "red";
        emailIdSpanRef.current.hidden = false;
        emailIdSpanRef.current.innerHTML = "EmailId already exists";
        emailIdSpanRef.current.style.color = "red";
      }
      else if (mobileResendOtpResponse.status == 401 && mobileResendOtpResponse.data.errors.message == "Phone number already exists"
        && mobileSpanRef.current != null && mobileInputRef.current != null) {
        mobileInputRef.current.style.borderColor = "red";
        mobileSpanRef.current.hidden = false;
        mobileSpanRef.current.innerHTML = "Phone Number already exists";
        mobileSpanRef.current.style.color = "red";
      }
    }
  }

  /**
   * OnclickOk() is a function that calls the setCurrentuserValue() function from the context.js file and
   * then navigates to the /loadsearch page.
   */
  const OnclickOk = () => {
    window.sessionStorage.setItem("session", "1");
    window.localStorage.setItem("UCS", "1")
    context.setCurrentuserValue();
    navigate('/loadsearch')
  }
  /* A React component.  CPF_PC_67*/
  return (
    <div>
      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12 col-12 bg-white container-height">
          <div className="row px-4 pt-5 mt-4 justify-content-center">
            <div className="col-md-8 col-lg-11 col-xl-8 col-sm-11">
              <div className="row">
                <div className="d-lg-none mb-4 d-block text-center">
                  <img src="../Images/MODE-logo.svg" alt="mode-logo" className="cp-logo-sty" />
                </div>
                {props.verifyEmail == 0 ? <h5 className="page-header-txt mt-lg-5 mt-0 px-0">Register Phone</h5> :
                  <h5 className="page-header-txt mt-lg-5 mt-0 px-0">Register Email ID &amp; Phone</h5>}
                <p className="data-txt p-0 mt-1">Register your Email ID and Phone Number so that we can send out notifications and other informations.</p>
                <div ref={emailIdDivRef} className="col-md-12 col-12 px-0  mt-3">
                  <label htmlFor="reg-email-otp" className="form-label cp-form-label px-0" > Email ID</label>
                  <input ref={emailIdInputRef} type="text" className="form-control cp-form-field" id="reg-email-otp" placeholder="Enter your email id" disabled={props.verifyEmail == 0} name="emailId" value={verify.emailId} onChange={(event) => { onValueChange(event, "text") }} />
                  <span ref={emailIdSpanRef} className="form-label cp-form-label px-0" hidden={true} ></span>
                </div>
                <div ref={emailOtpDivRef} hidden={true} className="col-md-6 col-sm-12 col-lg-5 col-xl-5 mt-3 px-sm-0 ps-md-3">
                  <label htmlFor="reg-otp-1" className="form-label cp-form-label px-0">OTP</label>
                  <input ref={emailOtpInputRef} type="text" className="form-control cp-form-field" id="reg-otp-1" placeholder="Enter your OTP" name="emailOtp" maxLength={6} value={verify.emailOtp} onChange={(event) => { onValueChange(event, "number") }} />
                  <span ref={emailOtpSpanRef} className="form-label cp-form-label px-0" hidden={true} ></span>
                  <div className="mt-2 py-o  d-flex width-sty justify-content-end">
                    {
                      emailCounter == 0 ?
                        <span className="data-tct"><a className="mb-3 forget-ps-sty forget-ps-sty pointer underLine-remover" onClick={emailResendOtp}>Resend OTP</a></span>
                        :
                        null
                    }
                    {
                      emailCounter > 0 ?
                        <div>
                          <span className="data-txt p-0 mt-1">Resend OTP in </span>
                          <span className='otp-timer'>00:{emailCounter < 10 ? 0 : null}{emailCounter}</span>
                        </div>
                        :
                        null
                    }
                  </div>
                </div>
                <div ref={mobileDivRef} className="col-md-12 col-12 px-0 mt-3">
                  <label htmlFor="reg-phne-otp" className="form-label cp-form-label px-0 mt-3">Phone Number</label>
                  <input ref={mobileInputRef} type="text" className="form-control cp-form-field" id="reg-phne-otp" placeholder="Enter your phone number" maxLength={10} name="mobileNumber" value={verify.mobileNumber} onChange={(event) => { onValueChange(event, "number") }} />
                  <span ref={mobileSpanRef} className="form-label cp-form-label px-0 mt-3" hidden={true} ></span>
                </div>
                <div ref={mobileOtpDivRef} hidden={true} className="col-md-6 col-sm-12 col-lg-5 col-xl-5 px-sm-0 ps-md-3">
                  <label htmlFor="reg-otp-2" className="form-label cp-form-label px-0 mt-3">OTP</label>
                  <input ref={mobileOtpInputRef} type="text" className="form-control cp-form-field" id="reg-otp-2" placeholder="Enter your OTP" maxLength={6} name="mobileOtp" value={verify.mobileOtp} onChange={(event) => { onValueChange(event, "number") }} />
                  <span ref={mobileOtpSpanRef} hidden={true} className="form-label cp-form-label px-0" ></span>
                  <div className="mt-2 py-0 d-flex width-sty justify-content-end">
                    {
                      phoneCounter == 0 ?
                        <span className="data-tct"><a className="mb-3 forget-ps-sty forget-ps-sty pointer underLine-remover" onClick={mobileResendOtp}> Resend OTP</a></span>
                        :
                        null
                    }
                    {
                      phoneCounter > 0 ?
                        <div>
                          <span className="data-txt p-0 mt-1">Resend OTP in </span>
                          <span className='otp-timer'>00:{phoneCounter < 10 ? 0 : null}{phoneCounter}</span>
                        </div>
                        :
                        null
                    }
                  </div>
                </div>
                <div className="px-0 mt-5">
                  <button ref={requestButtonRef} type="button" className="btn w-100 cp-btn-primary" onClick={requestOtpClick}>Request OTP</button>
                  <button ref={verifyButtonRef} hidden={true} type="button" className="btn w-100 cp-btn-primary" onClick={verifyClick}>Verify and Continue</button>
                </div>
              </div>
              <div className="login-footer-width fixed-bottom">
                <p className="text-center">Copyright © 2023 Mode Transportation. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-lg-block d-none login-bg-image container-height">
          <div className="row px-5 pt-5 mt-5 float-end align-self-center">
            <img src="../Images/mode-white-logo.svg" className="login-logo-sty" alt="Mode-logo" />
          </div>
        </div>
      </div>
      <div className="modal fade" id="registration-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={Popup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header"> Registration Success</h5>
              {props.verifyEmail == 0 ? <p className="popup-txt">Your Phone Number has been registered successfully.</p> :
                <p className="popup-txt">Your Email ID and Phone Number has been registered successfully.</p>}
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

export default LoginRegisterOTP