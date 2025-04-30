import React from "react";
import style from "../css/regkedr.module.css"
import MapCedars from "./MapCedrs"

class RegKedr extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          ShowFirstStep: true,
          selectedCoords: null,
          showModal: false,
          showSuccessModal: false,
          description: '',
          promo: '',
          file: null,
          title: '',
          userInfo: null,
          Error: '',
        };
      }

    render(){
        return(
        <div>
            {this.state.ShowFirstStep && <div className={style.main}>
                <header className={style.head_info}>
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <span className={style.user_info}>
                        {this.state.userInfo
                          ? `${this.state.userInfo.last_name} ${this.state.userInfo.first_name} ${this.state.userInfo.surname}`
                          : ""}
                    </span>
                </header>
                <nav className={style.navigation}>
                    <div className={style.step + " " + style.active}>1</div>
                    <div className={style.line}></div>
                    <div className={style.step}>2</div>
                </nav>
                <main className={style.map_con}>
                    <h2>Выберите место на карте</h2>
                    <div className={style.map}>
                        <MapCedars onMapClick={this.handleMapClick} />
                    </div>
                </main>
                {this.state.showModal && (
                    <div className={style.modal} onClick={this.handleOverlayClick}>
                        {/* Модальное окно подтверждения выбора места */}
                        <div className={style.modalContent}
                        onClick={e => e.stopPropagation()}> 
                            <p>Вы уверены, что хотите посадить кедр на этом месте?</p>
                            <div className={style.modalButtons}>
                                <button onClick={this.handleModalSave}>Да</button>
                                <button onClick={this.handleModalCancel}>Отмена</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>}
            {/* Вторая часть */}
            <div className={style.main}>
                <header className={style.head_info}>
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <span className={style.user_info}>
                        {this.state.userInfo
                          ? `${this.state.userInfo.last_name} ${this.state.userInfo.first_name} ${this.state.userInfo.surname}`
                          : ""}
                    </span>
                </header>
                <nav className={style.navigation}>
                    <div className={style.step}>1</div>
                    <div className={style.line}></div>
                    <div className={style.step + " " + style.active}>2</div>
                </nav>
                <form className={style.reg_kedr} onSubmit={this.handleSubmit}>
                    <label htmlFor="title">Название кедра</label>
                    <input type="text" id="title" value={this.state.title || ''} onChange={this.handleInputChange} required />
                    <label htmlFor="description">Добавить описание</label>
                    <textarea id="description" value={this.state.description || ''} onChange={this.handleInputChange} required />
                    <label htmlFor="add_img">Добавить фото</label>
                    <input type="file" id="add_img" onChange={this.handleInputChange} />
                    <label htmlFor="promo">Введите промокод</label>
                    <input id="promo" value={this.state.promo || ''} onChange={this.handleInputChange} />
                    {this.state.Error && <div className={style.error}>{this.state.Error}</div>}
                    <footer className={style.footer_reg}>
                        <button type="button" onClick={this.setShowFirstStep}>Назад</button>
                        <button type="submit">Отправить заявку</button>
                    </footer>
                </form>
            </div>

            {/* Модальное окно успешной отправки */}
            {this.state.showSuccessModal && (
                <div className={style.successModal} onClick={this.handleSuccessModalClose}>
                    <div className={style.successModalContent} onClick={e => e.stopPropagation()}>
                        <h2>Ваша заявка успешно отправлена!</h2>
                        <p>Мы обязательно свяжемся с Вами</p>
                        <button onClick={this.handleSuccessModalClose}>Ок</button>
                    </div>
                </div>
            )}
        </div>
        )
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
        this.fetchUserInfo();
    }

    componentWillUnmount() {
        document.body.style.overflow = '';
    }    

    setShowFirstStep = () => {
        if (this.state.ShowFirstStep) 
            this.setState({ ShowFirstStep: false })
        else 
            this.setState({ ShowFirstStep: true })
    }

    handleMapClick = (coords) => {
        this.setState({ selectedCoords: coords, showModal: true });
    };

    handleModalSave = () => {
        this.setState({ showModal: false });
        if (this.state.ShowFirstStep) 
            this.setState({ ShowFirstStep: false })
        else 
            this.setState({ ShowFirstStep: true })
    };

    handleModalCancel = () => {
        this.setState({ showModal: false, selectedCoords: null });
    };

    handleOverlayClick = () => {
        this.setState({ showModal: false})
    }

    handleInputChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "add_img") {
            this.setState({ file: files[0] });
        } else {
            this.setState({ [id]: value });
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const { selectedCoords, title, description, file, promo } = this.state;
        if (!selectedCoords || !title || !description || !promo) { //пока добавим промокд в обязательные поля, далее будет необязательным
            this.setState({ Error:"Пожалуйста, заполните все обязательные поля."});
            return;
        }

        if (promo) {
            try {
                const token = localStorage.getItem("token");
                const promoResponse = await fetch(`http://localhost:8000/api/v1/promocodes/check/${promo}/`, {
                    method: "GET",
                    headers: token
                        ? { "Authorization": `Token ${token}` }
                        : {},
                });

                if (!promoResponse.ok) {
                    this.setState({ Error: "Такого промокода не существует" });
                    return;
                }
            } catch (error) {
                console.error("Ошибка при проверке промокода:", error);
                this.setState({ Error: "Ошибка при проверке промокода" });
                return;
            }
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", description);
        formData.append("latitude", selectedCoords[0]);
        formData.append("longitude", selectedCoords[1]);
        if (file) formData.append("picture", file);
        if (promo) formData.append("promo", promo);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/v1/trees/", {
                method: "POST",
                body: formData,
                headers: token
                    ? { "Authorization": `Token ${token}` }
                    : {},
            });

            if (response.ok) {
                this.setState({ showSuccessModal: true, Error: '' });
            } else {
                const data = await response.json();
                alert("Ошибка при отправке: " + JSON.stringify(data));
            }
        } catch (error) {
            alert("Ошибка сети: " + error);
        }
    };

    handleSuccessModalClose = () => {
        this.setState({ showSuccessModal: false });
        window.location.reload();
    };

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
}
export default RegKedr;


