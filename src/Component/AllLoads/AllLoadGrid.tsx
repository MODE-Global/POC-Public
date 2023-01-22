import moment from 'moment'
// import { parse } from 'node:path/win32'
import React, { useState, useEffect, useRef } from 'react'
import { GetUserDetail, LoadSearch, LoadDocuments, LoadMethod, LoadStatus } from '../../api/api'
import { LoadRequest, LoadDocsRequest } from '../../interface/LoadSearchInterface'
import { useNavigate } from 'react-router-dom';

const AllLoadsGrid = () => {
  const objNav = useNavigate();
  const [loadGridData, setloadGridData] = useState<any[]>([])
  const [loadDocumentData, setloadDocumentData] = useState<any[]>([])
  const [customer, setcustomer] = useState("")

  const [loadStatus, setloadStatus] = useState<any[]>([])
  const [loadMethod, setloadMethod] = useState<any[]>([])
  const [loader, setLoader] = useState(true)
  let filterDateObj = {
    loadMethod: "",
    loadStatus: "",
    fromDate: "",
    toDate: "",
    customerId: [],
    gcid: [],
    officeCode: [],
  }
  const [filters, setFilters] = useState(filterDateObj)

  let searchObj = {
    loadId: "",
    poNumber: "",
    customerblNumber: "",
    pickupNumber: "",
    deliveryNumber: "",
  }
  const [searchValue, setSearchValue] = useState(searchObj)

  let loadCountObj = {
    othertmsLoadRecords: 0,
    btmsLoadRecords: 0,
    totalLoadsCount: 0
  }

  const [loadCount, setloadCount] = useState(loadCountObj)
  const loadRequestObj: LoadRequest = {
    customerId: [],
    gcid: [],
    officeCode: [],
    loadId: "",
    shipDateStart: "",
    shipDateEnd: "",
    loadStatus: "",
    loadMethod: "",
    poNumber: "",
    customerblNumber: "",
    pickupNumber: "",
    deliveryNumber: "",
    sortOrder: "",
    sortColumn: "",
    otmsLoadRecords: "",
    btmsLoadRecords: ""
  }
  let emptyArray: any = []

  const [getUserDetail, SetGetUserDetail] = useState(emptyArray)
  const [getUserGcidDetail, setgetUserGcidDetail] = useState(emptyArray)
  const [loadSearchReq, setloadSearchReq] = useState(loadRequestObj)
  const [sort, setSort] = useState({ sortField: "", sortOrder: "" });
  const [selectedSearch, setSelectedSearch] = useState("LoadNumber");
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const GetOnLoadData = async () => {
      const response: any = await GetUserDetail(localStorage.getItem('userId'))
      if (response.status == 200) {
        let customerGcidDetail: any[] = [];
        let customerDetail: any[] = [];
        let gcId: any[] = [];
        let custmId: any[] = [];
        let officeCode: any[] = [];
        response.data.userDetails.forEach((value: any) => {
          customerGcidDetail.push(value);
          gcId.push(value.gcId)
          value.customerDetails.forEach((customer: any) => {
            customerDetail.push(customer)
            custmId.push(parseInt(customer.custmId))
            officeCode.push(customer.officeCode)
          })
        })
        setloadSearchReq({
          ...loadSearchReq,
          ["gcid"]: gcId,
          ["customerId"]: custmId,
          ["officeCode"]: officeCode
        })
        setgetUserGcidDetail(customerGcidDetail)
        SetGetUserDetail(customerDetail)


        const loadStatusRes: any = await LoadStatus()
        setloadStatus(loadStatusRes.data.LoadStatus)
        const loadMethodRes: any = await LoadMethod()
        setloadMethod(loadMethodRes.data.LoadMethods)

        const payload = {
          ...loadRequestObj,
          ["gcid"]: gcId,
          ["customerId"]: custmId,
          ["officeCode"]: officeCode,
        }

        loadData(payload);
      }
    }
    GetOnLoadData()
  }, [])

  const loadData = async (req: LoadRequest) => {
    setLoader(true)
    const loadResponse: any = await LoadSearch(req)
    let btmsLoadId: any[] = []
    let othertmsLoads: any[] = []

    if (loadResponse.status == 200) {
      setLoader(false)
      let loadedData = req.btmsLoadRecords != "" || req.otmsLoadRecords != "" ? loadGridData.concat(loadResponse.data.loadResponse) : loadResponse.data.loadResponse;
      setloadGridData(loadedData);
      let loadCount = loadResponse.data.loadCount;
      setloadCount({
        ...loadCount,
        ["othertmsLoadRecords"]: loadCount.othertmsLoadRecords,
        ["btmsLoadRecords"]: loadCount.btmsLoadRecords,
        ["totalLoadsCount"]: loadCount.totalLoadsCount
      })
      loadedData.forEach((data: any, index: number) => {

        if (data?.documents == undefined) {
        if (data.loadOrigin == "BTMS") {
          btmsLoadId.push(data.loadID)
        }
        else {
          othertmsLoads.push(data.loadID)
        }
      }

      })
      const docRequest: LoadDocsRequest = {
        btmsLoads: btmsLoadId,
        othertmsLoads: othertmsLoads
      }
      const documentResponse: any = await LoadDocuments(docRequest)

      let loadedDocument = req.btmsLoadRecords != "" || req.otmsLoadRecords != "" ? loadDocumentData.concat(documentResponse?.data.loadDocResult) : documentResponse?.data.loadDocResult;

      setloadDocumentData(loadedDocument)

      setloadGridData((loadGridData: any) => {
          return loadGridData?.map((item: any, index: any) => {
            return { ...item, documents: loadedDocument?.find((doc: any) => doc.loadId === item.loadID)?.documents }
          })
        })
    }
    else if (loadResponse.status == 204) {

      setLoader(false)
      setloadGridData([])
    }
    else {
      setLoader(false)
    }
  }

  const customerDropDown = () => {
    return getUserDetail.map((data: any, index: any) => {
      return (
        <option key={index} value={data.mySunteckLoginId}>{data.customerName} - {data.mySunteckLoginId}</option>
      )
    })
  }

  const loadStatusDD = () => {
    return loadStatus?.map((data: any, index: any) => {
      return (
        <option key={data.LoadStatusId} value={data.Status}>{data.Status}</option>
      )
    })
  }

  const loadMethodDD = () => {
    return loadMethod?.map((data: any, index: any) => {
      return (
        <option key={data.LoadMethodsId} value={data.Methods}>{data.Methods}</option>
      )
    })
  }

  const toggleSort = (columnName: string) => {
    setloadSearchReq({...loadSearchReq, otmsLoadRecords: "", btmsLoadRecords : ""})

    setSort(prev => {

      const payload = {
        ...loadRequestObj,
        ["gcid"]: loadSearchReq.gcid,
        ["customerId"]: loadSearchReq.customerId,
        ["officeCode"]: loadSearchReq.officeCode,
        ["loadStatus"]: filters.loadStatus,
        ["loadMethod"]: filters.loadMethod,
        ["shipDateStart"]: filters.fromDate,
        ["shipDateEnd"]: filters.toDate,
        ["loadId"]: selectedSearch == "LoadNumber"? searchValue.loadId : "",
        ["poNumber"]: selectedSearch == "PONumber"? searchValue.poNumber : "",
        ["customerblNumber"]: selectedSearch == "CusBLNumber"? searchValue.customerblNumber : "",
        ["pickupNumber"]: selectedSearch == "PickupNumber"? searchValue.pickupNumber : "",
        ["deliveryNumber"]: selectedSearch == "DeliveryNumber"? searchValue.deliveryNumber : "",
        ["sortOrder"]: prev.sortField === columnName ? (prev.sortOrder === "" ? "ascending" : (prev.sortOrder === "ascending" ? "descending" : "ascending")) : "ascending",
        ["sortColumn"]: columnName
      };

      loadData(payload);

      return {
        ...prev,
        sortField: columnName,
        sortOrder: prev.sortField !== columnName ? "ascending" : prev.sortOrder === "ascending" ? "descending" : "ascending" //icon
      }
    })
  }

  const onCustomerChange = (event: any) => {
    let gcId: any = []
    let custmId: any = []
    let officeCode: any = []
    setcustomer(event.target.value)
    getUserGcidDetail.forEach((userDetail: any) => {
      userDetail.customerDetails.forEach((customerDetail: any) => {
        if (customerDetail.mySunteckLoginId == event.target.value) {
          gcId.push(userDetail.gcId)
          custmId.push(parseInt(customerDetail.custmId))
          officeCode.push(customerDetail.officeCode)
        }
      })
    })
    // setloadSearchReq({
    //   ...loadSearchReq,
    //   ["gcid"]: gcId,
    //   ["customerId"]: custmId,
    //   ["officeCode"]: officeCode
    // })
    setFilters({
      ...filters,
      gcid:gcId,
      customerId:custmId,
      officeCode:officeCode
    })
  }

  const handleApply = () => {
    setSort({ ...sort, sortField: "", sortOrder: "" })
    setloadSearchReq({...loadSearchReq, otmsLoadRecords: "", btmsLoadRecords : ""})
    const payload = {
      ...loadRequestObj,
      ["gcid"]: filters.gcid.length == 0 ? loadSearchReq.gcid : filters.gcid,
      ["customerId"]: filters.customerId.length == 0 ? loadSearchReq.customerId : filters.customerId,
      ["officeCode"]: filters.officeCode.length == 0 ? loadSearchReq.officeCode : filters.officeCode, 
      ["loadStatus"]: filters.loadStatus,
      ["loadMethod"]: filters.loadMethod,
      ["shipDateStart"]: filters.fromDate,
      ["shipDateEnd"]: filters.toDate,
      ["loadId"]: selectedSearch == "LoadNumber"? searchValue.loadId : "",
      ["poNumber"]: selectedSearch == "PONumber"? searchValue.poNumber : "",
      ["customerblNumber"]: selectedSearch == "CusBLNumber"? searchValue.customerblNumber : "",
      ["pickupNumber"]: selectedSearch == "PickupNumber"? searchValue.pickupNumber : "",
      ["deliveryNumber"]: selectedSearch == "DeliveryNumber"? searchValue.deliveryNumber : "",
    }

    loadData(payload)
  }

  const handleClear = () => {
    setSort({ ...sort, sortField: "", sortOrder: "" })
    setloadSearchReq({...loadSearchReq, otmsLoadRecords: "", btmsLoadRecords : ""})
    setcustomer("")
    loadData({
      ...loadRequestObj,
      ["gcid"]: loadSearchReq.gcid,
      ["customerId"]: loadSearchReq.customerId,
      ["officeCode"]: loadSearchReq.officeCode,
      ["loadId"]: selectedSearch == "LoadNumber"? searchValue.loadId : "",
      ["poNumber"]: selectedSearch == "PONumber"? searchValue.poNumber : "",
      ["customerblNumber"]: selectedSearch == "CusBLNumber"? searchValue.customerblNumber : "",
      ["pickupNumber"]: selectedSearch == "PickupNumber"? searchValue.pickupNumber : "",
      ["deliveryNumber"]: selectedSearch == "DeliveryNumber"? searchValue.deliveryNumber : "",
    })
  }

  const displayDocuments = (documents: any, loadId: any, loadOrigin : any) => {

    const priorityDocs = ["Invoice", "Proof of Delivery", "Bill of Lading", "Shipping label", "Customer Confirmation", "Lumper Receipt", "Customer Receipt", "Scale/Weight", "Accessorial Approval"]

    const finalDocs = priorityDocs.map((item: any, i: any) => {
      const docs = documents.filter((doc: any) => doc.docName === item);
      return docs;
    }).filter((arr) => arr.length > 0)

    return [...finalDocs?.map((doc: any, i: any) => {

      if (i < 2) {
        const openMultiple = (docs: any) => {
          docs.forEach((doc: any) => {
            window.open(doc.docUrl, "_blank");
          })
        }

        return <>
          <span className="me-3  pointer"><a target="_blank" onClick={() => openMultiple(doc)}>
            <img src="Images/t-pdf-icon.svg" className="cp-grid-pdf me-2" alt="table-pdf-icon" />{doc?.[0]?.docName} </a> </span>
        </>
      }

    }), finalDocs.length > 2 ? <span className="cp-grid-count pointer" onClick={() => { NavigateTo("/al-details-tl?lid="+loadId +"&lorg="+loadOrigin) }}>+{finalDocs.length - 2} </span> : ""]

  }

  const getSortIcon = (fieldName: string) => {
    return fieldName === sort.sortField ? <span className="ps-2" >
      <img src={sort.sortOrder === "ascending" ? "Images/sort-up-icon.svg" : "Images/sort-down-icon.svg"} alt="sort-icon" className="cp-table-sort" />
    </span> : ""
  }

  const onDisplayRecordsChange = (event: any) => {
    let payload = {
      ...loadRequestObj,
      ["customerId"]: loadSearchReq.customerId,
      ["gcid"]: loadSearchReq.gcid,
      ["officeCode"]: loadSearchReq.officeCode,
    }
    if (event.target.value == "Yesterday") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Today") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(0, 'day').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(0, 'day').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Tomorrow") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(-1, 'day').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(-1, 'day').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Last Week") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "This Week") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(0, 'weeks').startOf('week').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(0, 'weeks').endOf('week').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Next Week") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(-1, 'weeks').startOf('week').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(-1, 'weeks').endOf('week').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Last Month") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "This Month") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(0, 'month').startOf('month').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(0, 'month').endOf('month').format('YYYY-MM-DD'),
      }
    }

    if (event.target.value == "Next Month") {
      payload = {
        ...loadRequestObj,
        ["customerId"]: loadSearchReq.customerId,
        ["gcid"]: loadSearchReq.gcid,
        ["officeCode"]: loadSearchReq.officeCode,
        ["shipDateStart"]: moment().subtract(-1, 'month').startOf('month').format('YYYY-MM-DD'),
        ["shipDateEnd"]: moment().subtract(-1, 'month').endOf('month').format('YYYY-MM-DD'),
      }
    }
    setloadSearchReq({ ...payload })
    loadData(payload)

  }

  const onfilterChange = (event: any, type: any) => {
    switch (type) {
      case "fromDate": {
        setFilters({ ...filters, [event.target.name]: event.target.value, ["toDate"]: "" })
        break;
      }
      default: {
        setFilters({ ...filters, [event.target.name]: event.target.value })
      }
    }
  }

  const NavigateTo = (objPath: string) => {
    objNav(objPath)
  }

  const searchOnClick = () => {
    setSort({ ...sort, sortField: "", sortOrder: "" })
    setloadSearchReq({...loadSearchReq, otmsLoadRecords: "", btmsLoadRecords : ""})
    setSearchValue( {...searchValue, loadId: "", poNumber: "", customerblNumber: "", pickupNumber: "", deliveryNumber: ""})

    const payload = {
      ...loadRequestObj,
      ["gcid"]: filters.gcid.length == 0 ? loadSearchReq.gcid : filters.gcid,
      ["customerId"]: filters.customerId.length == 0 ? loadSearchReq.customerId : filters.customerId,
      ["officeCode"]: filters.officeCode.length == 0 ? loadSearchReq.officeCode : filters.officeCode, 
      ["loadId"]: '',
      ["poNumber"]: '',
      ["customerblNumber"]: '',
      ["pickupNumber"]: '',
      ["deliveryNumber"]: '',
      ["loadStatus"]: filters.loadStatus,
      ["loadMethod"]: filters.loadMethod,
      ["shipDateStart"]: filters.fromDate,
      ["shipDateEnd"]: filters.toDate,

    }
    // console.log("Search State variable",searchValue)
    // selectedSearch
    console.log("Search State variable",selectedSearch)

    switch (selectedSearch) {
      case 'LoadNumber':
        // setSearchValue(searchObj)
        payload.loadId = searchVal;
        setSearchValue({ ...searchValue, ["loadId"]: searchVal })
        break;
      case 'PONumber':
        // setSearchValue(searchObj)
        payload.poNumber = searchVal;
        setSearchValue({ ...searchValue, ["poNumber"]: searchVal })
        break;
      case 'CusBLNumber':
        // setSearchValue(searchObj)
        payload.customerblNumber = searchVal;
        setSearchValue({ ...searchValue, ["customerblNumber"]: searchVal })
        break;
      case 'PickupNumber':
        // setSearchValue(searchObj)
        payload.pickupNumber = searchVal;
        setSearchValue({ ...searchValue, ["pickupNumber"]: searchVal })
        break;
      case 'DeliveryNumber':
        // setSearchValue(searchObj)
        payload.deliveryNumber = searchVal;
        setSearchValue({ ...searchValue, ["deliveryNumber"]: searchVal })
        break;
    }
    loadData(payload);
  }

  const searchOnKey = (e: any) => {
    if (e.key === 'Enter') {
      searchOnClick();
    }
  }

  const loadMore = () => {
    const payload = {
      ...loadRequestObj,
      ["gcid"]: filters.gcid.length == 0 ? loadSearchReq.gcid : filters.gcid,
      ["customerId"]: filters.customerId.length == 0 ? loadSearchReq.customerId : filters.customerId,
      ["officeCode"]: filters.officeCode.length == 0 ? loadSearchReq.officeCode : filters.officeCode, 
      ["loadStatus"]: filters.loadStatus,
      ["loadMethod"]: filters.loadMethod,
      ["shipDateStart"]: filters.fromDate,
      ["shipDateEnd"]: filters.toDate,
      ["loadId"]: selectedSearch == "LoadNumber"? searchValue.loadId : "",
      ["poNumber"]: selectedSearch == "PONumber"? searchValue.poNumber : "",
      ["customerblNumber"]: selectedSearch == "CusBLNumber"? searchValue.customerblNumber : "",
      ["pickupNumber"]: selectedSearch == "PickupNumber"? searchValue.pickupNumber : "",
      ["deliveryNumber"]: selectedSearch == "DeliveryNumber"? searchValue.deliveryNumber : "",
      ["sortOrder"]: sort.sortOrder,
      ["sortColumn"]: sort.sortField,
      ["otmsLoadRecords"]: String(Number(loadSearchReq.otmsLoadRecords == "" ? 0 : loadSearchReq.otmsLoadRecords) + loadCount.othertmsLoadRecords),
      ["btmsLoadRecords"]: String(Number(loadSearchReq.btmsLoadRecords == "" ? 0 : loadSearchReq.btmsLoadRecords) + loadCount.btmsLoadRecords),
    }
    setloadSearchReq({
      ...loadSearchReq,
      ["otmsLoadRecords"]: String(Number(loadSearchReq.otmsLoadRecords == "" ? 0 : loadSearchReq.otmsLoadRecords) + loadCount.othertmsLoadRecords),
      ["btmsLoadRecords"]: String(Number(loadSearchReq.btmsLoadRecords == "" ? 0 : loadSearchReq.btmsLoadRecords) + loadCount.btmsLoadRecords),
    });
    loadData(payload);
  }

  return (
    <div className="mb-5">
      <div className="row">
        {/* Page Header Section Starts Here */}
        <div className="col-md-12 my-3">
          <div className="al-header-contents align-items-center justify-content-between">
            <h5 className="page-header-txt mb-3 mb-lg-0">All Loads</h5>
            <div className="al-header-alignment">
              <div className="d-flex float-start al-margin-end-filter align-items-center my-2">
                <label htmlFor="display-records" className="form-label mb-0 cp-form-label text-nowrap me-2">Display Records</label>
                <select id="display-records" className="form-select cp-form-field d-records-width" aria-label="Display Records based on date range" onChange={(event: any) => { onDisplayRecordsChange(event) }}>
                  <option value={"All"}>All</option>
                  <option value={"Yesterday"}>Yesterday</option>
                  <option value={"Today"}>Today</option>
                  <option value={"Tomorrow"}>Tomorrow</option>
                  <option value={"Last Week"}>Last Week</option>
                  <option value={"This Week"}>This Week</option>
                  <option value={"Next Week"}>Next Week</option>
                  <option value={"Last Month"}>Last Month</option>
                  <option value={"This Month"}>This Month</option>
                  <option value={"Next Month"}>Next Month</option>
                </select>
              </div>
              <div className=" float-start dropdown al-margin-start-filter my-2">
                <button className="btn cp-btn-filter" type="button" title="Advanced Filter" data-bs-toggle="dropdown" aria-expanded="false">
                  <span><img src="Images/filter-icon.svg" alt="filter-icon" className="me-2" /></span> Filter
                </button>
                {/*filter starts*/}
                <div className="dropdown-menu  mt-1  m-0 advanced-filter py-3 px-4">
                  <div className="row">
                    <div className="col-md-12 mb-3"><span className="adv-filter-title">Advanced Filter</span>
                      <button type="button" className="btn-close float-end close-filter" data-bs-dismiss="advanced-filter" aria-label="Close" />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="al-move-type">Move Type</label>
                          <select value={filters.loadMethod} name="loadMethod" onChange={(event: any) => { onfilterChange(event, "") }} className="form-select cp-form-field" id="al-move-type" aria-label="All Loads Move Tpe">
                            <option value="" disabled selected hidden>Select</option>
                            {loadMethodDD()}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3 ">
                          <label className="form-label cp-form-label" htmlFor="al-status">Status</label>
                          <select value={filters.loadStatus} name="loadStatus" onChange={(event: any) => { onfilterChange(event, "") }} className="form-select cp-form-field" id="al-status">
                            <option value="" disabled selected hidden>Select</option>
                            {loadStatusDD()}
                          </select>
                        </div>
                        <div className="col-md-12 mb-3 ">
                          <label className="form-label cp-form-label" htmlFor="al-customer">Customer</label>
                          <select onChange={(event: any) => { onCustomerChange(event) }} className="form-select cp-form-field" id="al-customer" value={customer}>
                            <option value={""}>Select</option>
                            {customerDropDown()}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12 pb-2 border-0 ">
                        <span className="data-label">Ship Date Range</span>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="from-date">From</label>
                          <input type="date" className="form-control cp-form-field" name="fromDate" value={filters.fromDate} id="from-date" onChange={(event: any) => { onfilterChange(event, "fromDate") }} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label cp-form-label" htmlFor="to-date">To</label>
                          <input type="date"
                            min={moment(new Date(filters.fromDate)).format('YYYY-MM-DD')}
                            className="form-control cp-form-field" id="to-date" name="toDate" value={filters.toDate} onChange={(event: any) => { onfilterChange(event, "") }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 my-3 d-flex justify-content-end">
                      <button className="btn hive-btn-secondary me-3" onClick={() => { handleClear(); setFilters(filterDateObj) }}>Clear</button>
                      <button className="btn cp-btn-primary" onClick={handleApply}>Apply</button>
                    </div>
                  </div>
                </div>
                {/*filter ends*/}
              </div>
              <div className="input-group float-start al-margin-start-search my-2">
                <select value={selectedSearch} onChange={(e) => setSelectedSearch(e.target.value)} className="form-select al-header-select-width cp-form-field" id="al-search" aria-label="Select Search Criteria">
                  <option selected value="LoadNumber">Load Number</option>
                  <option value="PONumber">P.O.Number</option>
                  <option value="CusBLNumber">Customer B/L Number</option>
                  <option value="PickupNumber">Pickup Number</option>
                  <option value="DeliveryNumber">Delivery Number</option>
                </select>
                <input type="search" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={searchOnKey} className="form-control search-form-field border-end-0" placeholder="Search" aria-label="al-search-grp" id="al-search-grp" />
                <span className="input-group-text bg-white cp-search" id="ql-NMFC"><a  onClick={searchOnClick}><img src="Images/search-icon.svg" alt="search icon" className="search-icon image-fluid" /></a></span>
              </div>
              {/* <div class="">
        </div> */}
            </div>
          </div>
        </div>
        {/* Page Header Section Ends Here */}
        {/* All Loads Table Starts Here */}
        {loadGridData.length > 0 ?
          <div className="col-md-12">
            <div className="table-responsive cp-grid">
              <table className="table mb-0  table-borderless ">
                <thead className="cp-table-head ">
                  <tr>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("loadId")}>Load #{getSortIcon("loadId")}
                    </th>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("loadStatus")}>Status{getSortIcon("loadStatus")}
                    </th>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("moveType")}>Move Type{getSortIcon("moveType")}</th>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("origin")}>Origin{getSortIcon("origin")}</th>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("destination")}>Destination{getSortIcon("destination")}</th>
                    <th>Reference #<span className="ps-2"></span></th>
                    <th className="al-grid-pointer" onClick={(e) => toggleSort("total")}>Total{getSortIcon("total")}</th>
                    <th>Documents<span className="ps-2"> </span></th>
                  </tr>
                </thead>
                <tbody>
                  {loadGridData?.map((data: any) => {
                    return (
                      <tr key={data.loadID}>
                        <td>
                          <a onClick={() => { NavigateTo("/al-details-tl?lid=" + data.loadID + "&lorg=" + data.loadOrigin) }} className="cp-link grid-textbold cursor">{data.loadID}</a></td>
                        <td>
                          <span className="  grid-textbold">{data.loadStatus}</span>
                        </td>
                        <td>{data.loadMethod}</td>
                        <td>
                          {data.shipperCity}, {data.shipperState}
                          <p className="cp-grid-secondary-text mb-0">{moment(new Date(data.shipDateStart)).format("MM/DD/YYYY")}</p>
                          <p className="cp-grid-secondary-text mb-0">{data.shipBlNumber}</p>

                        </td>
                        <td>
                          {data.consigneeCity}, {data.consigneeState}
                          <p className="cp-grid-secondary-text mb-0">{moment(new Date(data.shipDateEnd)).format("MM/DD/YYYY")}</p>
                        </td>
                        <td>
                          {(data.poNumber == "" || data.proNumber == null) ? "-" : "PO" + data.poNumber}
                          <p className="cp-grid-secondary-text mb-0">{(data.proNumber =="" || data.proNumber == null )?  "-" : `PRO#` + data.proNumber }</p>
                          <p className="cp-grid-secondary-text mb-0">{(data.shipBlNumber == "" || data.shipBlNumber == null )?  "-" : "BL#" + data.shipBlNumber} </p>
                        </td>
                        <td>
                          ${data.custTotal == null ? "0.00" : data.custTotal}
                          <p className="cp-grid-secondary-text mb-0"> {data.invoice == "0000-00-00" ? moment(new Date(data.invoiceDate)).format("MM/DD/YYYY") : ""}  </p>
                        </td>
                        <td className="d-flex align-items-center">
                          {!!data.documents ? (data.documents.length > 0 ? displayDocuments(data.documents, data.loadID, data.loadOrigin) : "Not Available") :
                            <div className="spinner-border Loader text-dark align-center " role="status">
                              <span className="visually-hidden" />
                            </div>
                          }
                        </td>
                      </tr>)
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <p className="mt-3 cp-grid-records"># of Records : <span className="cp-grid-record-count">{loadGridData.length}</span> out of <span className="cp-grid-record-count">{loadCount.totalLoadsCount}</span></p>
            </div>
            {loadGridData.length < loadCount.totalLoadsCount ?
              <div className="text-center mb-5">
                <button type="button" onClick={loadMore} className="btn cp-btn-loadmore">Load More</button>
              </div>
              : null}

          </div>
          :
          <div className="col-12 d-flex align-items-center justify-content-center flex-column no-records">
            <img src="Images/no-documents-found-icon.svg" alt="no documents found" className="no-records-icon" />
            <span className="data-label  mt-3">No Records Found</span>
          </div>}
        {loader ? <div className="overlay">
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border Loader text-dark align-center ms-2" role="status">
              <span className="visually-hidden" />
            </div>
            <p className="data-label">Loading...</p>
          </div>
        </div> : null}
        {/* All Loads table Ends Here */}
      </div>
    </div>

  )
}

export default AllLoadsGrid