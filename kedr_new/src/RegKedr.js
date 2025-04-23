import React from "react";
import style from "./css/regkedr.module.css"
import Map from "./Map"

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
                <header >
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <p>ФИО</p>
                </header>
                <nav>
                    <div className={style.step + " " + style.active}>1</div>
                    <div className={style.line}></div>
                    <div className={style.step}>2</div>
                </nav>
                <main>
                    <h2>Выберите место на карте</h2>
                    <Map className={style.map}></Map>
                </main>
                <footer>
                    <button type="button"
                    onClick={this.setShowFirstStep}>Далее</button>
                </footer>
            </div>}
            {/* Вторая часть */}
            <div className={style.main}>
                <header >
                    <button type="button"
                    onClick={this.props.closeRegKedr}>Вернуться на главную</button>
                    <p>ФИО</p>
                </header>
                <nav>
                    <div className={style.step}>1</div>
                    <div className={style.line}></div>
                    <div className={style.step + " " + style.active}>2</div>
                </nav>
                <form>
                    <label htmlFor="description">Добавить описание</label>
                    <textarea id="description"></textarea>
                    <label htmlFor="add_img">Добавить фото</label>
                    <input type="file" id="add_img"></input>
                    <label htmlFor="promo">Введите промокод</label>
                    <input id="promo"></input>
                </form>
                <footer className={style.foot_safe}>
                    <button type="button"
                    onClick={this.setShowFirstStep}>Назад</button>
                    <button type="button"
                    >Отправить заявку</button>
                </footer>
            </div>
        </div>
        )
        }

    setShowFirstStep = () => {
        if (this.state.ShowFirstStep) 
            this.setState({ ShowFirstStep: false })
        else 
            this.setState({ ShowFirstStep: true })
    }
}
export default RegKedr;


