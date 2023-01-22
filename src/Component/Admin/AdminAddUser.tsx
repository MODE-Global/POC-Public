//First Import the react and hooks package 
//from the react useState , useEffect.
import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router';
import { CreateNewUser, GetCustomerPermission, GetUserCustomer, GetUserDetails } from '../../api/api';
import Multiselect from 'multiselect-react-dropdown';
import { EditUser } from '../../api/api';
import { CustomerDetailMainResponse, GCPermission, Options, permLevel, UserCreateFields, UserDetails, UserInfo, permissionIds, CustomerPermissionMainResponse, PermissionReq, CustomerPermission, serviceValidation, UserCustomerMainResponse } from '../../interface/UserInfoInterface';

export default function AdminUserForm() {
  let dataObj: UserCreateFields = { FirstName: "", LastName: "", EmailId: "", PhoneNumber: "", CustomerDetails: [] };
  let loggedInUserId = Number(window.localStorage.getItem("userId"));
  console.log("loggedInUserId :", loggedInUserId)

  let { pMode } = useParams();
  const qsParams = new URLSearchParams(window.location.search)//useParams();
  let uId = qsParams.get("uId");
  let editViewUserId = Number(uId == null || uId == undefined ? 0 : uId);

  let dropDownCustomerArr: UserDetails[] = [];
  let dropDownCustomerOptionsArr: Options[] = [];

  let validUserFields = {
    firstNameNotProvided: false, lastNameNotProvided: false, emailNotProvided: false, 
    emailInvalid: false, phoneInvalid: false, customerDetailNotProvided: false, permissionLevelNotMet: false, 
    quotePermissionLevelNotMet: false, phoneExist: false, emailExist: false, 
  };

  let modulePermissionList = { CreateTL: false, QuoteLTL: false, BookLTL: false, Admin: false };

  const [userInfo, setuserInfo] = useState(dataObj);
  const [originalInfo, setOriginalInfo] = useState(dataObj);
  const [arrDropDownCustomer, setarrDropDownCustomer] = useState(dropDownCustomerArr);
  const [arrDropDownCustomerOpt, setarrDropDownCustomerOpt] = useState(dropDownCustomerOptionsArr);
  const [selectedCustomerDDOpt, setSelectedCustomerDDOpt] = useState<any[]>([]);
  const [validationObj, setvalidationObj] = useState(validUserFields);
  const [serviceValidation, setServiceValidation] = useState<serviceValidation[]>([]);
  const [submitSuccess, setsubmitSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [modulePermissionListChk, setmodulePermissionListChk] = useState(modulePermissionList);
  const [logUserPermLevel, setLogUserPermLevel] = useState<permLevel[]>([]);
  const [loader, setLoader] = useState(false);
  const [pageMode, setPageMode] = useState(pMode);
  console.log("pageMode :", pageMode)
  const [permissionAdd, setPermissionAdd] = useState<CustomerPermission[]>([]);
  const [permissionRemove, setPermissionRemove] = useState<CustomerPermission[]>([]);
  const [permissionModified, setPermissionModified] = useState(false);



  let navigate = useNavigate();

  useEffect(() => {

    //PH_HF_03
    //Inside the useEffect method call the the pageload method that 
    //need to tr during the initial call of the pageload method
    LoadDataEditView()
    LoadDataCustomer()


  }, [])




  const LoadDataCustomer = async () => {
    setLoader(true);
    let userCustomerResp: UserCustomerMainResponse = await GetUserCustomer(loggedInUserId);
    console.log(userCustomerResp, "intial userCustomer details neccesary to load")
    let userDetailResponseData: CustomerDetailMainResponse = await GetUserDetails(loggedInUserId);
    console.log(userDetailResponseData, "intial userDetail details neccesary to load")
    if (userDetailResponseData.status == 200) {
      setarrDropDownCustomer(userDetailResponseData.data.userDetails);
    }
    if (userCustomerResp.status == 200) {
      let customerDDOptions = [];
      let permLevel = [];
      for (let i = 0; i < userCustomerResp.data.length; i++) {
        let userDetailforUser = userDetailResponseData.data.userDetails.find(x => x.gcId == userCustomerResp.data[i].GCID);
        let option = {
          id: userCustomerResp.data[i].GCID,
          name: userCustomerResp.data[i].GCName + '-' + String(userCustomerResp.data[i].LoginId)
        }
        console.log(userCustomerResp, option, "single option for customer dd");
        customerDDOptions.push(option);
        if (userDetailforUser != undefined) {
          let perm = {
            gcId: userCustomerResp.data[i].GCID,
            permission: userDetailforUser.permission
          }
          permLevel.push(perm);
        }
      }
      console.log(customerDDOptions, permLevel, "options for customer dd");
      setarrDropDownCustomerOpt(customerDDOptions);
      setLogUserPermLevel(permLevel);
    }
    setLoader(false);
  }
  const LoadDataEditView = async () => {
    setLoader(true);
    if (pageMode == 'edit') {
      await PrefillFields(editViewUserId);
    }
    else if (pageMode == 'view') {
      await PrefillFields(editViewUserId);
    }
    setLoader(false);
  }
  //PH_HF_10
  //Create a functional component .
  //And map the array to bind the method and create the functional component. 
  //We can replace by  the Placeholder
  const PrefillFields = async (UserID: number) => {
    let responsedata: CustomerDetailMainResponse = await GetUserDetails(UserID);
    if (responsedata.status == 200) {
      let userDataObj: UserCreateFields = {
        FirstName: responsedata.data.userFirstName,
        LastName: responsedata.data.userLastName,
        EmailId: responsedata.data.userEmail,
        PhoneNumber: responsedata.data.userPhoneNumber,
        userStatus: responsedata.data.userStatus,
        userCreatedDate: responsedata.data.userCreatedDate,
        CustomerDetails: responsedata.data.userDetails
      }

      let customerSelectedOpt: Options[] = [];
      let gcidArr = [];
      for (let i = 0; i < userDataObj.CustomerDetails.length; i++) {
        let option: Options = {
          name: userDataObj.CustomerDetails[i].customerDetails[0].customerName + '-' + userDataObj.CustomerDetails[i].customerDetails[0].mySunteckLoginId,
          id: userDataObj.CustomerDetails[i].gcId
        }
        gcidArr.push(userDataObj.CustomerDetails[i].gcId);
        customerSelectedOpt.push(option);
      }
      let permReq: PermissionReq = {
        Gcid: gcidArr,
        UserId: String(UserID)
      }
      let userpermission: CustomerPermissionMainResponse = await GetCustomerPermission(permReq);
      if (userpermission.status == 200) {
        for (let i = 0; i < userpermission.data.length; i++) {
          let permissionRecordIndex = userDataObj.CustomerDetails.findIndex(x => x.gcId == userpermission.data[i].Gcid)
          if (permissionRecordIndex != -1) {
            userDataObj.CustomerDetails[permissionRecordIndex].permission = userpermission.data[i].Permission;
          }
        }
      }
      setuserInfo(userDataObj);
      setOriginalInfo(JSON.parse(JSON.stringify(userDataObj)));
      //setOriginalInfo(originaluserDataObj);
      setSelectedCustomerDDOpt(customerSelectedOpt);
    }


  }

  const userInfoOnchange = (e: any) => {
    let numberOnlyRegex = new RegExp(/^[0-9]*$/);
    if (e.target.name == 'PhoneNumber') {
      if (numberOnlyRegex.test(e.target.value)) {
        setuserInfo({ ...userInfo, [e.target.name]: e.target.value });
      }
    }
    else {
      setuserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }

  }

  const customerDDOnSelect = (selectedList: Options[], selectedItem: Options) => {
    debugger;
    let existingCustomerDetailVal: UserDetails[] = userInfo.CustomerDetails;
    let selectedCustomerDetail: UserDetails = { gcId: '', permission: ['All Loads'], customerDetails: [] };
    for (let i = 0; i < arrDropDownCustomer.length; i++) {
      if (arrDropDownCustomer[i].gcId == String(selectedItem.id)) {
        if (pageMode == 'new') {
          modifyPermission(true, 'All Loads', arrDropDownCustomer[i]);
        }
        else {
          let existingUserIndx = originalInfo.CustomerDetails.findIndex(x => x.gcId == String(selectedItem.id));
          if (existingUserIndx == -1) {
            modifyPermission(true, 'All Loads', arrDropDownCustomer[i]);
          }
          else {
            let permissionRemoveIndex = permissionRemove.findIndex(x => x.Gcid == arrDropDownCustomer[i].gcId);
            console.log(permissionRemoveIndex, 'permission remove index');
            if (permissionRemoveIndex != -1) {
              console.log(permissionRemove, 'permission remove index  not -1');
              let specificPermRemoveIndex = permissionRemove[permissionRemoveIndex].Permission.indexOf('All Loads');
              if (specificPermRemoveIndex != -1) {
                console.log(specificPermRemoveIndex, 'specificPermRemoveIndex not -1');
                permissionRemove[permissionRemoveIndex].Permission.splice(specificPermRemoveIndex, 1);
              }
            }
          }
        }
        selectedCustomerDetail.customerDetails = arrDropDownCustomer[i].customerDetails;
        selectedCustomerDetail.gcId = arrDropDownCustomer[i].gcId;
      }
    }
    existingCustomerDetailVal.push(selectedCustomerDetail);
    setuserInfo({ ...userInfo, CustomerDetails: existingCustomerDetailVal });
    setSelectedCustomerDDOpt(selectedList);
  }

  const customerDDOnRemove = (selectedList: Options[], selectedItem: Options) => {
    debugger;
    let existingCustomerDetailVal: UserDetails[] = userInfo.CustomerDetails;
    for (let i = 0; i < userInfo.CustomerDetails.length; i++) {
      if (pageMode != 'new') {
        modifyPermission(false, '', userInfo.CustomerDetails[i], true, userInfo.CustomerDetails[i].permission);
      }
      else {
        let permissionRemoveIndx = permissionRemove.findIndex(x => x.Gcid == userInfo.CustomerDetails[i].gcId);
        if (permissionRemoveIndx != -1) {
          permissionRemove.splice(permissionRemoveIndx, 1);
        }
      }
      let permissionAddIndx = permissionAdd.findIndex(x => x.Gcid == userInfo.CustomerDetails[i].gcId);
      if (permissionAddIndx != -1) {
        permissionAdd.splice(permissionAddIndx, 1);
      }

      if (userInfo.CustomerDetails[i].gcId == String(selectedItem.id)) {
        let customerDetailIndex = existingCustomerDetailVal.indexOf(userInfo.CustomerDetails[i]);
        existingCustomerDetailVal.splice(customerDetailIndex);
      }
    }
    setuserInfo({ ...userInfo, CustomerDetails: existingCustomerDetailVal });
    setSelectedCustomerDDOpt(selectedList);


  }

  const permissonChkOnChange = (e: any) => {
    let sunTeckLoginSelected = e.target.name.split('-');
    let customerDetailChosen = userInfo.CustomerDetails.find(x => x.customerDetails[0].mySunteckLoginId == sunTeckLoginSelected[0]);
    let customerDetailChosenIndex = userInfo.CustomerDetails.findIndex(x => x.customerDetails[0].mySunteckLoginId == sunTeckLoginSelected[0]);
    if (customerDetailChosen != undefined) {
      switch (e.target.name) {
        case (sunTeckLoginSelected[0] + '-CreateTL'):
          if (e.target.checked == 1) {
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.push('Create TL');
            setPermissionModified(!permissionModified);
            modifyPermission(true, 'Create TL', customerDetailChosen);
            // 
            // let permissionAddedIndex = permissionAdd.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
            // if (permissionAddedIndex != undefined) {
            //   permissionAdd[permissionAddedIndex].Permission.push('Create TL');
            // }
            // else {
            //   let permisonNeedToAdd: CustomerPermission = {
            //     Gcid: customerDetailChosen.gcId,
            //     Permission: ['Create TL']
            //   }
            //   permissionAdd.push(permisonNeedToAdd);
            // }
            // let permissionRemoveIndex = permissionRemove.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
            // if (permissionRemoveIndex != undefined) {
            //   let specificPermRemoveIndex = permissionRemove[permissionRemoveIndex].Permission.indexOf('Create TL');
            //   if (specificPermRemoveIndex != -1)
            //     permissionRemove[permissionRemoveIndex].Permission.splice(specificPermRemoveIndex, 1);
            // }

            // setmodulePermissionListChk({ ...modulePermissionListChk, CreateTL: true });
          }
          else {
            let spliceIndex = userInfo.CustomerDetails[customerDetailChosenIndex].permission.indexOf('Create TL');
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.splice(spliceIndex, 1);
            setPermissionModified(!permissionModified);
            modifyPermission(false, 'Create TL', customerDetailChosen);
            // let moduleIndex = customerDetailChosen?.permission.indexOf('Create TL');
            // if (moduleIndex != -1) {
            //   ;
            //   customerDetailChosen?.permission.splice(moduleIndex);
            //   setmodulePermissionListChk({ ...modulePermissionListChk, CreateTL: false });
            // }
          }
          break;

        case (sunTeckLoginSelected[0] + '-QuoteLTL'):
          if (e.target.checked == 1) {
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.push('Quote LTL');
            setPermissionModified(!permissionModified);
            modifyPermission(true, 'Quote LTL', customerDetailChosen);
          }
          else {
            let spliceIndex = userInfo.CustomerDetails[customerDetailChosenIndex].permission.indexOf('Quote LTL');
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.splice(spliceIndex, 1);
            setPermissionModified(!permissionModified);
            modifyPermission(false, 'Quote LTL', customerDetailChosen);
          }
          break;

        case (sunTeckLoginSelected[0] + '-BookLTL'):
          if (e.target.checked == 1) {
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.push('Book LTL');
            setPermissionModified(!permissionModified);
            modifyPermission(true, 'Book LTL', customerDetailChosen);
          }
          else {
            let spliceIndex = userInfo.CustomerDetails[customerDetailChosenIndex].permission.indexOf('Book LTL');
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.splice(spliceIndex, 1);
            setPermissionModified(!permissionModified);
            modifyPermission(false, 'Book LTL', customerDetailChosen);
          }
          break;

        case (sunTeckLoginSelected[0] + '-Admin'):
          if (e.target.checked == 1) {
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.push('Admin');
            setPermissionModified(!permissionModified);
            modifyPermission(true, 'Admin', customerDetailChosen);
          }
          else {
            let spliceIndex = userInfo.CustomerDetails[customerDetailChosenIndex].permission.indexOf('Admin');
            userInfo.CustomerDetails[customerDetailChosenIndex].permission.splice(spliceIndex, 1);
            setPermissionModified(!permissionModified);
            modifyPermission(false, 'Admin', customerDetailChosen);
          }
          break;
      }
      console.log(modulePermissionListChk, 'See whats checked');
    }
  }

  const modifyPermission = (chk: boolean, module: string, customerDetailChosen: UserDetails | undefined, removeAll: boolean = false, moduleArr: string[] = []) => {

    if (chk) {
      console.log(customerDetailChosen?.permission, module, 'customerdetail chosen and module check');
      let permissionRemoveIndex = permissionRemove.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
      console.log(permissionRemoveIndex, 'permission remove index');
      if (permissionRemoveIndex != -1) {
        console.log(permissionRemove, 'permission remove index  not -1');
        let specificPermRemoveIndex = permissionRemove[permissionRemoveIndex].Permission.indexOf(module);
        if (specificPermRemoveIndex != -1) {
          console.log(specificPermRemoveIndex, 'specificPermRemoveIndex not -1');
          permissionRemove[permissionRemoveIndex].Permission.splice(specificPermRemoveIndex, 1);
        }
        else{
          let permissionAddedIndex = permissionAdd.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
          console.log(permissionAddedIndex, 'permission added index');
          if (permissionAddedIndex != -1) {
            console.log(permissionAdd, 'permissionaddedindex not -1');
            permissionAdd[permissionAddedIndex].Permission.push(module);
          }
          else {
            console.log('permissionaddedindex -1');
            let permisonNeedToAdd: CustomerPermission = {
              Gcid: String(customerDetailChosen?.gcId),
              Permission: [module]
            }
            permissionAdd.push(permisonNeedToAdd);
            console.log(permisonNeedToAdd, 'permission need to add');
          }
        }
      }
      else {
        let permissionAddedIndex = permissionAdd.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
        console.log(permissionAddedIndex, 'permission added index');
        if (permissionAddedIndex != -1) {
          console.log(permissionAdd, 'permissionaddedindex not -1');
          permissionAdd[permissionAddedIndex].Permission.push(module);
        }
        else {
          console.log('permissionaddedindex -1');
          let permisonNeedToAdd: CustomerPermission = {
            Gcid: String(customerDetailChosen?.gcId),
            Permission: [module]
          }
          permissionAdd.push(permisonNeedToAdd);
          console.log(permisonNeedToAdd, 'permission need to add');
        }
      }
      
    }
    else {
      //debugger;
      if (!removeAll) {
        let moduleIndex = customerDetailChosen?.permission.indexOf(module);
        if (moduleIndex != -1) {
          customerDetailChosen?.permission.splice(Number(moduleIndex), 1);
        }
        let permissionAddedIndex = permissionAdd.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
        if (permissionAddedIndex != -1) {
          let specificPermAddIndex = permissionAdd[permissionAddedIndex].Permission.indexOf(module);
          if (specificPermAddIndex != -1)
            permissionAdd[permissionAddedIndex].Permission.splice(specificPermAddIndex, 1);
        }
        else {
          let permissionRemoveIndex = permissionRemove.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
          if (permissionRemoveIndex != -1) {
            permissionRemove[permissionRemoveIndex].Permission.push(module);
          }
          else {
            let permisonNeedToRemove: CustomerPermission = {
              Gcid: String(customerDetailChosen?.gcId),
              Permission: [module]
            }
            permissionRemove.push(permisonNeedToRemove);
          }
        }
      }
      else {
        let permissionRmvArr: CustomerPermission[] = permissionRemove;
        let permissionRmvIndx = permissionRmvArr.findIndex(x => x.Gcid == customerDetailChosen?.gcId);
        if (permissionRmvIndx != -1) {
          permissionRmvArr[permissionRmvIndx].Permission = moduleArr;
        }
        else {
          permissionRmvArr.push({ Gcid: String(customerDetailChosen?.gcId), Permission: moduleArr })
        }
      }


    }
  }

  const statusRadioOnChange = (e: any) => {
    console.log(e.target.value, 'value of radio button')
    setuserInfo({ ...userInfo, userStatus: e.target.value });
  }

  const emailOnBlur = (e: any) => {
    let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!emailRegex.test(e.target.value) && e.target.value != "") {
      setvalidationObj({ ...validationObj, emailNotProvided: false, emailInvalid: true });
    }
    else {
      setvalidationObj({ ...validationObj, emailInvalid: false });
    }
  }

  // const phoneOnBlur = (e: any) => {
  //   let phoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
  //   if (!phoneRegex.test(e.target.value) && e.target.value != "") {
  //     setvalidationObj({ ...validationObj, phoneInvalid: true });
  //   }
  //   else{
  //     setvalidationObj({ ...validationObj, phoneInvalid: false });
  //   }
  // }

  // //PH_HF_05
  // //Build functions
  // const buildCustomer = () => {
  //   return arrDropDownCustomer.map((value, index) => {
  //     return (
  //       <option value={value.gcId}>{value.customerDetails[0].customerName + '-' + value.customerDetails[0].mySunteckLoginId}</option>
  //     )
  //   });

  // }

  const buildPermissionRow = () => {
    console.log(userInfo.CustomerDetails, logUserPermLevel, "customer details once selected");
    return userInfo.CustomerDetails.map((value, index) => {
      let logUserPermCheck = logUserPermLevel.find(x => x.gcId == value.gcId);
      return (
        <tr>
          <td>{value.customerDetails[0].customerName + '-' + value.customerDetails[0].mySunteckLoginId}</td>
          <td className="text-center">
            <input type="checkbox" name={value.gcId + '-AllLoads'} className="form-check-input cp-checkbox" checked disabled />
          </td>
          <td className="text-center">
            <input disabled={pageMode != "view" ? logUserPermCheck?.permission.indexOf('Create TL') == -1 ? true : false : true} type="checkbox" name={value.customerDetails[0].mySunteckLoginId + '-CreateTL'} checked={value.permission.indexOf('Create TL') != -1 ? true : false} onChange={permissonChkOnChange} className="form-check-input cp-checkbox" />
          </td>
          <td className="text-center">
            <input disabled={pageMode != "view" ? logUserPermCheck?.permission.indexOf('Quote LTL') == -1 ? true : false : true} type="checkbox" name={value.customerDetails[0].mySunteckLoginId + '-QuoteLTL'} checked={value.permission.indexOf('Quote LTL') != -1 ? true : false} onChange={permissonChkOnChange} className="form-check-input cp-checkbox" />
          </td>
          <td className="text-center">
            <input disabled={pageMode != "view" ? logUserPermCheck?.permission.indexOf('Book LTL') == -1 ? true : false : true} type="checkbox" name={value.customerDetails[0].mySunteckLoginId + '-BookLTL'} checked={value.permission.indexOf('Book LTL') != -1 ? true : false} onChange={permissonChkOnChange} className="form-check-input cp-checkbox" />
          </td>
          <td className="text-center">
            <input disabled={pageMode != "view" ? logUserPermCheck?.permission.indexOf('Admin') == -1 ? true : false : true} type="checkbox" name={value.customerDetails[0].mySunteckLoginId + '-Admin'} checked={value.permission.indexOf('Admin') != -1 ? true : false} onChange={permissonChkOnChange} className="form-check-input cp-checkbox" />
          </td>
        </tr>
      )
    });
  }




  const Validation = () => {
    //PH_HF_08
    //"Inside the HandleChange method add the validation according 
    //to the requirement we can replace this by a Placeholder
    let fieldValid = true;
    let firstNameReqErr = false;
    let lastNameReqErr = false;
    let emailReqErr = false;
    let customerDetailReqErr = false;
    let emailInvalidErr = false;
    let permissionErrLvl = false;
    let phoneInvalidErr = false;
    let quotePermissionErrLvl= false;
    console.log(userInfo, 'user info when validate function');

    if (userInfo.FirstName == "") {
      console.log(userInfo.FirstName, "went into first name");
      firstNameReqErr = true;
      fieldValid = false;
    }
    else {
      firstNameReqErr = false;
    }

    if (userInfo.LastName == "") {
      console.log(userInfo.LastName, "went into last name");
      lastNameReqErr = true;
      fieldValid = false;
    }
    else {
      lastNameReqErr = false
    }

    if (userInfo.EmailId == "") {
      console.log(userInfo.EmailId, "went into email id");
      emailReqErr = true;
      fieldValid = false;
    }
    else {
      emailReqErr = false;
    }

    console.log(userInfo.CustomerDetails.length, "customer details length");
    if (userInfo.CustomerDetails.length <= 0) {
      console.log(userInfo.CustomerDetails.length, "went into customer details");
      customerDetailReqErr = true;
      fieldValid = false;
    }
    else {
      customerDetailReqErr = false;
      emailInvalidErr = false;
    }

    let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!emailRegex.test(userInfo.EmailId) && userInfo.EmailId != "") {
      console.log(userInfo.EmailId, "went into email invalid details");
      emailInvalidErr = true;
      fieldValid = false;
    }
    else {
      emailInvalidErr = false;
    }
    if(userInfo.PhoneNumber != null){
      if (userInfo.PhoneNumber.length > 0 && userInfo.PhoneNumber.length != 10) {
        phoneInvalidErr = true;
        fieldValid = false;
      }
    }
    for (let i = 0; i < userInfo.CustomerDetails.length; i++) {
      if (userInfo.CustomerDetails[i].permission.includes('Admin')) {
        let logUserPermCheck = logUserPermLevel.find(x => x.gcId == userInfo.CustomerDetails[i].gcId);
        if (logUserPermCheck != undefined) {
          if (logUserPermCheck.permission.sort().join(',') != userInfo.CustomerDetails[i].permission.sort().join(',')) {
            permissionErrLvl = true;
            fieldValid = false;
          }
        }
      }
      if (userInfo.CustomerDetails[i].permission.includes('Quote LTL')) {
        if(!userInfo.CustomerDetails[i].permission.includes('Book LTL')){
          quotePermissionErrLvl = true;
            fieldValid = false;
        }
      }
      if (userInfo.CustomerDetails[i].permission.includes('Book LTL')) {
        if(!userInfo.CustomerDetails[i].permission.includes('Quote LTL')){
          quotePermissionErrLvl = true;
          fieldValid = false;
        }
      }
    }

    setvalidationObj({
      ...validationObj, firstNameNotProvided: firstNameReqErr,
      lastNameNotProvided: lastNameReqErr,
      emailNotProvided: emailReqErr,
      customerDetailNotProvided: customerDetailReqErr,
      emailInvalid: emailInvalidErr,
      phoneInvalid: phoneInvalidErr,
      permissionLevelNotMet: permissionErrLvl,
      quotePermissionLevelNotMet: quotePermissionErrLvl
    });

    return fieldValid;

  }

  const submitClick = async () => {
    //PH_HF_09
    //Check for the status Mode if the statusMode using  the if condition (Mode=Insert) and( Mode=Edit) 
    //In this  method, pass the all  the parameter obtained from user declaring a variable called insertdata and pass 
    //the data all the parameter and pass the insertdata we can replace by thePlaceholder
    //debugger;

    if (Validation()) {
      setLoader(true);
      console.log(originalInfo, permissionAdd, 'user info when submit function');
      if (userInfo.FirstName != "" && userInfo.LastName != "" && userInfo.EmailId != "" && userInfo.CustomerDetails.length > 0) {
        let GCPermissionArr: GCPermission[] = [];
        for (let i = 0; i < userInfo.CustomerDetails.length; i++) {
          let customerDetailSimpl = userInfo.CustomerDetails[i].customerDetails[0];
          let addedPermission = permissionAdd.find(x => x.Gcid == userInfo.CustomerDetails[i].gcId);
          console.log(addedPermission, 'permission added');
          let addPermissionIdArr: string[] = [];
          if (addedPermission != undefined) {
            for (let addPermissionIndex = 0; addPermissionIndex < addedPermission.Permission.length; addPermissionIndex++) {
              console.log(addedPermission.Permission[addPermissionIndex], "went into add permission for loop");
              switch (addedPermission.Permission[addPermissionIndex]) {
                case ('Admin'):
                  addPermissionIdArr.push(String(permissionIds.Admin));
                  break;
                case ('Create TL'):
                  addPermissionIdArr.push(String(permissionIds.CreateTL));
                  break;
                case ('Book LTL'):
                  addPermissionIdArr.push(String(permissionIds.BookLTL));
                  break;
                case ('Quote LTL'):
                  addPermissionIdArr.push(String(permissionIds.QuoteLTL));
                  break;
                case ('All Loads'):
                  addPermissionIdArr.push(String(permissionIds.AllLoad));
                  break;
                default:
                  break;
              }
            }
          }
          if (addPermissionIdArr.length > 0) {
            let addPermissionObj: GCPermission = {
              Gcid: userInfo.CustomerDetails[i].gcId,
              GcidName: customerDetailSimpl.customerName,
              CustomerId: customerDetailSimpl.custmId,
              CustomerLoginId: customerDetailSimpl.mySunteckLoginId,
              PermissionId: addPermissionIdArr,
              Remove: false
            }
            console.log(addPermissionObj, 'add permission obj push to gcpermission');
            GCPermissionArr.push(addPermissionObj);
          }
          let removePermission = permissionRemove.find(x => x.Gcid == userInfo.CustomerDetails[i].gcId);
          if (removePermission != undefined) {
            let removePermissionIdArr: string[] = [];
            for (let removePermissionIndex = 0; removePermissionIndex < removePermission.Permission.length; removePermissionIndex++) {
              console.log(removePermission.Permission[removePermissionIndex], "went into add permission for loop");
              switch (removePermission.Permission[removePermissionIndex]) {
                case ('Admin'):
                  removePermissionIdArr.push(String(permissionIds.Admin));
                  break;
                case ('Create TL'):
                  removePermissionIdArr.push(String(permissionIds.CreateTL));
                  break;
                case ('Book LTL'):
                  removePermissionIdArr.push(String(permissionIds.BookLTL));
                  break;
                case ('Quote LTL'):
                  removePermissionIdArr.push(String(permissionIds.QuoteLTL));
                  break;
                case ('All Loads'):
                  removePermissionIdArr.push(String(permissionIds.AllLoad));
                  break;
                default:
                  break;
              }
            }
            if(removePermissionIdArr.length > 0){
              let removePermissionObj: GCPermission = {
                Gcid: userInfo.CustomerDetails[i].gcId,
                GcidName: customerDetailSimpl.customerName,
                CustomerId: customerDetailSimpl.custmId,
                CustomerLoginId: customerDetailSimpl.mySunteckLoginId,
                PermissionId: removePermissionIdArr,
                Remove: true
              }
              console.log(removePermissionObj, 'remove permission obj push to gcpermission');
              GCPermissionArr.push(removePermissionObj);
            }
          }
        }
        let insertdata: UserInfo = {
          userId: String(loggedInUserId),
          FirstName: userInfo.FirstName,
          LastName: userInfo.LastName,
          EmailId: userInfo.EmailId,
          PhoneNumber: userInfo.PhoneNumber,
          GCPermission: GCPermissionArr.length > 0 ? GCPermissionArr : null,
        }
        console.log(insertdata, 'insertdata for submit or update');

        let responsedata = { data: { Message: '', ValidationError: [{ ErrorId: '', message: '' }] }, status: 0, statusText: '' };
        if (pageMode == "new") {
          console.log("went into creat new user condition");
          responsedata = await CreateNewUser(insertdata);
        }
        else if (pageMode == "edit") {
          insertdata.loginUserId = String(loggedInUserId);
          insertdata.userId = String(editViewUserId);
          insertdata.Status = Number(userInfo.userStatus);
          responsedata = await EditUser(insertdata)
        }
        console.log(responsedata, "submit or edit responsedata");

        if (responsedata.status == 200) {
          let clearInfoObj: UserCreateFields = { FirstName: "", LastName: "", EmailId: "", PhoneNumber: "", CustomerDetails: [] };
          if (pageMode == "new")
            setsubmitSuccess(true);
          else
            setUpdateSuccess(true)
          setuserInfo(clearInfoObj);
          setSelectedCustomerDDOpt([]);
        }
        else if (responsedata.status == 400) {
          if (responsedata.data.ValidationError.length > 0) {
            let existError = false;
            let phoneExistsError = false, emailExistsError = false;
            for (let validationIndex = 0; validationIndex < responsedata.data.ValidationError.length; validationIndex++) {
              switch (responsedata.data.ValidationError[validationIndex].ErrorId) {
                case ('AD013'):
                  emailExistsError = true;
                  existError = true;
                  break;
                case ('AD014'):
                  phoneExistsError = true;
                  existError = true;
                  break;
                default:
                  setServiceValidation(responsedata.data.ValidationError);
                  existError = false;
                  break;
              }
            }
            if (existError) {
              setvalidationObj({
                ...validationObj,
                emailExist: emailExistsError,
                phoneExist: phoneExistsError
              });
            }
          }
        }
        setLoader(false);
      }
    }
  }

  const bindSvcValidation = () => {
    return serviceValidation.map((value, index) => {
      return (
        <p className="form-label cp-form-label cp-form-mandatory">{value.message}</p>
      )
    });
  }


  return (
    //PH_HF_09
    //Render function has all the html code needed and the snippet to enable disable input fields

    <div className="mb-5">
      <div className="row">
        {/*issue: need to take bredcrumb and backarrow code from sai*/}
        <div className="col-md-12 my-3">
          <ul className="breadcrumb mb-0">
            <li><a onClick={() => { navigate('/loadsearch') }} className="cursor">All Loads</a></li>
            <li><a onClick={() => { navigate('/admin-user-summary') }} className="cursor">Admin</a></li>
            {pageMode == "new" ?
              <li className="pe-2">Add user</li>
              : <li className="pe-2">{userInfo.FirstName + ' ' + userInfo.LastName}</li>}
          </ul>
        </div>
        <div className="col-md-12">
          <div className="cp-background">
            <div className="admin-details-header-contents justify-content-between">
              <div className="mb-5 page-header-txt d-flex align-items-center"><img src="../Images/back-icon.svg" onClick={() => { navigate('/admin-user-summary') }} alt="back-icon" className="back-icon pointer" />
                {pageMode == "new" ?
                  <span className="ms-2">Add New User</span> :
                  <span className="ms-2">User ID - {editViewUserId}</span>}
              </div>
              {pageMode == "view" ?
                <button type="button" onClick={() => { setPageMode('edit'); }} className="btn cp-btn-primary ms-auto d-block mb-5" title="Edit Details">Edit Details</button>
                : null}
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <label className="form-label cp-form-label" htmlFor="admin-fname">First name<span className="cp-form-mandatory"> *</span></label>
                {pageMode != "view" ?
                  <input className="form-control cp-form-field" maxLength={50} type="text" id="admin-fname" placeholder="Enter First Name" name="FirstName" value={userInfo.FirstName} onChange={userInfoOnchange} />
                  : <p className="data-txt">{userInfo.FirstName}</p>}
                {validationObj.firstNameNotProvided ? <label className="form-label cp-form-label cp-form-mandatory">Please enter the first name</label> : null}
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <label className="form-label cp-form-label" htmlFor="admin-lname">Last name<span className="cp-form-mandatory"> *</span></label>
                {pageMode != "view" ?
                  <input className="form-control cp-form-field" maxLength={50} type="text" id="admin-lname" placeholder="Enter Last Name" name="LastName" disabled={pageMode == "view" ? true : false} value={userInfo.LastName} onChange={userInfoOnchange} />
                  : <p className="data-txt">{userInfo.LastName}</p>}
                {validationObj.lastNameNotProvided ? <label className="form-label cp-form-label cp-form-mandatory">Please enter the last name</label> : null}
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <label className="form-label cp-form-label" htmlFor="admin-email">Email<span className="cp-form-mandatory"> *</span></label>
                {pageMode != "view" ?
                  <input className="form-control cp-form-field" maxLength={30} type="email" id="admin-email" placeholder="Enter Email ID" name="EmailId" value={userInfo.EmailId} onBlur={emailOnBlur} onChange={userInfoOnchange} />
                  : <p className="data-txt">{userInfo.EmailId}</p>}
                {validationObj.emailNotProvided ? <label className="form-label cp-form-label cp-form-mandatory">Please enter the email address</label> : null}
                {validationObj.emailInvalid ? <label className="form-label cp-form-label cp-form-mandatory">Please enter a valid email address</label> : null}
                {validationObj.emailExist ? <label className="form-label cp-form-label cp-form-mandatory">An existing user has the same email address</label> : null}
              </div>
              <div className="col-md-6 col-lg-3 mb-3">
                <label className="form-label cp-form-label" htmlFor="admin-phone">Phone Number</label>
                {pageMode != "view" ?
                  <input className="form-control cp-form-field" type="text" id="admin-phone" placeholder="Enter Phone Number" name="PhoneNumber" disabled={pageMode == "view" ? true : false} value={userInfo.PhoneNumber} onChange={userInfoOnchange} />
                  : <p className="data-txt">{userInfo.PhoneNumber == "" || userInfo.PhoneNumber == null ? "-" : userInfo.PhoneNumber}</p>}
                {validationObj.phoneInvalid ? <label className="form-label cp-form-label cp-form-mandatory">Please enter a valid phone number</label> : null}
                {validationObj.phoneExist ? <label className="form-label cp-form-label cp-form-mandatory">An existing user has the same phone number</label> : null}
              </div>
              {pageMode != "view" ?
                <div className="col-md-6 col-lg-3 mb-3">
                  <label htmlFor="qutltl-customer" className="form-label cp-form-label">Customer
                    <span className="cp-form-mandatory">*</span>
                  </label>
                  <Multiselect
                    options={arrDropDownCustomerOpt}
                    displayValue="name"
                    style={{
                      chips: {
                        background: '#115E67'
                      }
                    }}
                    selectedValues={selectedCustomerDDOpt}
                    onSelect={customerDDOnSelect}
                    onRemove={customerDDOnRemove}
                    placeholder="Select a customer"
                  />
                  {validationObj.customerDetailNotProvided ? <label className="form-label cp-form-label cp-form-mandatory" htmlFor="admin-fname">Please select at least one customer</label> : null}
                </div>
                : null}
              {pageMode == "view" ?
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label cp-form-label mb-3 d-block">Status</label>
                  <p className="data-txt">{userInfo.userStatus == "1" ? "Active" : userInfo.userStatus == "2" ? "Inactive" : "Pending Verification"}</p>
                </div>
                : null}
              {pageMode == "edit" ?
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label cp-form-label mb-3 d-block">Status<span className="cp-form-mandatory"> *</span></label>
                  <input className="form-check-input cp-checkbox me-1" checked={userInfo.userStatus == '1' ? true : false} disabled={userInfo.userStatus == "3" ? true : false} onChange={statusRadioOnChange} value="1" type="radio" id="admin-active-status" name="Status" />
                  <label className="form-check-label cp-form-label" htmlFor="admin-active-status">Active</label>
                  <input className="ms-5 form-check-input cp-checkbox me-1" checked={userInfo.userStatus == '2' ? true : false} disabled={userInfo.userStatus == "3" ? true : false} onChange={statusRadioOnChange}  value="2" type="radio" id="admin-inactive-status" name="Status" />
                  <label className="form-check-label cp-form-label" htmlFor="admin-inactive-status">Inactive</label>
                </div>
                : null}
              {pageMode != "new" ?
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label cp-form-label mb-3 d-block">Created Date</label>
                  <p className="data-txt">{new Date(userInfo.userCreatedDate == undefined ? new Date().toString() : userInfo.userCreatedDate).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}</p>
                </div>
                : null}
              <h5 className="mt-5 mb-4">Permission Details</h5>
              {validationObj.permissionLevelNotMet ? <label className="form-label cp-form-label cp-form-mandatory" htmlFor="admin-fname">Please select all the permission of the customer to make the user an admin</label> : null}
              {validationObj.quotePermissionLevelNotMet ? <label className="form-label cp-form-label cp-form-mandatory" htmlFor="admin-fname">Plese select both Book and Quote permission if providing either one</label> : null}
              <div className="col-md-12">
                <div className="table-responsive px-0 cp-grid">
                  <table className="table mb-0  table-borderless">
                    <thead className="cp-table-head ">
                      <tr>
                        <th>Customer</th>
                        <th className="text-center">Load Search</th>
                        <th className="text-center">Create TL</th>
                        <th className="text-center">Quote LTL</th>
                        <th className="text-center">Book LTL</th>
                        <th className="text-center">Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userInfo.CustomerDetails.length > 0 ? buildPermissionRow() :
                        <tr>
                          <td colSpan={6}>
                            <div className="row justify-content-center">
                              <img src="../Images/add-edit-admin-norec.svg" alt="add-edit-admin-no records found" className="add-admin-norec" />
                              <p className="data-txt text-center">Please select the customers to provide permission</p>
                            </div>
                          </td>
                        </tr>}
                    </tbody>
                  </table>

                </div>
              </div>

            </div>

          </div>
          {pageMode != "view" ?
            <div className="mt-5 d-flex justify-content-end">
              {bindSvcValidation()}
              <button type="button" onClick={() => { navigate('/admin-user-summary') }} className="btn cp-btn-tertiary mb-4 me-3">Cancel</button>
              <button type="button" onClick={submitClick} className="btn cp-btn-primary" data-bs-toggle="modal" data-bs-target="#user-added-popup">{pageMode == "new" ? "Add New User" : "Update User"}</button>
            </div>
            : null}
        </div>
      </div>
      {submitSuccess ?
        <div style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, .5)' }} className="modal show" id="user-added-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}>
          <div className="modal-dialog sucess-popup-width">
            <div className="modal-content">
              <div className="modal-header pt-4 justify-content-center border-0">
                <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
              </div>
              <div className="modal-body py-0 text-center border-0">
                <h5 className="popup-header">E-mail Sent Successfully!</h5>
                <p className="popup-txt">A Temporary Password has been sent to the User’s Email ID</p>
              </div>
              <div className="modal-footer pb-4 justify-content-center border-0">
                <button type="button" onClick={() => { navigate('/admin-user-summary') }} className="btn cp-btn-primary" data-bs-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
        : null}
      {updateSuccess ?
        <div style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, .5)' }} className="modal show" id="details-updated-sucess-popup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog sucess-popup-width">
            <div className="modal-content">
              <div className="modal-header pt-4 justify-content-center border-0">
                <img src="../Images/success-icon.svg" alt="success-icon" className="success-icon" />
              </div>
              <div className="modal-body py-0 text-center border-0">
                <h5 className="popup-header">Update Success!</h5>
                <p className="popup-txt">Details has been updated successfully for User <a className="cp-link">{userInfo.FirstName + ' ' + userInfo.LastName}</a></p>
              </div>
              <div className="modal-footer pb-4 justify-content-center border-0">
                <button type="button" onClick={() => { navigate('/admin-user-summary') }} className="btn cp-btn-primary" data-bs-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
        : null}
      {loader ? <div className="overlay">
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border Loader text-dark align-center ms-2" role="status">
            <span className="visually-hidden" />
          </div>
          <p className="data-label">Loading...</p>
        </div>
      </div> : null}
    </div>

  );
}

