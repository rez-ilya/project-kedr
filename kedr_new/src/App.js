import Header1 from "./Header/Header1"
import Header2 from "./Header/Header2";
import Footer from "./footer/footer"
import React from "react";
import style from "./css/main.module.css"
import { useState } from "react";
import PopUp from "./PopUp/PopUp";
import BasicInfo from "./BasicInfo";
import LogForm from "./Forms/LogForm";
import RegForm from "./Forms/RegForm";
import unDeathForm from "./Forms/unDeathForm";
import HelpInfo from "./HelpIfo";
import Map from "./Map";
import RegKedr from "./RegKedr";

function App() {

  const [ShowPopUpAuth, setShowPopUpAuth] = useState(false);
  const [ShowPopUpImmortal, setShowPopUpImmortal] = useState(false);
  const [ShowPopUpHelp, setShowPopUpHelp] = useState(false);
  const [authForm, setAuthForm] = useState ("login");
  const [ShowRegKedr, setShowRegKedr] = useState(false);
  const [ShowSendRequest, setShowSendRequest] = useState(false);

  const getFormComponent = () => {
    return authForm === "login"
      ? <LogForm switchToRegister={() => setAuthForm("register")} />
      : <RegForm switchToLogin={() => setAuthForm("login")}/>
  };

  return (
    <div>
      <div className={style.main}>
        <Header1 openPopUpImmortal={() => setShowPopUpImmortal(true)}
        openPopUpLog={() => setShowPopUpAuth(true)}/>
        {ShowPopUpAuth && <PopUp 
        obj={getFormComponent}
        closePopUp={() => setShowPopUpAuth(false)}/>}
        {ShowPopUpImmortal && <PopUp
        obj={unDeathForm}
        closePopUp={() => setShowPopUpImmortal(false)}/>}
        {ShowRegKedr && <RegKedr closeRegKedr={() => setShowRegKedr(false)}/>}
        <BasicInfo openRegKedr={() => setShowRegKedr(true)}/>
        <footer>
          <button type="submit" className={style.helpcircle} onClick={() => setShowPopUpHelp(true)}/>
          {ShowPopUpHelp && <PopUp
          obj={HelpInfo}
          closePopUp={() => setShowPopUpHelp(false)}/>}
        </footer>
      </div>
      <div className={style.main}>
      <Header2></Header2>
      <Map className={style.map}></Map>
      </div>
      <div className={style.main}>
      <Footer ></Footer>
      </div>
      {ShowSendRequest && <PopUp
      closeSendRequest={() => setShowSendRequest(false)}></PopUp>}
    </div>
  );
}

export default App;
