export interface BookRequest {
    AgentDetails: AgentDetails;
    referenceNumber: ReferenceNumber;
    shipperInfo: shipperInfo;
    consigneeInfo: consigneeInfo;
    BooktoQuote: boolean;
    LinearFt: string;
}

export interface AgentDetails {
    agentContact: string;
    agentEmailId: string;
    agentPhone: string;
    custmId: string;
    custaId: string;
}

export interface shipperInfo {
    name: string;
    addressline1: string;
    addressline2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    contactName: string;
    EmailAddress: string;
    PhoneNumber: string;
    FaxNumber: string;
    loadNotes: string;
    earliestDate: string;
    earliestTime: string;
    latestDate: string;
    latestTime: string;
    shipper: string;
}

export interface consigneeInfo {
    consignee: string;
    name: string;
    addressline1: string;
    addressline2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    contactName: string;
    EmailAddress: string;
    PhoneNumber: string;
    FaxNumber: string;
    loadNotes: string;
    earliestDate: string;
    earliestTime: string;
    latestDate: string;
    latestTime: string;
}

export interface ReferenceNumber {
    customer: string;
    poNumber: string;
    blNumber: string;
    shippingNumber: string;
}
