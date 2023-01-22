import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router';
import moment from 'moment'
import { GetUserCustomer, GetUserSummary, StatusDD } from '../../api/api';
import { CustomerOpt, SummaryQueryDetail, UserCustomerMainResponse, UserStatus, UserStatusMainResponse, UserSummary, UserSummaryMainResponse } from '../../interface/UserInfoInterface';
import DatePicker from "react-datepicker";

const UserSummaryGrid = () => {
  let navigate = useNavigate();
  let overallGridObj: UserSummary[] = [];

  //let gridDetailsObj: UserSummary = { GCID:'', userID:0, UserName:'', EmailID:'', PhoneNumber:'',Permission:[], Customer:[], Status:[] };
  let loggedInUserId = Number(window.localStorage.getItem("userId"));
  const [summaryApiResponse, setSummaryApiResponse] = useState(overallGridObj);
  const [loadedSummaryDetails, setLoadedSummaryDetails] = useState(overallGridObj);
  const [customerDDOpt, setCustomerDDOpt] = useState<CustomerOpt[]>([]);
  const [statusDDOptions, setstatusDDOptions] = useState<UserStatus[]>([])
  const [searchVal, setSearchVal] = useState("");
  const [currentLoadedCount, setCurrentLoadedCount] = useState(0);
  const [searchDetail, setsearchDetail] = useState({ searchTimes: 0, previousLoadCount: 0 });
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [colName, setColName] = useState("");
  const [colOrder, setColOrder] = useState("desc");
  const [userNameCurrOrder, setUserNameCurrOrder] = useState("DESC");
  const [statusCurrOrder, setStatusCurrOrder] = useState("DESC");
  const [loader, setLoader] = useState(false);

  const [filCusName, setfilCusName] = useState("");
  const [filStatusID, setfilStatusID] = useState('0');
  const [filStatus, setFilStatus] = useState("");
  const [filFrom, setfilFrom] = useState("");
  const [filTo, setfilTo] = useState("");


  // useEffect(() => {
  //   loadGridPage();
  // }, []);

  useEffect(() => {

    loadGridPage();

  }, [colName, colOrder])

  const loadGridPage = async (clearFilter: boolean = false, clearSearch: boolean = false) => {
    setLoader(true);
    if (summaryApiResponse.length <= 0) {
      let statusDetails: UserStatusMainResponse = await StatusDD();
      setstatusDDOptions(statusDetails.data.UserStatus);
      let userCustomerResp: UserCustomerMainResponse = await GetUserCustomer(loggedInUserId);
      if (userCustomerResp.status == 200) {
        let customerOpts: CustomerOpt[] = [];
        for (let i = 0; i < userCustomerResp.data.length; i++) {
          let customerOption: CustomerOpt = {
            GCID: userCustomerResp.data[i].GCID,
            customerName: userCustomerResp.data[i].GCName
          }
          customerOpts.push(customerOption);
        }
        setCustomerDDOpt(customerOpts);
      }
    }
    let queryDetails: SummaryQueryDetail = {
      searchQuery: searchVal == "" ? undefined : searchVal,
      filCus: filCusName == "" ? undefined : filCusName,
      filFromDate: filFrom == "" ? undefined : filFrom,
      filToDate: filTo == "" ? undefined : filTo,
      filStatus: filStatusID == "0" ? undefined : filStatusID,
      sortCol: colName == "" ? undefined : colName,
      sortOrder: colName == "" ? undefined : colOrder,
    }
    if (clearFilter) {
      queryDetails.searchQuery = undefined;
      queryDetails.filCus = undefined;
      queryDetails.filFromDate = undefined;
      queryDetails.filToDate = undefined;
      queryDetails.filStatus = undefined;
      queryDetails.sortCol = undefined;
      queryDetails.sortOrder = undefined;
      setColName("")
      setColOrder("desc");
      setSearchVal("");
    }
    let queryExist = false;
    if (Object.values(queryDetails).some(val => val !== undefined)) {
      queryExist = true;
    }
    let responsedata: UserSummaryMainResponse = await GetUserSummary(loggedInUserId, queryDetails);

    //debugger;
    if (responsedata.status == 200) {
      let respData = responsedata.data.UserSummaryResponse;
      console.log(respData, 'api resp');
      setSummaryApiResponse(respData);
      setTotalItemsCount(respData.length);
      let loadedDetails = respData.slice(0, currentLoadedCount <= 10 ? 10 : clearSearch ? searchDetail.previousLoadCount : (currentLoadedCount == 0 || !queryExist) ? 10 : currentLoadedCount);
      console.log(respData, 'api resp aftr slice');
      setLoadedSummaryDetails(loadedDetails);
      setCurrentLoadedCount(loadedDetails.length)
      console.log(respData, summaryApiResponse, loadedSummaryDetails, totalItemsCount, currentLoadedCount, "response data from api");
      // let customerOpts: CustomerOpt[] = [];
      // for (let i = 0; i < loadedDetails.length; i++) {
      //   let customerOptionFound = customerOpts.find(x => x.GCID == loadedDetails[i].GCID);
      //   if (customerOptionFound == undefined) {
      //     let customerOption: CustomerOpt = {
      //       GCID: loadedDetails[i].GCID,
      //       customerName: loadedDetails[i].Customer[0].customerName
      //     }
      //     customerOpts.push(customerOption);
      //   }
      // }
      // setCustomerDDOpt(customerOpts);
      setLoader(false);
    }
    else {
      setLoader(false);
      setLoadedSummaryDetails([]);
      setCurrentLoadedCount(0);
      setTotalItemsCount(0);
      setSummaryApiResponse([]);
    }
  }
  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  }
  const buildLoadSummary = () => {
    console.log('summaryapiresponse', summaryApiResponse);
    return loadedSummaryDetails.map((value, index) => {
      let permissionArr = [];
      for (let i = 0; i < value.Permission.length; i++) {
        permissionArr.push(value.Permission[i].PermissionType)
      }
      let permissionString = (permissionArr.filter(onlyUnique).toString()).replace(/,/g, ", ");
      let extraCustomers = '';
      if (value.Customer.length > 1) {
        let customerNamesArr = [];
        for (let customerNameIndx = 0; customerNameIndx < value.Customer.slice(1).length; customerNameIndx++) {
          customerNamesArr.push(value.Customer.slice(1)[customerNameIndx].customerName);
        }
        extraCustomers = (customerNamesArr.toString()).replace(/,/g, ", ");
      }
      return (
        <tr>
          <td><a onClick={() => { navigate(`/admin-user-form/view` + `?uId=${value.userID}`) }} className="cp-link grid-textbold">{value.userID}</a></td>
          <td>{value.userName}</td>
          <td>{value.EmailId == "" ? "-" : value.EmailId}</td>
          <td>{value.PhoneNumber == "" || value.PhoneNumber == null ? "-" : value.PhoneNumber}</td>
          <td>{permissionString}</td>
          <td className="d-flex align-items-center">
            {value.Customer[0].customerName}
            {value.Customer.length > 1 ? <span>...<span title={extraCustomers} className="cp-grid-count pointer">+{value.Customer.length - 1}</span></span> : null}
          </td>
          <td>
            <span className="grid-bold">{value.Status[0].statusDesc}</span>
          </td>
        </tr>
      )
    });
  }

  const buildCustomer = () => {
    return customerDDOpt.map((value, index) => {
      return (
        <option value={value.customerName}>{value.customerName}</option>
      )
    });
  }
  const buildStatus = () => {
    return statusDDOptions.map((value, index) => {
      return (
        <option value={value.UserStatusId} label={value.Status}>{value.Status}</option>
      )
    });
  }
  const filCustomerOnChange = (e: any) => {
    setfilCusName(e.target.value);
  }
  const filStatusOnChange = (e: any) => {
    setfilStatusID(e.target.value);
    setFilStatus(e.target.label);
  }
  const filDateOnChange = (e: any) => {
    if (e.target.name == "filFromDate") {
      setfilFrom(e.target.value);
      setfilTo(new Date().toString());
    }
    else if (e.target.name == "filToDate") {
      setfilTo(e.target.value);
    }
  }

  const clearFilter = () => {
    setfilCusName("");
    setfilStatusID("");
    setFilStatus("");
    setfilFrom("");
    setfilTo("");
    loadGridPage(true);
  }

  const searchOnChange = (e: any) => {
    setSearchVal(e.target.value);
  }
  const search = () => {
    let searchClear = false;
    if (searchVal == "") {
      searchClear = true;

    }
    if (searchClear) {
      if (searchDetail.searchTimes != 0) {
        setsearchDetail({ ...searchDetail, searchTimes: 0 });
      }
      else {
        setsearchDetail({ ...searchDetail, previousLoadCount: currentLoadedCount, searchTimes: 0 });
      }
    }
    else {
      if (searchDetail.searchTimes != 0) {
        setsearchDetail({ ...searchDetail, searchTimes: searchDetail.searchTimes + 1 });
      }
      else {
        setsearchDetail({ ...searchDetail, previousLoadCount: currentLoadedCount, searchTimes: searchDetail.searchTimes + 1 });
      }
    }
    loadGridPage(false, searchClear);
  }
  const searchOnKey = (e: any) => {
    if (e.key === 'Enter') {
      search();
    }
  }

  const loadMore = () => {
    console.log('count details', totalItemsCount, currentLoadedCount);
    if (totalItemsCount - currentLoadedCount >= 10) {
      console.log('went into more than 10 records');
      let newLoadCountBy10 = currentLoadedCount + 10;
      console.log(newLoadCountBy10, 'adding 10 records');
      setCurrentLoadedCount(newLoadCountBy10);
      console.log(summaryApiResponse, summaryApiResponse.slice(0, newLoadCountBy10), 'new grid');
      setLoadedSummaryDetails(summaryApiResponse.slice(0, newLoadCountBy10));
    }
    else {
      console.log('went into less than 10 records');
      let newLoadCountByDiff = currentLoadedCount + (totalItemsCount - currentLoadedCount);
      console.log(newLoadCountByDiff, 'adding n records');
      setCurrentLoadedCount(newLoadCountByDiff);
      console.log(summaryApiResponse, summaryApiResponse.slice(0, newLoadCountByDiff), 'new grid');
      setLoadedSummaryDetails(summaryApiResponse.slice(0, newLoadCountByDiff));
    }
  }
  return (
    <div className="mb-5">
      <div className="row">

        {/* Page Header Section Starts Here */}
        <div className="col-md-12 my-3">
          <div className="admin-header-contents align-items-center justify-content-between">
            <h5 className="page-header-txt align-items-center mb-sm-0 mb-3">User Details</h5>
            <div className="admin-header-alignment">
              {/*filter starts*/}
              <div className=" float-start dropdown admin-margin-start-filter my-2">
                <button className="btn cp-btn-filter" type="button" title="Advanced Filter" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="Images/filter-icon.svg" alt="filter-icon" className="me-2" /> Filter
                </button>
                <div className="dropdown-menu  mt-1  m-0 advanced-filter py-3 px-4">
                  <div className="row">
                    <div className="col-md-12 mb-3"><span className="adv-filter-title">Advanced Filter</span>
                      <button type="button" className="btn-close float-end close-filter" data-bs-dismiss="advanced-filter" aria-label="Close" />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row mb-3">
                        <div className="col-md-12 mb-3 ">
                          <label className="form-label cp-form-label" htmlFor="admin-customer">Customer</label>
                          <select onChange={filCustomerOnChange} value={filCusName} className="form-select cp-form-field" id="admin-customer" aria-label="Admin Customer Filter">
                            <option value="" selected>Select</option>
                            {buildCustomer()}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="admin-status">Status</label>
                          <select onChange={filStatusOnChange} value={filStatus} className="form-select cp-form-field" id="admin-status" aria-label="Admin Status Filter">
                            <option value="" selected>Select</option>
                            {buildStatus()}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12 pb-2 border-0 ">
                        <span className="data-label">Date Range</span>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="from-date">From</label>
                          <input type="date" className="form-control cp-form-field" name="filFromDate" value={filFrom} id="from-date" onChange={(event: any) => { filDateOnChange(event) }} />
                          {/* <DatePicker
                            selected={filFrom}
                             //when day is clicked
                            onChange={(date) => setfilFrom(date == null ? new Date() : date)} //only when value has changed
                          /> */}
                          {/* <input type="date" name='filFromDate' onChange={clearFilter} className="form-control cp-form-field" id="from-date" /> */}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="to-date">To</label>
                          <input type="date"
                            min={moment(new Date(filFrom)).format('YYYY-MM-DD')}
                            className="form-control cp-form-field" id="to-date" name="filToDate" value={filTo} onChange={(event: any) => { filDateOnChange(event) }} />
                          {/* <input type="date" name='filToDate' onChange={filDateOnChange} className="form-control cp-form-field" id="to-date" /> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 my-3 d-flex justify-content-end">
                      <button onClick={() => clearFilter()} className="btn hive-btn-secondary me-3">Clear</button>
                      <button onClick={() => loadGridPage()} className="btn cp-btn-primary">Apply</button>
                    </div>
                  </div>
                </div>
              </div>
              {/*filter ends*/}
              <div className="input-group admin-search-wid float-start admin-margin-start-search my-2">
                <input type="search" value={searchVal} onChange={searchOnChange} onKeyDown={searchOnKey} className="form-control search-form-field border-end-0" placeholder="Search" aria-label="al-search-grp" id="al-search-grp" />
                <span className="input-group-text bg-white cp-search" id="ql-NMFC"><a onClick={() => search()}><img src="Images/search-icon.svg" alt="search icon" className="search-icon image-fluid" /></a></span>
              </div>
              <div className="float-start my-2">
                <button type="button" onClick={() => { navigate('/admin-user-form/new') }} className="btn cp-btn-primary admin-newuser-btn"><span><img src="Images/add-user-icon.svg" className="me-2 pb-1" alt="Add User Icon" /></span> New User</button>
              </div>
            </div>
          </div>
        </div>
        {/* Page Header Section Ends Here */}
        {/* Admin Table Starts Here */}
        <div className="col-md-12">
          <div className="table-responsive cp-grid">
            <table className="table mb-0  table-borderless">
              <thead className="cp-table-head ">
                <tr>
                  <th>User ID</th>
                  <th>Username
                    <span className="ps-2">
                      {userNameCurrOrder == "DESC" ?
                        <img onClick={() => { setColName('Username'); setColOrder('ASC'); setUserNameCurrOrder('ASC') }} src="Images/sort-down-icon.svg" alt="sort-icon" className="cp-table-sort" />
                        : <img onClick={() => { setColName('Username'); setColOrder('DESC'); setUserNameCurrOrder('DESC') }} src="Images/sort-up-icon.svg" alt="sort-icon" className="cp-table-sort" />}
                    </span></th>
                  <th>Email ID</th>
                  <th>Phone Number</th>
                  <th>Permission</th>
                  <th>Customer</th>
                  <th>Status
                    <span className="ps-2">
                      {statusCurrOrder == "DESC" ?
                        <img onClick={() => { setColName('Status'); setColOrder('ASC'); setStatusCurrOrder('ASC') }} src="Images/sort-down-icon.svg" alt="sort-icon" className="cp-table-sort" />
                        : <img onClick={() => { setColName('Status'); setColOrder('DESC'); setStatusCurrOrder('DESC') }} src="Images/sort-up-icon.svg" alt="sort-icon" className="cp-table-sort" />}
                    </span></th>
                </tr>
              </thead>
              <tbody>
                <>
                  {loadedSummaryDetails.length > 0 ?
                    buildLoadSummary() :
                    <tr>
                      <td colSpan={6}>
                        <div className="row justify-content-center">
                          <img src="../Images/add-edit-admin-norec.svg" alt="add-edit-admin-no records found" className="add-admin-norec" />
                          <p className="data-txt text-center">No Users Found</p>
                        </div>
                      </td>
                    </tr>}
                </>
              </tbody>
            </table>
          </div>
          <div>
            <p className="mt-3 cp-grid-records"># of Records : <span className="cp-grid-record-count">{currentLoadedCount}</span> out of <span className="cp-grid-record-count">{totalItemsCount}</span></p>
          </div>
          {totalItemsCount > currentLoadedCount ?
            <div className="text-center">
              <button type="button" onClick={loadMore} className="btn cp-btn-loadmore">Load More</button>
            </div> : null}

        </div>
        {/* Admin Table Ends Here */}
        {loader ? <div className="overlay">
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border Loader text-dark align-center ms-2" role="status">
              <span className="visually-hidden" />
            </div>
            <p className="data-label">Loading...</p>
          </div>
        </div> : null}
      </div>
    </div>
  )
}

export default UserSummaryGrid