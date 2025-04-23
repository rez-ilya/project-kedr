import style from "./css/basicinfo.module.css"

const BasicInfo = (props) => {
    return(
        <div className={style.container}>
            <main className={style.LeftBlock}>
                <p className={style.CountReg}>
                С нами уже зарегистрировано
                </p>
                <div className={style.CounterTrees}>
                3785 деревьев
                </div>
            </main>
            <main className={style.RightBlock}>
                <p className={style.title}>
                Томск - столица кедра
                </p>
                <button type="submit" className={style.button}
                onClick={props.openRegKedr}>
                    Зарегистрировать кедр
                </button>
                <p className={style.memoryOf}>
                Дерево, как символ вечной памяти о Великой Победе
                </p>
            </main>
        </div>
    )
}

export default BasicInfo;