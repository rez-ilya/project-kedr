import Header1 from "./components/Header/Header1"
import Header2 from "./components/Header/Header2";
import Footer from "./components/footer/footer"
import React from "react";
import style from "./css/main.module.css"
import { useState } from "react";
import PopUp from "./components/PopUp/PopUp";
import BasicInfo from "./components/BasicInfo";
import LogForm from "./components/Forms/LogForm";
import RegForm from "./components/Forms/RegForm";
import unDeathForm from "./components/Forms/unDeathForm";
import HelpInfo from "./components/HelpIfo";
import MapCedars from './components/MapCedrs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterKedrPage from './pages/RegisterKedrPage';

function HomePage() {
  const [ShowPopUpAuth, setShowPopUpAuth] = useState(false);
  const [ShowPopUpImmortal, setShowPopUpImmortal] = useState(false);
  const [ShowPopUpHelp, setShowPopUpHelp] = useState(false);
  const [authForm, setAuthForm] = useState("login");
  const [ShowSendRequest, setShowSendRequest] = useState(false);

  const getFormComponent = () => {
    return authForm === "login"
      ? <LogForm switchToRegister={() => setAuthForm("register")} />
      : <RegForm switchToLogin={() => setAuthForm("login")}/>
  };

  const handleCloseAuthPopUp = () => {
    setShowPopUpAuth(false);
    setAuthForm("login");
  };

  return (
    <div>
      <div className={style.main}>
        <Header1 
          openPopUpImmortal={() => setShowPopUpImmortal(true)}
          openPopUpLog={() => setShowPopUpAuth(true)}
        />
        {ShowPopUpAuth && <PopUp 
          obj={getFormComponent}
          closePopUp={handleCloseAuthPopUp}
          contentClass="LogPopUp"
        />}
        {ShowPopUpImmortal && <PopUp
          obj={unDeathForm}
          closePopUp={() => setShowPopUpImmortal(false)}
          contentClass="UnDeathPopUp"
        />}
        <BasicInfo />
        <button type="submit" className={style.helpcircle} onClick={() => setShowPopUpHelp(true)}>?</button>
        {ShowPopUpHelp && <PopUp
          obj={HelpInfo}
          closePopUp={() => setShowPopUpHelp(false)}
          contentClass="helpPopUp"
          object="HelpText"
        />}
      </div>
      <div className={style.main}>
        <Header2 />
        <div className={style.cont_map}>
          <p className={style.title_map}>Карта зарегистрированных кедров</p>
          <div className={style.block_map}><MapCedars /></div>
        </div>
      </div>
      <div className={style.main}>
        <Footer />
      </div>
      {ShowSendRequest && <PopUp
        closeSendRequest={() => setShowSendRequest(false)}
      />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-kedr" element={<RegisterKedrPage />} />
      </Routes>
    </Router>
  );
}

export default App;
