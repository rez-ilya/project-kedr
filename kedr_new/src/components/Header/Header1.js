import React from "react"
import style from "./Header1.module.css"
import { FiMenu } from "react-icons/fi";

class Header1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            showLogoutPopup: false,
        };
        this.userContainerRef = React.createRef();
    }

    componentDidMount() {
        // Проверяем, авторизован ли пользователь
        const token = localStorage.getItem("token");
        if (token) {
            // Загружаем данные пользователя
            this.fetchUserInfo();
        }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/djoser-auth/users/me/", {
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                this.setState({ userInfo: data });
            } else {
                // Если токен недействителен, удаляем его
                localStorage.removeItem("token");
                this.setState({ userInfo: null });
            }
        } catch (error) {
            console.error("Ошибка загрузки данных пользователя:", error);
            localStorage.removeItem("token");
            this.setState({ userInfo: null });
        }
    };

    handleLogout = () => {
        localStorage.removeItem("token");
        this.setState({ userInfo: null, showLogoutPopup: false });
        window.location.reload();
    };

    toggleLogoutPopup = () => {
        this.setState(prevState => ({
            showLogoutPopup: !prevState.showLogoutPopup
        }));
    };

    handleClickOutside = (event) => {
        if (
            this.userContainerRef.current &&
            !this.userContainerRef.current.contains(event.target)
        ) {
            this.setState({ showLogoutPopup: false });
        }
    };

    render() {
        const { userInfo, showLogoutPopup } = this.state;

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
                    Войти через портал "Бессмертный полк"
                </button>
                {userInfo ? (
                    <div className={style.userContainer} ref={this.userContainerRef}>
                    <button 
                        className={style.userInfo}
                        onClick={this.toggleLogoutPopup}
                    >
                        <span>
                             {userInfo.last_name} {userInfo.first_name} {userInfo.surname}
                        </span>
                    </button>
                    {showLogoutPopup && (
                        <div className={style.logoutPopup}>
                            <button 
                                className={style.logoutButton}
                                onClick={this.handleLogout}>
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
                ) : (
                    <button type="button"
                    className={style.button} 
                    onClick={this.props.openPopUpLog}>
                        Вход/Регистрация
                    </button>
                )}
                <FiMenu className={style.burger_button}
                onClick={this.props.toggleMenu}/>
                </div>
            </div>
        )
    }
}

export default Header1;