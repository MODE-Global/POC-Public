import { StatesMainResp } from '../interface/QuoteLtlInterface'
import { client, Quoteclient, userSummaryClient } from '../api/Client'
import { PermissionReq, SummaryQueryDetail } from '../interface/UserInfoInterface'

export const GetLoginDetail = async (data: any) => {

  const response = await client(
    `authentication/auth/login`,
    { method: 'POST', body: data, },
  )

  return response
}

export const GetUserDetail = async (UserId: any) => {
  const response = await client(
    `customer/user/userdetail/${UserId}`,
    { method: 'GET' },
  )
  return response
}

export const GetEquipmentType = async () => {
  const response = await client(
    `masterrecord/equipmenttype`,
    { method: 'GET' },
  )
  return response
}

export const ChangePassword = async (requestBody: any) => {

  const response = await client(
    `authentication/auth/changepass`,
    { method: 'POST', body: requestBody },
  )

  return response
}


export const SendOtp = async (insertdata: any) => {

  const response = await client(
    `authentication/auth/generateotp`,
    { method: 'POST', body: insertdata },
  )
  return response
}


export const CheckOtp = async (insertdata: any) => {

  const response = await client(
    `authentication/auth/verifyotp`,
    { method: 'POST', body: insertdata },
  )

  return response
}


export const ForgotPassword = async (loginId: any) => {
  const response = await client(
    `authentication/auth/forgotpass/${loginId}`,
    { method: 'GET', body: null },
  )
  return response
}

export const GetQuotation = async (loginId: any) => {
  const response = await client(
    `Quoteltl`,
    { method: 'POST', body: null },
  )
  return response
}
export const Getaccessorials = async (ratingEngine: string, custmID: any) => {

  let endpoint = "";

  if (ratingEngine == "Banyan") {
    endpoint = `masterrecord/getaccessorials/` + ratingEngine
  }
  else {
    endpoint = `masterrecord/getaccessorials/` + ratingEngine + `?custmId=${custmID}`
  }

  const response = await client(
    endpoint,
    { method: 'GET', body: null },
  )
  return response
}

export const LoadSearch = async (loadRequestObj: any) => {

  const response = await client(
    `book/load/loadsearch`,
    { method: 'POST', body: loadRequestObj },
  )

  return response
}

export const LoadDocuments = async (loadDocReq: any) => {

  const response = await client(
    `book/load/loaddocument`,
    { method: 'POST', body: loadDocReq },
  )
  return response
}

export const LoadMethod = async () => {

  const response = await client(
    `masterrecord/loadmethod`,
    { method: 'GET', body: null },
  )
  return response
}

export const LoadStatus = async () => {

  const response = await client(
    `masterrecord/loadstatus`,
    { method: 'GET', body: null },
  )
  return response
}

/**
 * This method is newly added to load the details for a particulat load id
 * @param loadId - A specific load id to get the details
 * @returns - A JSON response to the component to load the data in controls
 */
export const GetLoadDetail = async (loadId: any, loadOrg: any) => {
  const response = await client(
    `book/load/loaddetails/${loadId}?loadOrigin=${loadOrg}`,
    { method: 'GET', body: null },
  )
  return response
}

/**
 * This method is written for sending email for load detail
 * @param emailReq - request object for sending email.
 * @returns 
 */
export const SendEmailForLoadDetail = async (emailReq: any) => {
  const response = await client(
    `postmark/sendmail`,
    { method: 'POST', body: emailReq },
  )
  return response
}

export const CreateLoad = async (loadReq: any) => {
  const response = await client(
    `book/load/creatl`,
    { method: 'POST', body: loadReq },
  )
  return response
}

export const GetClassList = async () => {
  const response: any = await client(
    `masterrecord/class`,
    { method: 'GET', body: null },
  )
  return response
}

export const GetPayTypeList = async () => {
  const response: any = await client(
    `masterrecord/paytype`,
    { method: 'GET', body: null },
  )
  return response
}

export const GetCountryList = async () => {
  const response: any = await client(
    `masterrecord/country`,
    { method: 'GET', body: null },
  )
  return response
}

export const GetShipperList = async (custaId: string) => {
  const response: any = await client(
    `masterrecord/getshipperpoints/` + custaId,
    { method: 'GET', body: null },
  )
  return response
}


export const GetConsigneeList = async (custaId: string) => {
  const response: any = await client(
    `masterrecord/getconsigneepoints/` + custaId,
    { method: 'GET', body: null },
  )
  return response
}

export const GetPreSavedCommodtiesList = async (custaId: string) => {
  const response: any = await client(
    `masterrecord/presavedcommodities/` + custaId,
    { method: 'GET', body: null },
  )
  return response
}

export const GetQuotationID = async (rateQuoteObj: any, loginId: any, userId: any) => {
  const headerObj = {
    'userId': userId,
    'loginId': loginId
  }

  const response = await Quoteclient(
    `quote/ltl/getquoteid`,
    { method: 'POST', body: rateQuoteObj, headers: headerObj },
  )
  return response
}

