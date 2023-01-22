import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../app/Context";
import { QuoteLtlResponse, QuoteRequest } from '../../interface/QuoteLtlInterface'
import { BookRequest } from '../../interface/BookLtlinterface'
import { v4 as uuidv4 } from "uuid";

const HeaderComponent = () => {
  // console.log(" inside removal in headercomponents.tsx")

  const context = useContext(UserContext);
  let navigate = useNavigate()
  const ScreenList = context.GetScreenList();
  const MenuData = context.GetMenuData();

  const loggingOut = () => {
  console.log(" inside removal in headercomponents.tsx ->>>> loggingOut()")

    window.localStorage.removeItem("SED");
    window.localStorage.removeItem("PM");
    window.localStorage.removeItem("ac");
    window.localStorage.removeItem("SC");
    window.localStorage.removeItem("UCS");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("menuData");
    window.localStorage.removeItem("expireTime");
    context.setCurrentuserValue();
    navigate("/login");
  }

  const NavChangePass = () => {
    context.setCurrentuserValue();
    navigate("/ChangePassword");
  }


  return (

    <div className="sticky-top">
      <div className="row bg-white nav-bar-view header-shadow  px-4">
        {/* navbar starts here */}
        <header className="d-flex  justify-content-between flex-wrap  px-0 py-3">
          <div className="d-flex">
            <a className="d-flex align-items-center me-4 text-decoration-none" onClick={() => {navigate("/loadsearch") }}>
              <img src="../Images/MODE-logo.svg" alt="logo" className="cp-logo-sty" />
            </a>
            <ul className="nav nav-pills align-items-center">
              {
                <li className="nav-item">
                  {
                    window.location.pathname === "/al-details-tl" ? (
                      <NavLink
                        to="/al-details-tl"
                        className="nav-link cp-header-tab-sty mx-1"
                        onClick={() => { context.ResetContext() }}>
                        All Loads
                      </NavLink>
                    ) : (
                      <NavLink
                        to="/loadsearch"
                        className="nav-link cp-header-tab-sty mx-1"
                        onClick={() => { context.ResetContext() }}>
                        All Loads
                      </NavLink>
                    )
                  }

                </li>
              }
              {
                ScreenList.some((screen: string) => screen === 'Create TL') && (
                  <li className="nav-item">
                    <NavLink
                      to="/create-tl"
                      className="nav-link cp-header-tab-sty mx-1"
                      onClick={() => { context.ResetContext() }}
                    >
                      Create TL
                    </NavLink>
                  </li>)
              }
              {
                ScreenList.some((screen: string) => screen === 'Quote LTL') && (
                  <li className="nav-item">
                    {
                      window.location.pathname === "/quoteltl-choose-carrier" ? (
                        <NavLink
                          to="/quoteltl"
                          className="nav-link cp-header-tab-sty mx-1"
                        >
                          Quote LTL
                        </NavLink>
                      ) : (
                        <NavLink
                          to="/quoteltl"
                          className="nav-link cp-header-tab-sty mx-1"
                          onClick={() => { context.ResetContext() }}
                        >
                          Quote LTL
                        </NavLink>
                      )
                    }
                  </li>)
              }
              {
                ScreenList.some((screen: string) => screen === 'Book LTL') && (
                  <li className="nav-item">
                    <NavLink
                      to="/bookltl"
                      className="nav-link cp-header-tab-sty mx-1"
                      onClick={() => { context.ResetContext() }}
                    >
                      Book LTL
                    </NavLink>
                  </li>)
              }
              {
                ScreenList.some((screen: string) => screen === 'Admin') && (
                  <li className="nav-item">
                    {
                      window.location.pathname === "/admin-user-form/:pMode" ? (
                        <NavLink
                          to="/admin-user-summary"
                          className="nav-link cp-header-tab-sty mx-1"
                        >
                          Admin
                        </NavLink>
                      ) : (
                        <NavLink
                          to="/admin-user-summary"
                          className="nav-link cp-header-tab-sty mx-1"
                        >
                          Admin
                        </NavLink>
                      )
                    }
                  </li>)
              }
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <label className="nav-alignment me-4 nav-cust-txt mb-0">Customer Name : <span className=" nav-cusname-sty">{MenuData.cropName}</span></label>
            <a className="dropdown text-decoration-none nav-batch"  id="userprofilenavbar" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Hi, {MenuData.userFirstName}
            </a>
            <ul className="dropdown-menu py-0 dropdown-sty" aria-labelledby="userprofile">
              {MenuData.userEmail != "" && MenuData.userEmail != null ? <li className="cp-dropdown-div"><a className="dropdown-item cp-dropdown-bg cust-info-txt py-2 mb-0 cursor-default">
                {MenuData.userEmail}</a></li> : null}
              <li className="cp-dropdown-div" ><a className="dropdown-item cp-dropdown-bg cust-info-txt py-2 mb-0 pointer" onClick={() => { NavChangePass() }}>
                <span><img src="../Images/change-ps-icon.svg" alt="change-ps-icon" className="me-1 nav-dropdown-align-sty" /></span>
                Change Password</a></li>
              <li><a className="dropdown-item cust-info-txt cp-dropdown-bg py-2 mb-0 pointer" onClick={() => { loggingOut() }}>
                <span><img src="../Images/logout-icon.svg" alt="logout-icon" className="me-1 nav-dropdown-align-sty logout-icon-wid" /></span>
                Log Out</a></li>
            </ul>
          </div>
        </header>
        {/* navbar ends here */}
      </div>
      {/* MOBILE VIEW offcanvas structure starts from here */}
      <div className="row bg-white  offcanvas-view px-0 py-3">
        <div className="col-sm-12 ">
          <div className="flex">
            <a className="bg-white me-2 d-inline-block" data-bs-toggle="offcanvas" href="#canvashumburger" aria-controls="canvashumburger">
              <img src="../Images/hamburger.svg" alt="hamburger-icon" className="hamburger-icon-sty" />
            </a>
            <a href="/loadsearch" className=" align-items-center me-4 text-decoration-none">
              <img src="../Images/MODE-logo.svg" alt="logo" className="cp-logo-sty" />
            </a>
          </div>
          <div className="offcanvas off-canvas-sty offcanvas-start" tabIndex={-1} id="canvashumburger" aria-labelledby="canvashumburger">
            <div className="offcanvas-header">
              <a className="navbar-brand d-xl-none font-30 text-decoration-none" >
                <img src="../Images/MODE-logo.svg" alt="logo" className="cp-logo-sty" /></a>
              <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav w-100">
                {
                  <li className="nav-item">
                    {
                      window.location.pathname === "/al-details-tl" ? (
                        <NavLink
                          to="/al-details-tl"
                          className="nav-link cp-header-tab-sty align-items-center px-3 my-1 mx-1"
                          onClick={() => { context.ResetContext() }}
                        >
                          All Loads
                        </NavLink>)
                        :
                        (<NavLink
                          to="/loadsearch"
                          className="nav-link cp-header-tab-sty align-items-center px-3 my-1 mx-1"
                          onClick={() => { context.ResetContext() }}
                        >
                          All Loads
                        </NavLink>
                        )}
                  </li>
                }
                {
                  ScreenList.some((screen: string) => screen === 'Create TL') && (
                    <li className="nav-item">
                      <NavLink
                        to="/create-tl"
                        className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                        onClick={() => { context.ResetContext() }}
                      >
                        Create TL
                      </NavLink>
                    </li>)
                }
                {
                  ScreenList.some((screen: string) => screen === 'Quote LTL') && (
                    <li className="nav-item">
                      {
                        window.location.pathname === "/quoteltl-choose-carrier" ? (
                          <NavLink
                            to="/quoteltl-choose-carrier"
                            className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                            onClick={() => { context.ResetContext() }}
                          >
                            Quote LTL
                          </NavLink>
                        ) : (
                          <NavLink
                            to="/quoteltl"
                            className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                            onClick={() => { context.ResetContext() }}
                          >
                            Quote LTL
                          </NavLink>
                        )
                      }
                    </li>)
                }
                {
                  ScreenList.some((screen: string) => screen === 'Book LTL') && (
                    <li className="nav-item">
                      <NavLink
                        to="/bookltl"
                        className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                        onClick={() => { context.ResetContext() }}
                      >
                        Book LTL
                      </NavLink>
                    </li>)
                }
                {
                  ScreenList.some((screen: string) => screen === 'Admin') && (
                    <li className="nav-item">
                      {
                        window.location.pathname === "/admin-user-form/:pMode" ? (
                          <NavLink
                            to="/admin-user-form/:pMode"
                            className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                          >
                            Admin
                          </NavLink>
                        ) : (
                          <NavLink
                            to="/admin-user-summary"
                            className="nav-link align-items-center cp-header-tab-sty px-3 my-1 mx-1"
                          >
                            Admin
                          </NavLink>
                        )
                      }
                    </li>)
                }
              </ul>
              <div className="align-items-center mt-3">
                <label className="nav-alignment mb-4 nav-cust-txt">Customer Name : <span className=" nav-cusname-sty">{MenuData.cropName}</span></label>
                <a className="dropdown text-decoration-none nav-batch"  id="userprofile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hi, {MenuData.userFirstName}
                </a>
                <ul className="dropdown-menu py-0 dropdown-sty" aria-labelledby="userprofile">
                  {MenuData.userEmail != "" && MenuData.userEmail != null ? <li className="cp-dropdown-div "><a className="dropdown-item cust-info-txt py-2 mb-0 cursor-default">
                    {MenuData.userEmail}</a></li> : null}
                  <li className="cp-dropdown-div"><a className="dropdown-item cust-info-txt py-2 mb-0 pointer" onClick={() => { loggingOut() }}>
                    <span><img src="../Images/change-ps-icon.svg" alt="change-ps-icon" className="me-1 nav-dropdown-align-sty" /></span>
                    Change Password</a></li>
                  <li><a className="dropdown-item cust-info-txt py-2 mb-0 pointer" onClick={() => { loggingOut() }}>
                    <span><img src="../Images/logout-icon.svg" alt="logout-icon" className="me-1 nav-dropdown-align-sty logout-icon-wid" /></span>
                    Log Out</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE VIEW offcanvas structure ends here */}
    </div>
  )
}

export default HeaderComponent