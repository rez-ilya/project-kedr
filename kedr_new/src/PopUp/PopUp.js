import React from "react";
import style from "./popup.module.css";
import { IoCloseOutline } from "react-icons/io5";

class PopUp extends React.Component{

    render(){
        return(
            <div className={style.overlay} onClick={this.handleOverlayClick}>
                <div className={style.content}>
                    <header className={style.header}>
                        <IoCloseOutline className={style.close}
                        onClick={this.props.closePopUp}></IoCloseOutline>
                    </header>
                    <main><this.props.obj/></main>
                </div>
            </div>
        )
    }
    
    handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
          this.props.closePopUp();
        }
    }
    
}

export default PopUp;


