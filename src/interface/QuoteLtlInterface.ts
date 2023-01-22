export interface QuoteRequest {
  shipInfo: ShipInfo
  commodities: Commodite[]
  linearFt: string
  accessorials: any[]
  pickLimited: string
  CurrentQuoteId:number
  deliveryLimited: string
  quoteId: string
  customerData:customerData
  totalWeight: number
  totalQuantity: number
}

export interface customerData {
  custmId: string,
  custaId: string,
  ratingEngine: string
}

export interface ShipInfo {
  pickCity: string
  pickState: string
  pickZipCode: string
  deliveryCity: string
  deliveryState: string
  deliveryZipCode: string
  customer: string
  payType: string
}

export interface Commodite {
  id: string
  description: string
  nmfc: string
  class: string
  stack: boolean
  haz: boolean
  dimenLength: number
  dimenWidth: number
  dimenHeight: number
  weight: number
  quantity: number
  type: string
  cube: number
  pcf: number
  reviewAcc:boolean
  commoditiesAcc:boolean
  dIcon:boolean
}

export interface QuoteLtlResponse {
  quoteLtlResponse: QuoteLtlRes
}

export interface QuoteLtlRes {
  quoteDetails: QuoteDetail[]
}

export interface QuoteDetail {
  loadId: number
  quoteId: number
  quoteNumber: string
  quoteNotes: string
  carrierName: string
  carrierNameBanyan: string
  carrierNotes: string
  tariffName: string
  scac: string
  service: string
  transitTime: number
  flatPrice: string
  fuelSurchargePrice: string
  discount: string
  otherCharges: any
  accessorialsPrice: AccessorialsPrice[]
  totalPrice: string
}

export interface AccessorialsPrice {
  name: string
  code: string
  price: string
}

export interface States {
  States: StateDetail[]
}

export interface StateDetail {
  StateId: number
  Abbreviation: string
  StateProvinceName: string
}

export interface StatesMainResp {
  data: States
  status: number
  statusText: string
}