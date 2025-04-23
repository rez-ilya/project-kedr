import React from "react"
import style from "./Header1.module.css"
import { FiMenu } from "react-icons/fi";

class Header1 extends React.Component {
    render() {
        return(
            <div className={style.header}>
                <div>
                <button type="button"
                className={style.button}>
                    почта@pochta.ru
                </button>
                <button type="button" 
                className={style.button}
                onClick={this.props.openPopUpImmortal}>
                    Войти через портал “Бессмертный полк”
                </button>
                <button type="button"
                className={style.button} 
                onClick={this.props.openPopUpLog}>
                    Вход/Регистрация
                </button>
                <FiMenu className={style.burger_button}
                onClick={this.props.toggleMenu}/>
                </div>
            </div>
        )
    }
}

export default Header1;