export const GetQuotes = async (quoteID: any, loginId: any, userId: any) => {
  const headerObj = {
    'userId': userId,
    'loginId': loginId
  }
  const response = await Quoteclient(
    `quote/ltl/getquotes/` + quoteID,
    { method: 'GET', body: undefined, headers: headerObj },
  )
  return response
}

export const GetStatesList = async () => {
  const response: StatesMainResp = await client(
    `masterrecord/states`,
    { method: 'GET', body: null },
  )
  return response
}

export const GetUOMList = async () => {
  const response: any = await client(
    `masterrecord/getuom`,
    { method: 'GET', body: null },
  )
  return response
}

export const VerifyAddress = async (data: any) => {

  const response = await client(
    `aperture/smartystreets/verifyaddress`,
    { method: 'POST', body: data, },
  )

  return response
}

export const VerifyZip = async (data: any) => {

  const response = await client(
    `masterrecord/verifyzip`,
    { method: 'POST', body: data, },
  )

  return response
}

export const CreateBookLtl = async (data: any, loginId: any, userId: any) => {

  const headerObj = {
    'userId': userId,
    'loginId': loginId
  }

  const response = await client(
    `book/ltl/bookltl`,
    { method: 'POST', body: data, headers: headerObj },
  )

  return response
}

//Admin Insert
export const CreateNewUser = async (UserInfo: any) => {

  const response = await client(
    `customer/admin/createuser`,
    { method: 'POST', body: UserInfo },
  )

  return response
}

export const GetUserCustomer = async (UserID: number) => {

  const response = await client(
    `customer/admin/usercustomer/${UserID}`,
    { method: 'GET' },
  )
  return response
}


//Gets User Details
export const GetUserDetails = async (UserID: number) => {

  const response = await client(
    `customer/user/userdetail/${UserID}`,
    { method: 'GET' },
  )

  return response
}

export const GetCustomerPermission = async (permReq: PermissionReq) => {

  const response = await client(
    `customer/admin/userpermission`,
    { method: 'POST', body: permReq },
  )

  return response
}

//User Summary Call
export const GetUserSummary = async (UserID: number, LoadDetails: SummaryQueryDetail) => {
  let query = ``;
  if (LoadDetails.searchQuery != undefined) {
    query == `` ? query = `?Searchparam=${LoadDetails.searchQuery}` : query += `&Searchparam=${LoadDetails.searchQuery}`;
  }
  if (LoadDetails.filCus != undefined) {
    query == `` ? query = `?FilCus=${LoadDetails.filCus}` : query += `&FilCus=${LoadDetails.filCus}`;
  }
  if (LoadDetails.filFromDate != undefined) {
    query == `` ? query = `?FilFromDate=${LoadDetails.filFromDate}` : query += `&FilFromDate=${LoadDetails.filFromDate}`;
  }
  if (LoadDetails.filToDate != undefined) {
    query == `` ? query = `?FilToDate=${LoadDetails.filToDate}` : query += `&FilToDate=${LoadDetails.filToDate}`;
  }
  if (LoadDetails.filStatus != undefined) {
    query == `` ? query = `?FilStatus=${LoadDetails.filStatus}` : query += `&FilStatus=${LoadDetails.filStatus}`;
  }
  if (LoadDetails.sortCol != undefined) {
    query == `` ? query = `?SortCol=${LoadDetails.sortCol}` : query += `&SortCol=${LoadDetails.sortCol}`;
  }
  if (LoadDetails.sortOrder != undefined) {
    query == `` ? query = `?SortOrder=${LoadDetails.sortOrder}` : query += `&SortOrder=${LoadDetails.sortOrder}`;
  }
  if (LoadDetails.pageIndex != undefined) {
    query == `` ? query = `?PageIndex=${LoadDetails.pageIndex}` : query += `&PageIndex=${LoadDetails.pageIndex}`;
  }
  const response = await userSummaryClient(
    `customer/admin/usersummary` + query,
    String(UserID),
    { method: 'GET' },
  )
  return response
}

//Status
export const StatusDD = async () => {

  const response = await client(
    `masterrecord/userstatus`,
    { method: 'GET' },
  )

  return response
}

//EditUser
export const EditUser = async (UserInfo: any) => {

  const response = await client(
    `customer/admin/edituser`,
    { method: 'POST', body: UserInfo },
  )

  return response
}

export const NmfcSearch = async (data: any) => {
  const response = await client(
    `aperture/nmfc/search`,
    { method: 'POST', body: data, },
  )
  return response
}

export const GetRetrieveItemdetail = async (itemNumber: any) => {
  const response = await client(
    `aperture/nmfc/retrieveitemdetail/${itemNumber}`,
    { method: 'GET' },
  )
  return response
}