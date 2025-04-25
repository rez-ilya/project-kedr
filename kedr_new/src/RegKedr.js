import React from "react";
import style from "./css/regkedr.module.css"
import MapCedars from "./MapCedrs"

class RegKedr extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          ShowFirstStep: true,
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
                    <div className={style.map}><MapCedars></MapCedars></div>
                </main>
                <footer className={style.footer_reg}>
                    <button type="button"
                    onClick={this.setShowFirstStep}>Далее</button>
                </footer>
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
                <form className={style.reg_kedr}>
                    <label htmlFor="description">Добавить описание</label>
                    <textarea id="description"></textarea>
                    <label htmlFor="add_img">Добавить фото</label>
                    <input type="file" id="add_img"></input>
                    <label htmlFor="promo">Введите промокод</label>
                    <input id="promo"></input>
                </form>
                <footer className={style.footer_reg}>
                    <button type="button"
                    onClick={this.setShowFirstStep}>Назад</button>
                    <button type="button"
                    >Отправить заявку</button>
                </footer>
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
}
export default RegKedr;


