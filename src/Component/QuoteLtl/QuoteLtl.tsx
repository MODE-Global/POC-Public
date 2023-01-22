import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import {
  Getaccessorials,
  GetClassList, GetPayTypeList,
  GetPreSavedCommodtiesList, GetQuotationID,
  GetRetrieveItemdetail,
  GetStatesList, GetUOMList, GetUserDetail, NmfcSearch, VerifyZip
} from '../../api/api';
import { CancelApi } from '../../api/Client';
import { UserContext } from '../../app/Context';
import { QuoteRequest, StateDetail } from '../../interface/QuoteLtlInterface';

const QuoteLtl = () => {
  const context = useContext(UserContext);
  let navigate = useNavigate();
  const QuoteLtlRequest = context.GetQuoteLtlRequest();
  const GetBookLtlRequest = context.GetBookLtlRequest();

  const pickZipInputRef = useRef<HTMLInputElement>(null);
  const pickZipSpanRef = useRef<HTMLSpanElement>(null);
  const pickCityInputRef = useRef<HTMLInputElement>(null);
  const pickCitySpanRef = useRef<HTMLSpanElement>(null);
  const deliveryCityInputRef = useRef<HTMLInputElement>(null);
  const deliveryCitySpanRef = useRef<HTMLSpanElement>(null);
  const deliveryZipInputRef = useRef<HTMLInputElement>(null);
  const deliveryZipSpanRef = useRef<HTMLSpanElement>(null);
  const CustomerSelectRef = useRef<HTMLSelectElement>(null);
  const CustomerSpanRef = useRef<HTMLSpanElement>(null);
  const pickStateSelectRef = useRef<HTMLSelectElement>(null);
  const pickStateSpanRef = useRef<HTMLSpanElement>(null);
  const deliveryStateSelectRef = useRef<HTMLSelectElement>(null);
  const deliveryStateSpanRef = useRef<HTMLSpanElement>(null);
  const PayTypeSelectRef = useRef<HTMLSelectElement>(null);
  const PayTypeSpanRef = useRef<HTMLSpanElement>(null);

  const shipperInfoDivRef = useRef<HTMLDivElement>(null);
  const shipperInfoDownButtonRef = useRef<HTMLButtonElement>(null);
  const shipperInfoAccordionDivRef = useRef<HTMLDivElement>(null);

  const commoditiesDivRef = useRef<HTMLDivElement>(null);
  const commoditiesAccordionDivRef = useRef<HTMLDivElement>(null);
  const commoditiesDownButtonRef = useRef<HTMLButtonElement>(null);

  const accesorialsDivRef = useRef<HTMLDivElement>(null);
  const accesorialsDownButtonRef = useRef<HTMLButtonElement>(null);

  const ValidationPopup = useRef<HTMLDivElement>(null);
  const someThingWentWrongPopup = useRef<HTMLDivElement>(null);
  const noContentPopup = useRef<HTMLDivElement>(null);
  const LoadingQuotedPopup = useRef<HTMLDivElement>(null);
  const NMFCDivPopUp = useRef<HTMLDivElement>(null);
  const NMFCItemDivPopUp = useRef<HTMLDivElement>(null);

  const PickLimitedDiv = useRef<HTMLDivElement>(null);
  const DropLimitedDiv = useRef<HTMLDivElement>(null);

  const [shipInfo, SetShipInfo] = useState(QuoteLtlRequest.shipInfo)
  const [Quantity, SetQuantity] = useState(0)
  const [Weight, SetWeight] = useState(0)
  const [ValidationPopupMSG, SetValidationPopupMSG] = useState("")
  const [NmfcValidationPopupMSG, SetNmfcValidationPopupMSG] = useState("")
  const [noContentPopupMSG, setnoContentPopupMSG] = useState("")
  const [popupSearch, setpopupSearch] = useState("")

  let emptyArray: any = []
  const [nmfcPopupData, setnmfcPopupData] = useState(emptyArray)
  const [nmfcItemPopupData, setnmfcItemPopupData] = useState(emptyArray)
  const [currentNmfcCommodity, setcurrentNmfcCommodity] = useState(0)
  const [CurrentNmfcDesc, setCurrentNmfcDesc] = useState("")
  const [CurrentnmfcCode, setCurrentnmfcCode] = useState("")
  const [accessorialValue, SetaccessorialValue] = useState(QuoteLtlRequest.accessorials)

  let nmfcPopupCountObj = {
    TotalPages: "",
    CurrentPage: "",
    TotalMatch: "",
    StartIndex: "",
    EndIndex: "",
  }
  const [nmfcPopupCount, setnmfcPopupCount] = useState(nmfcPopupCountObj)
  let accessorialLimitedObj = {
    pickLimited: QuoteLtlRequest.pickLimited,
    deliveryLimited: QuoteLtlRequest.deliveryLimited,
  }
  const [accessorialLimited, SetaccessorialLimited] = useState(accessorialLimitedObj)
  const [GetCustomerData, setGetCustomerData] = useState(QuoteLtlRequest.customerData)
  let stringArray: string[] = []
  const [GenralAccessorials, SetGenralAccessorials] = useState(stringArray)
  const [PickAccessorials, SetPickAccessorials] = useState(stringArray)
  const [DropAccessorials, SetDropAccessorials] = useState(stringArray)
  const [LimitedAccessorials, SetLimitedAccessorials] = useState(stringArray)
  const [getUserDetail, SetGetUserDetail] = useState(emptyArray)
  const [stateOptions, setStateOptions] = useState<StateDetail[]>([])
  const [payTypeOptions, setPayTypeOptions] = useState<any[]>([])
  const [classOptions, setClassOptions] = useState<any[]>([])
  const [uomOptions, setUOMOptions] = useState<any[]>([])
  const [preSavedCommodityOptions, setPreSavedCommodityOptions] = useState<any[]>([])
  const [preSavedCommodityZipOptions, setpreSavedCommodityZipOptions] = useState<any[]>([])

  const [commodities, Setcommodities] = useState(QuoteLtlRequest.commodities)
  const [barLoader, setbarLoader] = useState(99);
  const [LinearFt, SetLinearFt] = useState("")
  const [loader, setLoader] = useState(false)
  const [popUpLoader, setpopUpLoader] = useState(false)

  let divCompletedObj = {
    Shipper: false,
    commodities: false,
  }
  const [completedCheck, setcompletedCheck] = useState(divCompletedObj)

  /* Calling the GetUserDetail function and then it is checking the response.status. If the
  response.status is 200 then it is pushing the value.customerDetails into the customerDetail array. */
  useEffect(() => {
    const GetOnLoadData = async () => {
      const response: any = await GetUserDetail(localStorage.getItem('userId'))
      if (response.status == 200) {
        let customerDetail: any[] = []
        response.data.userDetails.forEach((value: any) => {
          if (value.permission.includes("Quote LTL")) {
            value.customerDetails.forEach((customer: any) => {
              customerDetail.push(customer)
            })
          }
        })

        if(customerDetail.length==1){
          console.log("customerDetail inside",customerDetail)
          SetShipInfo({ ...shipInfo, ["customer"]: customerDetail[0].mySunteckLoginId })
          setGetCustomerData({
            ...GetCustomerData,
            ["custaId"]: customerDetail[0].custaId,
            ["custmId"]: customerDetail[0].custmId,
            ["ratingEngine"]: customerDetail[0].ratingEngine,
          })
        
      let customerAcct = getUserDetail.find((x: any) => x.mySunteckLoginId == customerDetail[0].mySunteckLoginId)
      populateAccessorials(customerAcct?.ratingEngine, customerAcct?.custmId)
      preSavedCommoditiesDropdown(customerAcct?.custaId);
        }

        let ratingEngine: any = "";
        let custmId: any = "";
        customerDetail.forEach((val: any, index: any) => {
          if (Number(val.mySunteckLoginId) == Number(shipInfo.customer)) {
            ratingEngine = val.ratingEngine
            custmId = val.custmId
            setGetCustomerData({
              ...GetCustomerData,
              ["custaId"]: val.custaId,
              ["custmId"]: val.custmId,
              ["ratingEngine"]: val.ratingEngine,
            })
          }
        })

        if (shipInfo.customer != "" && ratingEngine != "") {
          const userResponse: any = await Getaccessorials(ratingEngine, custmId)

          const GenralAccessorials: any[] = []
          const PickAccessorials: any[] = []
          const DropAccessorials: any[] = []
          const LimitedAccessorials: any[] = []

          if (userResponse.status == 200) {
            userResponse.data.accessorialsResponse.forEach((data: any) => {

              if (data.generalAccessorialFlag == 1) {
                GenralAccessorials.push(data.accessorialName)
              }

              if (data.pickAccessorialFlag == 1 && data.dropAccessorialFlag == 0) {
                PickAccessorials.push(data.accessorialName)
              }

              if (data.pickAccessorialFlag == 0 && data.dropAccessorialFlag == 1) {
                DropAccessorials.push(data.accessorialName)
              }

              if (data.limitedFlag == 1) {
                LimitedAccessorials.push(data.accessorialName)
              }
            })
          }
          else {
            if (someThingWentWrongPopup.current != null) {
              someThingWentWrongPopup.current.classList.add("show");
              someThingWentWrongPopup.current.style.display = "block";
            }
          }

          SetGenralAccessorials(GenralAccessorials)
          SetPickAccessorials(PickAccessorials)
          SetDropAccessorials(DropAccessorials)
          SetLimitedAccessorials(LimitedAccessorials)
        }

        SetGetUserDetail(customerDetail)
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
    const GetPayTypes = async () => {
      const response: any = await GetPayTypeList();
      if (response.status == 200) {
        setPayTypeOptions(response.data.PayType);
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
    GetOnLoadData()
    GetStates()
    GetPayTypes()
    GetClassTypes()
    GetUOMTypes()
  }, [])

  /* Setting the state of the shipInfo object to the values of the GetBookLtlRequest.BooktoQuote object. */
  useEffect(() => {
    if (GetBookLtlRequest.BooktoQuote) {

      SetShipInfo({
        ...shipInfo,
        ["pickCity"]: (GetBookLtlRequest.shipperInfo.city).toUpperCase(),
        ["pickState"]: GetBookLtlRequest.shipperInfo.state,
        ["pickZipCode"]: GetBookLtlRequest.shipperInfo.zipCode,
        ["deliveryCity"]: (GetBookLtlRequest.consigneeInfo.city).toUpperCase(),
        ["deliveryState"]: GetBookLtlRequest.consigneeInfo.state,
        ["deliveryZipCode"]: GetBookLtlRequest.consigneeInfo.zipCode
      })
    }
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
* It returns a list of options, where each option is a Paytype and its ID.
* @returns An array of options.
*/
  const payTypeDropDown = () => {
    return payTypeOptions.map((data: any, index: any) => {
      return (
        <option key={index} value={data.PayType}>{data.PayType}</option>
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
* It returns a list of options, where each option is a a presaved commodity and its details.
* @returns An array of options.
*/
  const preSaveDropDown = () => {
    return preSavedCommodityZipOptions.map((data: any, index: any) => {
      return (
        <option key={index} value={data.id}>{data.description}</option>
      )
    })
  }

  const populateNmfc = () => {
    return nmfcPopupData.map((data: any, index: any) => {
      return (
        <tr key={index}>
          <td><a className="cp-link" onClick={() => { clickOnItemNumber(data.ItemNumber, data.Description.SearchHit, data.Description.Text) }} data-bs-target="#nmfc-item-popup" data-bs-toggle="modal" data-bs-dismiss="modal">{data.ItemNumber}</a></td>
          <td>{data.Description.SearchHit} {data.Description.Text}</td>
        </tr>
      )
    })
  }

  const populateNmfcItem = () => {
    return nmfcItemPopupData[0]?.SubItems?.SubItem?.map((data: any, index: any) => {
      return (
        <tr key={index}>
          <td>{data.Description}</td>
          <td><a className="cp-link" onClick={() => { clickOnSubItemNumber(data.Classification) }} data-bs-target="#nmfc-item-popup" data-bs-toggle="modal" data-bs-dismiss="modal">{data.Item}</a> <span className='data-txt'>{`(Class`}{data.Classification}{`)`}</span></td>
        </tr>
      )
    })
  }

  const clickOnItemNumber = async (ItemNumber: any, SearchHit: any, Text: any) => {
    setpopUpLoader(true)
    if (NMFCItemDivPopUp.current != null && NMFCDivPopUp.current != null) {
      NMFCDivPopUp.current.classList.remove("show");
      NMFCDivPopUp.current.style.display = "none";
      NMFCItemDivPopUp.current.classList.add("show");
      NMFCItemDivPopUp.current.style.display = "block";
    }
    const nmfcItemResponse: any = await GetRetrieveItemdetail(ItemNumber)
    const currentNmfcItem = nmfcItemResponse.data.nmfcRetrieveResponse.Body.RetrieveItemDetailResponse.RetrieveItemDetailResult.Result.Articles.Article;
    const particularItem: any = []
    setpopUpLoader(false)

    if (nmfcItemResponse.status == 200) {
      currentNmfcItem.forEach((data: any, index: any) => {
        if (data.Item == ItemNumber)
          particularItem.push(data)
      })

      console.log(particularItem)
      setnmfcItemPopupData(particularItem)
      setCurrentnmfcCode(ItemNumber)

      const descDisableDiv = document.getElementById(`descDisableDiv:${currentNmfcCommodity}`)
      const descriptionDiv = document.getElementById(`descriptionDiv:${currentNmfcCommodity}`)
      const nmfcInput = document.getElementById(`nmfc:${currentNmfcCommodity}`) as HTMLInputElement | null
      const nmfcSearchSpan = document.getElementById(`nmfcSearchSpan:${currentNmfcCommodity}`)


      let newCommodities = [...commodities];
      let particularCommodities: any = newCommodities[currentNmfcCommodity]
      particularCommodities["description"] = `${SearchHit == null ? "" : SearchHit} ${Text == null ? "" : Text}`;
      particularCommodities["nmfc"] = `${ItemNumber}`;

      if (descDisableDiv != null && descriptionDiv != null
        && nmfcInput != null && nmfcSearchSpan != null) {
        descDisableDiv.hidden = false;
        descriptionDiv.hidden = true;
        nmfcInput.disabled = true;
        nmfcSearchSpan.hidden = true;
      }
      newCommodities[currentNmfcCommodity] = particularCommodities
      Setcommodities(newCommodities);
    }
  }

  const clickOnSubItemNumber = async (Class: any) => {
    debugger;
    if (NMFCItemDivPopUp.current != null) {
      NMFCItemDivPopUp.current.classList.remove("show");
      NMFCItemDivPopUp.current.style.display = "none";
    }

    const classInput = document.getElementById(`classInput:${currentNmfcCommodity}`) as HTMLInputElement | null

    console.log("Class", Class)
    let newCommodities = [...commodities];
    let particularCommodities: any = newCommodities[currentNmfcCommodity]
    particularCommodities["class"] = Class;

    if(nmfcItemPopupData[0]?.SubItems?.SubItem != null){
      if ((nmfcItemPopupData[0]?.SubItems?.SubItem).length > 1) {
        particularCommodities["dIcon"] = false;
      }
    }
    if (classInput != null) {
      classInput.disabled = true;
    }

    newCommodities[currentNmfcCommodity] = particularCommodities
    Setcommodities(newCommodities);
  }

  const onNextPopupClick = async () => {
    if (nmfcPopupCount.EndIndex != nmfcPopupCount.TotalMatch) {
      SetNmfcValidationPopupMSG("")
      setpopUpLoader(true)
      let nmfcRequest = {
        keyword: CurrentNmfcDesc.toUpperCase(),
        page: Number(nmfcPopupCount.CurrentPage) + 1
      }
      const nmfcResponse: any = await NmfcSearch(nmfcRequest)
      console.log(nmfcResponse)
      setpopUpLoader(false)
      if (nmfcResponse.status == 200) {
        let currentNmfcCount = nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults
        console.log(currentNmfcCount.TotalPages, currentNmfcCount.CurrentPage)
        setnmfcPopupCount({
          ...nmfcPopupCount,
          ["TotalPages"]: currentNmfcCount.TotalPages,
          ["CurrentPage"]: currentNmfcCount.CurrentPage,
          ["TotalMatch"]: currentNmfcCount.TotalMatch,
          ["StartIndex"]: currentNmfcCount.StartIndex,
          ["EndIndex"]: currentNmfcCount.EndIndex
        })
        setnmfcPopupData(nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults.SearchResult)
        setpopUpLoader(false)
      }
      else if (nmfcResponse.status == 400) {
        setpopUpLoader(false)
        SetNmfcValidationPopupMSG(nmfcResponse.data.Errors[0].Message)
      }
    }
  }

  const onPrevPopupClick = async () => {
    if (nmfcPopupCount.StartIndex != "1") {
      SetNmfcValidationPopupMSG("")
      setpopUpLoader(true)
      let nmfcRequest = {
        keyword: CurrentNmfcDesc.toUpperCase(),
        page: Number(nmfcPopupCount.CurrentPage) - 1
      }
      const nmfcResponse: any = await NmfcSearch(nmfcRequest)
      console.log(nmfcResponse)
      setpopUpLoader(false)
      if (nmfcResponse.status == 200) {
        let currentNmfcCount = nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults
        console.log(currentNmfcCount.TotalPages, currentNmfcCount.CurrentPage)
        setnmfcPopupCount({
          ...nmfcPopupCount,
          ["TotalPages"]: currentNmfcCount.TotalPages,
          ["CurrentPage"]: currentNmfcCount.CurrentPage,
          ["TotalMatch"]: currentNmfcCount.TotalMatch,
          ["StartIndex"]: currentNmfcCount.StartIndex,
          ["EndIndex"]: currentNmfcCount.EndIndex
        })
        setnmfcPopupData(nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults.SearchResult)
        setpopUpLoader(false)
      }
      else if (nmfcResponse.status == 400) {
        setpopUpLoader(false)
        SetNmfcValidationPopupMSG(nmfcResponse.data.Errors[0].Message)
      }
    }
  }

  const onSearchClick = async () => {
    setpopUpLoader(true)
    setCurrentNmfcDesc(popupSearch)
    SetNmfcValidationPopupMSG("")
    let nmfcRequest = {
      keyword: popupSearch.toUpperCase(),
      page: 1
    }
    const nmfcResponse: any = await NmfcSearch(nmfcRequest)
    console.log(nmfcResponse)
    setpopUpLoader(false)

    if (nmfcResponse.status == 200) {
      let currentNmfcCount = nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults
      console.log(currentNmfcCount.TotalPages, currentNmfcCount.CurrentPage)
      setnmfcPopupCount({
        ...nmfcPopupCount,
        ["TotalPages"]: currentNmfcCount.TotalPages,
        ["CurrentPage"]: currentNmfcCount.CurrentPage,
        ["TotalMatch"]: currentNmfcCount.TotalMatch,
        ["StartIndex"]: currentNmfcCount.StartIndex,
        ["EndIndex"]: currentNmfcCount.EndIndex
      })
      setnmfcPopupData(nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults.SearchResult)
      setpopUpLoader(false)
    }
    else if (nmfcResponse.status == 400) {
      setpopUpLoader(false)
      SetNmfcValidationPopupMSG(nmfcResponse.data.Errors[0].Message)
    }
  }

  const onNmfcSearchClick = async () => {
    if (NMFCDivPopUp.current != null) {
      NMFCDivPopUp.current.classList.add("show");
      NMFCDivPopUp.current.style.display = "block";
    }
    setpopUpLoader(true)
    setCurrentNmfcDesc(popupSearch)
    SetNmfcValidationPopupMSG("")
    let nmfcRequest = {
      keyword: CurrentnmfcCode,
      page: 1
    }
    const nmfcResponse: any = await NmfcSearch(nmfcRequest)
    console.log(nmfcResponse)
    setpopUpLoader(false)

    if (nmfcResponse.status == 200) {
      let currentNmfcCount = nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults
      console.log(currentNmfcCount.TotalPages, currentNmfcCount.CurrentPage)
      setnmfcPopupCount({
        ...nmfcPopupCount,
        ["TotalPages"]: currentNmfcCount.TotalPages,
        ["CurrentPage"]: currentNmfcCount.CurrentPage,
        ["TotalMatch"]: currentNmfcCount.TotalMatch,
        ["StartIndex"]: currentNmfcCount.StartIndex,
        ["EndIndex"]: currentNmfcCount.EndIndex
      })
      setnmfcPopupData(nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults.SearchResult)
      setpopUpLoader(false)
    }
    else if (nmfcResponse.status == 400) {
      setpopUpLoader(false)
      SetNmfcValidationPopupMSG(nmfcResponse.data.Errors[0].Message)
    }
  }
  /* Setting a timer to increment the barLoader state by 1 every 320 milliseconds. */
  useEffect(() => {
    const emailTimer: any = barLoader < 99 && setInterval(() => setbarLoader(barLoader + 1), 320);
    return () => clearInterval(emailTimer);
  }, [barLoader]);

  /* Getting the data from the database and setting the state. */
  useEffect(() => {
    let quantity = 0;
    let weight = 0;
    commodities.forEach((data: any) => {
      quantity = quantity + Number(data.quantity)
      weight = weight + Number(data.weight)
    })
    SetQuantity(quantity);
    SetWeight(weight);
  }, [])

  /**
   * I'm trying to set the state of the accessorials based on the customer selected.
   * </code>
   * @param {any} event - any, type: string
   * @param {string} type - string
   */
  const onValueChange = async (event: any, type: string) => {
    switch (type) {
      case "Text": {
        const rejex = /^[a-zA-Z '.]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          SetShipInfo({ ...shipInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "number": {
        const rejex = /^[0-9]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          SetShipInfo({ ...shipInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "Zip": {
        const rejex = /^[a-zA-Z 0-9-]+$/;
        if (event.target.value == '' || rejex.test(event.target.value)) {
          SetShipInfo({ ...shipInfo, [event.target.name]: event.target.value })
        }
        break;
      }
      case "CustomerChange": {
        SetShipInfo({ ...shipInfo, [event.target.name]: event.target.value })
        getUserDetail.forEach((val: any, index: any) => {
          if (val.mySunteckLoginId == event.target.value) {
            setGetCustomerData({
              ...GetCustomerData,
              ["custaId"]: val.custaId,
              ["custmId"]: val.custmId,
              ["ratingEngine"]: val.ratingEngine,
            })
          }
        })
        let customerAcct = getUserDetail.find((x: any) => x.mySunteckLoginId == event.target.value)
        populateAccessorials(customerAcct?.ratingEngine, customerAcct?.custmId)
        preSavedCommoditiesDropdown(customerAcct?.custaId);
        break;
      }
      default: {
        SetShipInfo({ ...shipInfo, [event.target.name]: event.target.value })
      }
    }
  }

  const preSavedCommoditiesDropdown = async (custaId: any) => {
    if (custaId != undefined) {
      const commoditiesResp: any = await GetPreSavedCommodtiesList(custaId)
      if (commoditiesResp.status == 200) {
        setPreSavedCommodityOptions(commoditiesResp.data.presavedCommodities);
      }
      else if (commoditiesResp.status == 204) {

      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
  }
  const populateAccessorials = async (ratingEngine: any, custmId: any) => {
    const GenralAccessorials: any[] = []
    const PickAccessorials: any[] = []
    const DropAccessorials: any[] = []
    const LimitedAccessorials: any[] = []
    if (ratingEngine != undefined) {
      const userResponse: any = await Getaccessorials(ratingEngine, custmId)
      if (userResponse.status == 200) {
        if (userResponse.data.accessorialsResponse != null && userResponse.data.accessorialsResponse.length > 0)
          userResponse.data.accessorialsResponse.forEach((data: any) => {
            if (data.generalAccessorialFlag == 1) {
              GenralAccessorials.push(data.accessorialName)
            }
            if (data.pickAccessorialFlag == 1 && data.dropAccessorialFlag == 0) {
              PickAccessorials.push(data.accessorialName)
            }
            if (data.pickAccessorialFlag == 0 && data.dropAccessorialFlag == 1) {
              DropAccessorials.push(data.accessorialName)
            }
            if (data.limitedFlag == 1) {
              LimitedAccessorials.push(data.accessorialName)
            }
          })
      }
      else {
        if (someThingWentWrongPopup.current != null) {
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
    SetGenralAccessorials(GenralAccessorials)
    SetPickAccessorials(PickAccessorials)
    SetDropAccessorials(DropAccessorials)
    SetLimitedAccessorials(LimitedAccessorials)
  }

  /**
   * OnBlurShipmentChange is a function that takes an event as a parameter and sets the state of
   * shipInfo to the event.target.value.
   * @param {any} event - any -&gt; The event that is triggered when the user types in the input field
   */
  const OnBlurShipmentChange = async (event: any) => {
    SetShipInfo({ ...shipInfo, [event.target.name]: (event.target.value).toUpperCase() })

    if (pickZipInputRef.current != null && pickZipSpanRef.current != null &&
      deliveryZipInputRef.current != null && deliveryZipSpanRef.current != null) {
      if ((event.target.value).length == 5) {
        if (!(/^[0-9]{5}$/.test(event.target.value))) {
          if (event.target.name == "pickZipCode") {
            pickZipSpanRef.current.hidden = false;
            pickZipSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
            pickZipInputRef.current.style.borderColor = "red";
          }
          if (event.target.name == "deliveryZipCode") {
            deliveryZipSpanRef.current.hidden = false;
            deliveryZipSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
            deliveryZipInputRef.current.style.borderColor = "red";
          }
        }
        else if (/^[0-9]{5}$/.test(event.target.value)) {
          if (event.target.name == "pickZipCode") {
            pickZipSpanRef.current.hidden = true;
            pickZipSpanRef.current.innerHTML = "";
            pickZipInputRef.current.style.borderColor = "";
            // Verify Zipcode API call pickZipInputRef

            let verifyRequest = {
              shipZip: shipInfo.pickZipCode
            }
            const verifyResponse: any = await VerifyZip(verifyRequest)

            if (verifyResponse.status == 200) {
              let preSavedCommodityArray: any = []
              let ZipResponse = verifyResponse.data.zipCodeResponse[0]
              SetShipInfo({
                ...shipInfo,
                ["pickCity"]: (ZipResponse.city).toUpperCase(),
                ["pickState"]: ZipResponse.state,
                ["pickZipCode"]: ZipResponse.zipCode
              })
              preSavedCommodityOptions.forEach((data: any, index: any) => {
                if (data.zip == ZipResponse.zipCode) {
                  preSavedCommodityArray.push(data)
                }
                if (data.zip == "99999") {
                  preSavedCommodityArray.push(data)
                }
              })
              setpreSavedCommodityZipOptions(preSavedCommodityArray)
            }
            else if (verifyResponse.status == 204) {
              // if (noContentPopup.current != null) {
              //   setnoContentPopupMSG("Zipcode does not exist")
              //   noContentPopup.current.classList.add("show");
              //   noContentPopup.current.style.display = "block";
              // }
              if (pickZipSpanRef.current != null) {
                pickZipSpanRef.current.hidden = false;
                pickZipSpanRef.current.innerHTML = "Zip code does not exist";
                pickZipInputRef.current.style.borderColor = "red";
              }
            }
            else {
              if (someThingWentWrongPopup.current != null) {
                someThingWentWrongPopup.current.classList.add("show");
                someThingWentWrongPopup.current.style.display = "block";
              }
            }
          }
          if (event.target.name == "deliveryZipCode") {
            deliveryZipSpanRef.current.hidden = true;
            deliveryZipSpanRef.current.innerHTML = "";
            deliveryZipInputRef.current.style.borderColor = "";
            // Verify Zipcode API call deliveryZipInputRef
            let verifyRequest = {
              consZip: shipInfo.deliveryZipCode
            }
            const verifyResponse: any = await VerifyZip(verifyRequest)

            if (verifyResponse.status == 200) {
              let ZipResponse = verifyResponse.data.zipCodeResponse[0]
              SetShipInfo({
                ...shipInfo,
                ["deliveryCity"]: (ZipResponse.city).toUpperCase(),
                ["deliveryState"]: ZipResponse.state,
                ["deliveryZipCode"]: ZipResponse.zipCode
              })
            }
            else if (verifyResponse.status == 204) {
              // if (noContentPopup.current != null) {
              //   setnoContentPopupMSG("Zipcode does not exist")
              //   noContentPopup.current.classList.add("show");
              //   noContentPopup.current.style.display = "block";
              // }
              if (deliveryZipSpanRef.current != null) {
                deliveryZipSpanRef.current.hidden = false;
                deliveryZipSpanRef.current.innerHTML = "Zip code does not exist";
                deliveryZipInputRef.current.style.borderColor = "red";
              }
            }
            else {
              if (someThingWentWrongPopup.current != null) {
                someThingWentWrongPopup.current.classList.add("show");
                someThingWentWrongPopup.current.style.display = "block";
              }
            }
          }
        }
      }
      else if ((event.target.value).length == 7) {

        if (!(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(event.target.value))) {
          if (event.target.name == "pickZipCode") {
            pickZipSpanRef.current.hidden = false;
            pickZipSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
            pickZipInputRef.current.style.borderColor = "red";
          }
          if (event.target.name == "deliveryZipCode") {
            deliveryZipSpanRef.current.hidden = false;
            deliveryZipSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
            deliveryZipInputRef.current.style.borderColor = "red";
          }
        }
        else if (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(event.target.value)) {
          if (event.target.name == "pickZipCode") {
            pickZipSpanRef.current.hidden = true;
            pickZipSpanRef.current.innerHTML = "";
            pickZipInputRef.current.style.borderColor = "";
            // Verify Zipcode API call pickZipInputRef

            let verifyRequest = {
              shipZip: shipInfo.pickZipCode
            }
            const verifyResponse: any = await VerifyZip(verifyRequest)

            if (verifyResponse.status == 200) {
              let ZipResponse = verifyResponse.data.zipCodeResponse[0]
              SetShipInfo({
                ...shipInfo,
                ["pickCity"]: (ZipResponse.city).toUpperCase(),
                ["pickState"]: ZipResponse.state,
                ["pickZipCode"]: ZipResponse.zipCode
              })
            }
            else if (verifyResponse.status == 204) {
              // if (noContentPopup.current != null) {
              //   setnoContentPopupMSG("Zipcode does not exist")
              //   noContentPopup.current.classList.add("show");
              //   noContentPopup.current.style.display = "block";
              // }
              if (pickZipSpanRef.current != null) {
                pickZipSpanRef.current.hidden = false;
                pickZipSpanRef.current.innerHTML = "Zip code does not exist";
                pickZipInputRef.current.style.borderColor = "red";
              }
            }
            else {
              if (someThingWentWrongPopup.current != null) {
                someThingWentWrongPopup.current.classList.add("show");
                someThingWentWrongPopup.current.style.display = "block";
              }
            }
          }
          if (event.target.name == "deliveryZipCode") {
            deliveryZipSpanRef.current.hidden = true;
            deliveryZipSpanRef.current.innerHTML = "";
            deliveryZipInputRef.current.style.borderColor = "";
            // Verify Zipcode API call deliveryZipInputRef

            let verifyRequest = {
              consZip: shipInfo.deliveryZipCode
            }
            const verifyResponse: any = await VerifyZip(verifyRequest)

            if (verifyResponse.status == 200) {
              let ZipResponse = verifyResponse.data.zipCodeResponse[0]
              SetShipInfo({
                ...shipInfo,
                ["deliveryCity"]: (ZipResponse.city).toUpperCase(),
                ["deliveryState"]: ZipResponse.state,
                ["deliveryZipCode"]: ZipResponse.zipCode
              })
            }
            else if (verifyResponse.status == 204) {
              // if (noContentPopup.current != null) {
              //   setnoContentPopupMSG("Zipcode does not exist")
              //   noContentPopup.current.classList.add("show");
              //   noContentPopup.current.style.display = "block";
              // }
              if (deliveryZipSpanRef.current != null) {
                deliveryZipSpanRef.current.hidden = false;
                deliveryZipSpanRef.current.innerHTML = "Zip code does not exist";
                deliveryZipInputRef.current.style.borderColor = "red";
              }
            }
            else {
              if (someThingWentWrongPopup.current != null) {
                someThingWentWrongPopup.current.classList.add("show");
                someThingWentWrongPopup.current.style.display = "block";
              }
            }
          }
        }
      }
      else if ((event.target.value).length != 0 && ((event.target.value).length == 6 || (event.target.value).length < 5)) {
        if (event.target.name == "pickZipCode") {
          pickZipSpanRef.current.hidden = false;
          pickZipSpanRef.current.innerHTML = "Please enter the valid zip Code";
          pickZipInputRef.current.style.borderColor = "red";
        }

        if (event.target.name == "deliveryZipCode") {
          deliveryZipSpanRef.current.hidden = false;
          deliveryZipSpanRef.current.innerHTML = "Please enter the valid zip Code";
          deliveryZipInputRef.current.style.borderColor = "red";
        }
      }
    }
  }

  const onBlurDescCommChange = async (event: any, index: number) => {
    if (event.target.value != "") {
      setpopUpLoader(true)
      SetNmfcValidationPopupMSG("")
      setcurrentNmfcCommodity(index)
      if (NMFCDivPopUp.current != null) {
        NMFCDivPopUp.current.classList.add("show");
        NMFCDivPopUp.current.style.display = "block";
      }
      let nmfcRequest = {
        keyword: (event.target.value).toUpperCase(),
        page: 1
      }

      setCurrentNmfcDesc(event.target.value)
      const nmfcResponse: any = await NmfcSearch(nmfcRequest)
      console.log(nmfcResponse)

      if (nmfcResponse.status == 200) {
        let currentNmfcCount = nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults
        console.log(currentNmfcCount.TotalPages, currentNmfcCount.CurrentPage)
        setnmfcPopupCount({
          ...nmfcPopupCount,
          ["TotalPages"]: currentNmfcCount.TotalPages,
          ["CurrentPage"]: currentNmfcCount.CurrentPage,
          ["TotalMatch"]: currentNmfcCount.TotalMatch,
          ["StartIndex"]: currentNmfcCount.StartIndex,
          ["EndIndex"]: currentNmfcCount.EndIndex
        })
        setnmfcPopupData(nmfcResponse.data.nmfcSearchResponse.Body.SearchResponse.SearchResult.Result.Index.SearchResults.SearchResult)
        setpopUpLoader(false)
      }
      else if (nmfcResponse.status == 400) {
        setpopUpLoader(false)
        SetNmfcValidationPopupMSG(nmfcResponse.data.Errors[0].Message)
      }
    }
  }

  const onNmfcClose = () => {
    setpopupSearch("")
    if (NMFCDivPopUp.current != null) {
      NMFCDivPopUp.current.classList.remove("show");
      NMFCDivPopUp.current.style.display = "none";
    }
  }

  const onNmfcItemClose = () => {
    if (NMFCItemDivPopUp.current != null) {
      NMFCItemDivPopUp.current.classList.remove("show");
      NMFCItemDivPopUp.current.style.display = "none";
    }
  }

  /**
   * It checks to see if the user has entered data into the form. If they have, it returns true. If
   * they haven't, it returns false.
   * @returns A function that returns a boolean value.
   */
  const shipperInfoValidation = () => {

    let IsValid = false;
    if (CustomerSelectRef.current != null && CustomerSpanRef.current != null &&
      pickStateSelectRef.current != null && pickStateSpanRef.current != null &&
      deliveryStateSpanRef.current != null && deliveryStateSelectRef.current != null &&
      pickZipSpanRef.current != null && pickZipInputRef.current != null &&
      deliveryZipInputRef.current != null && deliveryZipSpanRef.current != null &&
      pickCityInputRef.current != null && pickCitySpanRef.current != null &&
      deliveryCityInputRef.current != null && deliveryCitySpanRef.current != null &&
      PayTypeSelectRef.current != null && PayTypeSpanRef.current != null) {


      if (shipInfo.customer == "") {
        CustomerSpanRef.current.hidden = false;
        CustomerSpanRef.current.innerHTML = "Please select the customer";
        CustomerSelectRef.current.style.borderColor = "red";
      }
      else if (shipInfo.customer != "") {
        CustomerSpanRef.current.hidden = true;
        CustomerSpanRef.current.innerHTML = "";
        CustomerSelectRef.current.style.borderColor = "";
      }

      if (shipInfo.pickCity == "") {
        pickCitySpanRef.current.hidden = false;
        pickCitySpanRef.current.innerHTML = "Please enter the city";
        pickCityInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.pickCity != "") {
        pickCitySpanRef.current.hidden = true;
        pickCitySpanRef.current.innerHTML = "";
        pickCityInputRef.current.style.borderColor = "";
      }

      if (shipInfo.pickState == "") {
        pickStateSpanRef.current.hidden = false;
        pickStateSpanRef.current.innerHTML = "Please select the state";
        pickStateSelectRef.current.style.borderColor = "red";
      }
      else if (shipInfo.pickState != "") {
        pickStateSpanRef.current.hidden = true;
        pickStateSpanRef.current.innerHTML = "";
        pickStateSelectRef.current.style.borderColor = "";
      }

      if (shipInfo.pickZipCode == "") {
        pickZipSpanRef.current.hidden = false;
        pickZipSpanRef.current.innerHTML = "Please enter the zip Code";
        pickZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.pickZipCode.length == 5 && !(/^[0-9]{5}$/.test(shipInfo.pickZipCode))) {
        pickZipSpanRef.current.hidden = false;
        pickZipSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
        pickZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.pickZipCode.length == 5 && (/^[0-9]{5}$/.test(shipInfo.pickZipCode))) {
        pickZipSpanRef.current.hidden = true;
        pickZipSpanRef.current.innerHTML = "";
        pickZipInputRef.current.style.borderColor = "";
      }
      else if (shipInfo.pickZipCode.length == 7 && !(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipInfo.pickZipCode))) {
        pickZipSpanRef.current.hidden = false;
        pickZipSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
        pickZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.pickZipCode.length == 7 && (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipInfo.pickZipCode))) {
        pickZipSpanRef.current.hidden = true;
        pickZipSpanRef.current.innerHTML = "";
        pickZipInputRef.current.style.borderColor = "";
      }
      else {
        pickZipSpanRef.current.hidden = false;
        pickZipSpanRef.current.innerHTML = "Please enter the valid zip Code";
        pickZipInputRef.current.style.borderColor = "red";
      }

      if (shipInfo.deliveryCity == "") {
        deliveryCitySpanRef.current.hidden = false;
        deliveryCitySpanRef.current.innerHTML = "Please enter the city";
        deliveryCityInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.deliveryCity != "") {
        deliveryCitySpanRef.current.hidden = true;
        deliveryCitySpanRef.current.innerHTML = "";
        deliveryCityInputRef.current.style.borderColor = "";
      }

      if (shipInfo.deliveryState == "") {
        deliveryStateSpanRef.current.hidden = false;
        deliveryStateSpanRef.current.innerHTML = "Please select the state";
        deliveryStateSelectRef.current.style.borderColor = "red";
      }
      else if (shipInfo.deliveryState != "") {
        deliveryStateSpanRef.current.hidden = true;
        deliveryStateSpanRef.current.innerHTML = "";
        deliveryStateSelectRef.current.style.borderColor = "";
      }

      if (shipInfo.deliveryZipCode == "") {
        deliveryZipSpanRef.current.hidden = false;
        deliveryZipSpanRef.current.innerHTML = "Please enter the zip Code";
        deliveryZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.deliveryZipCode.length == 5 && !(/^[0-9]{5}$/.test(shipInfo.deliveryZipCode))) {
        deliveryZipSpanRef.current.hidden = false;
        deliveryZipSpanRef.current.innerHTML = "Invalid U.S/Mexican Zip Code";
        deliveryZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.deliveryZipCode.length == 5 && (/^[0-9]{5}$/.test(shipInfo.deliveryZipCode))) {
        deliveryZipSpanRef.current.hidden = true;
        deliveryZipSpanRef.current.innerHTML = "";
        deliveryZipInputRef.current.style.borderColor = "";
      }
      else if (shipInfo.deliveryZipCode.length == 7 && !(/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipInfo.deliveryZipCode))) {
        deliveryZipSpanRef.current.hidden = false;
        deliveryZipSpanRef.current.innerHTML = "Invalid Canadian Postal Code";
        deliveryZipInputRef.current.style.borderColor = "red";
      }
      else if (shipInfo.deliveryZipCode.length == 7 && (/^[ABCEGHJ-NPRSTVXYabceghj-nprstvxy]\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z][ ]?\d[ABCEGHJ-NPRSTV-Zabceghj-nprstv-z]\d$/.test(shipInfo.deliveryZipCode))) {
        deliveryZipSpanRef.current.hidden = true;
        deliveryZipSpanRef.current.innerHTML = "";
        deliveryZipInputRef.current.style.borderColor = "";
      }

      if (shipInfo.payType == "") {
        PayTypeSpanRef.current.hidden = false;
        PayTypeSpanRef.current.innerHTML = "Please select the pay type";
        PayTypeSelectRef.current.style.borderColor = "red";
      }
      else if (shipInfo.payType != "") {
        PayTypeSpanRef.current.hidden = true;
        PayTypeSpanRef.current.innerHTML = "";
        PayTypeSelectRef.current.style.borderColor = "";
      }

      if (CustomerSpanRef.current.hidden && pickCitySpanRef.current.hidden && pickStateSpanRef.current.hidden && pickZipSpanRef.current.hidden
        && deliveryCitySpanRef.current.hidden && deliveryStateSpanRef.current.hidden && deliveryZipSpanRef.current.hidden && PayTypeSpanRef.current.hidden) {
        IsValid = true;
      }
      else {
        IsValid = false;
        shipperInfoDivRef.current?.classList.add('show');
        shipperInfoDownButtonRef.current?.classList.remove('completed');
        shipperInfoDownButtonRef.current?.classList.remove('collapsed');
        commoditiesDivRef.current?.classList.remove('show')
        commoditiesDownButtonRef.current?.classList.add('completed');
        commoditiesDownButtonRef.current?.classList.add('collapsed');
        accesorialsDivRef.current?.classList.remove('show')
        accesorialsDownButtonRef.current?.classList.add('completed');
        accesorialsDownButtonRef.current?.classList.add('collapsed');


        window.scrollTo(
          {
            top: shipperInfoAccordionDivRef.current?.offsetTop ?
              shipperInfoAccordionDivRef.current?.offsetTop - 100 : 0,
            behavior: "smooth"
          })
      }
    }

    return IsValid
  }

  /**
   * If the shipperInfoValidation function returns true, then remove the show class from the
   * shipperInfoDivRef element, add the collapsed class to the shipperInfoDownButtonRef element, add the
   * show class to the commoditiesDivRef element, and remove the collapsed class from the
   * commoditiesDownButtonRef element.
   */
  const shipperContinueClick = async () => {
    if (shipperInfoValidation()) {
      setLoader(true)
      let verifyRequest = {
        shipZip: shipInfo.pickZipCode,
        consZip: shipInfo.deliveryZipCode
      }
      const verifyResponse: any = await VerifyZip(verifyRequest)

      if (verifyResponse.status == 200) {
        let shipmentInfoArray: any = [];
        let shipperResp = false
        let consigneeResp = false

        let shipperRequest = {
          city: shipInfo.pickCity,
          state: shipInfo.pickState,
          zipCode: shipInfo.pickZipCode
        }
        let ConsigneeRequest = {
          city: shipInfo.deliveryCity,
          state: shipInfo.deliveryState,
          zipCode: shipInfo.deliveryZipCode
        }
        shipmentInfoArray.push(shipperRequest)
        shipmentInfoArray.push(ConsigneeRequest)

        let ZipResponse = verifyResponse.data.zipCodeResponse

        for (let i = 0; i < ZipResponse.length; i++) {
          if (ZipResponse[i].zipCode == shipmentInfoArray[0].zipCode) {
            if (((ZipResponse[i].state).toUpperCase() == shipmentInfoArray[0].state) && ((ZipResponse[i].city).toUpperCase() == shipmentInfoArray[0].city)) {
              shipperResp = true
              break
            }
          }
        }

        for (let i = 0; i < ZipResponse.length; i++) {
          if (ZipResponse[i].zipCode == shipmentInfoArray[1].zipCode) {
            if (((ZipResponse[i].state).toUpperCase() == shipmentInfoArray[1].state) && ((ZipResponse[i].city).toUpperCase() == shipmentInfoArray[1].city)) {
              consigneeResp = true
              break
            }
          }
        }

        if (pickZipSpanRef.current != null && deliveryZipSpanRef.current != null &&
          pickCityInputRef.current != null && pickStateSelectRef.current != null && pickZipInputRef.current != null &&
          deliveryCityInputRef.current != null && deliveryStateSelectRef.current != null && deliveryZipInputRef.current != null) {
          if (!shipperResp) {
            pickZipSpanRef.current.hidden = false;
            pickZipSpanRef.current.innerHTML = "Invalid shipper details";
            pickCityInputRef.current.style.borderColor = "red";
            pickStateSelectRef.current.style.borderColor = "red";
            pickZipInputRef.current.style.borderColor = "red";
          }
          else {
            pickZipSpanRef.current.hidden = true;
            pickZipSpanRef.current.innerHTML = "";
            pickCityInputRef.current.style.borderColor = "";
            pickStateSelectRef.current.style.borderColor = "";
            pickZipInputRef.current.style.borderColor = "";
          }

          if (!consigneeResp) {
            deliveryZipSpanRef.current.hidden = false;
            deliveryZipSpanRef.current.innerHTML = "Invalid consignee details";
            deliveryCityInputRef.current.style.borderColor = "red";
            deliveryStateSelectRef.current.style.borderColor = "red";
            deliveryZipInputRef.current.style.borderColor = "red";
          }
          else {
            deliveryZipSpanRef.current.hidden = true;
            deliveryZipSpanRef.current.innerHTML = "";
            deliveryCityInputRef.current.style.borderColor = "";
            deliveryStateSelectRef.current.style.borderColor = "";
            deliveryZipInputRef.current.style.borderColor = "";
          }
          setLoader(false)

          if (deliveryZipSpanRef.current.hidden && pickZipSpanRef.current.hidden) {
            shipperInfoDivRef.current?.classList.remove('show');
            shipperInfoDownButtonRef.current?.classList.add('completed');
            shipperInfoDownButtonRef.current?.classList.add('collapsed');
            setcompletedCheck({ ...completedCheck, ["Shipper"]: true })
            commoditiesDivRef.current?.classList.add('show')
            commoditiesDownButtonRef.current?.classList.remove('completed');
            commoditiesDownButtonRef.current?.classList.remove('collapsed');
          }
        }
      }
      else if (verifyResponse.status == 204) {
        if (pickZipSpanRef.current != null && deliveryZipSpanRef.current != null) {
          pickZipSpanRef.current.hidden = false;
          pickZipSpanRef.current.innerHTML = "Zip Code does not exist";
          deliveryZipSpanRef.current.hidden = false;
          deliveryZipSpanRef.current.innerHTML = "Zip Code does not exist";
        }
        setLoader(false)
      }
      else if (verifyResponse.status == 400) {

        if (LoadingQuotedPopup.current != null && ValidationPopup.current != null) {
          LoadingQuotedPopup.current.classList.remove("show");
          LoadingQuotedPopup.current.style.display = "none";
          ValidationPopup.current.classList.add("show");
          ValidationPopup.current.style.display = "block";

          // let validationMessage = ""
          verifyResponse.data.Errors.forEach((data: any, index: any) => {
            if (data.Message == "shipZip does not exist") {
              if (pickZipSpanRef.current != null && pickZipInputRef.current != null) {
                pickZipSpanRef.current.hidden = false;
                pickZipSpanRef.current.innerHTML = "Zip Code does not exist";
                pickZipInputRef.current.style.borderColor = "red"
              }
            } else if (data.Message == "consZip does not exist") {
              if (deliveryZipSpanRef.current != null && deliveryZipInputRef.current != null) {
                deliveryZipSpanRef.current.hidden = false;
                deliveryZipSpanRef.current.innerHTML = "Zip Code does not exist";
                deliveryZipInputRef.current.style.borderColor = "red";
              }
            }
          })
          // SetValidationPopupMSG(validationMessage)
          setLoader(false)

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
      setLoader(false)
      setcompletedCheck({ ...completedCheck, ["Shipper"]: false })
    }
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
      reviewAcc: false,
      commoditiesAcc: false,
      dIcon:true,
      cube: 0,
      pcf: 0
    }


    Setcommodities([...commodities, commodities_Obj])
  }


  /**
   * If the length of the array is 1, return. Otherwise, filter the array and set the state.
   * @param {any} index - any - the index of the item in the array
   * @returns The return value of the function is the return value of the last statement in the function.
   */
  const OnDeleteClick = (index: any) => {
    let weight = 0
    let quantity = 0
    let newCommodities = commodities.filter((val: { id: any; }) => val.id != index);
    newCommodities.forEach((data: any) => {
      weight = weight + Number(data.weight);
      quantity = quantity + Number(data.quantity);
    });
    SetWeight(weight)
    SetQuantity(quantity)
    Setcommodities(newCommodities)
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
        setCurrentnmfcCode(event.target.value)
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

    // if(particularCommodities[index]?.dimenHeight != undefined && particularCommodities[index]?.quantity != undefined && 
    //   particularCommodities[index].dimenHeight != 0 && particularCommodities[index].quantity != 0){
    if (particularCommodities.dimenHeight > 48 && particularCommodities.quantity > 1) {
      particularCommodities.stack = false
    }
    // }

    newCommodities[index] = particularCommodities
    Setcommodities(newCommodities);
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

  const noContentOkClick = () => {
    if (noContentPopup.current != null) {
      noContentPopup.current.classList.remove("show");
      noContentPopup.current.style.display = "none";
    }
  }

  const OnLoaderCancelClick = () => {
    CancelApi();
    if (LoadingQuotedPopup.current != null) {
      LoadingQuotedPopup.current.classList.remove("show");
      LoadingQuotedPopup.current.style.display = "none";
    }
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
          typeSpan.innerHTML = `Please select the type`;
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
      commoditiesDownButtonRef.current?.classList.remove('completed');
      commoditiesDownButtonRef.current?.classList.remove('collapsed');
      accesorialsDivRef.current?.classList.remove('show')
      accesorialsDownButtonRef.current?.classList.add('completed');
      accesorialsDownButtonRef.current?.classList.add('collapsed');

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
   * the accesorialsDivRef, and remove the collapsed class from the accesorialsDownButtonRef.
   */
  const commoditiesContinueClick = () => {
    if (commodities.length == 0 && ValidationPopup.current != null) {
      ValidationPopup.current.classList.add("show");
      ValidationPopup.current.style.display = "block";
      SetValidationPopupMSG("At least one commodity is required")
      return
    }
    if (commoditiesValidation()) {
      commoditiesDivRef.current?.classList.remove('show');
      commoditiesDownButtonRef.current?.classList.add('completed');
      commoditiesDownButtonRef.current?.classList.add('collapsed');
      setcompletedCheck({ ...completedCheck, ["commodities"]: true })
      accesorialsDivRef.current?.classList.add('show')
      accesorialsDownButtonRef.current?.classList.remove('completed');
      accesorialsDownButtonRef.current?.classList.remove('collapsed');
    }
    else {
      setcompletedCheck({ ...completedCheck, ["commodities"]: false })
    }
  }

  /**
   * If the checkbox is checked, add the value to the array, otherwise remove it.
   * @param {any} event - any, Value: any
   * @param {any} Value - is the value of the checkbox
   */
  const onAccessorialChange = (event: any, Value: any) => {
    if (event.target.checked) {
      SetaccessorialValue([...accessorialValue, Value])
    }
    else {
      const removedValue = accessorialValue.filter((data: any) => data != Value);
      SetaccessorialValue(removedValue)
    }
  }

  /**
   * It's a function that returns a map of an array of strings, where each string is wrapped in a div
   * with a checkbox and a label.
   * @returns An array of JSX elements.
   */
  const GenralAccessorialsLoad = () => {
    return GenralAccessorials.map((data: any, index: any) => {
      return (
        <div className="form-check my-2" key={index}>
          <input className="cp-checkbox form-check-input" type="checkbox" id={data} defaultChecked={accessorialValue.includes(data)} onChange={(event: any) => { onAccessorialChange(event, data) }} />
          <label className="data-txt form-check-label ms-1" htmlFor={data}>
            {data}
          </label>
        </div>
      )
    })
  }

  /**
   * It's a function that returns a map of an array of strings, and for each string, it returns a div
   * with a checkbox and a label.
   * @returns An array of JSX elements.
   */
  const PickAccessorialsLoad = () => {
    return PickAccessorials.map((data: any, index: any) => {
      return (
        <div className="form-check my-2" key={index}>
          <input className="cp-checkbox form-check-input" type="checkbox" id={data} defaultChecked={accessorialValue.includes(data)} onChange={(event: any) => { onAccessorialChange(event, data) }} />
          <label className="data-txt form-check-label ms-1" htmlFor={data}>
            {data}
          </label>
        </div>
      )
    })
  }

  /**
   * It's a function that returns a map of an array of strings.
   * @returns An array of JSX elements.
   */
  const DropAccessorialsLoad = () => {
    return DropAccessorials.map((data: any, index: any) => {
      return (
        <div className="form-check my-2" key={index}>
          <input className="cp-checkbox form-check-input" type="checkbox" id={data} defaultChecked={accessorialValue.includes(data)} onChange={(event: any) => { onAccessorialChange(event, data) }} />
          <label className="data-txt form-check-label ms-1" htmlFor={data}>
            {data}
          </label>
        </div>
      )
    })
  }

  /**
   * It takes an array of strings, and returns an array of React elements.
   * @returns An array of options.
   */
  const limitedDropDown = (type: string) => {
    return LimitedAccessorials.map((data: any, index: any) => {
      return (
        <option key={index} selected={type == "pickLimited" ? accessorialLimited.pickLimited == data : accessorialLimited.deliveryLimited == data}>{data}</option>
      )
    })
  }

  /**
   * OnLimitedValueChange is a function that takes an event as an argument and returns a function that
   * sets the state of accessorialLimited to the value of the event target name.
   * @param {any} event - any
   */
  const onLimitedValueChange = (event: any) => {
    SetaccessorialLimited({ ...accessorialLimited, [event.target.name]: event.target.value })
  }

  /**
   * If the shipperInfoValidation() and commoditiesValidation() functions return true, then the
   * LoadingQuotedPopup.current.classList.add("show"); and LoadingQuotedPopup.current.style.display =
   * "block"; lines are executed.
   * 
   * The shipperInfoValidation() and commoditiesValidation() functions are defined below:
   */
  const RequestTariffRateClick = async () => {
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
    else if (shipperInfoValidation() && commoditiesValidation() && commodities.length > 0) {
      setLoader(true)
      const commoditiesRequestArray: any = [];
      commodities.forEach((data: any) => {
        const CubitFeet = ((data.dimenLength * data.dimenWidth * data.dimenHeight) / 1728) * data.quantity;
        const Pcf = data.weight / CubitFeet;
        let particularCommodity = {
          desc: data.description,
          nmfc: data.nmfc,
          class: data.class,
          stackable: data.stack,
          hazmat: data.haz,
          length: (data.dimenLength).toString(),
          width: (data.dimenWidth).toString(),
          height: (data.dimenHeight).toString(),
          weight: (data.weight).toString(),
          quantity: (data.quantity).toString(),
          CubicFt: (Math.floor(CubitFeet)).toString(),
          pcf: (Math.ceil(Pcf * 10) / 10).toString(),
          equipmentType: data.type
        }
        commoditiesRequestArray.push(particularCommodity)
      })

      const QuoteLtlRequest = {
        shipperInfo: {
          city: shipInfo.pickCity,
          state: shipInfo.pickState,
          zipCode: shipInfo.pickZipCode
        },
        consigneeInfo: {
          city: shipInfo.deliveryCity,
          state: shipInfo.deliveryState,
          zipCode: shipInfo.deliveryZipCode
        },
        payType: shipInfo.payType,
        commodity: {
          commodities: commoditiesRequestArray,
          linearFt: LinearFt
        },
        accessorials: {
          generalAccessorials: {
            blindShipment: accessorialValue.includes("Blind Shipment"),
            correctedBilling: accessorialValue.includes("Corrected Billing"),
            customsInbond: accessorialValue.includes("Customs InBond"),
            freezeProtection: accessorialValue.includes("Freeze Protection"),
            guaranteed: accessorialValue.includes("Guaranteed"),
            overDimensional: accessorialValue.includes("Over Dimensional"),
            hazardousMaterial: accessorialValue.includes("Hazardous Material"),
            inspectionCharge: accessorialValue.includes("Inspection Charge"),
            reweighCharge: accessorialValue.includes("Reweigh Charge"),
            beyondCharge: accessorialValue.includes("Beyond Charges"),
            californiaComplianceCharge: accessorialValue.includes("California Compliance Charge"),
            correctedBol: accessorialValue.includes("Corrected Billing"),
            detentionCharge: accessorialValue.includes("Detention Charge"),
            freezeProtectionCharge: accessorialValue.includes("Freeze Protection Charge"),
            reconsignmentCharge: accessorialValue.includes("Reconsignment Charge"),
            singleShipment: accessorialValue.includes("Single Shipment"),
            hazmatCharge: accessorialValue.includes("Hazmat Charge"),
            homelandSecurity: accessorialValue.includes("Homeland Security"),
            inbondCharge: accessorialValue.includes("Inbond Charge"),
            extremeLength: accessorialValue.includes("Extreme Length"),
            fuelSurcharge: accessorialValue.includes("Fuel Surcharge"),
            detention: accessorialValue.includes("Detention"),
            bondCharges: accessorialValue.includes("Bond Charges"),
            rebate: accessorialValue.includes("Rebate")
          },
          shipperAccessorials: {
            liftgatePickup: accessorialValue.includes("Liftgate Pickup"),
            residentialPickup: accessorialValue.includes("Residential Pick Up"),
            sortAndSegPick: accessorialValue.includes("Sort And Segregate (PICK)"),
            tradeShowPickup: accessorialValue.includes("Trade Show Pickup"),
            constructionSitePickup: accessorialValue.includes("Construction Site Pickup"),
            insidePickup: accessorialValue.includes("Inside Pickup"),
            limitedAccessPickup: accessorialValue.includes("Limited Access Delivery"),
            overLength: accessorialValue.includes("Over Length"),
            limited: accessorialLimited.pickLimited
          },
          consigneeAccessorials: {
            appointmentDrop: accessorialValue.includes("Appointment (DROP)"),
            insideDelivery: accessorialValue.includes("Inside Delivery"),
            liftgateDelivery: accessorialValue.includes("Liftgate Delivery"),
            notify: accessorialValue.includes("Notify"),
            residentialDelivery: accessorialValue.includes("Residential Delivery"),
            sortAndSeg: accessorialValue.includes("Sort And Seg"),
            tradeShowDelivery: accessorialValue.includes("Trade Show Delivery"),
            constructionSiteDelivery: accessorialValue.includes("Construction Site Delivery"),
            limitedAccessDelivery: accessorialValue.includes("Limited Access Delivery"),
            notification: accessorialValue.includes("Notification"),
            redeliveryCharge: accessorialValue.includes("Redelivery Charge"),
            militaryDelivery: accessorialValue.includes("Military Delivery"),
            limited: accessorialLimited.deliveryLimited
          }
        }
      }
      const quoteIDresponse: any = await GetQuotationID(QuoteLtlRequest, shipInfo.customer, localStorage.getItem('userId'))
      if (quoteIDresponse.status == 200) {
        const choosecarrierRequest: QuoteRequest = {
          shipInfo: shipInfo,
          commodities: commodities,
          linearFt: LinearFt,
          CurrentQuoteId: 0,
          accessorials: accessorialValue,
          pickLimited: accessorialLimited.pickLimited,
          deliveryLimited: accessorialLimited.deliveryLimited,
          quoteId: quoteIDresponse.data.quoteId,
          customerData: GetCustomerData,
          totalWeight: Weight,
          totalQuantity: Quantity
        }
        // const quoteId = quoteIDresponse.data
        context.SetQuoteLtlRequest(choosecarrierRequest);
        // context.SetQuoteId(quoteIDresponse.data.quoteId);
        navigate('/quoteltl-choose-carrier')
      }
      else if (quoteIDresponse.status == 400 || quoteIDresponse.status == 401) {
        setLoader(false)
        if (LoadingQuotedPopup.current != null && ValidationPopup.current != null) {
          LoadingQuotedPopup.current.classList.remove("show");
          LoadingQuotedPopup.current.style.display = "none";
          ValidationPopup.current.classList.add("show");
          ValidationPopup.current.style.display = "block";

          let validationMessage = ""
          quoteIDresponse.data.Errors.forEach((data: any, index: any) => {
            validationMessage = validationMessage + data.Message
            if (index < quoteIDresponse.data.Errors.length - 1) {
              validationMessage = validationMessage + `,`
            }
          })
          SetValidationPopupMSG(validationMessage)
        }
      }
      else if (quoteIDresponse.status == 204) {
        setLoader(false)
        if (noContentPopup.current != null && LoadingQuotedPopup.current != null) {
          setnoContentPopupMSG("No records found!")
          LoadingQuotedPopup.current.classList.remove("show");
          LoadingQuotedPopup.current.style.display = "none";
          noContentPopup.current.classList.add("show");
          noContentPopup.current.style.display = "block";
        }
      }
      else {
        setLoader(false)
        if (LoadingQuotedPopup.current != null && someThingWentWrongPopup.current != null) {
          LoadingQuotedPopup.current.classList.remove("show");
          LoadingQuotedPopup.current.style.display = "none";
          someThingWentWrongPopup.current.classList.add("show");
          someThingWentWrongPopup.current.style.display = "block";
        }
      }
    }
  }

  /* Creating a form with multiple fields. */
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
              <div id={`descDisableDiv:${index}`} hidden={true} className="col-12 mb-3">
                <div className="col-sm-12 d-flex justify-content-between">
                  <span className="data-label ms-2"><span hidden={data.dIcon} className="density-icon me-2">D</span>{data.description}
                    <a onClick={() => OnDeleteClick(data.id)}><img src="../Images/commodity-delete-icon.svg" alt="delete icon" className="ps-2 delete-icon" /></a></span>
                </div>
              </div>

              <div id={`descriptionDiv:${index}`} className="col-12">
                <div className="mb-3">
                  <div className="col-sm-12 d-flex justify-content-between">
                    <input type="text" className="form-control cp-form-field ms-2" id={`description:${index}`} maxLength={255} placeholder="Enter Commodity Description" value={data.description} name="description" onChange={(event: any) => { onValueChangecommodities(event, index, "text") }} onBlur={(event) => { onBlurDescCommChange(event, index) }} />
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
                  <span hidden={false} className="input-group-text cp-search" id={`nmfcSearchSpan:${index}`}><a onClick={() => { onNmfcSearchClick() }}><img src="../Images/search-icon.svg" alt="search icon" className="search-icon image-fluid" data-bs-toggle="modal" data-bs-target="#bookltl-sucess-popup-close" /></a></span>
                </div>
                <span className="form-label cp-form-label px-0 " id={`nmfcSpan:${index}`} hidden={true} style={{ color: "red" }}></span>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-5 mb-4">
                <label htmlFor="qutltl-shipinfo-classcommo" className="form-label cp-form-label">Class</label>
                <span className="cp-form-mandatory">*</span>
                <select id={`classInput:${index}`} className="form-select cp-form-field" value={data.class} name="class" onChange={(event: any) => { onValueChangecommodities(event, index, "") }} >
                  <option value={""} disabled={true}>Select Class</option>
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
                      <option value={""} disabled={true}>Select Type</option>
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

  const onCancelClick = () => {
    SetShipInfo({
      ...shipInfo,
      ["pickCity"]: "",
      ["pickState"]: "",
      ["pickZipCode"]: "",
      ["deliveryCity"]: "",
      ["deliveryState"]: "",
      ["deliveryZipCode"]: "",
      ["customer"]: "",
      ["payType"]: ""
    })
    let emptyCommodities = {
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
    Setcommodities([emptyCommodities])
    SetaccessorialValue([])
    setcompletedCheck({ ...completedCheck, ["Shipper"]: false, ["commodities"]: false })

    SetQuantity(0);
    SetWeight(0);
    context.ResetContext()
  }

  const OnValueChangepreSavedComm = (event: any) => {
    let weight = 0
    let quantity = 0
    preSavedCommodityOptions.forEach((data: any, index: any) => {
      if (event.target.value == data.id) {
        let commodities_Obj = {
          id: uuidv4(),
          description: data.description,
          nmfc: data.nmfc,
          class: data.class,
          stack: data.stackable == 0 ? false : true,
          haz: data.hazmat == 0 ? false : true,
          dimenLength: data.length == null ? 0 : data.length,
          dimenWidth: data.width == null ? 0 : data.width,
          dimenHeight: data.height == null ? 0 : data.height,
          weight: 0,
          quantity: 0,
          type: "",
          reviewAcc: false,
          commoditiesAcc: false,
          cube: 0,
          pcf: data.density == null ? 0 : data.density
        }


        Setcommodities([...commodities, commodities_Obj])
      }
    })
    commodities.forEach((data: any) => {
      weight = weight + Number(data.weight);
      quantity = quantity + Number(data.quantity);
    });
    SetWeight(weight)
    SetQuantity(quantity)
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
            {GetBookLtlRequest.shipperInfo.name !== "" ? <><li><a className="cursor" onClick={() => { navigate("/loadsearch"); }}>All Loads</a></li><li><a className="cursor" onClick={() => { navigate("/bookltl"); }}>Book LTL</a></li></> :
              <li><a className="cursor" onClick={() => { navigate("/loadsearch") }}>All Loads</a></li>
            }
            <li className="pe-2">Quote LTL</li>
          </ul>
        </div>
        {!GetBookLtlRequest.BooktoQuote ? <div className="col-md-12 my-3">
          <ul className="qut-custom-stepper ps-0">
            <li className="qut-stepper-count active">
              <span className="qut-shipperinfo-stepper-icon" />
              <span className="d-block d-md-none mt-3 qut-stepper-text">Information</span>
              <span className="d-none d-md-inline d-xl-none qut-stepper-text ms-2">Shipping Information</span>
              <span className="d-none d-xl-inline ms-2 qut-stepper-text">Shipping Information</span>
            </li>
            <li className="qut-stepper-count qut-stepper-2 ">
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
              <li className="stepper-count stepper-2 active">
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
      <h5 className="page-header-txt">Quote Request</h5>
      <form>
        <div className="row">
          <div className="accordion" id="qut-ltl-shipment-info-accordion">
            <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={shipperInfoAccordionDivRef}>
              <h2 className="accordion-header py-1" id="qut-shipment-information">
                <button onClick={() => accordionHideShow(shipperInfoDownButtonRef, shipperInfoDivRef)} ref={shipperInfoDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0" type="button">
                  <span className="ms-3">Shipment Information</span>
                </button>
                {completedCheck.Shipper ? <div className="float-end">
                  <label className="completed-status me-4">
                    <span>
                      <img src="Images/completed-status-icon.svg" alt="completed-status-icon" className="status-icon me-2" />
                    </span>
                    Completed</label>
                </div> : null}
              </h2>
              <div ref={shipperInfoDivRef} id="qut-shipment-info" className="accordion-collapse collapse show" aria-labelledby="qut-shipment-information">
                <div className="accordion-body cp-accordion-body-padding">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-customer" className="form-label cp-form-label">Customer
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <select id="qutltl-customer" disabled={GetBookLtlRequest.BooktoQuote} ref={CustomerSelectRef} className="form-select cp-form-field" name="customer" value={shipInfo.customer} onChange={(event) => { onValueChange(event, "CustomerChange") }}>
                        <option value={""} disabled={true}>Select Customer</option>
                        {customerDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0" ref={CustomerSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>


                  <div className="row">
                    <h6 className="primary-header pb-3 pt-4">Pick up</h6>

                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-pucity" className="form-label cp-form-label">City
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <input type="text" ref={pickCityInputRef} maxLength={35} className="form-control cp-form-field" id="qutltl-shipinfo-shipmentinfo-pucity" placeholder="Enter City" name="pickCity" value={shipInfo.pickCity} onChange={(event) => { onValueChange(event, "Text") }} onBlur={(event) => { OnBlurShipmentChange(event) }} />
                      <span className="form-label cp-form-label px-0" ref={pickCitySpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-pustate" className="form-label cp-form-label">State
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <select id="qutltl-shipinfo-shipmentinfo-pustate" ref={pickStateSelectRef} className="form-select cp-form-field" name="pickState" value={shipInfo.pickState} onChange={(event) => { onValueChange(event, "") }}>
                        {/* <option disabled selected hidden>Select Class</option> */}
                        <option value={""} disabled={true}>Select State</option>
                        {stateDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0" ref={pickStateSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-puzipcode" className="form-label cp-form-label">Zip Code
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <input type="text" className="form-control cp-form-field" id="qutltl-shipinfo-shipmentinfo-puzipcode" ref={pickZipInputRef} placeholder="Enter Zip Code" name="pickZipCode" maxLength={7} value={shipInfo.pickZipCode} onChange={(event) => { onValueChange(event, "Zip") }} onBlur={(event) => { OnBlurShipmentChange(event) }} />
                      <span className="form-label cp-form-label px-0" ref={pickZipSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>

                  <div className="row">
                    <h6 className="primary-header pb-3 pt-4">Delivery</h6>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-decity" className="form-label cp-form-label">City
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <input type="text" ref={deliveryCityInputRef} className="form-control cp-form-field" id="qutltl-shipinfo-shipmentinfo-decity" placeholder="Enter City" name="deliveryCity" value={shipInfo.deliveryCity} onChange={(event) => { onValueChange(event, "Text") }} onBlur={(event) => { OnBlurShipmentChange(event) }} />
                      <span ref={deliveryCitySpanRef} className="form-label cp-form-label px-0" hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-destate" className="form-label cp-form-label">State
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <select id="qutltl-shipinfo-shipmentinfo-destate" ref={deliveryStateSelectRef} className="form-select cp-form-field" name="deliveryState" value={shipInfo.deliveryState} onChange={(event) => { onValueChange(event, "") }}>
                        {/* <option disabled selected hidden>Select Class</option> */}
                        <option value={""} disabled={true}>Select State</option>
                        {stateDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0" ref={deliveryStateSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-dezipcode" className="form-label cp-form-label">Zip Code
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <input type="text" className="form-control cp-form-field" id="qutltl-shipinfo-shipmentinfo-dezipcode" ref={deliveryZipInputRef} maxLength={7} placeholder="Enter Zip Code" name="deliveryZipCode" value={shipInfo.deliveryZipCode} onChange={(event) => { onValueChange(event, "Zip") }} onBlur={(event) => { OnBlurShipmentChange(event) }} />
                      <span className="form-label cp-form-label px-0" ref={deliveryZipSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
                      <label htmlFor="qutltl-shipinfo-shipmentinfo-depaytype" className="form-label cp-form-label">Pay Type
                        <span className="cp-form-mandatory">*</span>
                      </label>
                      <select id="qutltl-shipinfo-shipmentinfo-depaytype" ref={PayTypeSelectRef} className="form-select cp-form-field" name="payType" value={shipInfo.payType} onChange={(event) => { onValueChange(event, "") }}>
                        <option value={""} disabled={true}>Select Pay Type</option>
                        {payTypeDropDown()}
                      </select>
                      <span className="form-label cp-form-label px-0" ref={PayTypeSpanRef} hidden={true} style={{ color: "red" }}></span>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn cp-btn-primary my-4" onClick={() => { shipperContinueClick() }}>Continue</button>
                  </div>

                </div>
              </div>
            </div>
            <div className="accordion-item cp-accordion-brd-radius border-0 my-3" ref={commoditiesAccordionDivRef}>
              <h2 className="accordion-header py-1" id="qutltl-commodi">
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
              <div ref={commoditiesDivRef} id="qutltl-commodities" className="accordion-collapse collapse" aria-labelledby="qutltl-commodi">
                <div className="accordion-body cp-accordion-body-padding position-relative">
                  <img src="../Images/commodities-info-icon.svg" className="ms-2 mb-1 density-modal-position pointer" alt="help and documentation" data-bs-toggle="modal" data-bs-target="#bookltl-commodities-info-popup" />
                  {commodities.length > 0 ? <>{loadcommodities()}
                    <div className="row">
                      <div className="col-10 col-md-12 col-sm-12">
                        <div className="row border-bottom">
                          <h6 className="primary-header pb-3">TOTAL</h6>
                          <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3">
                                <label className="form-label cp-form-label mb-0">Quantity<span className="data-txt ps-3"> {Quantity}</span></label>
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
                    <div className="col-12 col-sm-12 col-md-6 col-lg-5">
                      <div className="mb-3">
                        <select id="qutltl-shipinfo-precommo" className="form-select cp-form-field" onChange={(event: any) => { OnValueChangepreSavedComm(event) }}>
                          <option value={""}>Select Presaved Commodities</option>
                          {preSaveDropDown()}
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-3">
                      <div className="mb-3">
                        <button type="button" className="btn cp-btn-secondary" onClick={() => { addNewCommodity() }}>Add New Commodity</button>
                      </div>
                    </div>
                    <div className="text-end">
                      <button type="button" className="btn cp-btn-primary my-4" onClick={() => { commoditiesContinueClick() }}>Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="bookltl-commodities-info-popup" tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable density-popup-width">
                <div className="modal-content">
                  <div className="modal-header  border-0  p-3 ">
                    <span className="primary-header">Density Items</span>
                    <button type="button" className="btn-close shadow-none  ms-5" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body  text-align-center d-flex">
                    <div className="me-3">
                      <span className="density-icon">D</span>
                    </div>
                    <div className="pt-1">
                      <p className="data-txt">The D-icon may appear next to commodities selected from the
                        list.What does that mean? </p>
                      <p className="data-txt"><span className="data-label">PURE DENSITY ITEM -</span> Class
                        and sub vary based on density, therefore dimensions are always required to
                        determine density. If you select an existing pure density commodity from the
                        list, the form may pre-fill with default dimensions, class, and sub based on
                        this shipper’s history, but these will change automatically if you edit
                        dimensions. </p>
                      <p className="data-txt"><span className="data-label">Note :</span> Commodities without
                        the D-icon fall into three categories, none of which require dimensions.</p>
                      <p className="data-txt"><span className="data-label">Non-Density Item, Without Subs
                        -</span> This item has no subs in the NMFTA listing, for example, NMFC
                        135760 will always be 135760 and bever 135760-01, etc. NMFTA listing will
                        specify “Class Not Taken” or “Class_regardless of density” to indicate that
                        density has no bearing for this commodity.</p>
                      <p className="data-txt"><span className="data-label">Non-Density Item, With Subs
                        -</span> This item does have subs in the NMFTA listing; however, subs
                        are not density-related - but they could affect the class and must therefore
                        be reviewed. Non-density subs could be based on such factors as packaging,
                        type of material, SU (set up) or KD (knock down), release etc. For
                        such commodities, always verify and select a different sub if necessary.</p>
                      <p className="data-txt"><span className="data-label">Frequent-Repeat Density Item
                        -</span> The commodity is a density item, but the shipper ships this
                        item frequently and Sunteck knows the density will never change; the LTL
                        Admin has locked it down so that you keep the same class and sub even if you
                        edit the dimensions.</p>
                      <p className="data-txt"><span className="data-label">Note :</span> Dimensions will be
                        required even for non D-icon commodities if the quote qualifies as volume.
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer pb-4 justify-content-center border-0">
                    <button type="button" className="btn cp-btn-primary" data-bs-dismiss="modal">OK</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Nmfc Search PopUp*/}
            <div ref={NMFCDivPopUp} style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} className="modal fade" id="nmfc-search-popup" tabIndex={-1} aria-hidden="true" >
              <div className="modal-dialog modal-dialog-centered search-popup-width">
                <div className="modal-content">
                  <div className="modal-header  border-0  p-3 ">
                    <span className="primary-header">NMFC Search</span>
                    <button type="button" className="btn-close shadow-none  ms-5" data-bs-dismiss="modal" aria-label="Close" onClick={() => { onNmfcClose() }} />
                  </div>
                  <div className="modal-body ">
                    <div className="row align-items-center mb-3">
                      <div className="col-md-6 ">
                        <span className="data-label me-2">Possible NMFCs</span>
                        {NmfcValidationPopupMSG == "" ?
                          <span className="data-txt">Results {nmfcPopupCount.StartIndex} - {nmfcPopupCount.EndIndex} of {nmfcPopupCount.TotalMatch}</span>
                          :
                          null
                        }
                      </div>
                      <div className="col-md-6">
                        <div className="input-group">
                          <input type="search" className="form-control search-form-field border-end-0" placeholder="Search" aria-label="search" aria-describedby="search" id="nmfc-search" onChange={(event: any) => {
                            setpopupSearch(event.target.value)
                          }} />
                          <span className="input-group-text bg-white ql-border-radius" id="search"><a onClick={() => { onSearchClick() }} ><img src="../Images/search-icon.svg" alt="search icon" className="search-icon image-fluid" /></a></span>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive nfmc-grid popupgrid-scroll-sty">
                      <table className="table mb-0  table-borderless">
                        <tbody>
                          {popUpLoader ?
                            <tr>
                              <td className="justify-content-center align-self-center d-flex nmfc-loader-height bg-white">
                                <div className="spinner-border Loader text-dark align-self-center ms-2 mb-3" role="status">
                                  <span className="visually-hidden" />
                                </div>
                              </td>
                            </tr>
                            :
                            <>
                              {
                                NmfcValidationPopupMSG == ""
                                  ?
                                  populateNmfc() :
                                  <tr>
                                    <td className="d-flex justify-content-center align-items-center nmfc-loader-height bg-white">
                                      <div className="d-flex align-items-center flex-column ms-2 mb-3" role="status">
                                        <img src="Images/no-documents-found-icon.svg" alt="No records found" className="no-records-icon" />
                                        <span className="data-label">{NmfcValidationPopupMSG}</span>
                                      </div>
                                    </td>
                                  </tr>
                              }
                            </>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer pb-4 justify-content-center border-0">
                    <a className="cp-link px-2" onClick={() => { onPrevPopupClick() }}>&lt;&lt; Prev 25</a>
                    <span className='data-txt'>|</span>
                    <a className="cp-link px-2" onClick={() => { onNextPopupClick() }}>Next 25 &gt;&gt;</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Nmfc Item PopUp*/}
            <div ref={NMFCItemDivPopUp} style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} className="modal fade" id="nmfc-item-popup" tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered search-popup-width">
                <div className="modal-content">
                  <div className="modal-header  border-0  p-3 ">
                    <span className="primary-header" data-bs-target="#nmfc-search-popup" data-bs-toggle="modal" data-bs-dismiss="modal"><img src="../Images/nmfc-popup-previous-icon.svg" alt="previous-icon" className="mb-1 me-2 pointer" /> NMFC Search</span>
                    <button type="button" className="btn-close shadow-none  ms-5" data-bs-dismiss="modal" aria-label="Close" onClick={() => { onNmfcItemClose() }} />
                  </div>
                  <div className="modal-body pt-0">
                    <div className="data-txt mb-2">
                      {nmfcItemPopupData[0]?.Description}
                      {nmfcItemPopupData[0]?.SubItems.SubItem == null ? 
                      <p><a onClick={() => { clickOnSubItemNumber(nmfcItemPopupData[0]?.Classification) }} className="cp-link">{"Class " + nmfcItemPopupData[0]?.Classification + " " + "regardless of density"}</a></p>
                      :null}
                    </div>
                    <div className="row align-items-center mb-3">
                      <div className="col-md-6 ">
                      </div>
                      <div className="col-md-6">
                        <div className="input-group">
                          <input type="search" className="form-control search-form-field border-end-0" placeholder="Search" aria-label="search" aria-describedby="search" id="nmfc-search" onChange={(event: any) => {
                            setpopupSearch(event.target.value)
                          }} />
                          <span className="input-group-text bg-white ql-border-radius" id="search"><a onClick={() => { onSearchClick() }} ><img src="../Images/search-icon.svg" alt="search icon" className="search-icon image-fluid" /></a></span>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive nfmc-grid popupgrid-scroll-sty">
                      <table className="table mb-0  table-borderless">
                        <tbody>
                          {popUpLoader ?
                            <tr>
                              <td className="justify-content-center align-self-center d-flex nmfc-loader-height bg-white">
                                <div className="spinner-border Loader text-dark align-self-center ms-2 mb-3" role="status">
                                  <span className="visually-hidden" />
                                </div>
                              </td>
                            </tr>
                            :
                            <>
                              {
                                NmfcValidationPopupMSG == ""
                                  ?
                                  populateNmfcItem() :
                                  <tr>
                                    <td className="d-flex justify-content-center align-items-center nmfc-loader-height bg-white">
                                      <div className="d-flex  flex-column ms-2 mb-3" role="status">
                                        <img src="Images/no-documents-found-icon.svg" alt="No records found" className="no-records-icon" />
                                        <span className="data-label">{NmfcValidationPopupMSG}</span>
                                      </div>
                                    </td>
                                  </tr>
                              }
                            </>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item cp-accordion-brd-radius border-0 my-3">
              <h2 className="accordion-header py-1" id="bookltl-access">
                <button onClick={() => accordionHideShow(accesorialsDownButtonRef, accesorialsDivRef)} ref={accesorialsDownButtonRef} className="cp-accordion-button ps-3 cp-accordion-brd-radius cp-accordion-header pb-3 border-0 collapsed" type="button">
                  <span className="ms-3">Accessorials</span>
                </button>
              </h2>
              <div ref={accesorialsDivRef} id="bookltl-accessorials" className="accordion-collapse collapse" aria-labelledby="bookltl-access">
                <div className="accordion-body cp-accordion-body-padding">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                      <h6 className="data-label pb-3">General Accesorials</h6>
                      <div className="mb-3">
                        {GenralAccessorialsLoad()}
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                      <h6 className="data-label pb-3">Pick Accesorials</h6>
                      <div className="mb-3">
                        {PickAccessorialsLoad()}
                        <div className="form-check my-2">
                          <input className="cp-checkbox form-check-input" type="checkbox" id="qutltl-shipinfo-pa-limit"
                            onChange={(event: any) => {
                              (event.target.checked && PickLimitedDiv.current) ? (PickLimitedDiv.current.hidden = false) :
                                ((PickLimitedDiv.current) && (PickLimitedDiv.current.hidden = true))
                            }} defaultChecked={accessorialLimited.pickLimited.length > 0}
                          />
                          <label className="data-txt form-check-label ms-1" htmlFor="qutltl-shipinfo-pa-limit">
                            Limited
                          </label>
                        </div>
                        <div className="my-3 w-75" hidden={accessorialLimited.pickLimited.length == 0} ref={PickLimitedDiv}>
                          <select id="pick-accesorials" className="form-select cp-form-field" name="pickLimited" defaultValue={accessorialLimited.pickLimited} onChange={(event: any) => { onLimitedValueChange(event) }}>
                            {<option value={""} disabled={true}> Select </option>}
                            {limitedDropDown("pickLimited")}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                      <h6 className="data-label pb-3">Drop Accesorials</h6>
                      <div className="mb-3">
                        {DropAccessorialsLoad()}
                        <div className="form-check my-2">
                          <input className="cp-checkbox form-check-input" type="checkbox" id="qutltl-shipinfo-da-limit"
                            onChange={(event: any) => {
                              (event.target.checked && DropLimitedDiv.current) ? (DropLimitedDiv.current.hidden = false) :
                                ((DropLimitedDiv.current) && (DropLimitedDiv.current.hidden = true))
                            }} defaultChecked={accessorialLimited.deliveryLimited.length > 0} />
                          <label className="data-txt form-check-label ms-1" htmlFor="qutltl-shipinfo-da-limit">
                            Limited
                          </label>
                        </div>
                        <div className="my-3 w-75" hidden={accessorialLimited.deliveryLimited.length == 0} ref={DropLimitedDiv}>
                          <select id="drop-accesorials" className="form-select cp-form-field" name="deliveryLimited" defaultValue={accessorialLimited.pickLimited} onChange={(event: any) => { onLimitedValueChange(event) }}>
                            {<option value={""} disabled={true}> Select </option>}
                            {limitedDropDown("deliveryLimited")}
                          </select>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* <div className=" d-flex btn-order justify-content-end">
        {GetBookLtlRequest.BooktoQuote ? <button type="button" className="btn bookltl-mbl-btn-order-2  my-2 cp-btn-secondary float-start" onClick={() => { navigate("/quoteltl-choose-carrier") }}><img src="../Images/previous-icon.svg" alt="privious Icon" className="logout-icon me-2" />Previous</button> : null}
        <button type="button" className="btn  bookltl-mbl-btn-order-2 cp-btn-tertiary my-2">Cancel</button>
        <button type="button" className="btn  bookltl-mbl-btn-order-1 cp-btn-primary my-2 bookltl-request-btn" onClick={() => { RequestTariffRateClick() }}>Request
          Tariff Rates</button>
      </div> */}

      <div className="text-end">
        {GetBookLtlRequest.BooktoQuote ? <button type="button" className="btn cp-btn-secondary my-4 float-start" onClick={() => { navigate("/bookltl") }}><img src="../Images/previous-icon.svg" alt="previous Icon" className="logout-icon me-2" />Previous</button> : null}
        <button type="button" className="btn cp-btn-tertiary my-4 me-2" onClick={() => { onCancelClick() }}>Clear</button>
        <button type="button" className="btn cp-btn-primary my-4"
          onClick={() => { RequestTariffRateClick() }}
        >
          Request Tariff Rates
        </button>
      </div>
      {/* Loading Quoted Rates PopUp*/}
      <div className="modal fade" style={{ backgroundColor: "rgba(0, 0, 0, .5)" }} ref={LoadingQuotedPopup} id="quote-tarrif-rates" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered tr-width">
          <div className="modal-content p-3">
            <div className="tr-modal-header pt-0 border-0  ">
              <span className="popup-header">Loading Quoted Rates</span>
            </div>
            <div className="modal-body pt-2">
              <p className="tr-fls-txt ms-1 mb-4">Please wait while we load the Quotes Rates for your Shipping
                Request</p>
              <div className="d-flex justify-content-end mb-3">
                <span className="data-label">{barLoader}</span>
                <span className="data-label"> % Completed</span>
              </div>
              <div className="tr-progress-bar">
                <div className="progress-bar tr-bg-color" role="progressbar" aria-label="Success example" style={{ width: `${barLoader}%` }} />
              </div>
            </div>
            <div className="modal-footer pb-1 justify-content-center border-0">
              <button type="button" className="btn cp-btn-tertiary" data-bs-dismiss="modal" onClick={() => { OnLoaderCancelClick() }}>Cancel</button>
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
              <h5 className="popup-header">{noContentPopupMSG}</h5>
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
          <div className="spinner-border barLoader text-dark align-center ms-2" role="status">
            <span className="visually-hidden" />
          </div>
          <p className="data-label">Loading...</p>
        </div>
      </div> : null}
    </div>
  )
}

export default QuoteLtl