import style from "../css/logform.module.css"
const unDeathForm = (props) => {
        return(
            <div className={style.container}>
                <header>
                    <p>
                    Если у вы уже зарегистрированы на сайте “Бессмертный полк”, то вы можете войти по номеру телефона и ФИО
                    </p>
                </header>
                <form className={style.form}>
                    <label htmlFor="login">Номер телефона</label>
                    <input placeholder="Введите номер..." id="login"
                    className={style.input}/>
                    <label htmlFor="full_name">ФИО</label>
                    <input placeholder="Введите ФИО..." id="full_name"
                    className={style.input}/>
                </form>
                <footer className={style.footer}>
                    <button className={style.button}>Войти</button>
                </footer>
            </div>
        )
    }

    export default unDeathForm;