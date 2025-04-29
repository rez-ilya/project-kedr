import style from "./header2.module.css"

const Header2 = () => {
    return(
        <div className={style.header}>
            <div className={style.title}>
            Почему это важно?
            </div>
            <div className={style.text}>
            Посадка дерева — это действие, которое соединяет прошлое, настоящее и будущее.
            </div>
        </div>
    )
}

export default Header2;