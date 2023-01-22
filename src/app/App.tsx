import { useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { UsersContext } from "./Context";

function App() {
  /* This is a hook that is used to clear the local storage when the user closes the browser. */
  // useEffect(() => {

  //   if (window.location.pathname !== "/ForgotPassword" && window.location.pathname !== "/login") {
  //     // console.log(" inside removal in app.tsx")
  //     const unloadCallback = (event: { preventDefault: () => void; returnValue: string; }) => {
  //       event.preventDefault();
  //       event.returnValue = "";
  //       let signInEncryptedDetail = window.localStorage.getItem("SED")
  //       if (signInEncryptedDetail == null || signInEncryptedDetail == undefined) {
  //         window.localStorage.removeItem("UCS");
  //       }
  //       return "";
  //     };
  //     window.addEventListener("beforeunload", unloadCallback);
  //     return () => window.removeEventListener("beforeunload", unloadCallback);
  //   }
  // }, []);

  useMemo(() => {
    let signInEncryptedDetail = window.localStorage.getItem("SED")
    if (signInEncryptedDetail == null || signInEncryptedDetail == undefined) {
      if (!window.sessionStorage.getItem("session")) {
        window.localStorage.removeItem("UCS");
      }
    }
  }, [])
  
  return (
    <BrowserRouter>
      <UsersContext />
    </BrowserRouter>
  );
}

export default App;
