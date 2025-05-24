import React, { useRef, useEffect } from "react";
import style from "./footer.module.css"
// import person from "../Cinder.jpg"

const partnerLogos = [
    "image 2.png",
    "image 3.png",
    "image 4.png",
    "image 5.png",
    "image 6.png",
    "image 7.png",
    "image 8.png"
    // Добавить сюда имена файлов других логотипов, если появятся
];

const Footer = () => {
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        const content = contentRef.current;
        if (!marquee || !content) return;

        let frame;
        let speed = 0.7; // px per frame

        function scroll() {
            if (marquee.scrollLeft >= content.scrollWidth / 2) {
                marquee.scrollLeft = 0;
            } else {
                marquee.scrollLeft += speed;
            }
            frame = requestAnimationFrame(scroll);
        }
        frame = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(frame);
    }, []);

    // Дублируем массив для бесшовности
    const logos = [...partnerLogos, ...partnerLogos];

    return(
    <div className={style.container}>
        <header className={style.header}>Наши <span>зелёные</span> партнёры</header>
        <div className={style.dividerBar}>
            <div className={style.marquee} ref={marqueeRef}>
                <div className={style.marqueeContent} ref={contentRef}>
                    {logos.map((logo, idx) => (
                        <img
                            key={idx}
                            src={`/logo-partners/${logo}`}
                            alt={`Партнёр ${idx+1}`}
                            className={style.partnerLogo}
                        />
                    ))}
                </div>
                <div className={style.marqueeFade}></div>
            </div>
        </div>
        <div className={style.greenLine}></div>
    </div>
    )
}

export default Footer;