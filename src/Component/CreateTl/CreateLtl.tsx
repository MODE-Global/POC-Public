import React, { useEffect, useRef, useState } from 'react'
import { GetUserDetail, CreateLoad, GetCountryList, GetStatesList, GetShipperList, GetConsigneeList, GetEquipmentType, GetUOMList, VerifyAddress } from '../../api/api';
import moment from 'moment';
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import { StateDetail } from '../../interface/QuoteLtlInterface';

const CreateLtl = () => {
  let navigate = useNavigate();

  const shipmentInfoDivRef = useRef<HTMLDivElement>(null);
  const shipmentInfoAccordionDivRef = useRef<HTMLDivElement>(null);
  const shipmentInfoDownButtonRef = useRef<HTMLButtonElement>(null);

  const EqupmentTypeSelectRef = useRef<HTMLSelectElement>(null);
  const EqupmentTypeSpanRef = useRef<HTMLSpanElement>(null);

  const ShipperInfoDivRef = useRef<HTMLDivElement>(null);
  const ShipperInfoAccordionDivRef = useRef<HTMLDivElement>(null);
  const ShipperInfoDownButtonRef = useRef<HTMLButtonElement>(null);

  const consigneeInfoDivRef = useRef<HTMLDivElement>(null);
  const consigneeInfoAccordionDivRef = useRef<HTMLDivElement>(null);
  const consigneeInfoDownButtonRef = useRef<HTMLButtonElement>(null);

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

  const commoditiesDivRef = useRef<HTMLDivElement>(null);
  const commoditiesAccordionDivRef = useRef<HTMLDivElement>(null);
  const commoditiesDownButtonRef = useRef<HTMLButtonElement>(null);

  const ReviewDivRef = useRef<HTMLDivElement>(null);
  const ReviewDownButtonRef = useRef<HTMLButtonElement>(null);

  const CustomerSelectRef = useRef<HTMLSelectElement>(null);
  const CustomerSpanRef = useRef<HTMLSpanElement>(null);

  const successPopup = useRef<HTMLDivElement>(null);
  const ValidationPopup = useRef<HTMLDivElement>(null);
  const noContentPopup = useRef<HTMLDivElement>(null);
  const someThingWentWrongPopup = useRef<HTMLDivElement>(null);
  const VerifyPopup = useRef<HTMLDivElement>(null);


  let emptyArray: any = []
  const [Customer, SetCustomer] = useState("")
  const [getUserDetail, SetGetUserDetail] = useState(emptyArray)
  let agentDetailsObj = {
    creditLimit: "",
    avaliableCredit: "",
    agentContact: "",
    agentEmailId: "",
    agentPhone: ""
  }

  const [equipmentType, setequipmentType] = useState(emptyArray)
  const [AgentDetails, setAgentDetails] = useState(agentDetailsObj)
  const [stateOptions, setStateOptions] = useState<StateDetail[]>([])
  const [countryOptions, setcountryOptions] = useState<any[]>([])
  const [ShipperOption, setShipperOption] = useState<any[]>([])
  const [ConsigneeOption, setConsigneeOption] = useState<any[]>([])
  const [uomOptions, setUOMOptions] = useState<any[]>([])
  const [VerifyPopupMSG, setVerifyPopupMSG] = useState("")
  const [VerifyAddressPopupMSG, setVerifyAddressPopupMSG] = useState("")
  const [ValidationPopupMSG, SetValidationPopupMSG] = useState("")
  const [LoadId, SetLoadId] = useState("")

  const [loader, setLoader] = useState(false)






  let shipmentInformationObj = {
    equipmentType: "",
    poNumber: "",
    blNumber: "",
    shippingnumber: "",
    referenceNumber: ""
  }
  const [shipmentInformation, setshipmentInformation] = useState(shipmentInformationObj)

  let divCompletedObj = {
    shipmentInformation: false,
    Shipper: false,
    consignee: false,
    commodities: false,
  }
  const [completedCheck, setcompletedCheck] = useState(divCompletedObj)

  let shipperInfoObj = {
    shipper: "",
    name: "",
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    contactName: "",
    EmailAddress: "",
    PhoneNumber: "",
    FaxNumber: "",
    loadNotes: "",
    earliestDate: "",
    earliestTime: "",
    latestDate: "",
    latestTime: "",
  }
  const [shipperInfo, setshipperInfo] = useState(shipperInfoObj)

  let consigneeInfoObj = {
    consignee: "",
    name: "",
    addressline1: "",
    addressline2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    contactName: "",
    EmailAddress: "",
    PhoneNumber: "",
    FaxNumber: "",
    loadNotes: "",
    earliestDate: "",
    earliestTime: "",
    latestDate: "",
    latestTime: "",
  }
  const [consigneeInfo, setconsigneeInfo] = useState(consigneeInfoObj)

//   BolsplIns  string     
// Qty        int        
// UOM        string     
// Weight     int        
// Value      int        
// Descrip    string     
// Hazmat     bool       
// HazmatInfo HazmatInfo 
  let commoditiesObj = {
    id: uuidv4(),
    commQuantity: "",
    commUnitOfMeasurement: "",
    commWeight: "",
    commValue: "",
    hazmat: false,
    commDescription: "",
    hazShippingName: "",
    hazDescription: "",
    hazGroupName: "",
    hazPackagingGroup: "",
    hazUNNANumber: "",
    hazClass: "",
    hazplacardType: "",
    hazFlashTemp: "",
    hazUnitOfMeasurement: "",
    hazFlashType: "",
    hazCertificateHolderName: "",
    hazContactName: "",
    hazPhoneNumber: "",
    reviewAcc: false
  }
  const [commodities, Setcommodities] = useState([commoditiesObj])
  const [BolDescription, setBolDescription] = useState("")
  /**
 * GetOnLoadData is an async function that calls GetUserDetail, which returns a response, which is then
 * checked for a status of 200, and if it is, then the response is looped through and the
 * customerDetails are pushed into an array, which is then set to the state of GetUserDetail.
 */
  useEffect(() => {
    shipmentInfoDivRef.current?.classList.add('show');
    shipmentInfoDownButtonRef.current?.classList.remove('collapsed');
    let customerDetail: any[]= []
    const GetOnLoadData = async () => {
      const response: any = await GetUserDetail(localStorage.getItem('userId'))
      if (response.status == 200) { 
        response.data.userDetails.forEach((value: any) => {
          if (value.permission.includes("Create TL")) {
            value.customerDetails.forEach((customer: any) => {
              customerDetail.push(customer)
            })
          }
        })
        SetGetUserDetail(customerDetail)
        if(customerDetail.length==1){
          console.log("customerDetail inside",customerDetail)
          SetCustomer(customerDetail[0].mySunteckLoginId)
            let currentCustaId = "";
              console.log("getUserDetail",getUserDetail)
                currentCustaId = customerDetail[0].custaId
                setAgentDetails({
                  ...AgentDetails,
                  ["creditLimit"]: customerDetail[0].creditLimit,
                  ["avaliableCredit"]: customerDetail[0].avaliableCredit,
                  ["agentContact"]: customerDetail[0].agentName,
                  ["agentEmailId"]: customerDetail[0].agentEmail,
                  ["agentPhone"]: customerDetail[0].agentPhoneNumber
                })
            GetShipperTypes(currentCustaId)
            GetConsigneeTypes(currentCustaId)
        }
      }
      else{
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
        console.log(response.data.States);
      } else{
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
        console.log(response.data);
      }else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }

    const GetEquipmentTypeData = async () => {
      const response: any = await GetEquipmentType()
      console.log("Equip response", response.data.EquipmentTypes)
      if (response.status == 200) {
        setequipmentType(response.data.EquipmentTypes)
        console.log(response.data);
      } else{
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
        console.log(response.data);
      } else{
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }

    GetEquipmentTypeData()
    GetUOMTypes()
    GetStates()
    GetCountryTypes()
    GetOnLoadData()
  }, [])

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


  const EquipmentDropDown = () => {

    return equipmentType.map((data: any, index: any) => {
      return (
        <option key={index} value={data.EquipmentTypeCode}> {data.EquipmentType}</option>
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

  /**
   * OnCustomerChange is a function that takes an event as an argument and returns nothing.
   * @param {any} event - any -&gt; The event object
   */
  const onCustomerChange = (event: any) => {
    SetCustomer(event.target.value)
    let currentCustaId = "";
    getUserDetail.forEach((data: any) => {
      if (event.target.value == data.mySunteckLoginId) {
        currentCustaId = data.custaId
        setAgentDetails({
          ...AgentDetails,
          ["creditLimit"]: data.creditLimit,
          ["avaliableCredit"]: data.avaliableCredit,
          ["agentContact"]: data.agentName,
          ["agentEmailId"]: data.agentEmail,
          ["agentPhone"]: data.agentPhoneNumber
        })
      }
    })
    GetShipperTypes(currentCustaId)
    GetConsigneeTypes(currentCustaId)
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
      console.log(response.data);
    }else {
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
      console.log(response.data);
    }else {
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
   * The function onShipmentInformationChange takes an event as an argument and sets the
   * shipmentInformation state to the event target name and value.
   * @param {any} event - any
   */
  const onShipmentInformationChange = (event: any) => {
    setshipmentInformation({ ...shipmentInformation, [event.target.name]: event.target.value })
  }

  /**
 * validate in reference card input value and 
 * if pass return true other wise return false
 * @returns A function that returns a boolean value.
 */
  const CustomerValidation = () => {
    let IsValid = false
    if (CustomerSpanRef.current != null && CustomerSelectRef.current != null) {
      if (Customer == "") {
        CustomerSpanRef.current.hidden = false;
        CustomerSpanRef.current.innerHTML = "Please select the customer";
        CustomerSelectRef.current.style.borderColor = "red";
      }
      else if (Customer != "") {
        CustomerSpanRef.current.hidden = true;
        CustomerSpanRef.current.innerHTML = "";
        CustomerSelectRef.current.style.borderColor = "";
      }

      if (CustomerSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        IsValid = false
      }
    }
    return IsValid
  }

  /**
   * If the span and select elements are not null, then if the select element's value is empty, then set
   * the span's hidden property to false, set the span's innerHTML to a message, and set the select
   * element's border color to red. Otherwise, if the select element's value is not empty, then set the
   * span's hidden property to true, set the span's innerHTML to an empty string, and set the select
   * element's border color to an empty string.
   * 
   * If the span's hidden property is true, then set the IsValid variable to true. Otherwise, set the
   * IsValid variable to false.
   * 
   * Return the IsValid variable.
   * @returns A function that returns a boolean value.
   */
  const ShipmentInfoValidation = () => {
    let IsValid = false
    if (EqupmentTypeSpanRef.current != null && EqupmentTypeSelectRef.current != null) {
      if (shipmentInformation.equipmentType == "") {
        EqupmentTypeSpanRef.current.hidden = false;
        EqupmentTypeSpanRef.current.innerHTML = "Please select the equipment type";
        EqupmentTypeSelectRef.current.style.borderColor = "red";
      }
      else if (shipmentInformation.equipmentType != "") {
        EqupmentTypeSpanRef.current.hidden = true;
        EqupmentTypeSpanRef.current.innerHTML = "";
        EqupmentTypeSelectRef.current.style.borderColor = "";
      }

      if (EqupmentTypeSpanRef.current.hidden) {
        IsValid = true
      }
      else {
        shipmentInfoDivRef.current?.classList.add('show');
        shipmentInfoDownButtonRef.current?.classList.remove('collapsed');

        window.scrollTo(
          {
            top: shipmentInfoAccordionDivRef.current?.offsetTop ?
            shipmentInfoAccordionDivRef.current?.offsetTop - 100 : 0,
            behavior: "smooth"
          })
        IsValid = false
      }
    }
    return IsValid
  }

  /**
   * If the customer and shipment info validations are true, then remove the class 'show' from the
   * shipment info div, add the class 'collapsed' to the shipment info down button, set the completed
   * check to true, add the class 'show' to the shipper info div, and remove the class 'collapsed' from
   * the shipper info down button.
   */
  const onShipmentClick = () => {

    if (CustomerValidation() && ShipmentInfoValidation()) {
      shipmentInfoDivRef.current?.classList.remove('show');
      shipmentInfoDownButtonRef.current?.classList.add('completed');
      shipmentInfoDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["shipmentInformation"]: true })
      ShipperInfoDivRef.current?.classList.add('show')
      ShipperInfoDownButtonRef.current?.classList.remove('collapsed');
    }
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
      case "number": {
        const rejex = /^[0-9]*$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Pnumber": {
        const rejex = /^[0-9() -]*$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setshipperInfo({ ...shipperInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Zip":{
        const rejex = /^[a-zA-Z 0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
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
      shipEarliestDateInputRef.current != null && shipEarliestDateSpanRef.current != null &&
      shipEarliestTimeInputRef.current != null && shipEarliestTimeSpanRef.current != null) {

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
        shipZipCodeSpanRef.current.innerHTML = "Please enter the zip code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 5 && !(/^[0-9]{5}$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Invalid U.S/Mexican zip code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 5 && (/^[0-9]{5}$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = true;
        shipZipCodeSpanRef.current.innerHTML = "";
        shipZipCodeInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.zipCode.length == 7 && !(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Invalid Canadian postal code";
        shipZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.zipCode.length == 7 && (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipperInfo.zipCode))) {
        shipZipCodeSpanRef.current.hidden = true;
        shipZipCodeSpanRef.current.innerHTML = "";
        shipZipCodeInputRef.current.style.borderColor = "";
      }
      else {
        shipZipCodeSpanRef.current.hidden = false;
        shipZipCodeSpanRef.current.innerHTML = "Please enter a valid zip code";
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
        shipEmailSpanRef.current.innerHTML = "Please enter a valid email address";
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

      const aphonere1=new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      const aphonere2=new RegExp(/^[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{4}$/)

      if (shipperInfo.PhoneNumber.length == 0) {
        shipPhoneSpanRef.current.hidden = true;
        shipPhoneSpanRef.current.innerHTML = "";
        shipPhoneInputRef.current.style.borderColor = "";
      }
      else if (shipperInfo.PhoneNumber.length > 10 &&  shipperInfo.PhoneNumber.length < 12 && !aphonere1.test(shipperInfo.PhoneNumber) ) {
        shipPhoneSpanRef.current.hidden = false;
        shipPhoneSpanRef.current.innerHTML = "Please enter a valid phone";
        shipPhoneInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.PhoneNumber.length > 12 && !aphonere2.test(shipperInfo.PhoneNumber) ) {
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
      else if (shipperInfo.FaxNumber.length > 10 &&  shipperInfo.FaxNumber.length < 12 && !aphonere1.test(shipperInfo.FaxNumber) ) {
        shipFaxSpanRef.current.hidden = false;
        shipFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        shipFaxInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.FaxNumber.length > 12 && !aphonere2.test(shipperInfo.FaxNumber) ) {
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
        shipperInfo.earliestTime <= moment(new Date()).format("HH:mm") &&
        shipperInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        shipEarliestTimeSpanRef.current.hidden = false;
        shipEarliestTimeSpanRef.current.innerHTML = "Please enter a valid earliest Time";
        shipEarliestTimeInputRef.current.style.borderColor = "red";
      }
      else if (shipperInfo.earliestTime.length > 0 &&
        shipperInfo.earliestTime >= moment(new Date()).format("HH:mm") &&
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
      case "number": {
        const rejex = /^[0-9]*$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Zip":{
        const rejex = /^[a-zA-Z 0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "earliestDate": {
        setconsigneeInfo({ ...consigneeInfo, [event.target.name]: event.target.value, ["latestDate"]: "" })
        break;
      }
      case "consignee": {
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
        ConsigneeZipCodeSpanRef.current.innerHTML = "Please enter the zip code";
        ConsigneeZipCodeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.zipCode.length == 5 && !(/^[0-9]{5}$/.test(consigneeInfo.zipCode))) {
        ConsigneeZipCodeSpanRef.current.hidden = false;
        ConsigneeZipCodeSpanRef.current.innerHTML = "Invalid U.S/Mexican zip code";
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
        ConsigneeZipCodeSpanRef.current.innerHTML = "Please enter a valid zip code";
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
        ConsigneeEmailSpanRef.current.innerHTML = "Please enter a valid email address";
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

      const aphonere1=new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      const aphonere2=new RegExp(/^[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{4}$/)
      if (consigneeInfo.PhoneNumber.length == 0) {
        ConsigneePhoneSpanRef.current.hidden = true;
        ConsigneePhoneSpanRef.current.innerHTML = "";
        ConsigneePhoneInputRef.current.style.borderColor = "";
      }
      else if (consigneeInfo.PhoneNumber.length > 10 &&  consigneeInfo.PhoneNumber.length < 12 && !aphonere1.test(consigneeInfo.PhoneNumber) ) {
        ConsigneePhoneSpanRef.current.hidden = false;
        ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        ConsigneePhoneInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.PhoneNumber.length > 12 && !aphonere2.test(consigneeInfo.PhoneNumber) ) {
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
      else if (consigneeInfo.FaxNumber.length > 10 &&  consigneeInfo.FaxNumber.length < 12 && !aphonere1.test(consigneeInfo.FaxNumber) ) {
        ConsigneeFaxSpanRef.current.hidden = false;
        ConsigneeFaxSpanRef.current.innerHTML = "Please enter a valid fax";
        ConsigneeFaxInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.FaxNumber.length > 12 && !aphonere2.test(consigneeInfo.FaxNumber) ) {
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
        consigneeInfo.earliestTime <= moment(new Date()).format("HH:mm") &&
        consigneeInfo.earliestDate == moment(new Date()).format("YYYY-MM-DD")) {
        ConsigneeEarliestTimeSpanRef.current.hidden = false;
        ConsigneeEarliestTimeSpanRef.current.innerHTML = "Please enter a valid earliest Time";
        ConsigneeEarliestTimeInputRef.current.style.borderColor = "red";
      }
      else if (consigneeInfo.earliestTime.length > 0 &&
        consigneeInfo.earliestTime >= moment(new Date()).format("HH:mm") &&
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
      case "CheckBox": {
        const rejex = /^[a-zA-Z ]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          particularCommodities[event.target.name] = event.target.checked;
        }
        break;
      }
      case "number": {
        const rejex = /^[0-9- ()]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          particularCommodities[event.target.name] = event.target.value;
        }
        break;
      }
      default: {
        particularCommodities[event.target.name] = event.target.value;
      }
    }

    newCommodities[index] = particularCommodities
    console.log("newCommodities",newCommodities)
    Setcommodities(newCommodities);
  }

  /**
 * OnDeleteClick is a function that takes an index as an argument and returns a new array of
 * commodities that have been filtered to remove the commodity with the id that matches the index
 * argument.
 * @param {any} index - any - the index of the item in the array
 */
  const OnDeleteClick = (index: any) => {
    if (commodities.length == 1) {
      return
    }
    let newCommodities = commodities.filter((val: { id: any; }) => val.id != index);
    Setcommodities(newCommodities)
  }

  /**
   * AddNewCommodity() is a function that creates a new object and pushes it into the commodities array.
   */
  const addNewCommodity = () => {

    let commodities_Obj = {
      id: uuidv4(),
      commQuantity: "",
      commUnitOfMeasurement: "",
      commWeight: "",
      commValue: "",
      hazmat: false,
      commDescription: "",
      hazShippingName: "",
      hazDescription: "",
      hazGroupName: "",
      hazPackagingGroup: "",
      hazUNNANumber: "",
      hazClass: "",
      hazplacardType: "",
      hazFlashTemp: "",
      hazUnitOfMeasurement: "",
      hazFlashType: "",
      hazCertificateHolderName: "",
      hazContactName: "",
      hazPhoneNumber: "",
      reviewAcc: false
    }

    Setcommodities([...commodities, commodities_Obj])
  }

  /**
   * It's a function that validates the input fields of a form. 
   * 
   * The function is called when the user clicks the submit button. 
   * 
   * The function is called in the following way:
   * @returns a boolean value.
   */
  const commoditiesValidation = () => {
    let ValidationArray: boolean[] = [];
    let phonevalidation:boolean=true;
    console.log("commodities",commodities)
    commodities.forEach((data: any, index: number) => {
      const commQuantityInput = document.getElementById(`commQuantity:${index}`)
      const commQuantitySpan = document.getElementById(`commQuantitySpan:${index}`)
      const commUnitOfMeasurementInput = document.getElementById(`commUnitOfMeasurement:${index}`)
      const commUnitOfMeasurementSpan = document.getElementById(`commUnitOfMeasurementSpan:${index}`)
      const commWeightInput = document.getElementById(`commWeight:${index}`)
      const commWeightSpan = document.getElementById(`commWeightSpan:${index}`)
      const commDescriptionInput = document.getElementById(`commDescription:${index}`)
      const commdescriptionSpan = document.getElementById(`commdescriptionSpan:${index}`)
      const PhoneNumberInput = document.getElementById(`PhoneNumberInput:${index}`)
      const PhoneNumberSpan = document.getElementById(`PhoneNumberSpan:${index}`)
      const hazmat=document.getElementById(`Commhazmat:${index}`)
     console.log("hazmat",hazmat)


    console.log("Inside forLoop commodity validation")
    console.log("commQuantityInput",commQuantityInput,"commQuantitySpan",commQuantitySpan,"commUnitOfMeasurementInput",commUnitOfMeasurementInput,"commUnitOfMeasurementSpan",commUnitOfMeasurementSpan,"commWeightInput",commWeightInput,"commWeightSpan",commWeightSpan,"PhoneNumberInput",PhoneNumberInput,"PhoneNumberSpan",PhoneNumberSpan,"commDescriptionInput",commDescriptionInput,"commdescriptionSpan",commdescriptionSpan)
    const aphonere1=new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
    const aphonere2=new RegExp(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}/)
      if (commQuantityInput != undefined && commQuantitySpan != undefined &&
        commUnitOfMeasurementInput != undefined && commUnitOfMeasurementSpan != undefined &&
        commWeightInput != undefined && commWeightSpan != undefined &&
        hazmat !=undefined &&
        commDescriptionInput != undefined && commdescriptionSpan != undefined) {
          console.log("data.commQuantity",data.commQuantity)
        if (data.commQuantity == "") {
          commQuantitySpan.hidden = false;
          commQuantitySpan.innerHTML = `Please enter the QTY`;
          commQuantityInput.style.borderColor = "red"
        }
        else if (data.commQuantity != "") {
          console.log("data.commQuantity",data.commQuantity)
          commQuantitySpan.innerHTML = "";
          commQuantitySpan.hidden = true;
          commQuantityInput.style.borderColor = ""
        }

        if (data.commUnitOfMeasurement == "") {
          console.log("data.commUnitOfMeasurement",data.commUnitOfMeasurement)
          commUnitOfMeasurementSpan.hidden = false;
          commUnitOfMeasurementSpan.innerHTML = `Please select the UOM`;
          commUnitOfMeasurementInput.style.borderColor = "red"
        }
        else if (data.commUnitOfMeasurement != "") {
          commUnitOfMeasurementSpan.hidden = true;
          commUnitOfMeasurementSpan.innerHTML = "";
          commUnitOfMeasurementInput.style.borderColor = ""
        }


        if (data.commWeight == "") {
          console.log("data.commWeight",data.commWeight)
          commWeightSpan.hidden = false;
          commWeightSpan.innerHTML = `Please enter the weight`;
          commWeightInput.style.borderColor = "red"
        }
        else if (data.commWeight != "") {
          commWeightSpan.hidden = true;
          commWeightSpan.innerHTML = "";
          commWeightInput.style.borderColor = ""
        }
        // else if (consigneeInfo.PhoneNumber.length > 10 &&  consigneeInfo.PhoneNumber.length < 12 && !aphonere1.test(consigneeInfo.PhoneNumber) ) {
        //   ConsigneePhoneSpanRef.current.hidden = false;
        //   ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        //   ConsigneePhoneInputRef.current.style.borderColor = "red";
        // }
        // else if (consigneeInfo.PhoneNumber.length > 12 && !aphonere2.test(consigneeInfo.PhoneNumber) ) {
        //   ConsigneePhoneSpanRef.current.hidden = false;
        //   ConsigneePhoneSpanRef.current.innerHTML = "Please enter valid phone";
        //   ConsigneePhoneInputRef.current.style.borderColor = "red";
        // }
        if (data.commDescription == "") {
          console.log("data.commDescription",data.commDescription)
          commdescriptionSpan.hidden = false;
          commdescriptionSpan.innerHTML = `Please enter the description`;
          commDescriptionInput.style.borderColor = "red"
        }
        else if (data.commDescription != "") {
          commdescriptionSpan.hidden = true;
          commdescriptionSpan.innerHTML = "";
          commDescriptionInput.style.borderColor = ""
        }
        if (data.hazmat) {
          if (PhoneNumberInput != undefined && PhoneNumberSpan != undefined){
         if (data.hazPhoneNumber.length == 0) {
              PhoneNumberSpan.hidden = true;
              PhoneNumberSpan.innerHTML = "";
              PhoneNumberInput.style.borderColor = "";
            }
          else if (data.hazPhoneNumber.length > 10 &&  data.hazPhoneNumber.length < 12 && !aphonere1.test(data.hazPhoneNumber.length) ){
            PhoneNumberSpan.hidden = false;
            PhoneNumberSpan.innerHTML = "Please enter a valid phone";
            PhoneNumberInput.style.borderColor = "red";
            phonevalidation=false;
          }
          else if (data.hazPhoneNumber.length > 12 && !aphonere2.test(data.hazPhoneNumber.length) ){
            PhoneNumberSpan.hidden = false;
            PhoneNumberSpan.innerHTML = "Please enter a valid phone";
            PhoneNumberInput.style.borderColor = "red";
            phonevalidation=false;
          }
          else if (data.hazPhoneNumber.length > 0 && data.hazPhoneNumber.length != 10) {
          PhoneNumberSpan.hidden = false;
          PhoneNumberSpan.innerHTML = "Please enter a valid phone";
          PhoneNumberInput.style.borderColor = "red";
          phonevalidation=false;
        }
        else if (data.hazPhoneNumber.length > 0 && data.hazPhoneNumber.length == 10) {
          PhoneNumberSpan.hidden = true;
          PhoneNumberSpan.innerHTML = "";
          PhoneNumberInput.style.borderColor = "";
        }
        
       }
      }

        if (commQuantitySpan.hidden && commUnitOfMeasurementSpan.hidden &&
          commWeightSpan.hidden && commdescriptionSpan.hidden && phonevalidation) {
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
      ReviewDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["commodities"]: false })
    }
  }

  /**
   * If the validation functions return true, then add the class "show" to the successPopup div.
   */
  const CreateLoadClick = async () => {
    
    if (CustomerValidation() && ShipmentInfoValidation() && shipperValidation() && ConsigeeValidation() && commoditiesValidation()) {
      setLoader(true)
      console.log("CustomerValidation()",CustomerValidation(),"ShipmentInfoValidation()",ShipmentInfoValidation(),"shipperValidation()",shipperValidation(),"ConsigeeValidation()",ConsigeeValidation(),"commoditiesValidation()",commoditiesValidation())
      // Createtl API CALL

      // console.log("BookRequest",BookRequest)

      const commoditiesRequestArray: any = [];
      commodities.forEach((data: any) => {
        
        let hazmatdetails={
          ShippingName: data.hazShippingName,
          Description: data.hazDescription,
          GroupName: data.hazGroupName,
          PackagingGroup: data.hazPackagingGroup,
          UNNANumber: data.hazUNNANumber,
          Class: data.hazClass,
          PlacardType: data.hazplacardType,
          FlashTemp: data.hazFlashTemp,
          UOM: data.hazUnitOfMeasurement,
          FlashType: (data.hazFlashType).toString(),
          CHName: data.hazCertificateHolderName,
          ContactName: data.hazContactName,
          PhoneNumber: data.hazPhoneNumber,
        }
        let particularCommodity = {
          id: uuidv4(),
          Qty: Number(data.commQuantity),
          UOM: data.commUnitOfMeasurement,
          Weight: Number(data.commWeight),
          Value: Number(data.commValue),
          Hazmat: data.hazmat,
          Descrip: data.commDescription,
          HazmatInfo:hazmatdetails,
        }
        commoditiesRequestArray.push(particularCommodity)
      })

      const BookRequest = {
        // These data has to be populated
        CustomerLoginId: Customer,
        UserId: localStorage.getItem("userId"),
        ShipmentInfo: {
          EquipType: shipmentInformation.equipmentType,
          PoNumber: shipmentInformation.poNumber,
          BlNumber: shipmentInformation.blNumber,
          ShippingNumber: shipmentInformation.shippingnumber,
          ReferenceNumber: shipmentInformation.referenceNumber,
        },
        ShipperInfo: {
          ShipName: shipperInfo.name,
          ShipAdd1: shipperInfo.addressline1,
          ShipAdd2: shipperInfo.addressline2,
          ShipCity: shipperInfo.city,
          ShipState: shipperInfo.state,
          ShipZipCode: shipperInfo.zipCode,
          ShipCountry: shipperInfo.country,
          ShipContactName: shipperInfo.contactName,
          ShipEmail: shipperInfo.EmailAddress,
          ShipPhoneNumber: shipperInfo.PhoneNumber,
          ShipFax: shipperInfo.FaxNumber,
          ShipLoadNotes: shipperInfo.loadNotes,
          ShipEarliestDate: shipperInfo.earliestDate,
          ShipLatestDate: shipperInfo.latestDate,
          ShipEarliestTime: shipperInfo.earliestTime,
          ShipLatestTime: shipperInfo.latestTime
        },
        ConsigneeInfo: {
          ConsigName: consigneeInfo.name,
          ConsigAdd1: consigneeInfo.addressline1,
          ConsigAdd2: consigneeInfo.addressline2,
          ConsigCity: consigneeInfo.city,
          ConsigState: consigneeInfo.state,
          ConsigZipcode: consigneeInfo.zipCode,
          ConsigCountry: consigneeInfo.country,
          ConsigContactName: consigneeInfo.contactName,
          ConsigEmail: consigneeInfo.EmailAddress,
          ConsigPhoneNumber: consigneeInfo.PhoneNumber,
          ConsigFax: consigneeInfo.FaxNumber,
          ConsigLoadNotes: consigneeInfo.loadNotes,
          ConsigEarliestDate: consigneeInfo.earliestDate,
          ConsigLatestDate: consigneeInfo.latestDate,
          ConsigEarliestTime: consigneeInfo.earliestTime,
          ConsigLatestTime: consigneeInfo.latestTime
        },
        CommoditiesInfo: commoditiesRequestArray
      }

      console.log("BookRequest",BookRequest)
      const response:any = await CreateLoad(BookRequest)
      console.log("CREATEtl response",response)
      if (response.status == 200) {
        setLoader(false)
        SetLoadId(response.data.TLId)
        if (successPopup.current != null) {
          successPopup.current.classList.add("show");
          successPopup.current.style.display = "block";
        }
      }else if (response.status == 400) {
        setLoader(false)
        if (ValidationPopup.current != null) {
          ValidationPopup.current.classList.add("show");
          ValidationPopup.current.style.display = "block";

          console.log("response.dataresponse.data", response.data)
          let validationMessage = ""
          response.data.ValidationError.forEach((value: any, index: any) => {
            validationMessage = validationMessage + value.message
            if (index < response.data.ValidationError.length - 1) {
              validationMessage = validationMessage + `,`
            }
          })
          SetValidationPopupMSG(validationMessage)
        }else {
          setLoader(false)
          if (someThingWentWrongPopup.current != null) {
            someThingWentWrongPopup.current.classList.add("show");
            someThingWentWrongPopup.current.style.display = "block";
          }
        }
      }else if ( response.status == 401) {
        setLoader(false)
        if (ValidationPopup.current != null) {
          ValidationPopup.current.classList.add("show");
          ValidationPopup.current.style.display = "block";

          console.log("response.dataresponse.data", response.data)
          let validationMessage = ""
          response.data.ValidationError.forEach((value: any, index: any) => {
            validationMessage = validationMessage + value.message
            if (index < response.data.ValidationError.length - 1) {
              validationMessage = validationMessage + `,`
            }
          })
          SetValidationPopupMSG(validationMessage)
        }else {
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
 * If the ValidationPopup.current element exists, remove the "show" class and set the display to
 * "none".
 */
   const ValidationOkClick = () => {
    if (ValidationPopup.current != null) {
      ValidationPopup.current.classList.remove("show");
      ValidationPopup.current.style.display = "none";
    }
  }

  /* Creating a form dynamically. */
  const loadcommodities = () => {
    return commodities.map((data: any, index: any) => {
      return (
        <div className="row ctl-border-line pb-4 mb-4">
          <h6 className="commodities-secondary-heading mb-3">Commodity {index + 1}
            {commodities.length == 1 ? null : <a onClick={() => OnDeleteClick(data.id)}><img src="Images/commodity-delete-icon.svg" alt="delete icon" className="ps-2 delete-icon" /></a>}
          </h6>
          <div className="col-12 col-sm-12 col-md-6 col-lg-4">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                <label htmlFor="ctl-commodities-qty" className="form-label cp-form-label">QTY<span className="cp-form-mandatory"> *</span></label>
                <input type="text" value={data.commQuantity} id={`commQuantity:${index}`} name="commQuantity" maxLength={4} className="form-control cp-form-field" placeholder="Enter quantity" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
                <span className="form-label cp-form-label px-0 ms-2" id={`commQuantitySpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                <label htmlFor="ctl-commodities-uom" className="form-label cp-form-label">UOM<span className="cp-form-mandatory"> *</span></label>
                <select value={data.commUnitOfMeasurement} id={`commUnitOfMeasurement:${index}`} name="commUnitOfMeasurement" className="form-select cp-form-field" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }}>
                  <option value={""} disabled={true}>Select One</option>
                  {uomDropDown()}
                </select>
                <span className="form-label cp-form-label px-0 ms-2" id={`commUnitOfMeasurementSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-4">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                <label htmlFor="ctl-commodities-weight" className="form-label cp-form-label">Weight<span className="cp-form-mandatory"> *</span></label>
                <input type="text" value={data.commWeight} id={`commWeight:${index}`} name="commWeight" maxLength={6} className="form-control cp-form-field" placeholder="Enter Weight" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
                <span className="form-label cp-form-label px-0 ms-2" id={`commWeightSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                <label htmlFor="ctl-commodities-value" className="form-label cp-form-label">Value</label>
                <input type="text" value={data.commValue} name="commValue" maxLength={6} className="form-control cp-form-field" id={`Commvalue:${index}`} placeholder="Enter Value" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
            <label htmlFor="ctl-commodities-hazmat" className="form-check-label cp-form-label w-100">Hazmat?</label>
            <input type="checkbox" value={data.hazmat} name="hazmat" className="form-check-input cp-checkbox ms-3" id={`Commhazmat:${index}`} onChange={(event: any) => { onValueChangecommodities(event, index, "CheckBox") }} />
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-4">
            <label htmlFor="ctl-commodities-description" className="form-label cp-form-label">Description<span className="cp-form-mandatory"> *</span></label>
            <textarea value={data.commDescription} id={`commDescription:${index}`} name="commDescription" maxLength={255} className="form-control height-control cp-form-field cp-textarea" rows={6} placeholder="Add description" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            <span className="form-label cp-form-label px-0 ms-2" id={`commdescriptionSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
          </div>
          {data.hazmat ? <>
            <h6 className="commodities-third-heading  mb-3">Hazmat Material Details</h6>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-name" className="form-label cp-form-label">Shipping Name</label>
              <input type="text" value={data.hazShippingName} name="hazShippingName" maxLength={255} className="form-control cp-form-field" id="ctl-commodities-name" placeholder="Enter Shipping Name" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-description1" className="form-label cp-form-label">Description</label>
              <input type="text" value={data.hazDescription} name="hazDescription" maxLength={255} className="form-control cp-form-field" id="ctl-commodities-description1" placeholder="Enter Description" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-group-name" className="form-label cp-form-label">Group Name</label>
              <input type="text" value={data.hazGroupName} name="hazGroupName" maxLength={125} className="form-control cp-form-field" id="ctl-commodities-group-name" placeholder="Enter Group Name" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-packaging-group" className="form-label cp-form-label">Packaging Group</label>
              <input type="text" value={data.hazPackagingGroup} name="hazPackagingGroup" maxLength={125} className="form-control cp-form-field" id="ctl-commodities-packaging-group" placeholder="Enter Packaging Group" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-un-num" className="form-label cp-form-label">UN/NA Number</label>
              <input type="text" value={data.hazUNNANumber} name="hazUNNANumber" maxLength={125} className="form-control cp-form-field" id="ctl-commodities-un-num" placeholder="Enter UN/NA Number" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-class" className="form-label cp-form-label">Class</label>
              <input type="text" value={data.hazClass} name="hazClass" maxLength={20} className="form-control cp-form-field" id="ctl-commodities-class" placeholder="Enter Class" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-placard-type" className="form-label cp-form-label">Placard Type</label>
              <input type="text" value={data.hazplacardType} name="hazplacardType" className="form-control cp-form-field" id="ctl-commodities-placard-type" placeholder="Enter Placard Type" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-flash-temp" className="form-label cp-form-label">Flash Temp</label>
              <input type="number" value={data.hazFlashTemp} name="hazFlashTemp" className="form-control cp-form-field" id="ctl-commodities-flash-temp" placeholder="Enter Flash Temp" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-uom1" className="form-label cp-form-label">UoM</label>
              <select id="ctl-commodities-uom1" value={data.hazUnitOfMeasurement} name="hazUnitOfMeasurement" className="form-select cp-form-field" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }}>
                <option value={""} disabled={true}>Select UOM</option>
                <option value={"F"}>F</option>
                <option value={"C"}>C</option>
                <option value={"K"}>K</option>

                
              </select>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-flash-type" className="form-label cp-form-label">Flash Type</label>
              <input type="text" value={data.hazFlashType} name="hazFlashType" className="form-control cp-form-field" id="ctl-commodities-flash-type" placeholder="Enter Flash Type" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <h6 className="commodities-third-heading mt-4 mb-3">Hazmat Emergency Contact</h6>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-certificate-holder" className="form-label cp-form-label">Certificate Holder Name</label>
              <input type="text" value={data.hazCertificateHolderName} name="hazCertificateHolderName" maxLength={255} className="form-control cp-form-field" id="ctl-commodities-certificate-holder" placeholder="Enter Certificate Holder Name" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-contact-name" className="form-label cp-form-label">Contact Name</label>
              <input type="text" value={data.hazContactName} name="hazContactName" maxLength={255} className="form-control cp-form-field" id="ctl-commodities-contact-name" placeholder="Enter Contact Name" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} />
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 mb-3">
              <label htmlFor="ctl-commodities-phone-num" className="form-label cp-form-label">Phone Number</label>
              <input type="text" value={data.hazPhoneNumber} id={`PhoneNumberInput:${index}`} name="hazPhoneNumber" maxLength={13} className="form-control cp-form-field " placeholder="Enter Phone Number" onChange={(event: any) => { onValueChangecommodities(event, index, "number") }} />
              <span className="form-label cp-form-label px-0 ms-2" id={`PhoneNumberSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
            </div>
          </> : null}
        </div>
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
      return (
        <>
          <tr>
            <td>
              <button id={`reviewCommodityButton:${index}`} className="cp-tbl-acc-button tbl-acc-btn collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#cp-all-loads-commodity" aria-expanded="true" aria-controls="cp-all-loads-commodity" disabled= {!data.hazmat} 
                onClick={() => { onReviewCommodityButtonClick(index, data) }} />
            </td>
            <td>Commodity {index + 1}</td>
            <td>{data.commQuantity == "" ? "-" : data.commQuantity}</td>
            <td>{data.commUnitOfMeasurement == "" ? "-" : data.commUnitOfMeasurement}</td>
            <td>{data.commWeight == "" ? "-" : data.commWeight}</td>
            <td>{data.commValue == "" ? "-" : data.commValue}</td>
            <td>{data.hazmat ? "Yes" : "No"}</td>
            <td>{data.commDescription == "" ? "-" : data.commDescription}</td>
          </tr>
          {data.hazmat ? <tr id={`reviewCommodityTableRow:${index}`} className="accordion-collapse table-parent-accordion collapse bg-white">
            <td colSpan={8} className=" p-4">
              <div className="row ">
                <h5 className="primary-header mb-4">Hazmat Material Details</h5>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Group Name</h5>
                  <p className="data-txt mb-0">{data.hazGroupName == "" ? "-" : data.hazGroupName}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Packaging group</h5>
                  <p className="data-txt mb-0">{data.hazPackagingGroup == "" ? "-" : data.hazPackagingGroup}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">UN/NA Number</h5>
                  <p className="data-txt mb-0">{data.hazUNNANumber == "" ? "-" : data.hazUNNANumber}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Class</h5>
                  <p className="data-txt mb-0">{data.hazClass == "" ? "-" : data.hazClass}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label">Placard Type</h5>
                  <p className="data-txt mb-0">{data.hazplacardType == "" ? "-" : data.hazplacardType}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label ">Flash Temp</h5>
                  <p className="data-txt mb-0">{data.hazFlashTemp == "" ? "-" : data.hazFlashTemp}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label ">Flash Type</h5>
                  <p className="data-txt mb-0">{data.hazFlashType == "" ? "-" : data.hazFlashType}</p>
                </div>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label ">UOM</h5>
                  <p className="data-txt mb-0">{data.hazUnitOfMeasurement == "" ? "-" : data.hazUnitOfMeasurement}</p>
                </div>
                <h5 className="primary-header mb-4">Hazmat Emergency Contact</h5>
                <div className="taccordion-data-width mb-4">
                  <h5 className="t-data-label ">Certificate Holder Name</h5>
                  <p className="data-txt mb-0">{data.hazCertificateHolderName == "" ? "-" : data.hazCertificateHolderName}</p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">Contact Name</h5>
                  <p className="data-txt mb-0">{data.hazContactName == "" ? "-" : data.hazContactName}</p>
                </div>
                <div className="taccordion-data-width">
                  <h5 className="t-data-label ">Phone Number</h5>
                  <p className="data-txt mb-0">{data.hazPhoneNumber == "" ? "-" : data.hazPhoneNumber}</p>
                </div>
              </div>
            </td>
          </tr> : null}
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
    SetCustomer("")
    setshipmentInformation({...shipmentInformation,
      ["equipmentType"]: "",
      ["poNumber"]: "",
      ["blNumber"]: "",
      ["shippingnumber"]: "",
      ["referenceNumber"]: ""
    })
    shipmentInfoDownButtonRef.current?.classList.remove('completed');
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
    ShipperInfoDownButtonRef.current?.classList.remove('completed');
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
    consigneeInfoDownButtonRef.current?.classList.remove('completed');
    Setcommodities([{
        ["id"]:"",
        ["commQuantity"]: "",
        ["commUnitOfMeasurement"]: "",
        ["commWeight"]: "",
        ["commValue"]: "",
        ["hazmat"]: false,
        ["commDescription"]: "",
        ["hazShippingName"]: "",
        ["hazDescription"]: "",
        ["hazGroupName"]: "",
        ["hazPackagingGroup"]: "",
        ["hazUNNANumber"]: "",
        ["hazClass"]: "",
        ["hazplacardType"]: "",
        ["hazFlashTemp"]: "",
        ["hazUnitOfMeasurement"]: "",
        ["hazFlashType"]: "",
        ["hazCertificateHolderName"]: "",
        ["hazContactName"]: "",
        ["hazPhoneNumber"]: "",
        ["reviewAcc"]: false }])
      commoditiesDownButtonRef.current?.classList.remove('completed');

      setcompletedCheck({ ...completedCheck, 
        ["shipmentInformation"]: false,
        ["Shipper"]: false,
        ["consignee"]: false,
        ["commodities"]: false, })

   

    // Setcommodities({...commodities,
    //   ["commQuantity"]: "",
    //   ["commUnitOfMeasurement"]: "",
    //   ["commWeight"]: "",
    //   ["commValue"]: "",
    //   ["hazmat"]: false,
    //   ["commDescription"]: "",
    //   ["hazShippingName"]: "",
    //   ["hazDescription"]: "",
    //   ["hazGroupName"]: "",
    //   ["hazPackagingGroup"]: "",
    //   ["hazUNNANumber"]: "",
    //   ["hazClass"]: "",
    //   ["hazplacardType"]: "",
    //   ["hazFlashTemp"]: "",
    //   ["hazUnitOfMeasurement"]: "",
    //   ["hazFlashType"]: "",
    //   ["hazCertificateHolderName"]: "",
    //   ["hazContactName"]: "",
    //   ["hazPhoneNumber"]: "",
    //   ["reviewAcc"]: false })
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
    } else if (response.status == 400) {
      if (VerifyPopup.current != null) {
        VerifyPopup.current.classList.add("show");
        VerifyPopup.current.style.display = "block";
        setVerifyPopupMSG("YOU ENTERED AN UNKNOWN CONSIGNEE ADDRESS")
        setVerifyAddressPopupMSG(consigneeInfo.addressline1 + " " + consigneeInfo.city + " " + consigneeInfo.state + " " + consigneeInfo.zipCode)
      }
    }
  }

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


  return (
    <div className=' mb-5'>
      <div className="row">
        {/* Breadcrumb Section Starts Here */}
        <div className="col-md-12 my-3">
          <ul className="breadcrumb mb-0">
            <li><a className="cursor"onClick={() => { navigate("/loadsearch") }}>All Loads</a></li>
            <li className="pe-2">Create TL</li>
          </ul>
        </div>
        {/* Breadcrumb Section Ends Here */}
        <div className="accordion" id="ctl-primary-info">
          <div className="accordion-item cp-accordion-brd-radius border-0">
            {/* <h2 className="accordion-header" id="headingOne">
              <button id="btn" className="accordion-button ctl-header-accordion page-header-txt btn cp-accordion-brd-radius shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#create-new-truckload" aria-expanded="false" aria-controls="create-new-truckload" >
                Create New Truckload
                <span className="primary-info-accordion d-md-block d-none" id="values">Hide Details</span>
              </button>
            </h2> */}
            
            <h2 className="accordion-header position-relative d-flex align-items-center p-3" id="book-primary-info">
              <p id="btn" className="page-header-txt mb-0">Create New Truckload</p>
              <button className="ms-auto ctl-header-accordion primary-info-accordion ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#create-new-truckload" aria-expanded="false" aria-controls="create-new-truckload"><span className="ms-3">Hide Details</span></button>
              </h2>
            <div id="create-new-truckload" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#ctl-primary-info">
              <div className="accordion-body ">
                <div className="row ">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-4">
                      <label htmlFor="cp-create-customer" className="form-label cp-form-label">Customer
                        <span className="cp-form-mandatory"> *</span>
                      </label>
                      <select id="cp-create-customer" className="form-select cp-form-field" value={Customer} ref={CustomerSelectRef} onChange={(event: any) => { onCustomerChange(event) }}>
                        <option value={""} disabled={true}>Select Customer</option>
                        {customerDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0 ms-2" ref={CustomerSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                </div>
                <div className='row justify-content-between'>
                  <div className="col-sm-12 col-md-6 my-2 col-lg-4 col-xl-3 col-xxl-2">
                    <p className="data-label">Credit Limit : <span className="data-txt">${AgentDetails.creditLimit == "" ? `0.00` : AgentDetails.creditLimit}</span></p>
                  </div>
                  <div className="col-sm-12 col-md-6 my-2 col-lg-4 col-xl-3 col-xxl-2">
                    <p className="data-label">Available Credit : <span className="data-txt">${AgentDetails.avaliableCredit == "" ? `0.00` : AgentDetails.avaliableCredit}</span></p>
                  </div>
                  <div className="col-sm-12 col-md-6 my-2 col-lg-4 col-xl-4 col-xxl-2">
                    <p className="data-label">My Mode Contact : <span className="data-txt">{AgentDetails.agentContact == "" ? `-` : AgentDetails.agentContact}</span></p>
                  </div>
                  <div className="col-sm-12 col-md-6 my-2 col-lg-12 col-xl-4 col-xxl-3">
                    <p className="data-label">Email ID : <span className="cp-link">
                      <a href={`mailto:${AgentDetails.agentEmailId}`} className="cp-link">{AgentDetails.agentEmailId == "" ? `-` : AgentDetails.agentEmailId}</a></span></p>
                  </div>
                  <div className="col-sm-12 col-md-6 my-2 col-lg-4 col-xl-8 col-xxl-2">
                    <p className="data-label">Phone : <span className="data-txt">{AgentDetails.agentPhone == "" ? `-` : AgentDetails.agentPhone}</span></p>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion" id="accordionPanelsStayOpenExample">
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={shipmentInfoAccordionDivRef} >
            <h2 className="accordion-header py-1" id="shipmentid">
              <button ref={shipmentInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#shipmentinformation" aria-expanded="true" aria-controls="shipmentinformation">
                <span className="ms-3"> Shipment Information </span>
              </button>
              {completedCheck.shipmentInformation ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={shipmentInfoDivRef} id="shipmentinformation" className="accordion-collapse  collapse" aria-labelledby="shipmentid">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="ship-equipmenttype" className="form-label cp-form-label">Equipment Type
                        <span className="cp-form-mandatory"> *</span>
                      </label>
                      <select id="ship-equipmenttype" className="form-select cp-form-field" ref={EqupmentTypeSelectRef}
                        value={shipmentInformation.equipmentType} name="equipmentType" onChange={(event: any) => { onShipmentInformationChange(event) }}>
                        <option value={""} disabled={true}>Select the Equipment type</option>
                        {EquipmentDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0 ms-2" ref={EqupmentTypeSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="ship-po-number" className="form-label cp-form-label">P.O.Number</label>
                      <input type="text" value={shipmentInformation.poNumber} className="form-control cp-form-field"
                        id="ship-po-number" placeholder="Enter P.O.Number" name="poNumber" onChange={(event: any) => { onShipmentInformationChange(event) }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="ship-b/l-number" className="form-label cp-form-label">B/L Number</label>
                      <input type="text" value={shipmentInformation.blNumber} className="form-control cp-form-field"
                        id="ship-b/l-number" placeholder="Enter B/L Number" name="blNumber" onChange={(event: any) => { onShipmentInformationChange(event) }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="shipping-number" className="form-label cp-form-label">Shipping Number</label>
                      <input type="text" value={shipmentInformation.shippingnumber} className="form-control cp-form-field"
                        id="shipping-number" placeholder="Enter Shipping Number" name="shippingnumber" onChange={(event: any) => { onShipmentInformationChange(event) }} />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="ship-reference-number" className="form-label cp-form-label">Reference Number</label>
                      <input type="text" value={shipmentInformation.referenceNumber} className="form-control cp-form-field"
                        id="ship-reference-number" placeholder="Enter Reference Number" name="referenceNumber" onChange={(event: any) => { onShipmentInformationChange(event) }} />
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn cp-btn-primary my-4" onClick={() => { onShipmentClick() }}>Continue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={ShipperInfoAccordionDivRef}>
            <h2 className="accordion-header py-1" id="qotto-book-shipper-information">
              <button ref={ShipperInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#qotto-book-shipper-info" aria-expanded="false" aria-controls="qotto-book-shipper-info">
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
                      <select id="qotto-book-shipper" className="form-select cp-form-field" name='shipper' value={shipperInfo.shipper} onChange={(event: any) => { onShipperValueChange(event, "shipper") }}>
                        <option value={""} disabled={true}>Select a Shipper</option>
                        {shipperDropDown()}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-shipper-name" className="form-label cp-form-label">Name<span className="cp-form-mandatory"> *</span></label>
                      <input type="text" maxLength={255} ref={shipNameInputRef} className="form-control cp-form-field" id="qotto-book-shipper-name" placeholder="Enter Shipper Name" name='name' value={shipperInfo.name} onChange={(event: any) => { onShipperValueChange(event, "Text") }} />
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
                        <input type="text" maxLength={60} ref={shipCityInputRef} className="form-control cp-form-field" id="qotto-book-shipper-city" placeholder="Enter City" name="city" value={shipperInfo.city} onChange={(event: any) => { onShipperValueChange(event, "Text") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipCitySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-shipper-state" className="form-label cp-form-label">State<span className="cp-form-mandatory"> *</span></label>
                        <select id="qotto-book-shipper-state" ref={shipStateInputRef} className="form-select cp-form-field" name="state" value={shipperInfo.state} onChange={(event: any) => { onShipperValueChange(event, "") }}>
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
                        <input type="text" maxLength={7} ref={shipZipCodeInputRef} className="form-control cp-form-field" id="qotto-book-shipper-zipcode" placeholder="Enter Zip Code" name='zipCode' value={shipperInfo.zipCode} onChange={(event: any) => { onShipperValueChange(event, "Zip") }} />
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
                    <button type="button" className="btn cp-btn-primary my-4" title="verify-address" onClick={() => { onShipperVerifyAddress() }}>Verify Address</button>
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
                        <input type="text" ref={shipPhoneInputRef} maxLength={14} value={shipperInfo.PhoneNumber} name="PhoneNumber" className="form-control cp-form-field" id="qotto-book-shipper-phone#" placeholder="Enter Phone Number" onChange={(event: any) => { onShipperValueChange(event, "Pnumber") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipPhoneSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-fax#" className="form-label cp-form-label">Fax Number</label>
                        <input type="text" ref={shipFaxInputRef} maxLength={14} value={shipperInfo.FaxNumber} name="FaxNumber" className="form-control cp-form-field" id="qotto-book-shipper-fax#" placeholder="Enter Fax Number" onChange={(event: any) => { onShipperValueChange(event, "Pnumber") }} />
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
                        <input type="date" min={moment().subtract(0, 'day').format('YYYY-MM-DD')} className="form-control cp-form-field" ref={shipEarliestDateInputRef} id="qotto-book-shipper-earliestdate" value={shipperInfo.earliestDate} name="earliestDate" onChange={(event: any) => { onShipperValueChange(event, "earliestDate") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipEarliestDateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-earliesttime" className="form-label cp-form-label">Earliest Time</label>
                        <input type="time" className="form-control cp-form-field" id="qotto-book-shipper-earliesttime"
                          value={shipperInfo.earliestTime} name="earliestTime" ref={shipEarliestTimeInputRef} onChange={(event: any) => { onShipperValueChange(event, "") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={shipEarliestTimeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-latestdate" className="form-label cp-form-label">Latest Date</label>
                        <input type="date" min={moment(new Date(shipperInfo.earliestDate)).format('YYYY-MM-DD')} className="form-control cp-form-field" id="qotto-book-shipper-latestdate" value={shipperInfo.latestDate} name="latestDate" onChange={(event: any) => { onShipperValueChange(event, "") }} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-shipper-latesttime" className="form-label cp-form-label">Latest Time</label>
                        <input type="time" className="form-control cp-form-field" id="qotto-book-shipper-latesttime" value={shipperInfo.latestTime} name="latestTime" onChange={(event: any) => { onShipperValueChange(event, "") }} />
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
              <button ref={consigneeInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#qotto-book-consignee-info" aria-expanded="false" aria-controls="qotto-book-consignee-info">
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
                      <select id="qotto-book-consignee" className="form-select cp-form-field" value={consigneeInfo.consignee} onChange={(event: any) => { onConsigneeValueChange(event, "consignee") }}>
                        <option value={""} disabled={true}>Select a Consignee</option>
                        {consigneeDropDown()}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="qotto-book-consignee-name" className="form-label cp-form-label">Name<span className="cp-form-mandatory"> *</span></label>
                      <input type="text" ref={ConsigneeNameInputRef} maxLength={255} className="form-control cp-form-field" id="qotto-book-consignee-name" placeholder="Enter Consignee Name" name='name' value={consigneeInfo.name} onChange={(event: any) => { onConsigneeValueChange(event, "Text") }} />
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
                        <input type="text" maxLength={60} ref={ConsigneeCityInputRef} className="form-control cp-form-field" id="qotto-book-consignee-city" name='city' value={consigneeInfo.city} placeholder="Enter City" onChange={(event: any) => { onConsigneeValueChange(event, "Text") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeCitySpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <label htmlFor="qotto-book-consignee-state" className="form-label cp-form-label">State<span className="cp-form-mandatory"> *</span></label>
                        <select id="qotto-book-consignee-state" ref={ConsigneeStateInputRef} className="form-select cp-form-field" name='state' value={consigneeInfo.state} onChange={(event: any) => { onConsigneeValueChange(event, "") }}>
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
                        <input type="text" maxLength={7} ref={ConsigneeZipCodeInputRef} value={consigneeInfo.zipCode} name='zipCode' className="form-control cp-form-field" id="qotto-book-consignee-zip-code" placeholder="Enter Zip Code" onChange={(event: any) => { onConsigneeValueChange(event, "Zip") }} />
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
                    <button type="button" className="btn cp-btn-primary my-4" onClick={() => { onConsigneeVerifyAddress() }}>Verify Address</button>
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
                        <input type="text" maxLength={14} ref={ConsigneePhoneInputRef} value={consigneeInfo.PhoneNumber} name='PhoneNumber' className="form-control cp-form-field" id="qotto-book-consignee-phone-num" placeholder="Enter Phone Number" onChange={(event: any) => { onConsigneeValueChange(event, "Pnumber") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneePhoneSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-faxnum" className="form-label cp-form-label">Fax Number</label>
                        <input type="text" maxLength={14} ref={ConsigneeFaxInputRef} value={consigneeInfo.FaxNumber} name='FaxNumber' className="form-control cp-form-field" id="qotto-book-consignee-faxnum" placeholder="Enter Fax Number" onChange={(event: any) => { onConsigneeValueChange(event, "Pnumber") }} />
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
                        <input type="date" min={moment(new Date(shipperInfo.earliestDate)).format('YYYY-MM-DD')} ref={ConsigneeEarliestDateInputRef} className="form-control cp-form-field" value={consigneeInfo.earliestDate} name="earliestDate" id="qotto-book-consignee-earliest-date" onChange={(event: any) => { onConsigneeValueChange(event, "earliestDate") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeEarliestDateSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-earliest-time" className="form-label cp-form-label">Earliest Time</label>
                        <input type="time" value={consigneeInfo.earliestTime} ref={ConsigneeEarliestTimeInputRef} name="earliestTime" className="form-control cp-form-field" id="qotto-book-consignee-earliest-time" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                        <span className="form-label cp-form-label px-0 ms-2" ref={ConsigneeEarliestTimeSpanRef} hidden={true} style={{ color: "red" }}></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-latest-date" className="form-label cp-form-label">Latest Date</label>
                        <input type="date" min={moment(new Date(consigneeInfo.earliestDate)).format('YYYY-MM-DD')} className="form-control cp-form-field" value={consigneeInfo.latestDate} name="latestDate" id="qotto-book-consignee-latest-date" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                        <label htmlFor="qotto-book-consignee-latesttime" className="form-label cp-form-label">Latest Time</label>
                        <input type="time" className="form-control cp-form-field" value={consigneeInfo.latestTime} name="latestTime" id="qotto-book-consignee-latesttime" onChange={(event: any) => { onConsigneeValueChange(event, "") }} />
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
            <h2 className="accordion-header py-1" id="commoditiesid">
              <button ref={commoditiesDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#commodities" aria-expanded="false" aria-controls="commodities">
                <span className="ms-3"> Commodities </span> <span>({commodities.length})</span>
              </button>
              {completedCheck.commodities ? <div className="float-end">
                <label className="completed-status me-4">
                  <span>
                    <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                  </span>
                  Completed</label>
              </div> : null}
            </h2>
            <div ref={commoditiesDivRef} id="commodities" className="accordion-collapse collapse" aria-labelledby="commoditiesid">
              <div className="accordion-body cp-accordion-body-padding">
                <div className="row pb-3">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 mb-4">
                    <label htmlFor="ctl-commodities-load-notes" className="form-label cp-form-label">BOL Special Instructions</label>
                    <textarea className="form-control height-control cp-form-field cp-textarea mb-3" value={BolDescription} rows={6}
                      id="ctl-commodities-load-notes" placeholder="Enter Special Instructions"
                      onChange={(event: any) => {
                        setBolDescription(event.target.value)
                      }} />
                  </div></div>
                {loadcommodities()}
                <div className="text-start mb-3">
                  <button type="button" className="btn cp-btn-secondary my-4" onClick={() => { addNewCommodity() }}>Add Commodity</button>
                </div>
                <div className="text-end">
                  <button type="button" className="btn cp-btn-primary my-4" onClick={() => { commoditiesContinueClick() }}>Continue</button>
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
                  <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { ValidationOkClick() }}>OK</button>
                </div>
              </div>
            </div>
          </div> 
          <div className="accordion-item cp-accordion-brd-radius border-0 my-3">
            <h2 className="accordion-header py-1" id="review-createid">
              <button ref={ReviewDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#review-create" aria-expanded="false" aria-controls="review-create">
                <span className="ms-3"> Review and Create </span>
              </button>
            </h2>
            <div ref={ReviewDivRef} id="review-create" className="accordion-collapse collapse" aria-labelledby="review-createid">
              <div className="accordion-body cp-accordion-body-padding pt-0">
                <div className="row">
                  <span className="mb-3">Please review the criteria below to ensure that the truckload information is correct. Updates cannot be made once the truckload has been created.</span>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-4">
                    <div className="row">
                      <h5 className="primary-header mb-2 "><img src="Images/reference-info-icon.svg" alt="reference-info-icon" className="title-icon me-3" />Reference Info</h5>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                        <h5 className="data-label ">Purchase Order</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{shipmentInformation.poNumber == "" ? `-` : `PO# ${shipmentInformation.poNumber}`}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                        <h5 className="data-label ">Bill of Lading</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{shipmentInformation.blNumber == "" ? `-` : `PO# ${shipmentInformation.blNumber}`}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                        <h5 className="data-label ">Shipping Number</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{shipmentInformation.shippingnumber == "" ? `-` : `PO# ${shipmentInformation.shippingnumber}`}</p>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-3 mt-3 mb-2">
                        <h5 className="data-label ">Pro Number</h5>
                        <p className="data-txt mb-0 mt-2 mb-0">{shipmentInformation.referenceNumber == "" ? `-` : `PO# ${shipmentInformation.referenceNumber}`}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 ctl-res-brd-left-sty  mt-4">
                    <div className="row">
                      <h6 className="primary-header mb-4"><img src="Images/shipper-info-icon.svg" alt="A icon with truck symbol" className="title-icon me-3" />  Shipper Info</h6>
                      <label className="data-label">Name</label>
                      <p className="data-txt mb-0 mt-2 mb-0">{shipperInfo.name == "" ? ` -` : shipperInfo.name}</p>
                      <p className="data-txt mb-0">{shipperInfo.addressline1 == "" ? ` -` : shipperInfo.addressline1} {shipperInfo.addressline2}</p>
                      <p className="data-txt mb-0">{shipperInfo.city},{shipperInfo.state} {shipperInfo.zipCode}</p>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Earliest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {shipperInfo.earliestDate == "" ? `NA` : moment(new Date(shipperInfo.earliestDate)).format("MM/DD/YYYY")} &amp; {shipperInfo.earliestTime == "" ? `NA` : shipperInfo.earliestTime}</p>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6 col-12 mt-3 mb-2">
                        <label className="data-label ">Latest Date &amp; Time</label>
                        <p className="data-txt mb-0 mt-2 mb-0">
                          {shipperInfo.latestDate == "" ? `NA` : moment(new Date(shipperInfo.latestDate)).format("MM/DD/YYYY")} &amp; {shipperInfo.latestTime == "" ? `NA` : shipperInfo.latestTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6  mt-4 res-cosignee-brd-left-sty ">
                    <div className="row">
                      <h6 className="primary-header mb-4 "><img src="Images/consignee-info-icon.svg" alt="A icon with truck symbol" className="title-icon me-3" /> Consignee Info</h6>
                      <label className="data-label">Name</label>
                      <p className="data-txt mb-0 mt-2 mb-0">{consigneeInfo.name == "" ? `-` : consigneeInfo.name}</p>
                      <p className="data-txt mb-0">{consigneeInfo.addressline1 == "" ? ` -` : shipperInfo.addressline1} {consigneeInfo.addressline2}</p>
                      <p className="data-txt mb-0">{consigneeInfo.city},{consigneeInfo.state} {shipperInfo.zipCode}
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
                  <div className="col-12 col-sm-12 col-md-6 col-lg-12  mt-4">
                    <div className="row">
                      <h5 className="primary-header mb-2 "><img src="Images/bol-notes-icon.svg" alt="notes-icon" className="title-icon me-3 mb-3" />BOL Special Instruction</h5>
                      <p className="data-txt">
                         {BolDescription == "" ? `-` : BolDescription}</p>
                    </div>
                  </div>
                  <div className="col-md-12 mt-4">
                    <h6 className="primary-header mb-4"><img src="Images/commodities-icon.svg" alt="commodities-icon" className="title-icon me-3" />Commodities <span>({commodities.length})</span></h6>
                    <div className="table-responsive mb-2 cp-grid">
                      <table className="table mb-0  table-borderless ">
                        <thead className="cp-table-head ">
                          <tr>
                            <th />
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>UOM</th>
                            <th>Weight</th>
                            <th>Value</th>
                            <th>Hazmat</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {QuoteReviewCommodityContent()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end">
        <button type="button" className="btn cp-btn-tertiary my-4 me-2" onClick={() => { onCancelClick() }}>Clear</button>
                  {/*data-bs-toggle="modal" data-bs-target="#ctl-sucess-popup" onCancelClick*/}
        <button type="button" className="btn cp-btn-primary my-4"  onClick={() => { CreateLoadClick() }}>
          Create Load
        </button>
      </div>
      {/* createTL ends here*/}
      {/* Create load popup */}
      <div className="modal fade" id="ctl-sucess-popup" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={successPopup} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered success-popup-width">
          <div className="modal-content">
            <div className="modal-header pt-4 justify-content-center border-0">
              <img src="Images/success-icon.svg" alt="success-icon" className="success-icon" />
            </div>
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header"> Truck Load Creation Success!</h5>
              <p className="popup-txt">Your TL has been created successfully with load ID : <a href={`/al-details-tl?lid=`+LoadId+`&lorg=BTMS`} className="cp-link" > {LoadId} </a></p>
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
            {/**/}
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
            {/**/}
            <div className="modal-body py-0 text-center border-0">
              <h5 className="popup-header">Something Went Wrong</h5>
              <p className="popup-txt">Oops - We're having some trouble completing Your request.</p>
            </div>
            <div className="modal-footer pb-4 justify-content-center border-0">
              <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal" onClick={() => { someThingWentWrongOkClick() }}>Ok</button>
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

export default CreateLtl