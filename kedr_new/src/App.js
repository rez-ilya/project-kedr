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
// import Map from "./Map";
import RegKedr from "./RegKedr";
import MapCedars from './MapCedrs';

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
        closePopUp={() => setShowPopUpImmortal(false)}
        contentClass="UnDeathPopUp"/>}
        <BasicInfo openRegKedr={() => setShowRegKedr(true)}/>
        <button type="submit" className={style.helpcircle} onClick={() => setShowPopUpHelp(true)}>?</button>
        {ShowPopUpHelp && <PopUp
        obj={HelpInfo}
        closePopUp={() => setShowPopUpHelp(false)}
        contentClass="helpPopUp"
        object="HelpText"/>}
      </div>
      {ShowRegKedr && <RegKedr closeRegKedr={() => setShowRegKedr(false)}/>}
      <div className={style.main}>
      <Header2></Header2>
      <div className={style.cont_map}>
        <p className={style.title_map}>Карта зарегистрированных кедров</p>
        <div className={style.block_map}><MapCedars></MapCedars></div>
      </div>
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
