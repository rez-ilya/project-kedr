import React from "react";
import style from "./css/regkedr.module.css"
import MapCedars from "./MapCedrs"

class RegKedr extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          ShowFirstStep: true,
          selectedCoords: null,
          showModal: false,
          description: '',
          promo: '',
          file: null,
          title: '',
        };
      }

    render(){
        return(
        <div>
            {this.state.ShowFirstStep && <div className={style.main}>
                <header className={style.head_info}>
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <p>ФИО</p>
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
                {/* <footer className={style.footer_reg}>
                    <button type="button"
                    onClick={this.setShowFirstStep}>Далее</button>
                </footer> */}
                {this.state.showModal && (
                    <div className={style.modal} onClick={this.handleOverlayClick}>
                        <div className={style.modalContent}
                        onClick={e => e.stopPropagation()}> 
                            {/* <p>Вы выбрали координаты: {this.state.selectedCoords?.join(', ')}</p> */}
                            <p>Вы уверены, что хотите посадить кедр на этом месте?</p>
                            <button onClick={this.handleModalSave}>Да</button>
                            <button onClick={this.handleModalCancel}>Отмена</button>
                        </div>
                    </div>
                )}
            </div>}
            {/* Вторая часть */}
            <div className={style.main}>
                <header className={style.head_info}>
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <p>ФИО</p>
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
                    <footer className={style.footer_reg}>
                        <button type="button" onClick={this.setShowFirstStep}>Назад</button>
                        <button type="submit">Отправить заявку</button>
                    </footer>
                </form>
            </div>
        </div>
        )
        }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
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
        // координаты уже сохранены в selectedCoords
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
        if (!selectedCoords || !title || !description) {
            alert("Пожалуйста, заполните все обязательные поля и выберите место на карте.");
            return;
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
                alert("Заявка успешно отправлена!");
                // Можно сбросить форму или перейти на другой этап
            } else {
                const data = await response.json();
                alert("Ошибка при отправке: " + JSON.stringify(data));
            }
        } catch (error) {
            alert("Ошибка сети: " + error);
        }
    };
}
export default RegKedr;


