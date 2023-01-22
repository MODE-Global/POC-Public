export interface UserSummaryMainResponse{
    data: UserSummaryResponse,
    status: number,
    statusText: string
}

export interface CustomerDetailMainResponse {
    data: UserDetailRes,
    status: number,
    statusText: string
}

export interface UserCustomerMainResponse {
    data: UserCustomerRes[],
    status: number,
    statusText: string
}

export interface UserStatusMainResponse{
    data: UserStatusResp,
    status: number,
    statusText: string
}

export interface CustomerPermissionMainResponse {
    data: CustomerPermission[],
    status: number,
    statusText: string
}

export interface Options {
    name: string,
    id: string
}

//UserDetails Grid
export interface UserSummaryResponse {
    UserSummaryResponse: UserSummary[]
}

export interface UserSummary {
    GCID: string,
    userID: number,
    userName: string,
    EmailId: string,
    PhoneNumber: string,
    Permission: Permission[],
    Customer: Customer[],
    Status: Status[]

}

export interface Permission {
    PermissionID: number,
    PermissionType: string
}

export interface CustomerOpt {
    GCID: string,
    customerName: string
}

export interface Customer {
    CoorporateID: string,
    CustomerID: string,
    customerName: string
}

export interface Status {
    statusId: number,
    statusDesc: string
}

export interface SummaryQueryDetail {
    searchQuery?: string,
    filCus?: string,
    filFromDate?: string,
    filToDate?: string,
    filStatus?: string,
    sortCol?: string,
    sortOrder?: string,
    pageIndex?: string
}

export interface UserStatusResp {
    UserStatus: UserStatus[]
}

export interface UserStatus {
    UserStatusId: number,
    Status: string
}

//UserForm
export interface UserCreateFields{
    FirstName: string,
    LastName: string,
    EmailId: string,
    PhoneNumber: string,
    userStatus?: string,
    userCreatedDate?: string,
    CustomerDetails: UserDetails[]
}


export interface UserInfo {
    loginUserId?: string,
    userId: string,
    FirstName: string,
    LastName: string,
    EmailId: string,
    PhoneNumber: string,
    GCPermission: GCPermission[] | null,
    Status?: number,
    Token?: string
}

export interface PermissionReq {
    Gcid: string[],
    UserId: string
}

export interface CustomerPermission {
    Gcid: string,
    Permission: string[]
}

export interface UserCustomerRes {
    GCID: string,
    LoginId: number,
    CustmId: string,
    GCName: string,
    Permission: string[]
}

export interface UserDetailRes {
    userStatus: string,
    userCreatedDate: string,
    cropName: string,        
	userId: number,           
	userFirstName: string,    
	userLastName: string,      
	changePassword: number,       
	verifyPhone: number,       
	verifyEmail: number,          
	userEmail: string,       
	userPhoneNumber: string,      
	menuPermission: string[],     
	userDetails: UserDetails[]
}

export interface UserDetails {
    gcId: string,
	permission: string[],
	customerDetails: CustomerDetails[]
}

export interface CustomerDetails {
    custmId: string,
	custaId: string,
	mySunteckLoginId: string,
	officeCode: string,
	customerName: string,
	creditLimit: string,
	avaliableCredit: number,
	agentName: string,
	agentEmail: string,
	agentPhoneNumber: string,
	ratingEngine: string
}

export interface permLevel {
    gcId: string,
    permission: string[]
}

export interface serviceValidation {
    ErrorId: string,
    message: string

}

export enum permissionIds {
    Admin = 1,
    CreateTL = 2,
    BookLTL = 3,
    QuoteLTL = 4,
    AllLoad = 5
}

export interface GCPermission {
    Gcid: string,
    GcidName: string,
    CustomerId: string,
    CustomerLoginId: string,
    PermissionId: string[],
    Remove?: boolean
}
