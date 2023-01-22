import moment from 'moment'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetLoadDetail, SendEmailForLoadDetail } from '../../api/api'
import { LatLong } from '../../interface/LoadSearchInterface';
import GoogleMaps from './GoogleMap';

const AllLoadsDetailsTL = () => {
  const objNav = useNavigate();
  const ShowEmailPopup = useRef<HTMLDivElement>(null);
  const ShowSuccessPopup = useRef<HTMLDivElement>(null);
  const EmailNotFilled = useRef<HTMLInputElement>(null);

  const qsParams = new URLSearchParams(window.location.search)//useParams();
  let objLoadId = qsParams.get("lid");
  let objLoadOrgin = qsParams.get("lorg");

  const [loadDetail, setLoadDetail]: any = useState();
  const [sendEmail, setSendEmail] = useState("");
  const [docUrl, setDocUrl] = useState("");
  let coordinates : LatLong = {
    lat:0,
    lng:0
  }
  const [destinationCoordinates, setDestinationCoordinates] = useState(coordinates)
  const [originCoordinates, setOriginCoordinates] = useState(coordinates)


  const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

 

  /**
   * This function is to navigate between screens
   * @param objPath - Specifies the page it should navigate.
   */
  const navigateTo = (objPath: string) => {
    objNav(objPath)
  }

  /**
   * This method gets called to get the data from the API and load 
   * the data into the state variable
   */
  const loadData = async () => {
    const response: any = await GetLoadDetail(objLoadId, objLoadOrgin)
    if (response.status == 200) {
      setLoadDetail(response.data)
      // console.log("laoddetial...", response.data)
if(response.data?.loadShipConsRef?.loadMethod.toLowerCase() == "tl"){

      let destination = response.data?.loadShipConsRef?.consigneeAddressLine1+","+ response.data?.loadShipConsRef?.consigneeCity+","+response.data?.loadShipConsRef?.consigneeState+","+response.data?.loadShipConsRef?.consigneeZip

      let origin = response.data?.loadShipConsRef?.shipperAddressLine1+","+ response.data?.loadShipConsRef?.shipperCity+","+response.data?.loadShipConsRef?.shipperState+","+response.data?.loadShipConsRef?.shipperZip

      let destinationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=+${destination}+&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY !=undefined ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}`

      fetch(destinationUrl)
      .then(res => res.json())
      .then(res => {
      setDestinationCoordinates({
      ...destinationCoordinates,
       ["lat"]: res.results[0].geometry.location.lat,
       ["lng"]: res.results[0].geometry.location.lng,
})

})

   let originUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=+${origin}+&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY !=undefined ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}`

  fetch(originUrl)
  .then(res => res.json())
  .then(res => {
  setOriginCoordinates({
  ...originCoordinates,
  ["lat"]: res.results[0].geometry.location.lat,
  ["lng"]: res.results[0].geometry.location.lng,
})

})

}

    }

  }

  /**
   * This method is to bind the date and time in the right format
   * @param inputDate - Date to be formated
   * @param inputTime - Time to be formated
   * @returns a concatenated string of date and time in the format mm/dd/yyyy & hh:mm
   */
  const bindDate = (inputDate: any, inputTime: string) => {
    let resDate = "";
    let resTime = "";
    // resDate = (inputDate == null || inputDate == "") ? "NA " : new Date(inputDate).toLocaleDateString()
    resDate = (inputDate == null || inputDate == "" || inputDate =="0000-00-00") ? "NA " : moment(new Date(inputDate)).format("MM/DD/YYYY")

    resTime = (inputTime == "" || inputTime == "00:00:00" || inputTime == null) ? "" : inputTime

    let splittedTime = resTime.split(":")

    return resDate + ((resTime != "") ? " & " + splittedTime[0]+":"+ splittedTime[1]: " & NA")
  }

  /**
   * This method is for binding all the documents in the document card.
   * If there are no documents then this will display no documents found.
   * @param paramDocArray - Array of documents retrieved from the database
   * @returns - Bind the HTML content with the document name
   */
  const bindDocuments = (paramDocArray: any[]) => {
    if (paramDocArray != undefined && paramDocArray.length > 0) {
      return paramDocArray.map((item, index) => {
        return (
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 my-2">
            <div className="card all-details-card px-0 py-2 h-100 ">
              <div className="card-body p-2">
                <div className="d-flex">
                  <a href={item.docUrl} target="_blank">
                    <img src="../Images/pdf-icon.svg" alt="pdf-icon" className="me-3 al-details-pdf-icon" /></a>
                  <div>
                    <h5 className="card-title data-txt mb-2">{item.docName}</h5>
                    <a href={item.docUrl} target="_blank">
                      <img src="../Images/download-icon.svg" alt="download-icon" className="me-2 al-details-download-icon" /></a>
                    {(item.docName === "Bill of Lading") ?
                      <a className="cursor" onClick={()=>invokeEmailPopup(item.docUrl)}>
                        <img src="../Images/send-email-icon.svg" alt="email-icon" className="me-2 al-details-download-icon" />
                      </a>
                      : ""
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
    else {
      return (
        <div className="col-12 d-flex align-items-center justify-content-center flex-column no-records">
          <img src="Images/no-documents-found-icon.svg" alt="no documents found" className="no-records-icon" />
          <span className="data-label  mt-3">No Documents Found</span>
        </div>
      )
    }
  }

  /**
   * This method is for binding the commodity details in the grid.
   * If hazmat data is available them thay segment will be displayed if not 
   * it will not be displayed.
   * @param paramCommArray - Commodity details array
   * @returns - HTML array content.
   */
  const bindCommodities = (paramCommArray: any[]) => {
    if (paramCommArray == undefined) {
      <tr>
        <td colSpan={7}>
          No records found
        </td>
      </tr>
    }
    else {
      return paramCommArray.map((item, index) => {
        let altClsName = ((index % 2) == 0) ? "tbl-acc-alt-rowclr" : ""
        return ([
         <tr className={altClsName}>
            <td>
              <button className="cp-tbl-acc-button tbl-acc-btn collapsed"
                type="button" data-bs-toggle="collapse"
                data-bs-target={"#Commodity" + index} aria-expanded="true"
                aria-controls={"Commodity" + index} />
            </td>
                 {/* <td>{item.itemId}</td> */}
                 <td>Commodity {index + 1}</td>
                 <td>{(item.hazmat) == "0" ? "No" : "Yes"}</td>
                 <td>{(item.itemQuantity == 0 || item.itemQuantity == null) ? "-" : item.itemQuantity}</td>
                 <td>{(item.unitOfMeasure == "" || item.unitOfMeasure == null) ? "-" : item.unitOfMeasure}</td>
                 <td>{(item.weight == 0 || item.weight == null) ? "-" : item.weight}</td>
                 <td>{(item.itemDescription == "" || item.itemDescription == null) ? "-" : item.itemDescription}</td>
          </tr>,
          <tr id={"Commodity" + index} className="accordion-collapse table-parent-accordion collapse bg-white">
            <td colSpan={10} className=" p-4">
              <div className="row border-bottom">
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Value</h5>
                  <p className="data-txt mb-0">{(item.itemValue == null || item.itemValue == 0) ? "-" : "$"+item.itemValue}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Class</h5>
                  <p className="data-txt mb-0">{(item.class == "" || item.class == null)? "-" : item.class}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">NMFC</h5>
                  <p className="data-txt mb-0">{(item.nmfc == "" || item.nmfc == null) ? "-"  :item.nmfc}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Dimensions</h5>
                  <p className="data-txt mb-0">{(item.palletLength == null ? "0" : item.palletLength) + "L X " + (item.palletWidth == null ? "0" : item.palletWidth) + "W X " + (item.palletHeight == null ? "0" : item.palletHeight) + "H"}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label ">Volume</h5>
                  <p className="data-txt mb-0">{(item.itemDensity == null || item.itemDensity =="") ? "-" :item.itemDensity}</p>
                </div>
              </div>
              {(item.hazmat == "1") ?
                <div className="row pt-3">
                  <h5 className="primary-header mb-4">Hazmat Material Details</h5>
                  <div className="taccordion-data-width mb-4 ">
                    <h5 className="t-data-label">Hazmat Contact</h5>
                    <p className="data-txt mb-0">{item.hazmatContact}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label">Group Name</h5>
                    <p className="data-txt mb-0">{item.hazmatGroupName}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label">Packaging group</h5>
                    <p className="data-txt mb-0">{item.hazmatPackagingGroup}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label">UN/NA Number</h5>
                    <p className="data-txt mb-0">{item.hazmatUNNAnumber}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label ">Flash Temp</h5>
                    <p className="data-txt mb-0">{item.hazmatFlashTemp}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label ">Flash Type</h5>
                    <p className="data-txt mb-0">{item.hazmatFlashType}</p>
                  </div>
                  <div className="taccordion-data-width mb-4">
                    <h5 className="t-data-label ">UOM</h5>
                    <p className="data-txt mb-0">{item.hazmatUom}</p>
                  </div>
                  <h5 className="primary-header mb-4">Hazmat Emergency Contact</h5>
                  <div className="taccordion-data-width ">
                    <h5 className="t-data-label ">Certificate Holder Name</h5>
                    <p className="data-txt mb-0">{item.hazmatCertHolderName}</p>
                  </div>
                  <div className="taccordion-data-width ">
                    <h5 className="t-data-label ">Contact Name</h5>
                    <p className="data-txt mb-0">{item.hazmatContactName}</p>
                  </div>
                  <div className="taccordion-data-width ">
                    <h5 className="t-data-label ">Phone Number</h5>
                    <p className="data-txt mb-0">{item.hazmatPhoneNumber}</p>
                  </div>
                </div>
                : ""}
            </td>
          </tr>
        ])
      }
      )
    }
  }

  /**
   * This method is used to load the tracking section. This section will be loaded
   * only if the Move Type is BTMS. If it of any other type this section
   * will not be displayed.
   * @param paramTrackingArray - Array of tracking information returned from loadsearch api
   * @param paramMoveType - Data from the load search API
   * @param paramLoadOrigin - Load origin denotes whether it is BTMS or others
   * @returns - The HTML elements to bind
   */
  //  && (paramMoveType.toLowerCase() == "tl" || paramMoveType.toLowerCase() =="eltl" || paramMoveType.toLowerCase() =="intermodal")
  const bindTrackingData = (paramTrackingArray: any[], paramMoveType: string, paramLoadOrigin: string, paramLocArray: any[]) => {
    if (paramLoadOrigin != undefined && paramLoadOrigin.toLowerCase() == "btms" && (paramMoveType.toLowerCase() == "tl" || paramMoveType.toLowerCase() =="eltl" || paramMoveType.toLowerCase() =="intermodal")) {
      let cssName = ""//"col-md-12 col-lg-12 col-sm-12 col-12 mb-3";
      //if(paramMoveType.toLowerCase() == "tl" && paramLocArray != undefined && paramLocArray.length > 0){
        cssName = "col-md-6 col-lg-6 col-sm-12 col-12 mb-3 res-tracking-brd-sty";
      //}
      return (
        <div className="col-12 mt-4">
          <div className="row">
            <h5 className="primary-header mb-4"><img src="../Images/location-icon.svg" className="title-icon me-3" />Tracking</h5>
            {bindEventsGrid(paramTrackingArray, paramMoveType, paramLoadOrigin, cssName)}
            {paramMoveType.toLowerCase() == "tl" && paramLocArray != undefined && paramLocArray.length > 0 ? bindEventsMap(paramLocArray, paramMoveType) : ""}
          </div>
        </div>
      )
    }
  }

  /**
   * 
   * @param paramLocArray 
   * @param paramMoveType 
   * @returns 
   */
  const bindEventsMap = (paramLocArray: any[], paramMoveType: string) => {
    //if(paramMoveType.toLowerCase() == "tl" && paramLocArray != undefined && paramLocArray.length > 0){
      // console.log("Origin", originCoordinates)
      // console.log("destination", destinationCoordinates)

      const googleApiKey : string = process.env.REACT_APP_GOOGLE_MAPS_API_KEY !=undefined ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""

      return(
        <div className="col-md-6 col-lg-6 col-sm-12 col-12 mt-sm-3 mb-3 mt-md-0">
          <GoogleMaps
          markers={loadDetail.locationUpdates.map((item:any,i:number)=>{
            return {lat:item.latitude,lng:item.longitude}
          })} 
          apiKey={googleApiKey} origin={originCoordinates} destination={destinationCoordinates} ></GoogleMaps>
        </div>
      )
    //}
  }

  /**
   * This method is for binding the event grids data based
   * @param paramTrackingArray - Array from the API to bind data
   * @param paramMoveType - Detemined whether it is TL, ETL, Intermodal etc
   * @param paramLoadOrigin - BTMS or OTMS
   * @param paramCssName - class names for the tracking grid part
   * @returns - The HTML elements to bind the grid heading and grid rows
   */
  const bindEventsGrid = (paramTrackingArray: any[], paramMoveType: string, paramLoadOrigin: string, paramCssName: string) => {
    if (paramMoveType != undefined &&
      (paramMoveType.toLowerCase() == "tl" ||
        paramMoveType.toLowerCase() == "eltl" ||
        paramMoveType.toLowerCase() == "intermodal")) {
      return (
        <div className={paramMoveType.toLowerCase() == "tl" ? paramCssName : ""}>
          <div className="table-responsive cp-grid">
            <table className="table mb-0  table-borderless ">
              <thead className="cp-table-head">
                {
                  bindEventsHead(paramMoveType)
                }
              </thead>
              <tbody>
                {bindEventsData(paramTrackingArray, paramMoveType)}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  }

  /**
   * This method bind the grid head based on the move type passed as input
   * @param paramMoveType - A string parameter that denotes the move type
   * @returns - HTML elements to bind
   */
  const bindEventsHead = (paramMoveType: string) => {
    switch (paramMoveType.toLowerCase()) {
      case "tl":
        return (
          <tr>
            <th>Date</th>
            <th>Event</th>
          </tr>
        )
      case "eltl":
        return (
          <tr>
            <th>Sent/Received</th>
            <th>Partner</th>
            <th>Status Date</th>
            <th>Notes</th>
          </tr>
        )
      case "intermodal":
        return (
          <tr>
            <th>Sent/Received</th>
            <th>Event</th>
            <th>Location</th>
          </tr>
        )
      default:
        break
    }
  }

  /**
   * This method will bind the data from array to edit table row
   * @param paramEventsArray - Array containing the data for events
   * @param paramMoveType - Speocifies the move type defined in the load
   * @returns - HTML elements to bind the table
   */
  const bindEventsData = (paramEventsArray: any[], paramMoveType: string) => {
    if (paramEventsArray != undefined && paramEventsArray.length > 0) {
      return paramEventsArray.map((item, index) => {
        let arrDate = item.eventDateTime.split("T")
        let eventDate = arrDate[0]
        let eventTime = (arrDate.length < 2) ? "00:00" : arrDate[1].split(":")
        let arrSRDate = "", srDate = ""
        let  srTime 
        let arrStatusDate = "", statusDate = ""
        let statusTime
        item.sentRecordDate = item.sentRecordDate == null ? "" : item.sentRecordDate 
        // if (item.sentRecordDate != null) {
          arrSRDate = item.sentRecordDate.split("T") 
          srDate = arrSRDate[0]
          srTime = (arrSRDate.length < 2) ? "00:00" : arrSRDate[1].split(":")
        // }
        item.statusDateTime = item.statusDateTime == null ? "" : item.statusDateTime 
        // if (item.statusDateTime != undefined) {
          arrStatusDate = item.statusDateTime.split("T")
          statusDate = arrStatusDate[0]
          statusTime = (arrStatusDate.length < 2) ? "00:00" : arrStatusDate[1].split(":")
        // }
        switch (paramMoveType.toLowerCase()) {
          case "tl":
            return (
              <tr>
                {/* <td>{bindDate(eventDate, eventTime)}</td> */}
                <td>{ moment(new Date(eventDate)).format("MM/DD/YYYY") }{" "+eventTime[0] +":"+eventTime[1]}</td>
                <td>{item.eventStatus + " - " + item.city + ", " + item.state + " " + item.country}</td>
              </tr>
            )
          case "eltl":
            return (
              <tr>
                {/* <td>{bindDate(srDate, srTime)}</td> */}
                <td>{ moment(new Date(srDate)).format("MM/DD/YYYY") }{" "+ srTime[0] +":"+srTime[1]}</td>
                <td>{item.tradingPartner}</td>
                {/* <td>{bindDate(statusDate, statusTime)}</td> */}
                <td>{ moment(new Date(statusDate)).format("MM/DD/YYYY") }{" "+statusTime[0] +":"+statusTime[1]}</td>
                <td>{item.reasonCode}</td>
              </tr>
            )
          case "intermodal":
            return (
              <tr>
                {/* <td>{bindDate(srDate, srTime)}</td> */}
                <td>{ moment(new Date(eventDate)).format("MM/DD/YYYY") }{" "+eventTime[0] +":"+eventTime[1]}</td>
                <td>{item.eventStatus == "DEPARTED TERMINAL LOCATION" ? "LOCATION UPDATE" : item.eventStatus}</td>
                <td>{item.city + ", " + item.state + " " + item.country}</td>
              </tr>
            )
          default:
            break;
        }
      })
    }
    else {
      return (
        <tr>
          <td colSpan={2}>
            <div className="col-12 d-flex align-items-center justify-content-center flex-column no-records">
              <img src="Images/no-documents-found-icon.svg" alt="no records found" className="no-records-icon" />
              <span className="data-label  mt-3">No Records Found</span>
            </div>
          </td>
        </tr>)
    }
  }

  /**
   * This method is to open the send email popup when user click on 
   * email icon.
   */
  const invokeEmailPopup = (paramDocUrl:string) => {
    setDocUrl(paramDocUrl)
    if (ShowEmailPopup.current != null) {
      ShowEmailPopup.current.classList.add("show")
      ShowEmailPopup.current.style.display = "block"
    }
  }

  /**
   * This method is to close the send email popup when user click on 
   * close icon in the popup.
   */
  const closeEmailPopup = () => {
    if (ShowEmailPopup.current != null) {
      ShowEmailPopup.current.classList.add("hide")
      ShowEmailPopup.current.style.display = "none"
    }
  }

  /**
   * This method is for closing the success popup after email is sent
   */
  const closeSuccessPopup = () => {
    if (ShowSuccessPopup.current != null) {
      ShowSuccessPopup.current.classList.add("hide")
      ShowSuccessPopup.current.style.display = "none"
    }
  }

  /**
   * This method is for sending email when user clicks on send document 
   * button in the popup.
   * @returns - Nothing
   */
  const sendDocument = async () => {

    if ((!(emailExp.test(sendEmail)) || sendEmail == "") && EmailNotFilled.current != null) {
      EmailNotFilled.current.hidden = false;
      EmailNotFilled.current.innerHTML = "Please enter a valid email.";
      EmailNotFilled.current.style.borderColor = "red";
      return false
    }

    let mailBody = 
    `<p>Hi,</p> 

 <p>Kindly find the Bill of Lading Document URL : <a href="${docUrl}"> BOL </a> </p>
 
 <p>Regards,<br>MODE Global</p>`

    let req = {
      "toEmails": sendEmail,
      "ccEmails": "",
      "bccEmails": "",
      "subject": "Bill of lading Document",
      "htmlBody": mailBody
    }

    const response: any = await SendEmailForLoadDetail(req)
    if (response.status == 200) {
      setSendEmail("")
      closeEmailPopup()
      if (ShowSuccessPopup.current != null) {
        ShowSuccessPopup.current.classList.add("show");
        ShowSuccessPopup.current.style.display = "block";
      }
    }
  }

  /**
   * Component load method, calls the API.
   */
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="mb-5">
      {/* Breadcrumb Section Starts Here */}
      <div className="col-md-12 my-3">
        <ul className="breadcrumb mb-0">
          <li><a className="cursor" onClick={() => { navigateTo("/loadsearch") }}>All Loads</a></li>
          <li className="pe-2">{"#" + objLoadId}</li>
        </ul>
      </div>
      {/* Breadcrumb Section Ends Here */}
      <div className="col-md-12 ">
        <div className="cp-background">
          <div className="al-details-header-contents justify-content-between">
            <div className="mb-4 page-header-txt d-flex align-items-center">
              <a className="cursor" onClick={() => { navigateTo("/loadsearch") }}>
                <img src="../Images/back-icon.svg" alt="back-icon" className="back-icon pointer" />
              </a>
              <span className="ms-2">{"Load #" + objLoadId}</span>
            </div>
            <div className="mb-4 batch-status-res-position align-items-center">
              <span className="data-label batch-status-res-position me-3 move-type-res-space ">Move Type : <span className="move-type">{loadDetail?.loadShipConsRef.loadMethod}</span></span>
              <div className="al-details-badge badge-sty">
                <label className="mb-0">{loadDetail?.loadShipConsRef.loadStatus}</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-4  mt-4">
              <div className="row">
                <h6 className="primary-header mb-4">
                  <img src="../Images/shipper-info-icon.svg" alt="Shipper Information Icon" className="title-icon me-3" /> Shipper Info</h6>
                <label className="data-label">Name</label>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.shipperName}</p>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.shipperAddressLine1 + ", " + loadDetail?.loadShipConsRef.shipperAddressLine2}</p>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.shipperCity + ", " + loadDetail?.loadShipConsRef.shipperState + " " + loadDetail?.loadShipConsRef.shipperZip}</p>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label ">Earliest Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.earliestShipmentsDate, loadDetail?.loadShipConsRef.earliestShipmentsTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label ">Latest Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.latestShipmentsDate, loadDetail?.loadShipConsRef.latestShipmentsTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label ">Driver In Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.shipperDriverinDate, loadDetail?.loadShipConsRef.shipperDriverinTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label  ">Driver Out Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.shipperDriverOutDate, loadDetail?.loadShipConsRef.shipperDriverOutTime)
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 mt-4 res-cosignee-brd-sty">
              <div className="row">
                <h6 className="primary-header mb-4 ">
                  <img src="../Images/consignee-info-icon.svg" alt="A icon with truck symbol" className="title-icon me-3" />Consignee Info</h6>
                <label className="data-label">Name</label>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.consigneeName}</p>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.consigneeAddressLine1 + ", " + loadDetail?.loadShipConsRef.consigneeAddressLine2}</p>
                <p className="data-txt mb-0">{loadDetail?.loadShipConsRef.consigneeCity + ", " + loadDetail?.loadShipConsRef.consigneeState + " " + loadDetail?.loadShipConsRef.consigneeZip}</p>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label">Earliest Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.earliestConsigneeDate, loadDetail?.loadShipConsRef.earliestConsigneeTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label">Latest Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.latestConsigneeDate, loadDetail?.loadShipConsRef.latestConsigneeTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label">Driver In Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.consigneeDriverinDate, loadDetail?.loadShipConsRef.consigneeDriverinTime)
                    }
                  </p>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                  <label className="data-label ">Driver Out Date &amp; Time</label>
                  <p className="data-txt mb-0">
                    {
                      bindDate(loadDetail?.loadShipConsRef.consigneeDriverOutDate, loadDetail?.loadShipConsRef.consigneeDriverOutTime)
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-4 mt-4 document-scroll-sty res-doc-brd-sty">
              <div className="row g-4">
                <h6 className="primary-header sticky-top doc-z-index bg-white pb-4 mb-0">
                  <img src="../Images/documents-icon.svg" alt="Documents Icon " className="title-icon me-3" /> Documents <span>{loadDetail?.loadDocuments.length > 0 ? "(" + loadDetail?.loadDocuments.length + ")" : ""}</span></h6>
                {bindDocuments(loadDetail?.loadDocuments)}
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-12 mt-4">
              <div className="row">
                <h5 className="primary-header mb-2 "><img src="../Images/reference-info-icon.svg" className="title-icon me-3" />Reference Info</h5>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                  <h5 className="data-label ">Purchase Order</h5>
                  <p className="data-txt mb-0">{(loadDetail?.loadShipConsRef.poNumber == "" ||loadDetail?.loadShipConsRef.poNumber == null) ? "-" : loadDetail?.loadShipConsRef.poNumber}</p>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                  <h5 className="data-label ">Bill of Lading</h5>
                  <p className="data-txt mb-0">{(loadDetail?.loadShipConsRef.shipBlNumber == ""|| loadDetail?.loadShipConsRef.shipBlNumber == null) ? "-" : loadDetail?.loadShipConsRef.shipBlNumber}</p>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                  <h5 className="data-label ">Shipper Number</h5>
                  <text className="data-txt mb-0">{(loadDetail?.loadShipConsRef.shipperNumber == "" || loadDetail?.loadShipConsRef.shipperNumber == null) ? "-" : loadDetail?.loadShipConsRef.shipperNumber}</text>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                  <h5 className="data-label ">PRO Number</h5>
                  <p className="data-txt mb-0">{(loadDetail?.loadShipConsRef.proNumber == ""|| loadDetail?.loadShipConsRef.proNumber == null) ? "-" : loadDetail?.loadShipConsRef.proNumber}</p>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-4">
              <h6 className="primary-header mb-4"><img src="../Images/commodities-icon.svg" className="title-icon me-3" />Commodities {loadDetail?.loadCommodities.length > 0 ? "("+ loadDetail?.loadCommodities.length + ")" : "" }</h6>
              <div className="table-responsive mb-2 cp-grid">
                <table className="table mb-0  table-borderless ">
                  <thead className="cp-table-head ">
                    <tr>
                      <th />
                      <th>Name</th>
                      <th>Hazmat</th>
                      <th>Quantity</th>
                      <th>UoM</th>
                      <th>Weight</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bindCommodities(loadDetail?.loadCommodities)}
                  </tbody>
                </table>
              </div>
            </div>
            {bindTrackingData(loadDetail?.loadEvents, loadDetail?.loadShipConsRef.loadMethod, loadDetail?.loadShipConsRef.loadOrigin, loadDetail?.locationUpdates)}
          </div>
        </div>
      </div>
      {/* Send Email Popup Starts Here */}
      <div className="modal fade" id="send-email-popup" ref={ShowEmailPopup} style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-modal="true" role="dialog">
        <div className="modal-dialog send-email-popup-width">
          <div className="modal-content">
            <div className="modal-header pb-1 border-0">
              <span className=" popup-header fs-5" id="staticBackdropLabel">Send Bill of Lading Document</span>
              <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close" onClick={closeEmailPopup} />
            </div>
            <div className="modal-body py-0 border-0">
              <p className="popup-txt">Enter the email address that you woud like to send this document to.</p>
              <label className="form-label cp-form-label" htmlFor="al-popup-email">Email Address</label>
              <input type="text" className="form-control cp-form-field" id="al-popup-email" value={sendEmail} onChange={(event) => { setSendEmail(event.target.value) }} />
              <span className="form-label cp-form-label px-0" ref={EmailNotFilled} hidden={true} style={{ color: "red" }}></span>
            </div>
            <div className="modal-footer pb-4 border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={sendDocument}>Send Document</button>
            </div>
          </div>Enter the email address
        </div>
      </div>
      {/* Email Sent Success Popup */}
      <div className="modal fade show" id="email-sucess-popup" ref={ShowSuccessPopup} style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-modal="true" role="dialog">
        <div className="modal-dialog success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header"> Doucument Sent Successfully!</h5>
              <p className="popup-txt">Bill of Lading Document has been sent successfully to the respective Email ID's.</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={closeSuccessPopup}>OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllLoadsDetailsTL