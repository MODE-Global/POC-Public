import { createContext, useState, useEffect } from "react";
import { AppRoutes } from "./routes";
import { QuoteLtlResponse, QuoteRequest } from '../interface/QuoteLtlInterface'
import { BookRequest } from '../interface/BookLtlinterface'
import { v4 as uuidv4 } from "uuid";
export const UserContext = createContext<any>({})
var CryptoJS = require("crypto-js");

export const UsersContext = () => {
    const userCurrentStatus = window.localStorage.getItem("UCS")
    const [currentUserStatus, setcurrentUserStatus] = useState((userCurrentStatus == null || userCurrentStatus == undefined) ? false : true);
    const [screenList, setScreenList] = useState([""])

    const QuoteRequest: QuoteRequest = {
        shipInfo: {
            pickCity: "",
            pickState: "",
            pickZipCode: "",
            deliveryCity: "",
            deliveryState: "",
            deliveryZipCode: "",
            customer: "",
            payType: ""
        },
        commodities: [{
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
            dIcon:true,
            pcf: 0
        }],
        linearFt: "",
        accessorials: [],
        CurrentQuoteId: 0,
        pickLimited: "",
        deliveryLimited: "",
        quoteId: "",
        customerData: {
            custmId: "",
            custaId: "",
            ratingEngine: ""
        },
        totalWeight: 0,
        totalQuantity: 0
    }

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
    const [QuoteLtlRequest, setQuoteLtlRequest] = useState(QuoteRequest)
    const [QuoteLtlResponse, setQuoteLtlResponse] = useState(QuoteReponseVar)

    const BookRequest: BookRequest = {
        AgentDetails: {
            agentContact: "",
            agentEmailId: "",
            agentPhone: "",
            custmId: "",
            custaId: ""
        },
        referenceNumber: {
            customer: "",
            poNumber: "",
            blNumber: "",
            shippingNumber: ""
        },
        shipperInfo: {
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
        },
        consigneeInfo: {
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
        },
        BooktoQuote: false,
        LinearFt: ""
    }

    const [BookLtlRequest, setBookltlRequest] = useState(BookRequest)
    let userResObj: any = {
        userEmail: "",
        userPhoneNumber: 0,
        verifyEmail: 0,
        verifyPhone: 0,
        cropName: "",
        userFirstName: ""
    }

    const [MenuData, setMenuData] = useState(userResObj)

    const ChangeContextValue = () => {
        setcurrentUserStatus(!currentUserStatus)
    }

    const menuData = localStorage.getItem("menuData")
    /* A hook that is called when the component is mounted. It is also called when the menuData variable
    changes. */
    useEffect(() => {

        if (menuData != undefined && menuData != null) {
            var bytes = CryptoJS.AES.decrypt(menuData, '');
            var decryptedMenuData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setMenuData(decryptedMenuData)
        }
    }, [menuData])


    const PM = localStorage.getItem("PM");

    /* A hook that is called when the component is mounted. It is also called when the PM variable
    changes. */
    useEffect(() => {
        if (PM != undefined && PM != null) {
            var bytes = CryptoJS.AES.decrypt(PM, '');
            var decryptedPM = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setScreenList(decryptedPM)
        }
    }, [PM])

    const resetContext = () => {

        setQuoteLtlRequest(QuoteRequest);
        setQuoteLtlResponse(QuoteReponseVar);
        setBookltlRequest(BookRequest);
    }

    return (
        <div>
            <UserContext.Provider value={
                {
                    GetCurrentUserValue: () => { return currentUserStatus },
                    setCurrentuserValue: ChangeContextValue,
                    GetScreenList: () => { return screenList },
                    SetScreenListArray: setScreenList,
                    GetMenuData: () => { return MenuData },
                    SetMenuData: setMenuData,
                    GetQuoteLtlResponse: () => { return QuoteLtlResponse },
                    SetQuoteLtlResponse: setQuoteLtlResponse,
                    GetQuoteLtlRequest: () => { return QuoteLtlRequest },
                    SetQuoteLtlRequest: setQuoteLtlRequest,
                    GetBookLtlRequest: () => { return BookLtlRequest },
                    SetBookltlRequest: setBookltlRequest,
                    ResetContext: resetContext
                }
            }>
                <AppRoutes />
            </UserContext.Provider>
        </div>
    )
}