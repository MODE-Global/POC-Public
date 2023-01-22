import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import {
  GetClassList, GetStatesList, GetUOMList,
  GetUserDetail, GetShipperList, GetCountryList,
  GetConsigneeList, VerifyAddress, CreateBookLtl,
  // GetPreSavedCommodtiesList
} from '../../api/api';
import { UserContext } from '../../app/Context';
import moment from 'moment';
import { QuoteLtlResponse } from '../../interface/QuoteLtlInterface'
import { BookRequest } from '../../interface/BookLtlinterface';
import { StateDetail } from '../../interface/QuoteLtlInterface';

const BookLtl = () => {
  const context = useContext(UserContext);
  let navigate = useNavigate();
  const QuoteLtlResponse = context.GetQuoteLtlResponse();
  const QuoteLtlRequest = context.GetQuoteLtlRequest();
  const GetBookLtlRequest = context.GetBookLtlRequest();

  const ReferenceNumDivRef = useRef<HTMLDivElement>(null);
  const ReferenceNumAccordionDivRef = useRef<HTMLDivElement>(null);
  const ShipperInfoAccordionDivRef = useRef<HTMLDivElement>(null);
  const ReferenceNumDownButtonRef = useRef<HTMLButtonElement>(null);

  const ShipperInfoDivRef = useRef<HTMLDivElement>(null);
  const ShipperInfoDownButtonRef = useRef<HTMLButtonElement>(null);

  const consigneeInfoDivRef = useRef<HTMLDivElement>(null);
  const consigneeInfoAccordionDivRef = useRef<HTMLDivElement>(null);
  const commoditiesAccordionDivRef = useRef<HTMLDivElement>(null);
  const consigneeInfoDownButtonRef = useRef<HTMLButtonElement>(null);

  const commoditiesDivRef = useRef<HTMLDivElement>(null);
  const commoditiesDownButtonRef = useRef<HTMLButtonElement>(null);

  const ReviewDivRef = useRef<HTMLDivElement>(null);
  const ReviewDownButtonRef = useRef<HTMLButtonElement>(null);

  const CustomerSelectRef = useRef<HTMLSelectElement>(null);
  const CustomerSpanRef = useRef<HTMLSpanElement>(null);

  const shipNameInputRef = useRef<HTMLInputElement>(null);
  const shipNameSpanRef = useRef<HTMLSpanElement>(null);

  const shipAddressLineOneInputRef = useRef<HTMLInputElement>(null);
  const shipAddressLineOneSpanRef = useRef<HTMLSpanElement>(null);

  const shipCityInputRef = useRef<HTMLInputElement>(null);
  const shipCitySpanRef = useRef<HTMLSpanElement>(null);

  const shipStateInputRef = useRef<HTMLSelectElement>(null);
  const shipStateSpanRef = useRef<HTMLSpanElement>(null);

  const shipZipCodeInputRef = useRef<HTMLInputElement>(null);
  const shipZipCodeSpanRef = useRef<HTMLSpanElement>(null);

  const shipEmailInputRef = useRef<HTMLInputElement>(null);
  const shipEmailSpanRef = useRef<HTMLSpanElement>(null);

  const shipPhoneInputRef = useRef<HTMLInputElement>(null);
  const shipPhoneSpanRef = useRef<HTMLSpanElement>(null);

  const shipFaxInputRef = useRef<HTMLInputElement>(null);
  const shipFaxSpanRef = useRef<HTMLSpanElement>(null);

  const shipEarliestDateInputRef = useRef<HTMLInputElement>(null);
  const shipEarliestDateSpanRef = useRef<HTMLSpanElement>(null);

  const shipEarliestTimeInputRef = useRef<HTMLInputElement>(null);
  const shipEarliestTimeSpanRef = useRef<HTMLSpanElement>(null);

  const shipCountryInputRef = useRef<HTMLSelectElement>(null);
  const shipCountrySpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeNameInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeNameSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeAddressLineOneInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeAddressLineOneSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeCityInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeCitySpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeStateInputRef = useRef<HTMLSelectElement>(null);
  const ConsigneeStateSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeZipCodeInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeZipCodeSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeEmailInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeEmailSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneePhoneInputRef = useRef<HTMLInputElement>(null);
  const ConsigneePhoneSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeFaxInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeFaxSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeEarliestDateInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeEarliestDateSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeEarliestTimeInputRef = useRef<HTMLInputElement>(null);
  const ConsigneeEarliestTimeSpanRef = useRef<HTMLSpanElement>(null);

  const ConsigneeCountryInputRef = useRef<HTMLSelectElement>(null);
  const ConsigneeCountrySpanRef = useRef<HTMLSpanElement>(null);

  const successPopup = useRef<HTMLDivElement>(null);
  const ValidationPopup = useRef<HTMLDivElement>(null);
  const noContentPopup = useRef<HTMLDivElement>(null);
  const someThingWentWrongPopup = useRef<HTMLDivElement>(null);
  const VerifyPopup = useRef<HTMLDivElement>(null);

  const bookAccordianStateObj = {
    referenceNumberShow: true,
    shipperInfoShow: false,
    consigneeInfo: false,
    commoditiesShow: false,
    reviewCreateShow: false
  }

  let emptyArray: any = []
  const [commodities, Setcommodities] = useState(QuoteLtlRequest.commodities)
  const QuoteReponseVar: QuoteLtlResponse = {
    quoteLtlResponse: {
      quoteDetails: [{
        loadId: 0,
        quoteId: 0,
        quoteNumber: "",
        quoteNotes: "",
        carrierName: "",
        carrierNameBanyan: "",
        carrierNotes: "",
        tariffName: "",
        scac: "",
        service: "",
        transitTime: 0,
        flatPrice: "",
        fuelSurchargePrice: "",
        discount: "",
        otherCharges: null,
        accessorialsPrice: [{
          name: "",
          code: "",
          price: "",
        }],
        totalPrice: ""
      }]
    }
  }

  console.log("QuoteReponseVar", QuoteReponseVar)
  const [CurrentQuote, setCurrentQuote] = useState(QuoteReponseVar.quoteLtlResponse.quoteDetails[0])
  const [getUserDetail, SetGetUserDetail] = useState(emptyArray)
  const [AgentDetails, setAgentDetails] = useState(GetBookLtlRequest.AgentDetails)
  const [referenceNumber, setreferenceNumber] = useState(GetBookLtlRequest.referenceNumber)
  const [shipperInfo, setshipperInfo] = useState(GetBookLtlRequest.shipperInfo)
  const [consigneeInfo, setconsigneeInfo] = useState(GetBookLtlRequest.consigneeInfo)
  const [Quantity, SetQuantity] = useState(0)
  const [Weight, SetWeight] = useState(0)
  const [ValidationPopupMSG, SetValidationPopupMSG] = useState("")
  const [LoadNumberSuccessPopupMsg, setLoadNumberSuccessPopupMsg] = useState("")
  const [VerifyPopupMSG, setVerifyPopupMSG] = useState("")
  const [VerifyAddressPopupMSG, setVerifyAddressPopupMSG] = useState("")
  const [accessorials, Setaccessorials] = useState("")
  const [LinearFt, SetLinearFt] = useState("")
  const [LoadNumber, SetLoadNumber] = useState("")
  const [stateOptions, setStateOptions] = useState<StateDetail[]>([])
  const [classOptions, setClassOptions] = useState<any[]>([])
  const [uomOptions, setUOMOptions] = useState<any[]>([])
  const [countryOptions, setcountryOptions] = useState<any[]>([])
  const [ShipperOption, setShipperOption] = useState<any[]>([])
  const [ConsigneeOption, setConsigneeOption] = useState<any[]>([])
  const [loader, setLoader] = useState(false)
  const [preSavedCommodityOptions, setPreSavedCommodityOptions] = useState<any[]>([])
  const [bookAccordianState, setBookAccordianState] = useState(bookAccordianStateObj);
  let divCompletedObj = {
    reference: false,
    Shipper: false,
    consignee: false,
    commodities: false,
  }
  const [completedCheck, setcompletedCheck] = useState(divCompletedObj)

  /* quote to book flow Setting the state of the component. */
  useEffect(() => {
    if (QuoteLtlRequest.CurrentQuoteId != 0) {
      let accessorialsString = ""
      QuoteLtlResponse.quoteLtlResponse.quoteDetails.forEach((data: any) => {
        if (data.quoteId == QuoteLtlRequest.CurrentQuoteId) {
          setCurrentQuote(data)
        }
      })
      QuoteLtlRequest.accessorials.forEach((data: any, index: number) => {
        accessorialsString += data;
        if (index < (QuoteLtlRequest.accessorials.length) - 1) {
          accessorialsString += ",";
        }
      })
      Setaccessorials(accessorialsString)
      setreferenceNumber({ ...referenceNumber, ["customer"]: QuoteLtlRequest.shipInfo.customer })
      setshipperInfo({
        ...shipperInfo,
        ["city"]: QuoteLtlRequest.shipInfo.pickCity,
        ["state"]: QuoteLtlRequest.shipInfo.pickState,
        ["zipCode"]: QuoteLtlRequest.shipInfo.pickZipCode
      })
      setconsigneeInfo({
        ...consigneeInfo,
        ["city"]: QuoteLtlRequest.shipInfo.deliveryCity,
        ["state"]: QuoteLtlRequest.shipInfo.deliveryState,
        ["zipCode"]: QuoteLtlRequest.shipInfo.deliveryZipCode
      })
    }
  }, [CurrentQuote])

  /**
   * GetOnLoadData is an async function that calls GetUserDetail, which returns a response, which is then
   * checked for a status of 200, and if it is, then the response is looped through and the
   * customerDetails are pushed into an array, which is then set to the state of GetUserDetail.
   */
  useEffect(() => {
    ReferenceNumDivRef.current?.classList.add('show');
    ReferenceNumDownButtonRef.current?.classList.remove('collapsed');
    const GetOnLoadData = async () => {
      const response: any = await GetUserDetail(localStorage.getItem('userId'))
      if (response.status == 200) {
        let customerDetail: any[] = []
        response.data.userDetails.forEach((value: any) => {
          if (value.permission.includes("Book LTL")) {
            value.customerDetails.forEach((customer: any) => {
              customerDetail.push(customer)
            })
          }
        })
        SetGetUserDetail(customerDetail)
        if(customerDetail.length==1){
          console.log("customerDetail inside",customerDetail)
          setreferenceNumber({ ...referenceNumber, ["customer"]: customerDetail[0].mySunteckLoginId })
          let currentCustaId = "";
            currentCustaId = customerDetail[0].custaId
            setAgentDetails({
              ...AgentDetails,
              ["agentContact"]: customerDetail[0].agentName,
              ["agentEmailId"]: customerDetail[0].agentEmail,
              ["agentPhone"]: customerDetail[0].agentPhoneNumber,
              ["custaId"]: customerDetail[0].custaId,
              ["custmId"]: customerDetail[0].custmId
            })
          


        if (customerDetail[0].mySunteckLoginId != "") {
          GetShipperTypes(currentCustaId)
          GetConsigneeTypes(currentCustaId)
          // preSavedCommoditiesDropdown(currentCustaId)
        }
        }
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }

    const GetStates = async () => {
      const response: any = await GetStatesList();
      if (response.status == 200) {
        setStateOptions(response.data.States);
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }

    const GetClassTypes = async () => {
      const response: any = await GetClassList();
      if (response.status == 200) {
        setClassOptions(response.data.Class);
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
    const GetUOMTypes = async () => {
      const response: any = await GetUOMList();
      if (response.status == 200) {
        setUOMOptions(response.data.Uom);
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
    const GetCountryTypes = async () => {
      const response: any = await GetCountryList();
      if (response.status == 200) {
        setcountryOptions(response.data.Country);
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }

    GetOnLoadData()
    GetStates()
    GetClassTypes()
    GetUOMTypes()
    GetCountryTypes()
  }, [])

  /* Checking if the referenceNumber.customer is not empty, then it will loop through the getUserDetail
  array and check if the QuoteLtlRequest.shipInfo.customer is equal to the data.mySunteckLoginId. If
  it is, then it will set the AgentDetails object with the data.agentName, data.agentEmail, and
  data.agentPhoneNumber. */
  useEffect(() => {
    if (referenceNumber.customer != "") {
      getUserDetail.forEach((data: any) => {
        if (QuoteLtlRequest.shipInfo.customer == data.mySunteckLoginId) {
          setAgentDetails({
            ...AgentDetails,
            ["agentContact"]: data.agentName,
            ["agentEmailId"]: data.agentEmail,
            ["agentPhone"]: data.agentPhoneNumber,
            ["custaId"]: data.custaId,
            ["custmId"]: data.custmId
          })
          GetShipperTypes(data.custaId)
          GetConsigneeTypes(data.custaId)
          // preSavedCommoditiesDropdown(data.custaId)
        }
      })
    }
  }, [referenceNumber, getUserDetail])

  /**
 * It returns a list of options, where each option is a customer name and their login ID.
 * @returns An array of options.
 */
  const customerDropDown = () => {
    return getUserDetail.map((data: any, index: any) => {
      return (
        <option key={index} value={data.mySunteckLoginId}>{data.customerName} - {data.mySunteckLoginId}</option>
      )
    })
  }

  /**
* It returns a list of options, where each option is a State name, its abbrevation and its ID.
* @returns An array of options.
*/
  const stateDropDown = () => {
    return stateOptions.map((data: StateDetail, index: any) => {
      return (
        <option key={index} value={data.Abbreviation}>{data.Abbreviation + "-" + data.StateProvinceName}</option>
      )
    })
  }

  /**
* It returns a list of options, where each option is a Class and its NMFC Class ID.
* @returns An array of options.
*/
  const classDropDown = () => {
    return classOptions.map((data: any, index: any) => {
      return (
        <option key={index} value={data.Methods}>{data.Methods}</option>
      )
    })
  }

  /**
  * It returns a list of options, where each option is a equipment type and its ID.
  * @returns An array of options.
  */
  const uomDropDown = () => {
    return uomOptions.map((data: any, index: any) => {
      return (
        <option key={index} value={data.Uom}>{data.Uom}</option>
      )
    })
  }

  /**
   * It returns a list of options for a select element, where each option is a country name.
   * @returns An array of option elements.
   */
  const countryDropDown = () => {
    return countryOptions.map((data: any, index: any) => {
      return (
        <option key={index} value={data.CountryCode}>{data.Country}</option>
      )
    })
  }

  // const preSavedCommoditiesDropdown = async (custaId: any) => {
  //   if (custaId != undefined) {
  //     const commoditiesResp: any = await GetPreSavedCommodtiesList(custaId)
  //     if (commoditiesResp.status == 200) {
  //       setPreSavedCommodityOptions(commoditiesResp.data.presavedCommodities);
  //     }
  //     else if (commoditiesResp.status == 204) {

  //     }
  //     else {
  //       if (someThingWentWrongPopup.current != null) {
  //         someThingWentWrongPopup.current.classList.add("show");
  //         someThingWentWrongPopup.current.style.display = "block";
  //       }
  //     }
  //   }
  // }


  // const preSaveDropDown = () => {
  //   return preSavedCommodityOptions.map((data: any, index: any) => {
  //     return (
  //       <option key={index} value={data.id}>{data.description}</option>
  //     )
  //   })
  // }


  /**
   * OnReferenceValueChange is a function that takes an event as an argument and returns nothing.
   * @param {any} event - any
   */
  const onReferenceValueChange = (event: any, type: string) => {
    switch (type) {
      case "Customer": {
        let currentCustaId = "";
        getUserDetail.forEach((data: any) => {
          if (event.target.value == data.mySunteckLoginId) {
            currentCustaId = data.custaId
            setAgentDetails({
              ...AgentDetails,
              ["agentContact"]: data.agentName,
              ["agentEmailId"]: data.agentEmail,
              ["agentPhone"]: data.agentPhoneNumber,
              ["custaId"]: data.custaId,
              ["custmId"]: data.custmId
            })
          }
        })
        if (event.target.value != "") {
          GetShipperTypes(currentCustaId)
          GetConsigneeTypes(currentCustaId)
          // preSavedCommoditiesDropdown(currentCustaId)
        }
        setreferenceNumber({ ...referenceNumber, ["customer"]: event.target.value })
        break;
      }
      default: {
        setreferenceNumber({ ...referenceNumber, [event.target.name]: event.target.value })
      }
    }
  }

  /**
   * GetShipperTypes is a function that takes a custaId as a parameter and returns a promise that
   * resolves to a response object that has a status property that is equal to 200 and a data property
   * that has a ShipPoints property that is an array of objects that have a ShipperType property that is
   * a string.
   * @param {any} custaId - number
   */
  const GetShipperTypes = async (custaId: any) => {
    const response: any = await GetShipperList(custaId);
    if (response.status == 200) {
      setShipperOption(response.data.ShipPoints);
    }
    else {
      if (someThingWentWrongPopup.current != null) {
        someThingWentWrongPopup.current.classList.add("show");
        someThingWentWrongPopup.current.style.display = "block";
      }
    }
  }

  /**
   * GetConsigneeTypes is a function that takes a custaId as an argument and returns a response object
   * that contains a status and data property. If the status is 200, then the function sets the
   * consigneeOption state to the data property of the response object.
   * @param {any} custaId - number
   */
  const GetConsigneeTypes = async (custaId: any) => {
    const response: any = await GetConsigneeList(custaId);
    if (response.status == 200) {
      setConsigneeOption(response.data.ConsigneePoints);
    }
    else {
      if (someThingWentWrongPopup.current != null) {
        someThingWentWrongPopup.current.classList.add("show");
        someThingWentWrongPopup.current.style.display = "block";
      }
    }
  }

  /**
* It returns a list of options, where each option is a Class and its NMFC Class ID.
* @returns An array of options.
*/
  const shipperDropDown = () => {
    return ShipperOption.map((data: any, index: any) => {
      return (
        <option key={index} value={data.Id}>{data.Name} {data.city},{data.state}</option>
      )
    })
  }

  const consigneeDropDown = () => {
    return ConsigneeOption.map((data: any, index: any) => {
      return (
        <option key={index} value={data.Id}>{data.Name} {data.city},{data.state}</option>
      )
    })
  }

  /**
   * If the event.target.value is empty or matches the regex, then set the state.
   * @param {any} event - any, type: string
   * @param {string} type - string
   */
  const onShipperValueChange = (event: any, type: string) => {
    switch (type) {
      case "Text": {
        const rejex = /^[a-zA-Z ]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Zip": {
        const rejex = /^[a-zA-Z 0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "number": {
        const rejex = /^[0-9-]*$/;
        const amenumber = /^\(?([0-9]{3})\)?[-.?]?([0-9]{3})[-.?]?([0-9]{4})$/;
        if (event.target.value == '' || rejex.test(event.target.value) || amenumber.test(event.target.value)) {
          setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "earliestDate": {
        setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value, ["latestDate"]: "" })
        setconsigneeInfo({ ...consigneeInfo, ["earliestDate"]: "" })
        break;
      }
      case "shipper": {
        setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        ShipperOption.forEach((data: any, index: any) => {
          if (data.Id == event.target.value) {
            setshipperInfo({
              ...shipperInfo,
              ["shipper"]: event.target.value,
              ["addressline1"]: data.AddressLine1,
              ["addressline2"]: data.AddressLine2,
              ["contactName"]: data.ContactName,
              ["country"]: data.Country,
              ["EmailAddress"]: data.Email,
              ["FaxNumber"]: data.Fax,
              ["PhoneNumber"]: data.PhoneNumber,
              ["zipCode"]: data.ZipCode,
              ["city"]: data.city,
              ["state"]: data.state,
              ["name"]: data.Name,
            })
          }
        })
        break;
      }
      default: {
        setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
      }
    }

  }
  /**
   * validate in reference card input value and 
   * if pass return true other wise return false
   * @returns A function that returns a boolean value.
   */
  const ReferenceValidation = () => {
    let IsValid = false
    if (CustomerSpanRef.current != null && CustomerSelectRef.current != null) {
      if (referenceNumber.customer == "") {
        CustomerSpanRef.current.hidden = false;
        CustomerSpanRef.current.innerHTML = "Please select the customer";
        CustomerSelectRef.current.style.borderColor = "red";
      }
      else if (referenceNumber.customer != "") {
        CustomerSpanRef.current.hidden = true;
        CustomerSpanRef.current.innerHTML = "";
        CustomerSelectRef.current.style.borderColor = "";
      }

      if (CustomerSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        ReferenceNumDivRef.current?.classList.add('show');
        ReferenceNumDownButtonRef.current?.classList.remove('completed');
        ReferenceNumDownButtonRef.current?.classList.remove('collapsed');
        ShipperInfoDivRef.current?.classList.remove('show')
        ShipperInfoDownButtonRef.current?.classList.add('collapsed');
        consigneeInfoDivRef.current?.classList.remove('show')
        consigneeInfoDownButtonRef.current?.classList.add('collapsed');
        commoditiesDivRef.current?.classList.remove('show')
        commoditiesDownButtonRef.current?.classList.add('collapsed');
        ReviewDivRef.current?.classList.remove('show')
        ReviewDownButtonRef.current?.classList.add('collapsed');
        window.scrollTo(
          {
            top: ReferenceNumAccordionDivRef.current?.offsetTop ?
              ReferenceNumAccordionDivRef.current?.offsetTop - 100 : 0,
            behavior: "smooth"
          })

        IsValid = false
      }
    }
    return IsValid
  }

  /**
   * ReferenceValidation function return true then
   * close div card of reference and open div card of shipperInfo
   */
  const onReferenceContinueClick = () => {
    if (ReferenceValidation()) {
      ReferenceNumDivRef.current?.classList.remove('show');
      ReferenceNumDownButtonRef.current?.classList.add('completed');
      ReferenceNumDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["reference"]: true })
      ShipperInfoDivRef.current?.classList.add('show')
      ShipperInfoDownButtonRef.current?.classList.remove('completed');
      ShipperInfoDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["reference"]: false })
    }
  }

  /**
   * validate in shipper card input value and 
   * if pass return true other wise return false
   * @returns A boolean value.
   */
  const shipperValidation = () => {
    let IsValid = false;
    if (shipNameInputRef.current != null && shipNameSpanRef.current != null &&
      shipAddressLineOneInputRef.current != null && shipAddressLineOneSpanRef.current != null &&
      shipCityInputRef.current != null && shipCitySpanRef.current != null &&
      shipStateInputRef.current != null && shipStateSpanRef.current != null &&
      shipZipCodeInputRef.current != null && shipZipCodeSpanRef.current != null &&
      shipCountryInputRef.current != null && shipCountrySpanRef.current != null &&
      shipEmailInputRef.current != null && shipEmailSpanRef.current != null &&
      shipPhoneInputRef.current != null && shipPhoneSpanRef.current != null &&
      shipFaxInputRef.current != null && shipFaxSpanRef.current != null &&
      shipEarliestTimeInputRef.current != null && shipEarliestTimeSpanRef.current != null &&
      shipEarliestDateInputRef.current != null && shipEarliestDateSpanRef.current != null) {

      if (shipperInfo.name == "") {
        shipNameSpanRef.current.hidden = false;
        shipNameSpanRef.current.innerHTML = "Please enter the name";
        shipNameInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.name != "") {
        shipNameSpanRef.current.hidden = true;
        shipNameSpanRef.current.innerHTML = "";
        shipNameInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.addressline1 == "") {
        shipAddressLineOneSpanRef.current.hidden = false;
        shipAddressLineOneSpanRef.current.innerHTML = "Please enter the address";
        shipAddressLineOneInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.addressline1 != "") {
        shipAddressLineOneSpanRef.current.hidden = true;
        shipAddressLineOneSpanRef.current.innerHTML = "";
        shipAddressLineOneInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.city == "") {
        shipCitySpanRef.current.hidden = false;
        shipCitySpanRef.current.innerHTML = "Please enter the city";
        shipCityInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.city != "") {
        shipCitySpanRef.current.hidden = true;
        shipCitySpanRef.current.innerHTML = "";
        shipCityInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.state == "") {
        shipStateSpanRef.current.hidden = false;
        shipStateSpanRef.current.innerHTML = "Please select the state";
        shipStateInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.state != "") {
        shipStateSpanRef.current.hidden = true;
        shipStateSpanRef.current.innerHTML = "";
        shipStateInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.zipCode == "") {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Please enter the Zip Code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 5 && !(/^[0-9]{5}$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 5 && (/^[0-9]{5}$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = true;
        shipZipCodeSpanRef.current.innerHTML = "";
        shipZipCodeInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.zipCode.length == 7 && !(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 7 && (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = true;
        shipZipCodeSpanRef.current.innerHTML = "";
        shipZipCodeInputRef.current.style.borderColor = "";
      }
      else {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Please enter the Valid Zip Code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }

      if (shipperInfo.country == "") {
        shipCountrySpanRef.current.hidden = false;
        shipCountrySpanRef.current.innerHTML = "Please select the country";
        shipCountryInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.country != "") {
        shipCountrySpanRef.current.hidden = true;
        shipCountrySpanRef.current.innerHTML = "";
        shipCountryInputRef.current.style.borderColor = "";
      }


      const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      if (shipperInfo.EmailAddress.length > 0 && !emailExp.test(shipperInfo.EmailAddress)) {
        shipEmailSpanRef.current.hidden = false;
        shipEmailSpanRef.current.innerHTML = "Please enter a valid email Address";
        shipEmailInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.EmailAddress.length > 0 && emailExp.test(shipperInfo.EmailAddress)) {
        shipEmailSpanRef.current.hidden = true;
        shipEmailSpanRef.current.innerHTML = "";
        shipEmailInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.EmailAddress.length == 0) {
        shipEmailSpanRef.current.hidden = true;
        shipEmailSpanRef.current.innerHTML = "";
        shipEmailInputRef.current.style.borderColor = "";
      }






      const aphonere1 = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      const aphonere2 = new RegExp(/^[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{4}$/)

      if (shipperInfo.PhoneNumber.length == 0) {
        shipPhoneSpanRef.current.hidden = true;
        shipPhoneSpanRef.current.innerHTML = "";
        shipPhoneInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.PhoneNumber.length > 10 && shipperInfo.PhoneNumber.length < 12 && !aphonere1.test(shipperInfo.PhoneNumber)) {
        shipPhoneSpanRef.current.hidden = false;
        shipPhoneSpanRef.current.innerHTML = "Please enter a valid phone";
        shipPhoneInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.PhoneNumber.length > 12 && !aphonere2.test(shipperInfo.PhoneNumber)) {
        shipPhoneSpanRef.current.hidden = false;
        shipPhoneSpanRef.current.innerHTML = "Please enter a valid phone";
        shipPhoneInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.PhoneNumber.length < 10 && shipperInfo.PhoneNumber.length != 10) {
        shipPhoneSpanRef.current.hidden = false;
        shipPhoneSpanRef.current.innerHTML = "Please enter a valid phone";
        shipPhoneInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.PhoneNumber.length > 0 && shipperInfo.PhoneNumber.length == 10) {
        shipPhoneSpanRef.current.hidden = true;
        shipPhoneSpanRef.current.innerHTML = "";
        shipPhoneInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.FaxNumber.length == 0) {
        shipFaxSpanRef.current.hidden = true;
        shipFaxSpanRef.current.innerHTML = "";
        shipFaxInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.FaxNumber.length > 10 && shipperInfo.FaxNumber.length < 12 && !aphonere1.test(shipperInfo.FaxNumber)) {
        shipFaxSpanRef.current.hidden = false;
        shipFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        shipFaxInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.FaxNumber.length > 12 && !aphonere2.test(shipperInfo.FaxNumber)) {
        shipFaxSpanRef.current.hidden = false;
        shipFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        shipFaxInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.FaxNumber.length < 10 && shipperInfo.FaxNumber.length != 10) {
        shipFaxSpanRef.current.hidden = false;
        shipFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        shipFaxInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.FaxNumber.length > 0 && shipperInfo.FaxNumber.length == 10) {
        shipFaxSpanRef.current.hidden = true;
        shipFaxSpanRef.current.innerHTML = "";
        shipFaxInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.earliestDate == "") {
        shipEarliestDateSpanRef.current.hidden = false;
        shipEarliestDateSpanRef.current.innerHTML = "Please select the earliest date";
        shipEarliestDateInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.earliestDate != "") {
        shipEarliestDateSpanRef.current.hidden = true;
        shipEarliestDateSpanRef.current.innerHTML = "";
        shipEarliestDateInputRef.current.style.borderColor = "";
      }

      if (shipperInfo.earliestTime.length > 0 &&
        shipperInfo.earliestTime <= moment(new Date()).format("H:mm") &&
        shipperInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        shipEarliestTimeSpanRef.current.hidden = false;
        shipEarliestTimeSpanRef.current.innerHTML = "Please enter a valid earliest Time";
        shipEarliestTimeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.earliestTime.length > 0 &&
        shipperInfo.earliestTime >= moment(new Date()).format("H:mm") &&
        shipperInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        shipEarliestTimeSpanRef.current.hidden = true;
        shipEarliestTimeSpanRef.current.innerHTML = "";
        shipEarliestTimeInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.earliestTime.length > 0 && shipperInfo.earliestDate > moment(new Date()).format("YYYY-MM-DD")) {
        shipEarliestTimeSpanRef.current.hidden = true;
        shipEarliestTimeSpanRef.current.innerHTML = "";
        shipEarliestTimeInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.earliestTime.length == 0) {
        shipEarliestTimeSpanRef.current.hidden = true;
        shipEarliestTimeSpanRef.current.innerHTML = "";
        shipEarliestTimeInputRef.current.style.borderColor = "";
      }

      if (shipNameSpanRef.current.hidden && shipAddressLineOneSpanRef.current.hidden && shipCitySpanRef.current.hidden && shipStateSpanRef.current.hidden &&
        shipZipCodeSpanRef.current.hidden && shipCountrySpanRef.current.hidden && shipEmailSpanRef.current.hidden && shipPhoneSpanRef.current.hidden &&
        shipFaxSpanRef.current.hidden && shipEarliestDateSpanRef.current.hidden && shipEarliestTimeSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        ShipperInfoDivRef.current?.classList.add('show')
        ShipperInfoDownButtonRef.current?.classList.remove('completed');
        ShipperInfoDownButtonRef.current?.classList.remove('collapsed');
        consigneeInfoDivRef.current?.classList.remove('show')
        consigneeInfoDownButtonRef.current?.classList.add('collapsed');
        commoditiesDivRef.current?.classList.remove('show')
        commoditiesDownButtonRef.current?.classList.add('collapsed');
        ReviewDivRef.current?.classList.remove('show')
        ReviewDownButtonRef.current?.classList.add('collapsed');

        window.scrollTo(
          {
            top: ShipperInfoAccordionDivRef.current?.offsetTop ?
              ShipperInfoAccordionDivRef.current?.offsetTop - 100 : 0,
            behavior: "smooth"
          })
        IsValid = false
      }
    }
    return IsValid
  }

  /**
   * shipperValidation function return true then
   * close div card of shipper and open div card of consigee
   */
  const shipperInfoContiueClick = () => {
    if (shipperValidation()) {
      ShipperInfoDivRef.current?.classList.remove('show')
      ShipperInfoDownButtonRef.current?.classList.add('completed');
      ShipperInfoDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["Shipper"]: true })
      consigneeInfoDivRef.current?.classList.add('show')
      consigneeInfoDownButtonRef.current?.classList.remove('completed');
      consigneeInfoDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["Shipper"]: false })
    }
  }

  /**
   * If the input is a number, then only allow numbers, otherwise allow anything.
   * @param {any} event - any, type: string
   * @param {string} type - string
   */
  const onConsigneeValueChange = (event: any, type: string) => {
    switch (type) {
      case "Text": {
        const rejex = /^[a-zA-Z ]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Zip": {
        const rejex = /^[a-zA-Z 0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "number": {
        const rejex = /^[0-9]*$/;
        const amenumber = /^\(?([0-9]{3})\)?[-.?]?([0-9]{3})[-.?]?([0-9]{4})$/;
        if (event.target.value == '' || rejex.test(event.target.value) || amenumber.test(event.target.value)) {
          setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "earliestDate": {
        setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value, ["latestDate"]: "" })
        break;
      }
      case "consignee": {
        setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        ConsigneeOption.forEach((data: any, index: any) => {
          if (data.Id == event.target.value) {
            setconsigneeInfo({
              ...consigneeInfo,
              ["consignee"]: event.target.value,
              ["addressline1"]: data.AddressLine1,
              ["addressline2"]: data.AddressLine2,
              ["contactName"]: data.ContactName,
              ["country"]: data.Country,
              ["EmailAddress"]: data.Email,
              ["FaxNumber"]: data.Fax,
              ["PhoneNumber"]: data.PhoneNumber,
              ["zipCode"]: data.ZipCode,
              ["city"]: data.city,
              ["state"]: data.state,
              ["name"]: data.Name,
            })
          }
        })
        break;
      }
      default: {
        setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
      }
    }
  }

  /**
   * validate in consigee card input value and 
   * if pass return true other wise return false
   * @returns A boolean value.
   */
  const ConsigeeValidation = () => {
    let IsValid = false;
    if (ConsigneeNameInputRef.current != null && ConsigneeNameSpanRef.current != null &&
      ConsigneeAddressLineOneInputRef.current != null && ConsigneeAddressLineOneSpanRef.current != null &&
      ConsigneeCityInputRef.current != null && ConsigneeCitySpanRef.current != null &&
      ConsigneeStateInputRef.current != null && ConsigneeStateSpanRef.current != null &&
      ConsigneeZipCodeInputRef.current != null && ConsigneeZipCodeSpanRef.current != null &&
      ConsigneeCountryInputRef.current != null && ConsigneeCountrySpanRef.current != null &&
      ConsigneeEmailInputRef.current != null && ConsigneeEmailSpanRef.current != null &&
      ConsigneePhoneInputRef.current != null && ConsigneePhoneSpanRef.current != null &&
      ConsigneeFaxInputRef.current != null && ConsigneeFaxSpanRef.current != null &&
      ConsigneeEarliestTimeInputRef.current != null && ConsigneeEarliestTimeSpanRef.current != null &&
      ConsigneeEarliestDateInputRef.current != null && ConsigneeEarliestDateSpanRef.current != null) {

      if (consigneeInfo.name == "") {
        ConsigneeNameSpanRef.current.hidden = false;
        ConsigneeNameSpanRef.current.innerHTML = "Please enter the name";
        ConsigneeNameInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.name != "") {
        ConsigneeNameSpanRef.current.hidden = true;
        ConsigneeNameSpanRef.current.innerHTML = "";
        ConsigneeNameInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.addressline1 == "") {
        ConsigneeAddressLineOneSpanRef.current.hidden = false;
        ConsigneeAddressLineOneSpanRef.current.innerHTML = "Please enter the address";
        ConsigneeAddressLineOneInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.addressline1 != "") {
        ConsigneeAddressLineOneSpanRef.current.hidden = true;
        ConsigneeAddressLineOneSpanRef.current.innerHTML = "";
        ConsigneeAddressLineOneInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.city == "") {
        ConsigneeCitySpanRef.current.hidden = false;
        ConsigneeCitySpanRef.current.innerHTML = "Please enter the city";
        ConsigneeCityInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.city != "") {
        ConsigneeCitySpanRef.current.hidden = true;
        ConsigneeCitySpanRef.current.innerHTML = "";
        ConsigneeCityInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.state == "") {
        ConsigneeStateSpanRef.current.hidden = false;
        ConsigneeStateSpanRef.current.innerHTML = "Please select the state";
        ConsigneeStateInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.state != "") {
        ConsigneeStateSpanRef.current.hidden = true;
        ConsigneeStateSpanRef.current.innerHTML = "";
        ConsigneeStateInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.zipCode == "") {
        ConsigneeZipCodeSpanRef.current.hidden = false;
        ConsigneeZipCodeSpanRef.current.innerHTML = "Please enter the Zip Code";
        ConsigneeZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.zipCode.length == 5 && !(/^[0-9]{5}$/.test(consigneeInfo.zipCode))) {
        ConsigneeZipCodeSpanRef.current.hidden = false;
        ConsigneeZipCodeSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
        ConsigneeZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.zipCode.length == 5 && (/^[0-9]{5}$/.test(consigneeInfo.zipCode))) {
        ConsigneeZipCodeSpanRef.current.hidden = true;
        ConsigneeZipCodeSpanRef.current.innerHTML = "";
        ConsigneeZipCodeInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.zipCode.length == 7 && !(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(consigneeInfo.zipCode))) {
        ConsigneeZipCodeSpanRef.current.hidden = false;
        ConsigneeZipCodeSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
        ConsigneeZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.zipCode.length == 7 && (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(consigneeInfo.zipCode))) {
        ConsigneeZipCodeSpanRef.current.hidden = true;
        ConsigneeZipCodeSpanRef.current.innerHTML = "";
        ConsigneeZipCodeInputRef.current.style.borderColor = "";
      }
      else {
        ConsigneeZipCodeSpanRef.current.hidden = false;
        ConsigneeZipCodeSpanRef.current.innerHTML = "Please enter a Valid Zip Code";
        ConsigneeZipCodeInputRef.current.style.borderColor = "red";
      }

      if (consigneeInfo.country == "") {
        ConsigneeCountrySpanRef.current.hidden = false;
        ConsigneeCountrySpanRef.current.innerHTML = "Please select the country";
        ConsigneeCountryInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.country != "") {
        ConsigneeCountrySpanRef.current.hidden = true;
        ConsigneeCountrySpanRef.current.innerHTML = "";
        ConsigneeCountryInputRef.current.style.borderColor = "";
      }


      const emailExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      if (consigneeInfo.EmailAddress.length > 0 && !emailExp.test(consigneeInfo.EmailAddress)) {
        ConsigneeEmailSpanRef.current.hidden = false;
        ConsigneeEmailSpanRef.current.innerHTML = "Please enter a valid email Address";
        ConsigneeEmailInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.EmailAddress.length > 0 && emailExp.test(consigneeInfo.EmailAddress)) {
        ConsigneeEmailSpanRef.current.hidden = true;
        ConsigneeEmailSpanRef.current.innerHTML = "";
        ConsigneeEmailInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.EmailAddress.length == 0) {
        ConsigneeEmailSpanRef.current.hidden = true;
        ConsigneeEmailSpanRef.current.innerHTML = "";
        ConsigneeEmailInputRef.current.style.borderColor = "";
      }

      const aphonere1 = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      const aphonere2 = new RegExp(/^[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{4}$/)
      if (consigneeInfo.PhoneNumber.length == 0) {
        ConsigneePhoneSpanRef.current.hidden = true;
        ConsigneePhoneSpanRef.current.innerHTML = "";
        ConsigneePhoneInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.PhoneNumber.length > 10 && consigneeInfo.PhoneNumber.length < 12 && !aphonere1.test(consigneeInfo.PhoneNumber)) {
        ConsigneePhoneSpanRef.current.hidden = false;
        ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        ConsigneePhoneInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.PhoneNumber.length > 12 && !aphonere2.test(consigneeInfo.PhoneNumber)) {
        ConsigneePhoneSpanRef.current.hidden = false;
        ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        ConsigneePhoneInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.PhoneNumber.length < 10 && consigneeInfo.PhoneNumber.length != 10) {
        ConsigneePhoneSpanRef.current.hidden = false;
        ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        ConsigneePhoneInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.PhoneNumber.length > 0 && consigneeInfo.PhoneNumber.length == 10) {
        ConsigneePhoneSpanRef.current.hidden = true;
        ConsigneePhoneSpanRef.current.innerHTML = "";
        ConsigneePhoneInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.FaxNumber.length == 0) {
        ConsigneeFaxSpanRef.current.hidden = true;
        ConsigneeFaxSpanRef.current.innerHTML = "";
        ConsigneeFaxInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.FaxNumber.length > 10 && consigneeInfo.FaxNumber.length < 12 && !aphonere1.test(consigneeInfo.FaxNumber)) {
        ConsigneeFaxSpanRef.current.hidden = false;
        ConsigneeFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        ConsigneeFaxInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.FaxNumber.length > 12 && !aphonere2.test(consigneeInfo.FaxNumber)) {
        ConsigneeFaxSpanRef.current.hidden = false;
        ConsigneeFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        ConsigneeFaxInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.FaxNumber.length < 10 && consigneeInfo.FaxNumber.length != 10) {
        ConsigneeFaxSpanRef.current.hidden = false;
        ConsigneeFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        ConsigneeFaxInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.FaxNumber.length > 0 && consigneeInfo.FaxNumber.length == 10) {
        ConsigneeFaxSpanRef.current.hidden = true;
        ConsigneeFaxSpanRef.current.innerHTML = "";
        ConsigneeFaxInputRef.current.style.borderColor = "";
      }

      if (consigneeInfo.earliestDate == "") {
        ConsigneeEarliestDateSpanRef.current.hidden = false;
        ConsigneeEarliestDateSpanRef.current.innerHTML = "Please select the earliest date";
        ConsigneeEarliestDateInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.earliestDate != "") {
        ConsigneeEarliestDateSpanRef.current.hidden = true;
        ConsigneeEarliestDateSpanRef.current.innerHTML = "";
        ConsigneeEarliestDateInputRef.current.style.borderColor = "";
      }
      if (consigneeInfo.earliestTime.length > 0 &&
        consigneeInfo.earliestTime <= moment(new Date()).format("H:mm") &&
        consigneeInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        ConsigneeEarliestTimeSpanRef.current.hidden = false;
        ConsigneeEarliestTimeSpanRef.current.innerHTML = "Please enter a valid earliest Time";
        ConsigneeEarliestTimeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.earliestTime.length > 0 &&
        consigneeInfo.earliestTime >= moment(new Date()).format("H:mm") &&
        consigneeInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        ConsigneeEarliestTimeSpanRef.current.hidden = true;
        ConsigneeEarliestTimeSpanRef.current.innerHTML = "";
        ConsigneeEarliestTimeInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.earliestTime.length > 0 && consigneeInfo.earliestDate > moment(new Date()).format("YYYY-MM-DD")) {
        ConsigneeEarliestTimeSpanRef.current.hidden = true;
        ConsigneeEarliestTimeSpanRef.current.innerHTML = "";
        ConsigneeEarliestTimeInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.earliestTime.length == 0) {
        ConsigneeEarliestTimeSpanRef.current.hidden = true;
        ConsigneeEarliestTimeSpanRef.current.innerHTML = "";
        ConsigneeEarliestTimeInputRef.current.style.borderColor = "";
      }

      if (ConsigneeNameSpanRef.current.hidden && ConsigneeAddressLineOneSpanRef.current.hidden && ConsigneeCitySpanRef.current.hidden && ConsigneeStateSpanRef.current.hidden &&
        ConsigneeZipCodeSpanRef.current.hidden && ConsigneeCountrySpanRef.current.hidden && ConsigneeEmailSpanRef.current.hidden && ConsigneePhoneSpanRef.current.hidden &&
        ConsigneeFaxSpanRef.current.hidden && ConsigneeEarliestDateSpanRef.current.hidden && ConsigneeEarliestTimeSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        consigneeInfoDivRef.current?.classList.add('show')
        consigneeInfoDownButtonRef.current?.classList.remove('completed');
        consigneeInfoDownButtonRef.current?.classList.remove('collapsed');
        commoditiesDivRef.current?.classList.remove('show')
        commoditiesDownButtonRef.current?.classList.add('collapsed');
        ReviewDivRef.current?.classList.remove('show')
        ReviewDownButtonRef.current?.classList.add('collapsed');

        window.scrollTo(
          {
            top: consigneeInfoAccordionDivRef.current?.offsetTop ?
              consigneeInfoAccordionDivRef.current?.offsetTop - 100 : 0,
            behavior: "smooth"
          })
        IsValid = false
      }
    }
    return IsValid
  }

  /**
  * ConsigeeValidation function return true then
  * close div card of consigee and open div card of commodities
  */
  const ConsigeeInfoContinueClick = () => {
    if (ConsigeeValidation()) {
      consigneeInfoDivRef.current?.classList.remove('show')
      consigneeInfoDownButtonRef.current?.classList.add('completed');
      consigneeInfoDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["consignee"]: true })
      commoditiesDivRef.current?.classList.add('show')
      commoditiesDownButtonRef.current?.classList.remove('completed');
      commoditiesDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["consignee"]: false })
    }
  }

  /**
 * "If the value of the input is empty or matches the regex, then set the value of the input to the
 * value of the input."
 * 
 * That's not very helpful.
 * @param {any} event - any, index: number, type: string
 * @param {number} index - the index of the commodity in the array
 * @param {string} type - string - this is the type of input field.
 */
  const onValueChangecommodities = (event: any, index: number, type: string) => {
    let newCommodities = [...commodities];
    let particularCommodities: any = newCommodities[index];
    switch (type) {
      case "nmfcCode": {
        const rejex = /^[0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          particularCommodities[event.target.name] = event.target.value;
        }
        break;
      }
      case "CheckBox": {
        const rejex = /^[a-zA-Z ]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          particularCommodities[event.target.name] = event.target.checked;
        }
        break;
      }
      case "number": {
        const rejex = /^[0-9]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          particularCommodities[event.target.name] = event.target.value;
        }
        break;
      }
      case "WeightNumber": {
        const rejex = /^[0-9]+$/;
        if (event.target.value == '' || rejex.test(event.target.value) && event.target.value <= 10000) {
          particularCommodities[event.target.name] = event.target.value;
        }
        break;
      }
      case "heightNumber": {
        const rejex = /^[0-9]+$/;
        if (event.target.value == '' || rejex.test(event.target.value) && event.target.value <= 96) {
          particularCommodities[event.target.name] = event.target.value;
        }
        break;
      }
      default: {
        particularCommodities[event.target.name] = event.target.value;
      }
    }

    if (particularCommodities.dimenHeight > 48 && particularCommodities.quantity > 1) {
      particularCommodities.stack = false
    }

    newCommodities[index] = particularCommodities
    Setcommodities(newCommodities);
  }

  /**
   * When the user clicks the button, add a new object to the array of objects.
   */
  const addNewCommodity = () => {

    if (commodities.length == 0) {
      SetWeight(0)
      SetQuantity(0)
    }

    let commodities_Obj = {
      id: uuidv4(),
      description: "",
      nmfc: "",
      class: "",
      stack: false,
      haz: false,
      dimenLength: 0,
      dimenWidth: 0,
      dimenHeight: 0,
      weight: 0,
      quantity: 0,
      type: "",
      cube: 0,
      reviewAcc: false,
      commoditiesAcc: false,
      pcf: 0
    }


    Setcommodities([...commodities, commodities_Obj])
  }

  /**
 * OnBlurCommChange is a function that takes two parameters, event and index, and returns a function
 * that takes no parameters and returns nothing.
 * 
 * The arrow function is a function expression that is assigned to a variable that is a property of an
 * object that is a property of an object.
 * 
 * The arrow function is a function expression that is assigned to a variable that is a property of an
 * object that is a property of an object that is a property of an object.
 * @param {any} event - any, index: number
 * @param {number} index - number - the index of the commodity in the array
 */
  const onBlurCommChange = (event: any, index: number) => {
    let quantity = 0;
    let weight = 0;
    commodities.forEach((data: any) => {
      quantity = quantity + Number(data.quantity)
      weight = weight + Number(data.weight)
    })
    SetQuantity(quantity);
    SetWeight(weight);

    if (weight >= 10000 && ValidationPopup.current != null) {
      ValidationPopup.current.classList.add("show");
      ValidationPopup.current.style.display = "block";
      SetValidationPopupMSG("Weight should not exceed 10,000 lbs")
    }

    let newCommodities = [...commodities];
    let particularCommodities: any = newCommodities[index];
    particularCommodities[event.target.name] = (event.target.value).toUpperCase();
    newCommodities[index] = particularCommodities
    Setcommodities(newCommodities);
  }

  /**
   * OnDeleteClick is a function that takes an index as an argument and returns a new array of
   * commodities that have been filtered to remove the commodity with the id that matches the index
   * argument.
   * @param {any} index - any - the index of the item in the array
   */
  const OnDeleteClick = (index: any) => {
    let weight = 0
    let quantity = 0
    let newCommodities = commodities.filter((val: { id: any; }) => val.id != index)
    newCommodities.forEach((data: any) => {
      weight = weight + Number(data.weight);
      quantity = quantity + Number(data.quantity);
    });
    SetWeight(weight)
    SetQuantity(quantity);
    Setcommodities(newCommodities)
  }

  /**
  * It's a function that validates the input fields of a form. 
  * 
  * The function is called when the user clicks the submit button. 
  * 
  * The function loops through the input fields and checks if they are empty. 
  * 
  * If they are empty, it displays an error message and changes the border color of the input field to
  * red. 
  * 
  * If they are not empty, it hides the error message and changes the border color of the input field to
  * white. 
  * 
  * The function returns true if all the input fields are not empty. 
  * 
  * The function returns false if at least one of the input fields is empty. 
  * 
  * The function is called when the user clicks the submit button. 
  * 
  * If the function returns true, the form is submitted. 
  * 
  * If the function returns false, the form is not submitted.
  * @returns const commoditiesValidation = () => {
  *     let ValidationArray: boolean[] = [];
  *     commodities.forEach((data: any, index: number) => {
  *       const descriptionInput = document.getElementById(`description:`)
  *       const descriptionSpan = document.getElementById(`descriptionSpan:${index
  */
  const commoditiesValidation = () => {
    let ValidationArray: boolean[] = [];
    commodities.forEach((data: any, index: number) => {
      const descriptionInput = document.getElementById(`description:${index}`)
      const descriptionSpan = document.getElementById(`descriptionSpan:${index}`)
      const nmfcInput = document.getElementById(`nmfc:${index}`)
      const nmfcSpan = document.getElementById(`nmfcSpan:${index}`)
      const nmfcSearchSpan = document.getElementById(`nmfcSearchSpan:${index}`)
      const classInput = document.getElementById(`classInput:${index}`)
      const classSpan = document.getElementById(`classSpan:${index}`)
      const dimenLengthInput = document.getElementById(`dimenLengthInput:${index}`)
      const dimenLSpan = document.getElementById(`dimenLSpan:${index}`)
      const dimenLengthSpan = document.getElementById(`dimenLengthSpan:${index}`)
      const dimenWidthInput = document.getElementById(`dimenWidthInput:${index}`)
      const dimenWSpan = document.getElementById(`dimenWSpan:${index}`)
      const dimenWidthSpan = document.getElementById(`dimenWidthSpan:${index}`)
      const dimenHeightInput = document.getElementById(`dimenHeightInput:${index}`)
      const dimenHSpan = document.getElementById(`dimenHSpan:${index}`)
      const dimenHeightSpan = document.getElementById(`dimenHeightSpan:${index}`)
      const weightInput = document.getElementById(`weightInput:${index}`)
      const weightSpan = document.getElementById(`weightSpan:${index}`)
      const quantityInput = document.getElementById(`quantityInput:${index}`)
      const quantitySpan = document.getElementById(`quantitySpan:${index}`)
      const typeInput = document.getElementById(`typeInput:${index}`)
      const typeSpan = document.getElementById(`typeSpan:${index}`)

      if (descriptionSpan != undefined && descriptionInput != undefined &&
        nmfcInput != undefined && nmfcSearchSpan != undefined &&
        classInput != undefined && dimenLengthInput != undefined &&
        dimenLSpan != undefined && dimenWidthInput != undefined &&
        dimenWSpan != undefined && dimenHeightInput != undefined &&
        dimenHSpan != undefined && weightInput != undefined &&
        quantityInput != undefined && typeInput != undefined &&
        nmfcSpan != undefined && classSpan != undefined &&
        dimenLengthSpan != undefined && dimenWidthSpan != undefined &&
        dimenHeightSpan != undefined && weightSpan != undefined &&
        quantitySpan != undefined && typeSpan != undefined) {

        if (data.description == "") {
          descriptionSpan.hidden = false;
          descriptionSpan.innerHTML = `Please enter the description`;
          descriptionInput.style.borderColor = "red"
        }
        else if (data.description != "") {
          descriptionSpan.innerHTML = "";
          descriptionSpan.hidden = true;
          descriptionInput.style.borderColor = ""
        }

        if (data.nmfc == "") {
          nmfcSpan.hidden = false;
          nmfcSpan.innerHTML = `Please enter the NMFC code`;
          nmfcInput.style.borderColor = "red"
          nmfcSearchSpan.style.borderColor = "red"
        }
        else if (data.nmfc != "") {
          nmfcSpan.hidden = true;
          nmfcSpan.innerHTML = "";
          nmfcInput.style.borderColor = ""
          nmfcSearchSpan.style.borderColor = ""
        }


        if (data.class == "") {
          classSpan.hidden = false;
          classSpan.innerHTML = `Please select the class`;
          classInput.style.borderColor = "red"
        }
        else if (data.class != "") {
          classSpan.hidden = true;
          classSpan.innerHTML = "";
          classInput.style.borderColor = ""
        }


        if (data.dimenLength == "") {
          dimenLengthSpan.hidden = false;
          dimenLengthSpan.innerHTML = `Please enter the length`;
          dimenLengthInput.style.borderColor = "red"
          dimenLSpan.style.borderColor = "red"
        }
        else if (data.dimenLength != "") {
          dimenLengthSpan.hidden = true;
          dimenLengthSpan.innerHTML = "";
          dimenLengthInput.style.borderColor = ""
          dimenLSpan.style.borderColor = ""
        }

        if (data.dimenWidth == "") {
          dimenWidthSpan.hidden = false;
          dimenWidthSpan.innerHTML = `Please enter the width`;
          dimenWidthInput.style.borderColor = "red"
          dimenWSpan.style.borderColor = "red"
        }
        else if (data.dimenWidth != "") {
          dimenWidthSpan.hidden = true;
          dimenWidthSpan.innerHTML = "";
          dimenWidthInput.style.borderColor = ""
          dimenWSpan.style.borderColor = ""
        }

        if (data.dimenHeight == "") {
          dimenHeightSpan.hidden = false;
          dimenHeightSpan.innerHTML = `Please enter the height`;
          dimenHeightInput.style.borderColor = "red"
          dimenHSpan.style.borderColor = "red"
        }
        else if (data.dimenHeight != "") {
          dimenHeightSpan.hidden = true;
          dimenHeightSpan.innerHTML = "";
          dimenHeightInput.style.borderColor = ""
          dimenHSpan.style.borderColor = ""
        }

        if (data.weight == "") {
          weightSpan.hidden = false;
          weightSpan.innerHTML = `Please enter the weight`;
          weightInput.style.borderColor = "red"
        }
        else if (data.weight != "") {
          weightSpan.hidden = true;
          weightSpan.innerHTML = "";
          weightInput.style.borderColor = ""
        }

        if (data.quantity == "") {
          quantitySpan.hidden = false;
          quantitySpan.innerHTML = `Please enter the quantity`;
          quantityInput.style.borderColor = "red"
        }
        else if (data.quantity != "") {
          quantitySpan.hidden = true;
          quantitySpan.innerHTML = "";
          quantityInput.style.borderColor = ""
        }

        if (data.type == "") {
          typeSpan.hidden = false;
          typeSpan.innerHTML = `Please enter the type`;
          typeInput.style.borderColor = "red"
        }
        else if (data.type != "") {
          typeSpan.hidden = true;
          typeSpan.innerHTML = "";
          typeInput.style.borderColor = ""
        }


        if (descriptionSpan.hidden && nmfcSpan.hidden && classSpan.hidden && dimenLengthSpan.hidden &&
          dimenWidthSpan.hidden && dimenHeightSpan.hidden && weightSpan.hidden && quantitySpan.hidden && typeSpan.hidden) {
          ValidationArray.push(true)
        }
        else {
          ValidationArray.push(false)
        }
      }



    })

    if (ValidationArray.includes(false)) {
      commoditiesDivRef.current?.classList.add('show')
      commoditiesDownButtonRef.current?.classList.remove('collapsed');
      ReviewDivRef.current?.classList.remove('show')
      ReviewDownButtonRef.current?.classList.add('collapsed');

      window.scrollTo(
        {
          top: commoditiesAccordionDivRef.current?.offsetTop ?
            commoditiesAccordionDivRef.current?.offsetTop - 100 : 0,
          behavior: "smooth"
        })

      return false
    }
    else {
      return true
    }
  }

  /**
   * If the commoditiesValidation function returns true, then remove the show class from the
   * commoditiesDivRef, add the collapsed class to the commoditiesDownButtonRef, add the show class to
   * the ReviewDivRef, and remove the collapsed class from the ReviewDownButtonRef.
   */
  const commoditiesContinueClick = () => {

    if (commoditiesValidation()) {
      commoditiesDivRef.current?.classList.remove('show')
      commoditiesDownButtonRef.current?.classList.add('completed');
      commoditiesDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["commodities"]: true })
      ReviewDivRef.current?.classList.add('show')
      ReviewDownButtonRef.current?.classList.remove('completed');
      ReviewDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["commodities"]: false })
    }
  }

  /**
   * When the user clicks the continue button, the commodities div will be hidden, the commodities down
   * button will be shown, the review div will be shown, and the review down button will be hidden.
   */
  const DisableCommoditiesContinueClick = () => {
    commoditiesDivRef.current?.classList.remove('show')
    commoditiesDownButtonRef.current?.classList.add('collapsed');
    setcompletedCheck({ ...completedCheck, ["commodities"]: true })
    ReviewDivRef.current?.classList.add('show')
    ReviewDownButtonRef.current?.classList.remove('completed');
    ReviewDownButtonRef.current?.classList.remove('collapsed');
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

  /* Creating a list of commodities. */
  const loadcommodities = () => {
    return commodities.map((data: any, index: any) => {
      const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
      const Pcf = data.weight / CubitFeet;
      return (
        <div className="col-12 d-flex mb-5" key={index}>
          <div className='mt-1'>
            <span className="data-label">{index + 1}</span>
          </div>
          <div className="col-10 col-md-12 col-sm-12">
            <div className="row pb-4 border-bottom">
              <div className="col-12">
                <div className="mb-3">
                  <div className="col-sm-12 d-flex justify-content-between">
                    <input type="text" className="form-control cp-form-field ms-2" id={`description:${index}`} maxLength={255} placeholder="Enter Commodity Description" value={data.description} name="description" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} onBlur={(event) => { onBlurCommChange(event, index) }} />
                    <a onClick={() => OnDeleteClick(data.id)}><img src="../Images/commodity-delete-icon.svg" alt="delete icon" className="ps-2 mt-1 delete-icon" /></a>
                  </div>
                  <span className="form-label cp-form-label px-0 ms-2" id={`descriptionSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                </div>
              </div>


              <div className="col-12 col-sm-12 col-md-6 col-lg-5 mb-4">
                <label htmlFor="qutltl-shipinfo-NMFC-commo" className="form-label cp-form-label">NMFC</label>
                <span className="cp-form-mandatory">*</span>
                <div className="input-group">
                  <input type="search" className="form-control search-form-field border-end-0" id={`nmfc:${index}`} maxLength={10} placeholder="Enter NMFC Code" aria-label="Recipient's username" aria-describedby="ql-nmc" value={data.nmfc} name="nmfc" onChange={(event: any) => { onValueChangecommodities(event, index, "nmfcCode") }} />
                  <span className="input-group-text cp-search" id={`nmfcSearchSpan:${index}`}></span>
                </div>
                <span className="form-label cp-form-label px-0 " id={`nmfcSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-5 mb-4">
                <label htmlFor="qutltl-shipinfo-classcommo" className="form-label cp-form-label">Class</label>
                <span className="cp-form-mandatory">*</span>
                <select id={`classInput:${index}`} className="form-select cp-form-field" value={data.class} name="class" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} >
                  <option value={""}>Select Class</option>
                  {classDropDown()}
                </select>
                <span className="form-label cp-form-label px-0 " id={`classSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-2 mb-3 d-flex">
                <div className="mb-3 d-flex">
                  <div className="d-flex flex-column align-items-center margin-align-3">
                    <label className="form-label cp-form-label d-block" htmlFor="qutltl-info-commodities-stackcommo"> Stack </label>
                    <input className="cp-checkbox form-check-input cp-form-field mt-2" type="checkbox" id="qutltl-info-commodities-stackcommo" checked={data.stack} value={data.stack} disabled={data.dimenHeight > 48 && data.quantity > 1 ? true : false} name="stack" onChange={(event: any) => { onValueChangecommodities(event, index, "CheckBox") }} />
                  </div>
                  <div className="ps-5 d-flex flex-column align-items-center margin-align-3">
                    <label className="form-label cp-form-label d-block" htmlFor="qutltl-commodities-haz"> HAZ </label>
                    <input className="cp-checkbox form-check-input cp-form-field mt-2" type="checkbox" id="qutltl-commodities-haz" checked={data.haz} value={data.haz} name="haz" onChange={(event: any) => { onValueChangecommodities(event, index, "CheckBox") }} />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-5">
                <div>
                  <label htmlFor="qutltl-shipinfo-dimensioncommo" className="form-label cp-form-label">Dimensions</label>
                  <span className="cp-form-mandatory">*</span>
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-4 mb-3">
                      <div className="input-group ">
                        <input type="text" className="form-control cp-form-field" id={`dimenLengthInput:${index}`} placeholder="Enter Length" maxLength={3} aria-describedby="ql-dimension-L" value={data.dimenLength == 0 ? "" : data.dimenLength} name="dimenLength" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
                        <span className="input-group-text commodities-input-grp" id={`dimenLSpan:${index}`}>L</span>
                      </div>
                      <span className="form-label cp-form-label px-0 " id={`dimenLengthSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 mb-3">
                      <div className="input-group ">
                        <input type="text" className="form-control cp-form-field" id={`dimenWidthInput:${index}`} aria-describedby="ql-dimension-W" placeholder="Enter Width" maxLength={3} value={data.dimenWidth == 0 ? "" : data.dimenWidth} name="dimenWidth" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
                        <span className="input-group-text commodities-input-grp" id={`dimenWSpan:${index}`}>W</span>
                      </div>
                      <span className="form-label cp-form-label px-0 " id={`dimenWidthSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 mb-3">
                      <div className="input-group">
                        <input type="text" className="form-control cp-form-field" id={`dimenHeightInput:${index}`} aria-describedby="ql-dimension-H" placeholder="Enter Height" maxLength={2} value={data.dimenHeight == 0 ? "" : data.dimenHeight} name="dimenHeight" onChange={(event: any) => { onValueChangecommodities(event, index, "heightNumber") }} />
                        <span className="input-group-text commodities-input-grp" id={`dimenHSpan:${index}`}>H</span>
                      </div>
                      <span className="form-label cp-form-label px-0 " id={`dimenHeightSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-5">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-4 mb-3">

                    <label htmlFor="qutltl-shipinfo-weight-commo" className="form-label cp-form-label">Weight</label>
                    <span className="cp-form-mandatory">*</span>
                    <input type="text" id={`weightInput:${index}`} className="form-control cp-form-field input-group" placeholder="Enter Weight" maxLength={5} value={data.weight == 0 ? "" : data.weight} name="weight" onChange={(event: any) => { onValueChangecommodities(event, index, "WeightNumber") }} onBlur={(event) => { onBlurCommChange(event, index) }} />
                    <span className="form-label cp-form-label px-0 " id={`weightSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 mb-3">

                    <label htmlFor="qutltl-shipinfo-qty-commo" className="form-label cp-form-label">Quantity</label>
                    <span className="cp-form-mandatory">*</span>
                    <input type="text" id={`quantityInput:${index}`} className="form-control cp-form-field input-group" placeholder="Enter Quantity" maxLength={3} value={data.quantity == 0 ? "" : data.quantity} name="quantity" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} onBlur={(event) => { onBlurCommChange(event, index) }} />
                    <span className="form-label cp-form-label px-0 " id={`quantitySpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 mb-3">
                    <label htmlFor="qutltl-shipinfo-typecommo" className="form-label cp-form-label">Type</label>
                    <span className="cp-form-mandatory">*</span>
                    <select id={`typeInput:${index}`} className="form-select cp-form-field" value={data.type} name="type" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} >
                      <option value={""}>Select Type</option>
                      {uomDropDown()}
                    </select>
                    <span className="form-label cp-form-label px-0 " id={`typeSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-2">
                <div className="mb-3 d-flex">
                  <div className="d-flex flex-column margin-align-3 align-items-center">
                    <label className="form-label cp-form-label d-block"> Cube </label>
                    <p className="data-txt mt-2">{CubitFeet == 0 ? '-' : Math.floor(CubitFeet)}</p>
                  </div>
                  <div className="ps-5 d-flex flex-column margin-align-3 align-items-center">
                    <label className="form-label cp-form-label d-block"> PCF </label>
                    <p className="data-txt mt-2">{(Pcf == Infinity || Number.isNaN(Pcf)) ? '-' : Pcf.toFixed(1)}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
    }
    )
  }

  /**
   * If the commodities array is empty, then add the class "show" to the ValidationPopup element and set
   * the display to "block".
   * 
   * If the ReferenceValidation() function returns true, and the shipperValidation() function returns
   * true, and the ConsigeeValidation() function returns true, and the commoditiesValidation() function
   * returns true, then do the following:
   * 
   * Set the commodities property of the CurrentQuoteRequest object to the commodities array.
   * 
   * Set the commodities property of the QuoteBookRequest object to the commodities array.
   * 
   * If the CurrentQuoteId property of the QuoteLtlRequest object is an empty string, then set the
   * BookltlRequest property of the context object to the QuoteBookRequest object, and navigate to the
   * "/quoteltl" route.
   * 
   * Otherwise, do the following:
   * 
   * Create an empty array called commoditiesRequestArray.
   */
  const CreateLoadClick = async () => {
    if (commodities.length == 0 && ValidationPopup.current != null) {
      ValidationPopup.current.classList.add("show");
      ValidationPopup.current.style.display = "block";
      SetValidationPopupMSG("At least one commodity is required")
    }
    else if (Weight >= 10000 && ValidationPopup.current != null) {
      ValidationPopup.current.classList.add("show");
      ValidationPopup.current.style.display = "block";
      SetValidationPopupMSG("Weight should not exceed 10,000 lbs")
    }
    else if (ReferenceValidation() && shipperValidation() && ConsigeeValidation() && commoditiesValidation()) {
      const CurrentQuoteRequest = context.GetQuoteLtlRequest();
      CurrentQuoteRequest.commodities = commodities;
      CurrentQuoteRequest.linearFt = LinearFt;
      context.SetQuoteLtlRequest(CurrentQuoteRequest)

      const QuoteBookRequest: BookRequest = {
        AgentDetails: {
          agentContact: AgentDetails.agentContact,
          agentEmailId: AgentDetails.agentEmailId,
          agentPhone: AgentDetails.agentPhone,
          custaId: AgentDetails.custaId,
          custmId: AgentDetails.custmId
        },
        referenceNumber: {
          customer: referenceNumber.customer,
          poNumber: referenceNumber.poNumber,
          blNumber: referenceNumber.blNumber,
          shippingNumber: referenceNumber.shippingNumber
        },
        shipperInfo: {
          shipper: shipperInfo.shipper,
          name: shipperInfo.name,
          addressline1: shipperInfo.addressline1,
          addressline2: shipperInfo.addressline2,
          city: shipperInfo.city,
          state: shipperInfo.state,
          zipCode: shipperInfo.zipCode,
          country: shipperInfo.country,
          contactName: shipperInfo.contactName,
          EmailAddress: shipperInfo.EmailAddress,
          PhoneNumber: shipperInfo.PhoneNumber,
          FaxNumber: shipperInfo.FaxNumber,
          loadNotes: shipperInfo.loadNotes,
          earliestDate: shipperInfo.earliestDate,
          earliestTime: shipperInfo.earliestTime,
          latestDate: shipperInfo.latestDate,
          latestTime: shipperInfo.latestTime,
        },
        consigneeInfo: {
          consignee: consigneeInfo.consignee,
          name: consigneeInfo.name,
          addressline1: consigneeInfo.addressline1,
          addressline2: consigneeInfo.addressline2,
          city: consigneeInfo.city,
          state: consigneeInfo.state,
          zipCode: consigneeInfo.zipCode,
          country: consigneeInfo.country,
          contactName: consigneeInfo.contactName,
          EmailAddress: consigneeInfo.EmailAddress,
          PhoneNumber: consigneeInfo.PhoneNumber,
          FaxNumber: consigneeInfo.FaxNumber,
          loadNotes: consigneeInfo.loadNotes,
          earliestDate: consigneeInfo.earliestDate,
          earliestTime: consigneeInfo.earliestTime,
          latestDate: consigneeInfo.latestDate,
          latestTime: consigneeInfo.latestTime,
        },
        BooktoQuote: true,
        LinearFt: LinearFt
      }


      if (QuoteLtlRequest.CurrentQuoteId == "") {
        const CurrentQuoteRequest = context.GetQuoteLtlRequest();
        CurrentQuoteRequest.shipInfo.customer = referenceNumber.customer
        context.SetQuoteLtlRequest(CurrentQuoteRequest)
        context.SetBookltlRequest(QuoteBookRequest)
        navigate("/quoteltl")
      }
      else {
        setLoader(true)
        const commoditiesRequestArray: any = [];
        commodities.forEach((data: any) => {
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
          LoadId: CurrentQuote.loadId,
          QuoteId: CurrentQuote.quoteId,
          PoNumber: referenceNumber.poNumber,
          BlNumber: referenceNumber.blNumber,
          ShippingNumber: referenceNumber.shippingNumber,
          Agent: {
            Name: AgentDetails.agentContact,
            Email: AgentDetails.agentEmailId
          },
          ShipperDetails: {
            ShipName: shipperInfo.name,
            ShipAddress1: shipperInfo.addressline1,
            ShipAddress2: shipperInfo.addressline2,
            ShipCity: shipperInfo.city,
            ShipState: shipperInfo.state,
            ShipZipCode: shipperInfo.zipCode,
            ShipCountry: shipperInfo.country,
            ShipContactName: shipperInfo.contactName,
            ShipEmail: shipperInfo.EmailAddress,
            ShipPhone: shipperInfo.PhoneNumber,
            ShipFax: shipperInfo.FaxNumber,
            ShipLoadNotes: shipperInfo.loadNotes,
            ShipEarliestDate: shipperInfo.earliestDate,
            ShipLatestDate: shipperInfo.latestDate,
            ShipEarliestTime: shipperInfo.earliestTime,
            ShipLatestTime: shipperInfo.latestTime
          },
          ConsigneeDetails: {
            ConsName: consigneeInfo.name,
            ConsAddress1: consigneeInfo.addressline1,
            ConsAddress2: consigneeInfo.addressline2,
            ConsCity: consigneeInfo.city,
            ConsState: consigneeInfo.state,
            ConsZipCode: consigneeInfo.zipCode,
            ConsCountry: consigneeInfo.country,
            ConsContactName: consigneeInfo.contactName,
            ConsEmail: consigneeInfo.EmailAddress,
            ConsPhone: consigneeInfo.PhoneNumber,
            ConsFax: consigneeInfo.FaxNumber,
            ConsLoadNotes: consigneeInfo.loadNotes,
            ConsEarliestDate: consigneeInfo.earliestDate,
            ConsLatestDate: consigneeInfo.latestDate,
            ConsEarliestTime: consigneeInfo.earliestTime,
            ConsLatestTime: consigneeInfo.latestTime
          },
          commodities: {
            commodities: commoditiesRequestArray,
            LinearFt: LinearFt
          }
        }

        const response: any = await CreateBookLtl(BookRequest, referenceNumber.customer, localStorage.getItem('userId'))

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
    }
  }

  /**
   * When the user clicks on a button, toggle the class of the button and the row below it.
   * @param {any} index - the index of the commodity in the array
   * @param {any} value - any = {
   */
  const onCommodityButtonClick = (index: any, value: any) => {
    let newCommodities = [...commodities];
    let particularCommodities: any = newCommodities[index];
    const commodityButton = document.getElementById(`QuoteCommodityButton:${index}`)
    const commodityTableRow = document.getElementById(`QuoteCommodityTableRow:${index}`)
    if (commodityTableRow != undefined && commodityButton != undefined) {
      if (value.commoditiesAcc) {
        commodityButton.classList.add('collapsed');
        commodityTableRow.classList.remove('show');
        particularCommodities.commoditiesAcc = false;
      }
      else {
        commodityButton.classList.remove('collapsed');
        commodityTableRow.classList.add('show');
        particularCommodities.commoditiesAcc = true;
      }
    }
    newCommodities[index] = particularCommodities
    Setcommodities(newCommodities);
  }

  /**
   * map over an array of objects and return a table row with a button and a table row in commodity content card with
   * a collapsible div. 
   * 
   * @returns A function that returns a table row with a button and a table row with a collapsible div.
   */
  const QuoteCommodityContent = () => {
    return commodities.map((data: any, index: number) => {
      const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
      const Pcf = data.weight / CubitFeet;
      return (
        <>
          <tr>
            <td>
              <button id={`QuoteCommodityButton:${index}`} className="cp-tbl-acc-button tbl-acc-btn collapsed"
                type="button" data-bs-toggle="collapse" data-bs-target="#quote-commodity" aria-expanded="true"
                aria-controls="quote-commodity" onClick={() => { onCommodityButtonClick(index, data) }} />
            </td>
            <td>Commodity {index + 1}</td>
            <td>{data.haz ? "Yes" : "No"}</td>
            <td>{data.quantity}</td>
            <td>{data.weight}</td>
            <td>
              {/* <span className="density-icon mt-1 me-1">D</span> */}
              <div><span hidden={data.dIcon} className="density-icon me-2">D</span>{data.description}</div>
            </td>
          </tr>
          <tr id={`QuoteCommodityTableRow:${index}`} className="accordion-collapse table-parent-accordion collapse bg-white">
            <td colSpan={8} className=" p-4">
              <div className="row">
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">NMFC</h5>
                  <p className="data-txt mb-0">{data.nmfc}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Class</h5>
                  <p className="data-txt mb-0">{data.class}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Stack</h5>
                  <p className="data-txt mb-0">{data.stack ? "Yes" : "No"}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Type</h5>
                  <p className="data-txt mb-0">{data.type}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Dimensions</h5>
                  <p className="data-txt mb-0"><span>{data.dimenLength}L</span> * <span>{data.dimenWidth}W</span> * <span>{data.dimenHeight}H</span></p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">Cube</h5>
                  <p className="data-txt mb-0">{CubitFeet == 0 ? '??' : Math.floor(CubitFeet)}</p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">PCF</h5>
                  <p className="data-txt mb-0">{(Pcf == Infinity || Number.isNaN(Pcf)) ? '??' : Pcf.toFixed(1)}</p>
                </div>

              </div>
            </td>
          </tr>
        </>
      )
    })
  }


  /**
   * If the commodityTableRow and commodityButton are not undefined, then if the value.reviewAcc is true,
   * then add the class collapsed to the commodityButton and remove the class show from the
   * commodityTableRow, and set the particularCommodities.reviewAcc to false. Otherwise, remove the class
   * collapsed from the commodityButton and add the class show to the commodityTableRow, and set the
   * particularCommodities.reviewAcc to true.
   * @param {any} index - the index of the commodity in the commodities array
   * @param {any} value - {
   */
  const onReviewCommodityButtonClick = (index: any, value: any) => {
    let newCommodities = [...commodities];
    let particularCommodities: any = newCommodities[index];
    const commodityButton = document.getElementById(`reviewCommodityButton:${index}`)
    const commodityTableRow = document.getElementById(`reviewCommodityTableRow:${index}`)

    if (commodityTableRow != undefined && commodityButton != undefined) {
      if (value.reviewAcc) {
        commodityButton.classList.add('collapsed');
        commodityTableRow.classList.remove('show');
        particularCommodities.reviewAcc = false;
      }
      else {
        commodityButton.classList.remove('collapsed');
        commodityTableRow.classList.add('show');
        particularCommodities.reviewAcc = true;
      }
    }
    newCommodities[index] = particularCommodities
    Setcommodities(newCommodities);
  }


  /**
   * map over an array of objects and return a table row with a button and a table row in review content card with
   * a collapsible div. 
   * 
   * @returns A list of tr elements.
   */
  const QuoteReviewCommodityContent = () => {
    return commodities.map((data: any, index: number) => {
      const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
      const Pcf = data.weight / CubitFeet;
      return (
        <>
          <tr>
            <td>
              <button id={`reviewCommodityButton:${index}`} className="cp-tbl-acc-button tbl-acc-btn collapsed"
                type="button" data-bs-toggle="collapse" data-bs-target="#quote-commodity" aria-expanded="true"
                aria-controls="quote-commodity" onClick={() => { onReviewCommodityButtonClick(index, data) }} />
            </td>
            <td>Commodity {index + 1}</td>
            <td>{data.haz ? "Yes" : "No"}</td>
            <td>{data.quantity == "" ? "-" : data.quantity}</td>
            <td>{data.weight == "" ? "-" : data.weight}</td>
            <td>
              {/* <span className="density-icon mt-1 me-1">D</span> */}
              <div><span hidden={data.dIcon} className="density-icon me-2">D</span>{data.description == "" ? "-" : data.description}</div>
            </td>
          </tr>
          <tr id={`reviewCommodityTableRow:${index}`} className="accordion-collapse table-parent-accordion collapse bg-white">
            <td colSpan={8} className=" p-4">
              <div className="row">
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">NMFC</h5>
                  <p className="data-txt mb-0">

                    {data.nmfc == "" ? `-` : data.nmfc}
                  </p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Class</h5>
                  <p className="data-txt mb-0">
                    {data.class == "" ? `-` : data.class}
                  </p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Stack</h5>
                  <p className="data-txt mb-0">{data.stack ? "Yes" : "No"}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Type</h5>
                  <p className="data-txt mb-0">
                    {data.type == "" ? `-` : data.type}
                  </p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Dimensions</h5>
                  <p className="data-txt mb-0">
                    {data.dimenLength == "" && data.dimenWidth == "" && data.dimenHeight == "" ?
                      `-`
                      :
                      <><span>{data.dimenLength}L</span> * <span>{data.dimenWidth}W</span> * <span>{data.dimenHeight}H</span></>
                    }
                  </p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">Cube</h5>
                  <p className="data-txt mb-0">{CubitFeet == 0 ? '-' : Math.floor(CubitFeet)}</p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">PCF</h5>
                  <p className="data-txt mb-0">{(Pcf == Infinity || Number.isNaN(Pcf)) ? '-' : Pcf.toFixed(1)}</p>
                </div>

              </div>
            </td>
          </tr>
        </>
      )
    })
  }

  const onCancelClick = () => {
    setAgentDetails({
      ...AgentDetails,
      ["agentContact"]: "",
      ["agentEmailId"]: "",
      ["agentPhone"]: ""
    })
    setreferenceNumber({
      ...referenceNumber,
      ["customer"]: "",
      ["poNumber"]: "",
      ["blNumber"]: "",
      ["shippingNumber"]: ""
    })
    setshipperInfo({
      ...shipperInfo,
      ["shipper"]: "",
      ["name"]: "",
      ["addressline1"]: "",
      ["addressline2"]: "",
      ["city"]: "",
      ["state"]: "",
      ["zipCode"]: "",
      ["country"]: "",
      ["contactName"]: "",
      ["EmailAddress"]: "",
      ["PhoneNumber"]: "",
      ["FaxNumber"]: "",
      ["loadNotes"]: "",
      ["earliestDate"]: "",
      ["earliestTime"]: "",
      ["latestDate"]: "",
      ["latestTime"]: "",
    })
    setconsigneeInfo({
      ...consigneeInfo,
      ["consignee"]: "",
      ["name"]: "",
      ["addressline1"]: "",
      ["addressline2"]: "",
      ["city"]: "",
      ["state"]: "",
      ["zipCode"]: "",
      ["country"]: "",
      ["contactName"]: "",
      ["EmailAddress"]: "",
      ["PhoneNumber"]: "",
      ["FaxNumber"]: "",
      ["loadNotes"]: "",
      ["earliestDate"]: "",
      ["earliestTime"]: "",
      ["latestDate"]: "",
      ["latestTime"]: "",
    })
    context.resetContext()
  }

  const onShipperVerifyAddress = async () => {
    let verifyRequest = {
      Street: shipperInfo.addressline1,
      City: shipperInfo.city,
      State: shipperInfo.state,
      Zipcode: shipperInfo.zipCode
    }
    const response: any = await VerifyAddress(verifyRequest)

    if (response.status == 200) {
      let shipperdata = response.data[0].components;

      setshipperInfo({
        ...shipperInfo,
        ["addressline1"]: response.data[0].delivery_line_1,
        ["zipCode"]: shipperdata.zipcode,
        ["city"]: shipperdata.default_city_name,
        ["state"]: shipperdata.state_abbreviation,
      })
    }
    else if (response.status == 400) {
      if (VerifyPopup.current != null) {
        VerifyPopup.current.classList.add("show");
        VerifyPopup.current.style.display = "block";
        setVerifyPopupMSG("YOU ENTERED AN UNKNOWN SHIPPER ADDRESS")
        setVerifyAddressPopupMSG(shipperInfo.addressline1 + " " + shipperInfo.city + " " + shipperInfo.state + " " + shipperInfo.zipCode)
      }
    }
    else {
      if (someThingWentWrongPopup.current != null) {
        someThingWentWrongPopup.current.classList.add("show");
        someThingWentWrongPopup.current.style.display = "block";
      }
    }
  }

  const onConsigneeVerifyAddress = async () => {
    let verifyRequest = {
      Street: consigneeInfo.addressline1,
      City: consigneeInfo.city,
      State: consigneeInfo.state,
      Zipcode: consigneeInfo.zipCode
    }
    const response: any = await VerifyAddress(verifyRequest)

    if (response.status == 200) {
      let shipperdata = response.data[0].components;

      setconsigneeInfo({
        ...consigneeInfo,
        ["addressline1"]: response.data[0].delivery_line_1,
        ["zipCode"]: shipperdata.zipcode,
        ["city"]: shipperdata.default_city_name,
        ["state"]: shipperdata.state_abbreviation,
      })
    }
    else if (response.status == 400) {
      if (VerifyPopup.current != null) {
        VerifyPopup.current.classList.add("show");
        VerifyPopup.current.style.display = "block";
        setVerifyPopupMSG("YOU ENTERED AN UNKNOWN CONSIGNEE ADDRESS")
        setVerifyAddressPopupMSG(consigneeInfo.addressline1 + " " + consigneeInfo.city + " " + consigneeInfo.state + " " + consigneeInfo.zipCode)
      }
    }
    else {
      if (someThingWentWrongPopup.current != null) {
        someThingWentWrongPopup.current.classList.add("show");
        someThingWentWrongPopup.current.style.display = "block";
      }
    }
  }

  /**
   * OnclickContinue() is a function that removes the class "show" from the div with the id "verifyPopup" and
   * sets the display property to "none".
   */
  const OnclickContinue = () => {
    if (VerifyPopup.current != null) {
      VerifyPopup.current.classList.remove("show");
      VerifyPopup.current.style.display = "none";
    }
  }

  const onVerifyCancelClick = () => {
    if (VerifyPopup.current != null) {
      VerifyPopup.current.classList.remove("show");
      VerifyPopup.current.style.display = "none";
    }
  }
  const someThingWentWrongOkClick = () => {
    if (someThingWentWrongPopup.current != null) {
      someThingWentWrongPopup.current.classList.remove("show");
      someThingWentWrongPopup.current.style.display = "none";
    }
  }

  const noContentOkClick = () => {
    if (noContentPopup.current != null) {
      noContentPopup.current.classList.remove("show");
      noContentPopup.current.style.display = "none";
    }
  }

  const accordionHideShow = (btnElement: any, divElement: any) => {
    if (btnElement.current?.classList.contains('collapsed')) {
      divElement.current?.classList.add('show');
      btnElement.current?.classList.remove('collapsed');
    }
    else {
      divElement.current?.classList.remove('show');
      btnElement.current?.classList.add('collapsed');
    }
  }

  return (
    <div className="mb-5">
      <div className="row">
        <div className="col-md-12 my-3">
          <ul className="breadcrumb mb-0">
            {QuoteLtlRequest.CurrentQuoteId != 0 ? <><li><a className="cursor" onClick={() => { navigate("/loadsearch"); }}>All Loads</a></li><li><a className="cursor" onClick={() => { navigate("/quoteltl-choose-carrier"); }}>Quote LTL</a></li></> :
              <li><a className="cursor" onClick={() => { navigate("/loadsearch") }}>All Loads</a></li>
            }
            <li className="pe-2">Book LTL</li>
          </ul>
        </div>
        {QuoteLtlRequest.CurrentQuoteId != 0 ? <div className="col-md-12 my-3">
          <ul className="qut-custom-stepper ps-0">
            <li className="qut-stepper-count completed ">
              <span className="qut-shipperinfo-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Information</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Shipping Information</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Shipping Information</span>
            </li>
            <li className="qut-stepper-count qut-stepper-2 completed">
              <span className="qut-choosecarrier-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Carrier</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Choose Carrier</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Choose Your Carrier</span>
            </li>
            <li className="qut-stepper-count qut-stepper-3 active">
              <span className="qut-shipmentdetail-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Shipment</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Shipment Details</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Shipment Details</span>
            </li>
          </ul>
        </div>
          :
          <div className="col-md-12 my-3">
            <ul className="custom-stepper ps-0">
              <li className="stepper-count active">
                <span className="bookltl-shipmentdetail-stepper-icon" />
                {/* <span class="font-15 text-medium text-black wizard-text-padd">Define</span> */}
                <span className="d-block d-md-none mt-3 stepper-text">Shipment</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Shipment Details</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Shipment Details</span>
              </li>
              <li className="stepper-count stepper-2 ">
                <span className="bookltl-shipperinfo-stepper-icon" />
                <span className="d-block d-md-none mt-3 stepper-text">Information</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Shipping Information</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Shipping Information</span>
              </li>
              <li className="stepper-count stepper-3">
                <span className="bookltl-choosecarrier-stepper-icon" />
                <span className="d-block d-md-none mt-3 stepper-text">Carrier</span>
                <span className="d-none d-md-inline d-xl-none stepper-text ms-2">Choose Carrier</span>
                <span className="d-none d-xl-inline ms-2 stepper-text">Choose Your Carrier</span>
              </li>
            </ul>
          </div>}

      </div>
      <div className="row">
        {/* Quote to Book LTL Primary Section Starts Here */}
        <div className="accordion" id="book-ltl-primary-info">
          <div className="accordion-item cp-accordion-brd-radius border-0">
            {/* <h2 className="accordion-header" id="book-primary-info">
              <button id="btn" className="accordion-button ctl-header-accordion page-header-txt btn cp-accordion-brd-radius shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#book-primary-details" aria-expanded="false" aria-controls="book-primary-details">
                Shipment Quote
                <span className="primary-info-accordion d-md-block d-none" id="values">Hide Details</span>
              </button>
            </h2> */}
            <h2 className="accordion-header position-relative d-flex align-items-center p-3" id="book-primary-info">
              <p id="btn" className="page-header-txt mb-0">Shipment Quote</p>
              <button className="ms-auto ctl-header-accordion primary-info-accordion ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#book-primary-details" aria-expanded="false" aria-controls="book-primary-details"><span className="ms-3">Hide Details</span></button>
            </h2>
            <div id="book-primary-details" className="accordion-collapse collapse show" aria-labelledby="book-primary-info" data-bs-parent="#book-ltl-primary-info">
              <div className="accordion-body ">
                <div className="row justify-content-between">
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Carrier : <span className="data-txt">{CurrentQuote.carrierName == "" ? `-` : CurrentQuote.carrierName}</span></p>
                  </div>
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Flat Rate : <span className="data-txt">${CurrentQuote.flatPrice == "" ? `0.00` : CurrentQuote.flatPrice}</span></p>
                  </div>
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Total : <span className="data-txt">${CurrentQuote.totalPrice == "" ? `0.00` : CurrentQuote.totalPrice}</span></p>
                  </div>
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Contact : <span className="data-txt">{AgentDetails.agentContact == "" ? `-` : AgentDetails.agentContact}</span></p>
                  </div>
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Email ID :
                      {AgentDetails.agentEmailId == ""
                        ?
                        <span className="data-txt underLine-remover"> -</span>
                        : <a href={`mailto:${AgentDetails.agentEmailId}`} className="cp-link">{AgentDetails.agentEmailId}</a>
                      }
                    </p>
                  </div>
                  <div className="col-sm-12 my-2 col-md-6 col-lg-4">
                    <p className="data-label">Phone : <span className="data-txt">{AgentDetails.agentPhone == "" ? `-` : AgentDetails.agentPhone}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quote to Book LTL Primary Section Ends Here */}
        {/* Quote to Book LTL Accordion Section Starts Here */}
        <div className="accordion" id="quote-to-book-accordion">
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={ReferenceNumAccordionDivRef}>
            <h2 className="accordion-header py-1" id="qotto-book-reference-info">
              <button onClick={() => accordionHideShow(ReferenceNumDownButtonRef, ReferenceNumDivRef)} ref={ReferenceNumDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button" data-bs-toggle="collapse">
                <span className="ms-3"> Reference Numbers </span>
              </button>
              {completedCheck.reference ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={ReferenceNumDivRef} id="qotto-book-reference-number" className="accordion-collapse collapse" aria-labelledby="qotto-book-reference-info">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-4">
                      <label htmlFor="qotto-book-ref-po-number" className="form-label cp-form-label">Customer<span className="cp-form-mandatory"> *</span></label>
                      <select id="qotto-book-shipper" disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-select cp-form-field" ref={CustomerSelectRef} name="customer" value={referenceNumber.customer} onChange={(event: any) => { onReferenceValueChange(event, "Customer") }}>
                        <option value={""} disabled={true}>Select Customer</option>
                        {customerDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0 ms-2" ref={CustomerSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-ref-po-number" className="form-label cp-form-label">P.O.Number</label>
                      <input type="text" className="form-control cp-form-field" name="poNumber" value={referenceNumber.poNumber} id="qotto-book-ref-po-number" placeholder="Enter P.O.Number" onChange={(event: any) => { onReferenceValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-ref-b/l-number" className="form-label cp-form-label">B/L Number</label>
                      <input type="text" className="form-control cp-form-field" name="blNumber" value={referenceNumber.blNumber} id="qotto-book-ref-b/l-number" placeholder="Enter B/L Number" onChange={(event: any) => { onReferenceValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipping-number" className="form-label cp-form-label">Shipping Number</label>
                      <input type="text" className="form-control cp-form-field" name="shippingNumber" value={referenceNumber.shippingNumber} id="qotto-book-shipping-number" placeholder="Enter Shipping Number" onChange={(event: any) => { onReferenceValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn cp-btn-primary my-4" onClick={() => { onReferenceContinueClick() }}>Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={ShipperInfoAccordionDivRef}>
            <h2 className="accordion-header py-1" id="qotto-book-shipper-information">
              <button onClick={() => accordionHideShow(ShipperInfoDownButtonRef, ShipperInfoDivRef)} ref={ShipperInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button">
                <span className="ms-3"> Shipper Information </span>
              </button>
              {completedCheck.Shipper ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={ShipperInfoDivRef} id="qotto-book-shipper-info" className="accordion-collapse collapse" aria-labelledby="qotto-book-shipper-information">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper" className="form-label cp-form-label">Shipper
                      </label>
                      <select id="qotto-book-shipper" disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-select cp-form-field" name='shipper' value={shipperInfo.shipper} onChange={(event: any) => { onShipperValueChange(event, "shipper") }}>
                        <option disabled={true} value={""}>Select a Shipper</option>
                        {shipperDropDown()}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-name" className="form-label cp-form-label">Name<span className="cp-form-mandatory"> *</span></label>
                      <input type="text" maxLength={255} ref={shipNameInputRef} className="form-control cp-form-field" id="qotto-book-shipper-name" placeholder="Enter Shipper Name" name='name' value={shipperInfo.name} onChange={(event: any) => { onShipperValueChange(event, "Name") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={shipNameSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-address1" className="form-label cp-form-label">Address Line 1<span className="cp-form-mandatory"> *</span></label>
                      <input type="text" maxLength={255} ref={shipAddressLineOneInputRef} className="form-control cp-form-field" id="qotto-book-shipper-address1" placeholder="Enter Address Line 1" name='addressline1' value={shipperInfo.addressline1} onChange={(event: any) => { onShipperValueChange(event, "") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={shipAddressLineOneSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-address2" className="form-label cp-form-label">Address Line 2</label>
                      <input type="text" maxLength={255} className="form-control cp-form-field" id="qotto-book-shipper-address2" placeholder="Enter Address Line 2" name='addressline2' value={shipperInfo.addressline2} onChange={(event: any) => { onShipperValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-shipper-city" className="form-label cp-form-label">City<span className="cp-form-mandatory"> *</span></label>
                        <input type="text" maxLength={60} ref={shipCityInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-control cp-form-field" id="qotto-book-shipper-city" placeholder="Enter City" name="city" value={shipperInfo.city} onChange={(event: any) => { onShipperValueChange(event, "Text") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipCitySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-shipper-state" className="form-label cp-form-label">State<span className="cp-form-mandatory"> *</span></label>
                        <select id="qotto-book-shipper-state" ref={shipStateInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-select cp-form-field" name="state" value={shipperInfo.state} onChange={(event: any) => { onShipperValueChange(event, "Text") }}>
                          <option value={""} disabled={true}>Select State</option>
                          {stateDropDown()}
                        </select>
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipStateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-zipcode" className="form-label cp-form-label">Zip Code<span className="cp-form-mandatory"> *</span></label>
                        <input type="text" maxLength={7} ref={shipZipCodeInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-control cp-form-field" id="qotto-book-shipper-zipcode" placeholder="Enter Zip Code" name='zipCode' value={shipperInfo.zipCode} onChange={(event: any) => { onShipperValueChange(event, "Zip") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipZipCodeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-country" className="form-label cp-form-label">Country<span className="cp-form-mandatory"> *</span></label>
                        <select id="qotto-book-shipper-country" ref={shipCountryInputRef} className="form-select cp-form-field" name='country' value={shipperInfo.country} onChange={(event: any) => { onShipperValueChange(event, "") }}>
                          <option value={""} disabled={true}>Select Country</option>
                          {countryDropDown()}
                        </select>
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipCountrySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="btn cp-btn-primary my-4" title="verify-address" onClick={() => { onShipperVerifyAddress() }}>Verify Address</button>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-contactname" className="form-label cp-form-label">Contact Name</label>
                      <input type="text" maxLength={255} value={shipperInfo.contactName} name="contactName" className="form-control cp-form-field" id="qotto-book-shipper-contactname" placeholder="Enter Contact Name" onChange={(event: any) => { onShipperValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-email" className="form-label cp-form-label">Email Address</label>
                      <input type="text" maxLength={125} value={shipperInfo.EmailAddress} ref={shipEmailInputRef} name="EmailAddress" className="form-control cp-form-field" id="qotto-book-shipper-email" placeholder="Enter Email Address" onChange={(event: any) => { onShipperValueChange(event, "") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={shipEmailSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-phone#" className="form-label cp-form-label">Phone Number</label>
                        <input type="text" ref={shipPhoneInputRef} maxLength={10} value={shipperInfo.PhoneNumber} name="PhoneNumber" className="form-control cp-form-field" id="qotto-book-shipper-phone#" placeholder="Enter Phone Number" onChange={(event: any) => { onShipperValueChange(event, "number") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipPhoneSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-fax#" className="form-label cp-form-label">Fax Number</label>
                        <input type="text" ref={shipFaxInputRef} maxLength={10} value={shipperInfo.FaxNumber} name="FaxNumber" className="form-control cp-form-field" id="qotto-book-shipper-fax#" placeholder="Enter Fax Number" onChange={(event: any) => { onShipperValueChange(event, "number") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipFaxSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                    <label htmlFor="qotto-book-shipper-loadnotes" className="form-label cp-form-label">Load Notes</label>
                    <textarea value={shipperInfo.loadNotes} maxLength={255} name="loadNotes" className="form-control cp-form-field cp-textarea" rows={6} id="qotto-book-shipper-loadnotes" placeholder="Enter Load Notes" onChange={(event: any) => { onShipperValueChange(event, "") }} />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-earliestdate" className="form-label cp-form-label">Earliest Date<span className="cp-form-mandatory"> *</span></label>
                        <input type="date" min={moment().subtract(0, 'day').format('YYYY-MM-DD')} className="form-control cp-form-field" ref={shipEarliestDateInputRef} id="qotto-book-shipper-earliestdate" value={shipperInfo.earliestDate} name="earliestDate" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onShipperValueChange(event, "earliestDate") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipEarliestDateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-earliesttime" className="form-label cp-form-label">Earliest Time</label>
                        <input type="time" className="form-control cp-form-field" ref={shipEarliestTimeInputRef} id="qotto-book-shipper-earliesttime" value={shipperInfo.earliestTime} name="earliestTime" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onShipperValueChange(event, "") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipEarliestTimeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-latestdate" className="form-label cp-form-label">Latest Date</label>
                        <input type="date" min={moment(new Date(shipperInfo.earliestDate)).format('YYYY-MM-DD')} className="form-control cp-form-field" id="qotto-book-shipper-latestdate" value={shipperInfo.latestDate} onKeyDown={(e) => e.preventDefault()} name="latestDate" onChange={(event: any) => { onShipperValueChange(event, "") }} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-latesttime" className="form-label cp-form-label">Latest Time</label>
                        <input type="time" className="form-control cp-form-field" id="qotto-book-shipper-latesttime" value={shipperInfo.latestTime} name="latestTime" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onShipperValueChange(event, "") }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn cp-btn-primary my-4" title="Continue" onClick={() => { shipperInfoContiueClick() }}>Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={consigneeInfoAccordionDivRef}>
            <h2 className="accordion-header py-1" id="qotto-book-consignee-information">
              <button onClick={() => accordionHideShow(consigneeInfoDownButtonRef, consigneeInfoDivRef)} ref={consigneeInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button">
                <span className="ms-3"> Consignee Information </span>
              </button>
              {completedCheck.consignee ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={consigneeInfoDivRef} id="qotto-book-consignee-info" className="accordion-collapse collapse" aria-labelledby="qotto-book-consignee-information">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee" className="form-label cp-form-label">Consignee
                      </label>
                      <select id="qotto-book-consignee" disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-select cp-form-field" value={consigneeInfo.consignee} name="consignee" onChange={(event: any) => { onConsigneeValueChange(event, "consignee") }}>
                        <option disabled={true} value={""}>Select a Consignee</option>
                        {consigneeDropDown()}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-name" className="form-label cp-form-label">Name<span className="cp-form-mandatory"> *</span></label>
                      <input type="text" ref={ConsigneeNameInputRef} maxLength={255} className="form-control cp-form-field" id="qotto-book-consignee-name" placeholder="Enter Consignee Name" name='name' value={consigneeInfo.name} onChange={(event: any) => { onConsigneeValueChange(event, "Name") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeNameSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-address1" className="form-label cp-form-label">Address Line 1<span className="cp-form-mandatory">*</span></label>
                      <input type="text" ref={ConsigneeAddressLineOneInputRef} maxLength={255} className="form-control cp-form-field" id="qotto-book-consignee-address1" placeholder="Enter Address Line 1" name='addressline1' value={consigneeInfo.addressline1} onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeAddressLineOneSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-address2" className="form-label cp-form-label">Address Line 2</label>
                      <input type="text" maxLength={255} className="form-control cp-form-field" id="qotto-book-consignee-address2" placeholder="Enter Address Line 2" name='addressline2' value={consigneeInfo.addressline2} onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-consignee-city" className="form-label cp-form-label">City<span className="cp-form-mandatory"> *</span></label>
                        <input type="text" maxLength={60} ref={ConsigneeCityInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-control cp-form-field" id="qotto-book-consignee-city" name='city' value={consigneeInfo.city} placeholder="Enter City" onChange={(event: any) => { onConsigneeValueChange(event, "Text") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeCitySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-consignee-state" className="form-label cp-form-label">State<span className="cp-form-mandatory"> *</span></label>
                        <select id="qotto-book-consignee-state" ref={ConsigneeStateInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="form-select cp-form-field" name='state' value={consigneeInfo.state} onChange={(event: any) => { onConsigneeValueChange(event, "") }}>
                          <option value={""} disabled={true}>Select State</option>
                          {stateDropDown()}
                        </select>
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeStateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-zip-code" className="form-label cp-form-label">Zip Code<span className="cp-form-mandatory"> *</span></label>
                        <input type="text" maxLength={7} ref={ConsigneeZipCodeInputRef} disabled={QuoteLtlRequest.CurrentQuoteId != 0} value={consigneeInfo.zipCode} name='zipCode' className="form-control cp-form-field" id="qotto-book-consignee-zip-code" placeholder="Enter Zip Code" onChange={(event: any) => { onConsigneeValueChange(event, "Zip") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeZipCodeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="ctl-consignee-country" className="form-label cp-form-label">Country<span className="cp-form-mandatory"> *</span></label>
                        <select id="ctl-consignee-country" ref={ConsigneeCountryInputRef} value={consigneeInfo.country} name='country' className="form-select cp-form-field" onChange={(event: any) => { onConsigneeValueChange(event, "") }}>
                          <option value={""} disabled={true}>Select Country</option>
                          {countryDropDown()}
                        </select>
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeCountrySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" disabled={QuoteLtlRequest.CurrentQuoteId != 0} className="btn cp-btn-primary my-4" onClick={() => { onConsigneeVerifyAddress() }}>Verify Address</button>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-contactname" className="form-label cp-form-label">Contact Name</label>
                      <input type="text" maxLength={255} className="form-control cp-form-field" value={consigneeInfo.contactName} name='contactName' id="qotto-book-consignee-contactname" placeholder="Enter Contact Name" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-email" className="form-label cp-form-label">Email Address</label>
                      <input type="text" maxLength={125} ref={ConsigneeEmailInputRef} value={consigneeInfo.EmailAddress} name='EmailAddress' className="form-control cp-form-field" id="qotto-book-consignee-email" placeholder="Enter Email Address" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                      <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeEmailSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-phone-num" className="form-label cp-form-label">Phone Number</label>
                        <input type="text" maxLength={10} ref={ConsigneePhoneInputRef} value={consigneeInfo.PhoneNumber} name='PhoneNumber' className="form-control cp-form-field" id="qotto-book-consignee-phone-num" placeholder="Enter Phone Number" onChange={(event: any) => { onConsigneeValueChange(event, "number") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneePhoneSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-faxnum" className="form-label cp-form-label">Fax Number</label>
                        <input type="text" maxLength={10} ref={ConsigneeFaxInputRef} value={consigneeInfo.FaxNumber} name='FaxNumber' className="form-control cp-form-field" id="qotto-book-consignee-faxnum" placeholder="Enter Fax Number" onChange={(event: any) => { onConsigneeValueChange(event, "number") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeFaxSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                    <label htmlFor="qotto-book-consignee-load-notes" className="form-label cp-form-label">Load Notes</label>
                    <textarea className="form-control cp-form-field cp-textarea" maxLength={255} value={consigneeInfo.loadNotes} name='loadNotes' rows={6} id="qotto-book-consignee-load-notes" placeholder="Enter Load Notes" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-earliest-date" className="form-label cp-form-label">Earliest Date<span className="cp-form-mandatory"> *</span></label>
                        <input type="date" min={moment(new Date(shipperInfo.earliestDate)).format('YYYY-MM-DD')} ref={ConsigneeEarliestDateInputRef} className="form-control cp-form-field" value={consigneeInfo.earliestDate} name="earliestDate" id="qotto-book-consignee-earliest-date" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onConsigneeValueChange(event, "earliestDate") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeEarliestDateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-earliest-time" className="form-label cp-form-label">Earliest Time</label>
                        <input type="time" value={consigneeInfo.earliestTime} ref={ConsigneeEarliestTimeInputRef} name="earliestTime" className="form-control cp-form-field" id="qotto-book-consignee-earliest-time" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeEarliestTimeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-latest-date" className="form-label cp-form-label">Latest Date</label>
                        <input type="date" min={moment(new Date(consigneeInfo.earliestDate)).format('YYYY-MM-DD')} className="form-control cp-form-field" value={consigneeInfo.latestDate} name="latestDate" id="qotto-book-consignee-latest-date" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-latesttime" className="form-label cp-form-label">Latest Time</label>
                        <input type="time" className="form-control cp-form-field" value={consigneeInfo.latestTime} name="latestTime" id="qotto-book-consignee-latesttime" onKeyDown={(e) => e.preventDefault()} onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn cp-btn-primary my-4" onClick={() => { ConsigeeInfoContinueClick() }}>Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={commoditiesAccordionDivRef}>
            <h2 className="accordion-header py-1" id="qotto-book-commodities">
              <button onClick={() => accordionHideShow(commoditiesDownButtonRef, commoditiesDivRef)} ref={commoditiesDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button">
                <span className="ms-3">Commodities </span> <span>({commodities.length})</span>
              </button>
              {completedCheck.commodities ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={commoditiesDivRef} id="qotto-book-commodities-accordion" className="accordion-collapse collapse" aria-labelledby="qotto-book-commodities">
              {
                QuoteLtlRequest.CurrentQuoteId != 0 ?
                  <div className="accordion-body cp-accordion-body-padding position-relative">
                    <img src="Images/commodities-info-icon.svg" className="ms-2 mb-1 density-modal-position pointer" alt="help and documentation" data-bs-toggle="modal" data-bs-target="#qotto-book-commodities-info-popup" />
                    <div className="row ">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-4">
                        <label htmlFor="qotto-book-commodities-bolsplinfo" className="form-label cp-form-label">BOL Special Information</label>
                        <textarea value={`Quote # ${CurrentQuote.quoteNumber} // Accessorials: ${accessorials}`} disabled={true} className="form-control height-control cp-form-field cp-textarea mb-3" rows={6} id="qotto-book-commodities-bolsplinfo" placeholder="Enter Special Instructions" />
                      </div>
                    </div>
                    <div className="table-responsive mb-2 cp-grid">
                      <table className="table mb-0  table-borderless ">
                        <thead className="cp-table-head ">
                          <tr>
                            <th /><th>Name</th>
                            <th>Hazmat</th>
                            <th>Quantity</th>
                            <th>Weight</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {QuoteCommodityContent()}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-5">
                      <div className="text-end">
                        <button type="button" className="btn cp-btn-primary my-4" onClick={() => { DisableCommoditiesContinueClick() }}>Continue</button>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="accordion-body cp-accordion-body-padding position-relative">
                    <img src="../Images/commodities-info-icon.svg" className="ms-2 mb-1 density-modal-position pointer" alt="help and documentation" data-bs-toggle="modal" data-bs-target="#qotto-book-commodities-info-popup" />
                    {commodities.length > 0 ?
                      <>
                        {loadcommodities()}
                        <div className="row">
                          <div className="col-10 col-md-12 col-sm-12">
                            <div className="row border-bottom">
                              <h6 className="primary-header pb-3">TOTAL</h6>
                              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                                <div className="row">
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3">
                                    <label className="form-label cp-form-label mb-0">Quantity<span className="data-txt ps-3">{Quantity}</span></label>
                                  </div>
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3">
                                    <label htmlFor="qutltl-shipinfo-linearft-commototal" className="form-label cp-form-label pt-2 pe-3">Linear Ft</label>
                                    <input type="text" className="form-control cp-form-field w-50" id="qutltl-shipinfo-linearft-commototal" maxLength={2} value={LinearFt}
                                      onChange={(event: any) => {
                                        if (/^[0-9]*$/.test(event.target.value) && event.target.value < 13) {
                                          SetLinearFt(event.target.value)
                                        }
                                      }} />
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-6 col-lg-4 d-flex align-items-center mb-3">
                                <label className="form-label cp-form-label mb-0">Weight<span className="data-txt ps-3">{Weight} lbs</span></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </> : null}
                    <div className="row mt-5">
                      {/* <div className="col-12 col-sm-12 col-md-6 col-lg-5">
                        <div className="mb-3">
                          <select id="qutltl-shipinfo-precommo" className="form-select cp-form-field" onChange={(event: any) => { OnValueChangepreSavedComm(event) }}>
                            <option value={""}>Select Presaved Commodities</option>
                            {preSaveDropDown()}
                          </select>
                        </div>
                      </div> */}
                      <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                        <div className="mb-3">
                          <button type="button" className="btn cp-btn-secondary" onClick={() => { addNewCommodity() }}>Add New Commodity</button>
                        </div>
                      </div>
                      <div className="text-end">
                        <button type="button" className="btn cp-btn-primary my-4" onClick={() => { commoditiesContinueClick() }}>Continue</button>
                      </div>
                    </div>
                  </div>}
            </div>
          </div>
          {/* commodities info popup */}
          <div className="modal fade" id="qotto-book-commodities-info-popup" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable density-popup-width">
              <div className="modal-content">
                <div className="modal-header  border-0  p-3 ">
                  <span className="primary-header">Density Items</span>
                  <button type="button" className="btn-close popup-closeicon-shadow shadow-none ms-5" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body  text-align-center d-flex px-4">
                  <div className="me-3">
                    <span className="density-icon mt-1">D</span>
                  </div>
                  <div className="pt-1">
                    <p className="data-txt">The D-icon may appear next to commodities selected from the list. What does that mean? </p>
                    <p className="data-txt"><span className="data-label">PURE DENSITY ITEM -</span> Class and sub vary based on density, therefore dimensions are always required to determine density. If you select an existing pure density commodity from the list, the form may pre-fill with default dimensions, class, and sub based on this shipper’s history, but these will change automatically if you edit dimensions. </p>
                    <p className="data-txt"><span className="data-label">Note :</span> Commodities without the D-icon fall into three categories, none of which require dimensions.</p>
                    <p className="data-txt"><span className="data-label">Non-Density Item, Without Subs -</span>  This item has no subs in the NMFTA listing, for example, NMFC 135760 will always be 135760 and bever 135760-01, etc. NMFTA listing will specify “Class Not Taken” or “Class_regardless of density” to indicate that density has no bearing for this commodity.</p>
                    <p className="data-txt"><span className="data-label">Non-Density Item, With Subs -</span>  This item does have subs in the NMFTA listing; however, subs are not density-related - but they could affect the class and must therefore be reviewed. Non-density subs could be based on such factors as packaging, type of material, SU (set up) or KD (knock down), release etc. For such commodities, always verify and select a different sub if necessary.</p>
                    <p className="data-txt"><span className="data-label">Frequent-Repeat Density Item -</span> The commodity is a density item, but the shipper ships this item frequently and Sunteck knows the density will never change; the LTL Admin has locked it down so that you keep the same class and sub even if you edit the dimensions.</p>
                    <p className="data-txt"><span className="data-label">Note :</span> Dimensions will be required even for non D-icon commodities if the quote qualifies as volume.</p>
                  </div>
                </div>
                <div className="modal-footer pb-4 justify-content-center border-0">
                  <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal">OK</button>
                </div>
              </div>
            </div>
          </div>
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
                  <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { ValidationOkClick() }}>Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3">
            <h2 className="accordion-header py-1" id="review-createid">
              <button onClick={() => accordionHideShow(ReviewDownButtonRef, ReviewDivRef)} ref={ReviewDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button">
                <span className="ms-3"> Review and Create </span>
              </button>
            </h2>
            <div ref={ReviewDivRef} id="review-create" className="accordion-collapse collapse" aria-labelledby="review-createid">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row">
                  <span className="mb-3">Please review the criteria below to ensure that the truckload information is correct. Updates cannot be made once the truckload has been created.</span>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-4">
                    <div className="row">
                      <h5 className="primary-header mb-2 "><img src="Images/reference-info-icon.svg" alt="reference-info-icon" className="all-details-heading-icon me-3" />Reference Info</h5>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3 mb-2">
                        <h5 className="data-label ">Purchase Order</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{referenceNumber.poNumber == "" ? ` -` : referenceNumber.poNumber}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3 mb-2">
                        <h5 className="data-label ">Bill of Lading</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{referenceNumber.blNumber == "" ? ` -` : referenceNumber.blNumber}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3 mb-2">
                        <h5 className="data-label ">Shipping Number</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{referenceNumber.shippingNumber == "" ? ` -` : referenceNumber.shippingNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 quote-res-brd-left-sty  mt-4">
                    <div className="row">
                      <h6 className="primary-header mb-4"><img src="Images/shipper-info-icon.svg" alt="A icon with truck symbol" className="all-details-heading-icon me-3" />  Shipper Info</h6>
                      <label className="data-label">Name</label>
                      <p className="data-txt mb-0 mt-2 mb-0">{shipperInfo.name == "" ? ` -` : shipperInfo.name}</p>
                      <p className="data-txt mb-0">{shipperInfo.addressline1 == "" ? ` -` : shipperInfo.addressline1} {shipperInfo.addressline2}</p>
                      <p className="data-txt mb-0">{shipperInfo.city}, {shipperInfo.state} {shipperInfo.zipCode}</p>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Earliest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {shipperInfo.earliestDate == "" ? `NA` : moment(new Date(shipperInfo.earliestDate)).format("MM/DD/YYYY")} &amp; {shipperInfo.earliestTime == "" ? `NA` : shipperInfo.earliestTime}</p>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Latest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {shipperInfo.latestDate == "" ? `NA` : moment(new Date(shipperInfo.latestDate)).format("MM/DD/YYYY")} &amp; {shipperInfo.latestTime == "" ? `NA` : shipperInfo.latestTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6  mt-4 res-cosignee-brd-left-sty ">
                    <div className="row">
                      <h6 className="primary-header mb-4 "><img src="Images/consignee-info-icon.svg" alt="A icon with truck symbol" className="all-details-heading-icon me-3" /> Consignee Info</h6>
                      <label className="data-label">Name</label>
                      <p className="data-txt mb-0 mt-2 mb-0">{consigneeInfo.name == "" ? `-` : consigneeInfo.name}</p>
                      <p className="data-txt mb-0">{consigneeInfo.addressline1 == "" ? ` -` : consigneeInfo.addressline1} {consigneeInfo.addressline2}</p>
                      <p className="data-txt mb-0">{consigneeInfo.city} {consigneeInfo.state} {consigneeInfo.zipCode}
                      </p>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Earliest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {consigneeInfo.earliestDate == "" ? `NA` : moment(new Date(consigneeInfo.earliestDate)).format("MM/DD/YYYY")} &amp; {consigneeInfo.earliestTime == "" ? `NA` : consigneeInfo.earliestTime}
                        </p>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Latest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {consigneeInfo.latestDate == "" ? `NA` : moment(new Date(consigneeInfo.latestDate)).format("MM/DD/YYYY")} &amp; {consigneeInfo.latestTime == "" ? `NA` : consigneeInfo.latestTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* QuoteLtlRequest.CurrentQuoteId != 0 */}
                  {QuoteLtlRequest.CurrentQuoteId != 0 ? <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-4">
                    <div className="row">
                      <h5 className="primary-header mb-2 "><img src="Images/bol-notes-icon.svg" alt="notes-icon" className="all-details-heading-icon me-3 mb-3" />BOL Special Instruction</h5>
                      <p className="data-txt">Quote # {CurrentQuote.quoteNumber} // Accessorials: {accessorials} </p>
                    </div>
                  </div> : null}
                  <div className="col-md-12 mt-4">
                    <h6 className="primary-header mb-4"><img src="Images/commodities-icon.svg" alt="commodities-icon" className="all-details-heading-icon me-3" />Commodities ({commodities.length})</h6>
                    <div className="table-responsive mb-2 cp-grid">
                      <table className="table mb-0  table-borderless ">
                        <thead className="cp-table-head ">
                          <tr>
                            <th /><th>Name</th>
                            <th>Hazmat</th>
                            <th>Quantity</th>
                            <th>Weight</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {QuoteReviewCommodityContent()}
                        </tbody>
                      </table>
                    </div>
                    {/* {<div className="accordion-body cp-accordion-body-padding position-relative pb-5">
                      <div className="table-responsive mb-2 cp-grid">
                        <table className="table mb-0  table-borderless ">
                          <thead className="cp-table-head ">
                            <tr>
                              <th /><th>Name</th>
                              <th>Hazmat</th>
                              <th>Quantity</th>
                              <th>Weight</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {QuoteReviewCommodityContent()}
                          </tbody>
                        </table>
                      </div>
                    </div>} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-end">
          {QuoteLtlRequest.CurrentQuoteId != 0 ? <button type="button" className="btn cp-btn-secondary float-start my-4" onClick={() => { navigate("/quoteltl-choose-carrier") }}><img src="../Images/previous-icon.svg" alt="privious Icon" className="logout-icon me-2" />Previous</button> : null}
          <button type="button" className="btn cp-btn-tertiary my-4 me-2" onClick={() => { onCancelClick() }}>Clear</button>
          <button type="button" className="btn cp-btn-primary my-4" onClick={() => { CreateLoadClick() }}>
            Create Load
          </button>
        </div>
      </div>
      {/* Quote to Book LTL Accordion Section Ends Here */}
      {/* Create load popup STARTS HERE */}
      <div className="modal fade" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={successPopup} id="ctl-sucess-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header"> LTL Creation Success!</h5>
              <p className="popup-txt">Your LTL has been created successfully with load ID :<a href={`/al-details-tl?lid=` + LoadNumber + `&lorg=BTMS`} className="text-decoration-none ctl-link-color" >{LoadNumberSuccessPopupMsg}</a></p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { navigate('/loadsearch') }}>OK</button>
            </div>
          </div>
        </div>
      </div>
      {/* Create load popup ENDS HERE */}
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={VerifyPopup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/verify-address-icon.svg" alt="info-required-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">{VerifyPopupMSG}</h5>
              <p className="popup-txt">{VerifyAddressPopupMSG}</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-tertiary" onClick={() => { onVerifyCancelClick() }}>Go Back</button>
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { OnclickContinue() }}>Use as it is</button>
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
      <div className="modal fade" id="email-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={noContentPopup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true" aria-modal="true" role="dialog" >
        <div className="modal-dialog weight-validation-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="../Images/404-img.svg" alt="info-required-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">No records found!</h5>
              {/* <p className="popup-txt">no content</p> */}
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { noContentOkClick() }}>OK</button>
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

export default BookLtl