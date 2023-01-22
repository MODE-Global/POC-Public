import axios from 'axios';
import qs from 'qs';
let controller = new AbortController();


export async function client(
  endpoint: String,
  { requestType, body, ...customConfig }: any = {},
) {
  const headers: any = {
    'Content-Type': process.env.REACT_APP_HEADER_CONTENT_TYPE
  };

  let expiredTime: any;
  if (localStorage.getItem('expireTime') != null) {
    expiredTime = localStorage.getItem('expireTime')
  }
  var CurrentTime = new Date();
  var currentexpireTime = new Date(expiredTime);
  if (CurrentTime < currentexpireTime) {
    headers.Authorization = `Bearer ${localStorage.getItem('ac')}`
  }
  else {
    const jwtToken = await getAccessToken();
    headers.Authorization = `Bearer ${jwtToken}`
  }

  const requestConfig: any = {
    method: requestType,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  };
  if (body) {
    requestConfig.data = JSON.stringify(body);
  }
  const url = process.env.REACT_APP_BASE_URL + `/${endpoint}`;

  console.log("logs", url)
  const apiResponse = await axios(url, requestConfig).catch((error: any) => {
    if (error.response.status != 200) {
      return error.response
    }
  });
  return apiResponse;
}

export async function userSummaryClient(
  endpoint: String,
  userID: string,
  { requestType, body, ...customConfig }: any = {},

) {
  const headers: any = {
    'Content-Type': 'application/json; charset=UTF-8',
    'UserId': userID
  };
  const jwtToken = await getAccessToken();

  if (jwtToken != null) {
    headers.Authorization = `Bearer ${jwtToken}`;

    const requestConfig: any = {
      method: requestType,

      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers
      }
    };

    if (body) {
      requestConfig.data = JSON.stringify(body);
    }
    const url = process.env.REACT_APP_BASE_URL + `/${endpoint}`;

    const apiResponse = await axios(url, requestConfig).catch((error: any) => {
      if (error.response.status != 200) {
        return error.response
      }
    });
    console.log('apiResponse', apiResponse);
    return apiResponse;
  }
}

export const CancelApi = () => {
  controller.abort();
}

export async function Quoteclient(
  endpoint: String,
  { requestType, body, ...customConfig }: any = {},
) {
  const headers: any = {
    'Content-Type': process.env.REACT_APP_HEADER_CONTENT_TYPE
  };

  let expiredTime: any;
  if (localStorage.getItem('expireTime') != null) {
    expiredTime = localStorage.getItem('expireTime')
  }
  var CurrentTime = new Date();
  var currentexpireTime = new Date(expiredTime);
  if (CurrentTime < currentexpireTime) {
    headers.Authorization = `Bearer ${localStorage.getItem('ac')}`
  }
  else {
    const jwtToken = await getAccessToken();
    headers.Authorization = `Bearer ${jwtToken}`
  }

  const requestConfig: any = {
    method: requestType,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    },
    signal: controller.signal
  };
  if (body) {
    requestConfig.data = JSON.stringify(body);
  }
  const url = process.env.REACT_APP_BASE_URL + `/${endpoint}`;
  console.log("logs", url)
  const apiResponse = await axios(url, requestConfig).catch((error: any) => {
    controller = new AbortController();
    if (error.code != "ERR_CANCELED") {
      if (error.response.status != 200) {
        return error.response
      }
    }
  });

  return apiResponse;
}

async function getAccessToken() {
  const headers: any = {
    'Content-Type': process.env.REACT_APP_HEADER_CONTENT_TYPE
  }
  let data = qs.stringify({
    'grant_type': process.env.REACT_APP_ACCESS_TOKEN_GRANT_TYPE,
    'client_id': process.env.REACT_APP_ACCESS_TOKEN_CLIENT_ID,
    'client_secret': process.env.REACT_APP_ACCESS_TOKEN_CLIENT_SECRET
  });

  console.log("loggg", headers)
  const requestConfig: any = {
    method: 'POST',
    headers: {
      headers
    },
    data: data
  };
  const url: any = process.env.REACT_APP_ACCESS_TOKEN_URL;

  console.log("loggg", url)
  const apiResponse = await axios(url == undefined ? '' : url, requestConfig).catch((error: any) => {
    return null;
  });

  if (apiResponse != null) {
    var currentDate = new Date();
    var dateToMilliseconds = currentDate.getTime();
    var addedMinutes = dateToMilliseconds + (1000 * apiResponse.data.expires_in);
    var newDate = new Date(addedMinutes);
    window.localStorage.setItem("expireTime", (newDate).toISOString())
    window.localStorage.setItem("ac", (apiResponse.data.access_token).toString())
    return apiResponse.data.access_token;
  }
}