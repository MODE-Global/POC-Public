
export interface LoadRequest{
    customerId: number[],
    gcid: string[],
    officeCode: string[],
    loadId: string,
    shipDateStart: string,
    shipDateEnd: string,
    loadStatus: string,
    loadMethod: string,
    poNumber: string,
    customerblNumber: string,
    pickupNumber: string,
    deliveryNumber: string,
    sortOrder: string,
    sortColumn: string,
    otmsLoadRecords: string,
    btmsLoadRecords: string
}

export interface LoadDocsRequest{
    othertmsLoads: number[]
    btmsLoads: number[],
} 

export interface LatLong{
    lat: number,
    lng: number
}

export interface mapProps {
    markers: LatLong[],
    apiKey: string,
    origin: LatLong
    destination: LatLong,
}