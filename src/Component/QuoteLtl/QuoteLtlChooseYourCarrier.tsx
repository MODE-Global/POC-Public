import React, { useContext, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../app/Context';
import { CreateBookLtl, GetQuotes } from '../../api/api';
import { FormText } from 'react-bootstrap';
import { parse } from 'node:path/win32';

const QuoteLtlChooseYourCarrier = () => {
  const context = useContext(UserContext);
  let navigate = useNavigate()
  const QuoteLtlResponse = context.GetQuoteLtlResponse();
  const QuoteLtlRequest = context.GetQuoteLtlRequest();
  const GetBookLtlRequest = context.GetBookLtlRequest();
  const successPopup = useRef<HTMLDivElement>(null);
  const ValidationPopup = useRef<HTMLDivElement>(null);
  const someThingWentWrongPopup = useRef<HTMLDivElement>(null);
  const LoadingQuotedPopup = useRef<HTMLDivElement>(null);
  const [LoadNumberSuccessPopupMsg, setLoadNumberSuccessPopupMsg] = useState("")
  const [loader, setLoader] = useState(false)
  const [LoadNumber, SetLoadNumber] = useState("")
  const [RatingCompleted, setRatingCompleted] = useState(false)
  const [quoteStatus, setQuoteStatus] = useState(false)
  let sortobj = {
    timingSort: false,
    rateSort: false
  }
  const [sort, setSort] = useState(sortobj)
  const [barLoader, setbarLoader] = useState(99);
  const [QuotedRates, setQuotedRates] = useState(QuoteLtlResponse.quoteLtlResponse.quoteDetails)
  // const [QuotedRates, setQuotedRates] = useState([])
  let popUpDataObj = {
    carrierName: "",
    rateRetrieved: "",
    SCAC: "",
    QuoteNo: "",
    LoadId: "",
    QuoteId: "",
    ServiceId: "",
    TariffName: "",
    FlatRate: "",
    Total: "",
    CarrierNotes: "",
    discount: "",
    quoteNotes: "",
    fuelSurchargePrice: "",
    carrierNameBanyan: "",
    charges: []
  }

  console.log("quoteId")
  console.log("customerInfo", QuoteLtlRequest)
  const [popUpData, setpopUpData] = useState(popUpDataObj)
  const [ValidationPopupMSG, SetValidationPopupMSG] = useState("")
  let check = 1;

  /* Setting a timer to increment the barLoader state by 1 every 320 milliseconds. */
  useEffect(() => {
    const timer: any = barLoader < 99 && setInterval(() => setbarLoader(barLoader + 1), 320);
    return () => clearInterval(timer);
  }, [barLoader]);

  const ViewQuoteDetail = (value: any) => {
    setpopUpData({
      ...popUpData,
      ["carrierName"]: value.carrierName == null || value.carrierName == undefined ? '' : value.carrierName,
      ["rateRetrieved"]: value.rateRetrieved == null || value.rateRetrieved == undefined ? '' : value.rateRetrieved,
      ["SCAC"]: value.scac == null || value.scac == undefined ? '' : value.scac,
      ["QuoteNo"]: value.quoteNumber == null || value.quoteNumber == undefined ? '' : value.quoteNumber,
      ["LoadId"]: value.loadId,
      ["QuoteId"]: value.quoteId,
      ["ServiceId"]: value.service == null || value.service == undefined ? '' : value.service,
      ["TariffName"]: value.tariffName == null || value.tariffName == undefined ? '' : value.tariffName,
      ["FlatRate"]: value.flatPrice == null || value.flatPrice == undefined ? '' : value.flatPrice,
      ["Total"]: value.totalPrice == null || value.totalPrice == undefined ? '' : value.totalPrice,
      ["charges"]: value.charges == null || value.charges == undefined ? [] : value.charges,
      ["quoteNotes"]: value.quoteNotes == null || value.quoteNotes == undefined ? '' : value.quoteNotes,
      ["carrierNameBanyan"]: value.carrierNameBanyan == null || value.carrierNameBanyan == undefined ? '' : value.carrierNameBanyan,
      ["discount"]: value.discount == null || value.discount == undefined ? '' : value.discount,
      ["fuelSurchargePrice"]: value.fuelSurchargePrice == null || value.fuelSurchargePrice == undefined ? '' : value.fuelSurchargePrice,
      ["CarrierNotes"]: value.carrierNotes == null || value.carrierNotes == undefined ? '' : value.carrierNotes
    })
  }

  const GetQuoteDetails = async (quoteId: any, customer: any) => {
    let ratingCompleted = false
    let statusCode = 0

    do {
      const quoteresponse = await GetQuotes(quoteId, customer, localStorage.getItem('userId'))

      if (quoteresponse.status ==200|| 204){
        statusCode = quoteresponse.status
        setQuoteStatus(true)
        if (statusCode == 200 && quoteresponse.data.quoteLtlResponse != null) {
          setQuotedRates(quoteresponse.data.quoteLtlResponse.quoteDetails)
          ratingCompleted = quoteresponse.data.ratingCompleted
          if (ratingCompleted == true){
            setRatingCompleted(ratingCompleted)
          }
          console.log(setQuotedRates.length)
          console.log("check")
          console.log(ratingCompleted)
          context.SetQuoteLtlResponse(quoteresponse.data);
        }
      }
    }
    while (!ratingCompleted)


    // context.SetQuoteLtlResponse(quoteresponse.data)

    // console.log("")
    // if (quoteresponse.status == 200) {
    //           // if (LoadingQuotedPopup.current != null) {
    //           //   LoadingQuotedPopup.current.classList.add("show");
    //           //   LoadingQuotedPopup.current.style.display = "block";
    //           // }
    //           // setbarLoader(0)
    //           setQuotedRates(quoteresponse.data.quoteLtlResponse.quoteDetails)

    // }
    //         else if (quoteresponse.status == 204) {
    //           // if (noContentPopup.current != null && LoadingQuotedPopup.current != null) {
    //           //   setnoContentPopupMSG("No records found!")
    //           //   LoadingQuotedPopup.current.classList.remove("show");
    //           //   LoadingQuotedPopup.current.style.display = "none";
    //           //   noContentPopup.current.classList.add("show");
    //           //   noContentPopup.current.style.display = "block";
    //           // }
    //         }
    //         else if (quoteresponse.status == 400 || quoteresponse.status == 401) {
    //           // if (LoadingQuotedPopup.current != null && ValidationPopup.current != null) {
    //           //   LoadingQuotedPopup.current.classList.remove("show");
    //           //   LoadingQuotedPopup.current.style.display = "none";
    //           //   ValidationPopup.current.classList.add("show");
    //           //   ValidationPopup.current.style.display = "block";


    //           //   let validationMessage = ""
    //           //   quoteresponse.data.Errors.forEach((data: any, index: any) => {
    //           //     validationMessage = validationMessage + data.Message
    //           //     if (index < quoteresponse.data.Errors.length - 1) {
    //           //       validationMessage = validationMessage + `,`
    //           //     }
    //           //   })
    //           //   SetValidationPopupMSG(validationMessage)
    //           // }
    //         }
    //         else {
    //           // if (LoadingQuotedPopup.current != null && someThingWentWrongPopup.current != null) {
    //           //   LoadingQuotedPopup.current.classList.remove("show");
    //           //   LoadingQuotedPopup.current.style.display = "none";
    //           //   someThingWentWrongPopup.current.classList.add("show");
    //           //   someThingWentWrongPopup.current.style.display = "block";
    //           // }
    //         }

  }



  useEffect(() => {
    if (QuoteLtlRequest.quoteId != "") {
      GetQuoteDetails(QuoteLtlRequest.quoteId, QuoteLtlRequest.customerData)
    }
  }, [])



  const onCreateLoad = async (value: any) => {
    const CurrentQuoteRequest = context.GetQuoteLtlRequest();
    console.log("quote value", value.quoteId)
    CurrentQuoteRequest.CurrentQuoteId = value.quoteId
    context.SetQuoteLtlRequest(CurrentQuoteRequest)

    if (GetBookLtlRequest.BooktoQuote) {
      setLoader(true)
      const commoditiesRequestArray: any = [];
      QuoteLtlRequest.commodities.forEach((data: any) => {
        const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
        const Pcf = data.weight / CubitFeet;
        let particularCommodity = {
          Desc: data.description,
          NMFC: data.nmfc,
          Class: data.class,
          Stackable: data.stack,
          Hazmat: data.haz,
          Length: Number(data.dimenLength),
          Width: Number(data.dimenWidth),
          Height: Number(data.dimenHeight),
          Weight: Number(data.weight),
          Quantity: Number(data.quantity),
          CubicFt: (Math.floor(CubitFeet)).toString(),
          Density: (Math.ceil(Pcf * 10) / 10).toString(),
          EquipmentType: data.type
        }
        commoditiesRequestArray.push(particularCommodity)
      })

      const BookRequest = {
        LoadId: value.loadId,
        QuoteId: value.quoteId,
        PoNumber: GetBookLtlRequest.referenceNumber.poNumber,
        BlNumber: GetBookLtlRequest.referenceNumber.blNumber,
        ShippingNumber: GetBookLtlRequest.referenceNumber.shippingNumber,
        Agent: {
          Name: GetBookLtlRequest.AgentDetails.agentContact,
          Email: GetBookLtlRequest.AgentDetails.agentEmailId
        },
        ShipperDetails: {
          ShipName: GetBookLtlRequest.shipperInfo.name,
          ShipAddress1: GetBookLtlRequest.shipperInfo.addressline1,
          ShipAddress2: GetBookLtlRequest.shipperInfo.addressline2,
          ShipCity: GetBookLtlRequest.shipperInfo.city,
          ShipState: GetBookLtlRequest.shipperInfo.state,
          ShipZipCode: GetBookLtlRequest.shipperInfo.zipCode,
          ShipCountry: GetBookLtlRequest.shipperInfo.country,
          ShipContactName: GetBookLtlRequest.shipperInfo.contactName,
          ShipEmail: GetBookLtlRequest.shipperInfo.EmailAddress,
          ShipPhone: GetBookLtlRequest.shipperInfo.PhoneNumber,
          ShipFax: GetBookLtlRequest.shipperInfo.FaxNumber,
          ShipLoadNotes: GetBookLtlRequest.shipperInfo.loadNotes,
          ShipEarliestDate: GetBookLtlRequest.shipperInfo.earliestDate,
          ShipLatestDate: GetBookLtlRequest.shipperInfo.latestDate,
          ShipEarliestTime: GetBookLtlRequest.shipperInfo.earliestTime,
          ShipLatestTime: GetBookLtlRequest.shipperInfo.latestTime
        },
        ConsigneeDetails: {
          ConsName: GetBookLtlRequest.consigneeInfo.name,
          ConsAddress1: GetBookLtlRequest.consigneeInfo.addressline1,
          ConsAddress2: GetBookLtlRequest.consigneeInfo.addressline2,
          ConsCity: GetBookLtlRequest.consigneeInfo.city,
          ConsState: GetBookLtlRequest.consigneeInfo.state,
          ConsZipCode: GetBookLtlRequest.consigneeInfo.zipCode,
          ConsCountry: GetBookLtlRequest.consigneeInfo.country,
          ConsContactName: GetBookLtlRequest.consigneeInfo.contactName,
          ConsEmail: GetBookLtlRequest.consigneeInfo.EmailAddress,
          ConsPhone: GetBookLtlRequest.consigneeInfo.PhoneNumber,
          ConsFax: GetBookLtlRequest.consigneeInfo.FaxNumber,
          ConsLoadNotes: GetBookLtlRequest.consigneeInfo.loadNotes,
          ConsEarliestDate: GetBookLtlRequest.consigneeInfo.earliestDate,
          ConsLatestDate: GetBookLtlRequest.consigneeInfo.latestDate,
          ConsEarliestTime: GetBookLtlRequest.consigneeInfo.earliestTime,
          ConsLatestTime: GetBookLtlRequest.consigneeInfo.latestTime
        },
        commodities: {
          commodities: commoditiesRequestArray,
          LinearFt: GetBookLtlRequest.LinearFt
        }
      }

      const response: any = await CreateBookLtl(BookRequest, GetBookLtlRequest.referenceNumber.customer, localStorage.getItem('userId'))

      if (response.status == 200) {
        setLoader(false)
        if (successPopup.current != null) {
          successPopup.current.classList.add("show");
          successPopup.current.style.display = "block";
          setLoadNumberSuccessPopupMsg(response.data.loadNumber)
          SetLoadNumber(response.data.loadNumber)
        }
      }
      else if (response.status == 400 || response.status == 401) {
        setLoader(false)
        if (ValidationPopup.current != null) {
          ValidationPopup.current.classList.add("show");
          ValidationPopup.current.style.display = "block";

          let validationMessage = ""
          response.data.forEach((value: any, index: any) => {
            validationMessage = validationMessage + value.message
            if (index < response.data.length - 1) {
              validationMessage = validationMessage + `,`
            }
          })
          SetValidationPopupMSG(validationMessage)
        }
      }
      else {
        setLoader(false)
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
    else {
      navigate("/bookltl")
    }
  }

  const QuotedRatesRow = () => {

    return QuotedRates.map((data: any, index: number) => {
      return (
        <tr key={index}>
          <td>{data.carrierName}
            <div className="data-txt" title={data.carrierNameBanyan} >{(data.carrierNameBanyan).length > 25 ? data.carrierNameBanyan.substr(0, 25) + "..." : data.carrierNameBanyan}</div>
            <a className="pointer underLine-remover" data-bs-toggle="modal" data-bs-target="#ql-alldetails-popup" onClick={() => { ViewQuoteDetail(data) }}>View Details</a>
          </td>
          <td>{data.transitTime} Days
            <div className="data-txt">Delivery {new Date(Date.now() + (data.transitTime * (3600 * 1000 * 24))).toLocaleDateString()}</div>
          </td>
          <td>${parseFloat(data.totalPrice).toFixed(2)}
            <div className="data-txt">Total</div>
          </td>
          <td className="text-center"><button type="button" className="btn cp-btn-primary" onClick={() => { onCreateLoad(data) }}>Create Load</button></td>
        </tr>
      )
    })
  }

  const viewShipmentDetail = () => {
    return QuoteLtlRequest.commodities.map((data: any, index: any) => {
      const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
      const Pcf = data.weight / CubitFeet;
      return (
        <div key={index} className="d-flex mt-3">
          <span className="data-label">{index + 1}</span>
          <div>
            <span className="data-txt align-middle ms-3">{data.description}</span>
            <div className="row shipment-m-bottom mt-3">
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <label className="form-check-label cp-form-label w-100">NMFC</label>
                <span className="data-txt">{data.nmfc}</span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <label className="form-check-label cp-form-label w-100">Class</label>
                <span className="data-txt">{data.class}</span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
                    <label className="form-check-label cp-form-label w-100">Stack</label>
                    <input checked={data.stack} disabled={true} type="checkbox" className="form-check-input cp-checkbox ms-1" />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
                    <label className="form-check-label cp-form-label w-100">HAZ</label>
                    <input checked={data.haz} disabled={true} type="checkbox" className="form-check-input cp-checkbox ms-1" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <label className="form-check-label cp-form-label w-100">Dimensions</label>
                <span className="data-txt">{data.dimenLength}<span className="dimension-data-sty"> L</span></span>
                <span className="data-txt ms-3">{data.dimenWidth}<span className="dimension-data-sty"> W</span></span>
                <span className="data-txt ms-3">{data.dimenHeight}<span className="dimension-data-sty"> H</span></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-2 mb-3">
                    <label className="form-check-label cp-form-label  w-100">Qty</label>
                    <span className="data-txt">{data.quantity}</span>
                  </div>
                  {/* <div className="col-12 col-sm-12 col-md-6 col-lg-2 ms-3 mb-3"> */}
                  <div className="col-12 col-sm-12 col-md-6 col-lg-3 ms-3 mb-3">
                    <label className="form-check-label cp-form-label w-100">Type</label>
                    <span className="data-txt">{data.type}</span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-2 ms-3 mb-3">
                    <label className="form-check-label cp-form-label w-100">Weight</label>
                    <span className="data-txt">{data.weight}</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-2 mb-3">
                    <label className="form-check-label cp-form-label w-100">Cube</label>
                    <span className="data-txt">{CubitFeet == 0 ? '??' : Math.floor(CubitFeet)}</span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-2 ms-4 mb-3">
                    <label className="form-check-label cp-form-label w-100">PCF</label>
                    <span className="data-txt">{(Pcf == Infinity || Number.isNaN(Pcf)) ? '??' : Pcf.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  /**
* If the ValidationPopup.current element exists, remove the "show" class and set the display to
* "none".
*/
  const ValidationOkClick = () => {
    if (ValidationPopup.current != null) {
      ValidationPopup.current.classList.remove("show");
      ValidationPopup.current.style.display = "none";
    }
  }

  const someThingWentWrongOkClick = () => {
    if (someThingWentWrongPopup.current != null) {
      someThingWentWrongPopup.current.classList.remove("show");
      someThingWentWrongPopup.current.style.display = "none";
    }
  }

  const onSortDescTiming = () => {
    console.log("onSortDescTiming")
    const strDescending = [...QuotedRates].sort((a, b) =>
    (parseFloat(a.transitTime) > parseFloat(b.transitTime ))?-1:1
    );
    setQuotedRates(strDescending)
    setSort({ ...sort, ["timingSort"]: true })
  }

  const onSortAscTiming = () => {
    const strAscending = [...QuotedRates].sort((a, b) =>
    (parseFloat(a.transitTime) > parseFloat(b.transitTime )) ? 1 : -1,
    );
    setQuotedRates(strAscending)
    setSort({ ...sort, ["timingSort"]: false })
  }

  const onSortDescRates = () => {
    const strDescending = [...QuotedRates].sort((a, b) =>
    parseFloat(a.totalPrice) > parseFloat(b.totalPrice) ? -1 : 1,
    );
    setQuotedRates(strDescending)
    setSort({ ...sort, ["rateSort"]: true })
  }

  const onSortAscRates = () => {
    const strAscending = [...QuotedRates].sort((a, b) =>
    parseFloat(a.totalPrice) > parseFloat(b.totalPrice) ? 1 : -1,
    );
    setQuotedRates(strAscending)
    setSort({ ...sort, ["rateSort"]: false })
  }

  return (
    <div className="mb-5">
      <div className="row">
        <div className="col-md-12 my-3">
          <ul className="breadcrumb mb-0">
          {GetBookLtlRequest.shipperInfo.name !== ""? <><li><a className="cursor" onClick={() => { navigate("/loadsearch"); } }>All Loads</a></li><li><a className="cursor" onClick={() => { navigate("/bookltl"); } }>Book LTL</a></li></>:
             <li><a className="cursor" onClick={() => { navigate("/loadsearch") }}>All Loads</a></li>
            }
            <li className="pe-2">Quote LTL</li>
          </ul>
        </div>
        {!GetBookLtlRequest.BooktoQuote ? <div className="col-md-12 my-3">
          <ul className="qut-custom-stepper ps-0">
            <li className="qut-stepper-count completed">
              <span className="qut-shipperinfo-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Information</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Shipping Information</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Shipping Information</span>
            </li>
            <li className="qut-stepper-count qut-stepper-2 active">
              <span className="qut-choosecarrier-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Carrier</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Choose Carrier</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Choose Your Carrier</span>
            </li>
          </ul>
        </div>
          :
          <div className="col-md-12 my-3">
            <ul className="custom-stepper ps-0">
              <li className="stepper-count completed">
                <span className="bookltl-shipmentdetail-stepper-icon" />
                {/* <span class="font-15 text-medium text-black wizard-text-padd">Define</span> */}
                <span className="d-block d-md-none mt-3 stepper-text">Shipment</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Shipment Details</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Shipment Details</span>
              </li>
              <li className="stepper-count stepper-2 completed">
                <span className="bookltl-shipperinfo-stepper-icon" />
                <span className="d-block d-md-none mt-3 stepper-text">Information</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Shipping Information</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Shipping Information</span>
              </li>
              <li className="stepper-count stepper-3  active">
                <span className="bookltl-choosecarrier-stepper-icon" />
                <span className="d-block d-md-none mt-3 stepper-text">Carrier</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Choose Carrier</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Choose Your Carrier</span>
              </li>
            </ul>
          </div>}

      </div>
      <div className="row">
        <div className="accordion mt-4" id="qutltl-accordion">
          <div className="accordion-item cp-accordion-brd-radius border-0">
            {/* <h2 className="accordion-header" id="qutltl-shipinfo">
              <button id="btn" className="accordion-button ctl-header-accordion page-header-txt btn cp-accordion-brd-radius shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#shipment-information" aria-expanded="false" aria-controls="shipment-information">
                Shipment Information
                <span className="primary-info-accordion d-md-block d-none" id="values">Hide Details</span>
              </button>
            </h2> */}
            <h2 className="accordion-header position-relative d-flex align-items-center p-3" id="qutltl-shipinfo">
              <p id="btn" className="page-header-txt mb-0">Shipment Information</p>
              <button className="ms-auto ctl-header-accordion primary-info-accordion ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#shipment-information" aria-expanded="false" aria-controls="shipment-information"><span className="ms-3">Hide Details</span></button>
              </h2>
            <div id="shipment-information" className="accordion-collapse collapse show" aria-labelledby="qutltl-shipinfo" data-bs-parent="#qutltl-accordion">
              <div className="accordion-body ">
                <div className="row justify-content-between">
                  <div className="col-sm-12 col-md-6 col-lg-2">
                    <label className="data-label">Pick up</label>
                    <p className="data-txt my-2">{QuoteLtlRequest.shipInfo.pickCity}</p>
                    <p className="data-txt">{QuoteLtlRequest.shipInfo.pickState} {QuoteLtlRequest.shipInfo.pickZipCode}</p>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-2">
                    <label className="data-label">Delivery</label>
                    <p className="data-txt my-2">{QuoteLtlRequest.shipInfo.deliveryCity}</p>
                    <p className="data-txt">{QuoteLtlRequest.shipInfo.deliveryState} {QuoteLtlRequest.shipInfo.deliveryZipCode}</p>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-2">
                    <label className="data-label">Limited</label>
                    <p className="data-txt my-2">{QuoteLtlRequest.pickLimited == "" ? `(no)` : QuoteLtlRequest.pickLimited}</p>
                    <p className="data-txt">{QuoteLtlRequest.deliveryLimited == "" ? `(no)` : QuoteLtlRequest.deliveryLimited}</p>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-3">
                    <label className="data-label">Pay Type</label>
                    <p className="data-txt my-2">{QuoteLtlRequest.shipInfo.payType}</p>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-2 d-flex flex-column">
                    <label className="data-label my-2"><a className="cp-link" onClick={() => { navigate("/quoteltl") }}>Edit Shipment</a></label>
                    <label className="data-label"><a  className="cp-link" data-bs-toggle="modal" data-bs-target="#quote-sucess-popup">View Shipment Details</a></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ql-cyc-page-header mt-4 page-header-txt">
          Quoted Rates
        </div>
        <div className="col-md-12 mt-3">
          <div className="table-responsive cp-grid">
            <table className="table mb-0  table-borderless ">
              <thead className="cp-table-head ">
                <tr>
                  <th>Service</th>
                  <th>Timing 
                    {sort.timingSort ?
                      <img src="../Images/sort-up-icon.svg" alt="sort  icon" className="cp-table-sort ps-1"  onClick={() => { onSortAscTiming() }}/>
                      :
                      <img src="../Images/sort-down-icon.svg" alt="sort  icon" className="cp-table-sort ps-1" onClick={() => { onSortDescTiming() }} />
                    }
                  </th>
                  <th>Rate 
                    {sort.rateSort ?
                      <img src="../Images/sort-up-icon.svg" alt="sort  icon" className="cp-table-sort ps-1" onClick={() => { onSortAscRates() }} />
                      :
                      <img src="../Images/sort-down-icon.svg" alt="sort  icon" className="cp-table-sort ps-1" onClick={() => { onSortDescRates() }} />
                    }
                  </th>
                  <th />
                </tr>
              </thead>
             
              {(QuotedRates.length > 0 && QuotedRates[0].rateRetrieved != null) ?
              <tbody>
                  {QuotedRatesRow()}
                  </tbody>
              :null}
                 <tbody>
              {(RatingCompleted == false) ?
              <tr className="bg-white">
                <td colSpan={4} className="text-center">  
                  
                  <div className="spinner-border Loader text-dark align-center ms-2" role="status">
                  <span className="visually-hidden" />
                </div>
                <p className="data-label ms-3">Loading...</p>

            
                </td>
              </tr>
              :null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn cp-btn-secondary" onClick={() => { navigate("/quoteltl") }}><img src="../Images/previous-icon.svg" alt="privious Icon" className="logout-icon me-2" />Previous</button>
          <button type="button" className="btn cp-btn-tertiary" onClick={() => { context.ResetContext(); navigate("/quoteltl") }}>Cancel</button>
        </div>
      </div>
      <div className="modal fade" id="quote-sucess-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable search-popup-width">
          <div className="modal-content">
            <div className="modal-header  border-0  p-3 ">
              <span className="popup-header">Shipment Details</span>
              <button type="button" className="btn-close shadow-none  ms-5" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <span className="popup-sub-header">Commodities</span>
              {viewShipmentDetail()}
              <div className="row shipment-m-bottom mt-3">
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                  <span className="data-label me-3">Total</span>
                  <span className="data-txt">QTY<span className="primary-header">{QuoteLtlRequest.totalQuantity}</span></span>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                  <span className="data-txt me-3">Linear Ft</span>
                  <span className="primary-header">{QuoteLtlRequest.linearFt}</span>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                  <span className="data-txt me-3">Weight</span>
                  <span className="primary-header">{QuoteLtlRequest.totalWeight}<span className="data-label"> lbs</span></span>
                </div>
              </div>

              {(QuoteLtlRequest.accessorials.length > 0) ?
                <div>
                  <div>
                    <h6 className="popup-sub-header mt-4 mb-3">Accessorials</h6>
                    <div className="table-responsive nfmc-grid border-0">
                      <table className="table mb-0  table-borderless">
                        <tbody>
                          {QuoteLtlRequest.accessorials.map((data: any, index: number) => {
                            return (
                              <tr key={index}>
                                <td>{data}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="ql-alldetails-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog  modal-dialog-centered bookl-popup-width">
          <div className="modal-content">
            <div className="modal-header  border-0  p-3 pb-0">
              <span className="primary-header">{popUpData.carrierName}</span>
              <button type="button" className="btn-close shadow-none  ms-5" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className='px-3 pt-1'>
              <p className="all-details-popup-label" >{popUpData.carrierNameBanyan}</p>
            </div>
            <div className="modal-body d-flex">
              <div className="row">
                <div className="col-12 col-md-8">
                  <table className="table mb-0  table-borderless">
                    <tbody>
                      <tr className="all-details-popup-altclr">
                        <td className="all-details-popup-label text-nowrap">Rate Retrieved</td>
                        <td className="data-txt">{popUpData.rateRetrieved}</td>
                      </tr>
                      <tr>
                        <td className="all-details-popup-label text-nowrap">SCAC</td>
                        <td className="data-txt">{popUpData.SCAC}</td>
                      </tr>
                      <tr className="all-details-popup-altclr">
                        <td className="all-details-popup-label text-nowrap">Quote No.</td>
                        <td className="data-txt">{popUpData.QuoteNo}</td>
                      </tr>
                      <tr>
                        <td className="all-details-popup-label text-nowrap">Load ID</td>
                        <td className="data-txt">{popUpData.LoadId}</td>
                      </tr>
                      <tr className="all-details-popup-altclr">
                        <td className="all-details-popup-label text-nowrap">Quote ID</td>
                        <td className="data-txt">{popUpData.QuoteId}</td>
                      </tr>
                      <tr hidden={popUpData.ServiceId === ""}>
                        <td className="all-details-popup-label text-nowrap">Service ID</td>
                        <td className="data-txt">{popUpData.ServiceId}</td>
                      </tr>
                      <tr className="all-details-popup-altclr">
                        <td className="all-details-popup-label text-nowrap">Tariff Name</td>
                        <td className="data-txt">
                          {popUpData.TariffName}
                        </td>
                      </tr>
                      <tr hidden={popUpData.CarrierNotes === ""}>
                        <td className="all-details-popup-label text-nowrap">Carrier Notes</td>
                        <td>
                          {
                            popUpData.CarrierNotes.split("\n").map((line, index) => {
                              return (
                                <div key={index} className="data-txt" dangerouslySetInnerHTML={{ __html: (line) }} />
                              )
                            })
                          }
                        </td>
                      </tr>
                      <tr className="all-details-popup-altclr" hidden={popUpData.quoteNotes === ""}>
                        <td className="all-details-popup-label text-nowrap">Quote Notes</td>
                        <td className="data-txt">{popUpData.quoteNotes}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-12 col-md-4">
                  <table className=" table table-borderless">
                    <tbody>
                      {(QuoteLtlRequest.customerData.ratingEngine === "Mode") &&
                        <>
                          <tr>
                            <td className="all-details-popup-label">
                              Flat Rate
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">${parseFloat(popUpData.FlatRate).toFixed(2)}</span>
                            </td>
                          </tr>
                          {popUpData.charges.map((data: any, index: any) => {
                            return (
                              <tr key={index}>
                                {(data.name !== "Total Line Haul" && data.name !== "Contract Minimum Reached" && data.name !== "Line Haul") &&
                                  <>
                                    <td className="all-details-popup-label">
                                      {data.name}
                                    </td>
                                    <td className="text-end">
                                      <span className="all-details-popup">${parseFloat(data.price).toFixed(2)}</span>
                                    </td>
                                  </>}
                              </tr>
                            )
                          })}
                          <tr className="popup-total-border-line">
                            <td className="all-details-popup-label">
                              Total
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">
                                ${parseFloat(popUpData.Total).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </>
                      }
                      {(QuoteLtlRequest.customerData.ratingEngine === "Banyan") &&
                        <>
                          <tr>
                            <td className="all-details-popup-label">
                              Flat Rate
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">${parseFloat(popUpData.FlatRate).toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="all-details-popup-label">
                              Fuel Surcharge Price
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">${parseFloat(popUpData.fuelSurchargePrice).toFixed(2)}</span>
                            </td>
                          </tr>
                          {popUpData.discount === "" && <tr>
                            <td className="all-details-popup-label">
                              Discount
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">${parseFloat(popUpData.discount).toFixed(2)}</span>
                            </td>
                          </tr>}
                          {popUpData.charges.map((data: any, index: any) => {
                            return (
                              <tr key={index}>
                                {(data.name !== "Total Line Haul" && data.name !== "Contract Minimum Reached" && data.name !== "Line Haul") &&
                                  <>
                                    <td className="all-details-popup-label">
                                      {data.name}
                                    </td>
                                    <td className="text-end">
                                      <span className="all-details-popup">${parseFloat(data.price).toFixed(2)}</span>
                                    </td>
                                  </>}
                              </tr>
                            )
                          })}
                          <tr className="popup-total-border-line">
                            <td className="all-details-popup-label">
                              Total
                            </td>
                            <td className="text-end">
                              <span className="all-details-popup">
                                ${parseFloat(popUpData.Total).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quote to Book LTL Accordion Section Ends Here */}
      {/* Create load popup STARTS HERE */}
      <div className="modal fade" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={successPopup} id="ctl-sucess-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header"> LTL Creation Success!</h5>
              <p className="popup-txt">Your LTL has been created successfully with load ID :<a href ={`/al-details-tl?lid=`+LoadNumber +`&lorg=BTMS`} className="text-decoration-none ctl-link-color">{LoadNumberSuccessPopupMsg}</a></p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => {/* CPF_PC_85 */navigate('/loadsearch') }}>OK</button>
            </div>
          </div>
        </div>
      </div>
      {/* Create load popup ENDS HERE */}
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={ValidationPopup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog weight-validation-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/verify-address-icon.svg" alt="info-required-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">{ValidationPopupMSG}</h5>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { ValidationOkClick() }}>OK</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={someThingWentWrongPopup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog weight-validation-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/404-img.svg" alt="info-required-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">Something Went Wrong</h5>
              <p className="popup-txt">Oops - We're having some trouble completing your request.</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { someThingWentWrongOkClick() }}>OK</button>
            </div>
          </div>
        </div>
      </div>
      {loader ? <div className="overlay">
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border Loader text-dark align-center ms-2" role="status">
            <span className="visually-hidden" />
          </div>
          <p className="data-label">Loading...</p>
        </div>
      </div> : null}
    </div>
  )
}

export default QuoteLtlChooseYourCarrier