import style from "./footer.module.css"
// import person from "../Cinder.jpg"

const Footer = () => {
    return(
    <div className={style.container}>
        <header className={style.header}>Партнёры</header>
        <div className={style.dividerBar} />
      
        <main className={style.main}>
          <div className={style.leftblock}>
            <h2>Ответственное лицо</h2>
            <div className={style.person}>
              <div className={style.image}>Фотка</div>
              <p className={style.info}>Инфа об этом человеке</p>
            </div>
          </div>
      
          <div className={style.verticalLine} />
      
          <div className={style.rightblock}>
            <h2>Контактная информация</h2>
            <div className={style.contacts}>
              <p>Тг</p>
              <p>Почта</p>
              <p>Ватсап</p>
              <p className={style.address}>Адрес организации</p>
            </div>
          </div>
        </main>
    </div>
      
    )
}

export default Footer;