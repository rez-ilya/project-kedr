import { useEffect, useState } from "react";
import style from "../css/basicinfo.module.css"

const BasicInfo = (props) => {
    const [count, setCount] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/trees/')
            .then(res => res.json())
            .then(data => setCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setCount(0));
    }, []);

    // Функция для склонения слова "кедр"
    function getCedarWord(n) {
        n = Math.abs(n) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return "кедров";
        if (n1 > 1 && n1 < 5) return "кедра";
        if (n1 === 1) return "кедр";
        return "кедров";
    }

    return(
        <div className={style.container}>
            <main className={style.LeftBlock}>
                <p className={style.CountReg}>
                С нами уже зарегистрировано
                </p>
                <div className={style.CounterTrees}>
                    <p>{count !== null ? count : "..."}</p>
                    <p>{count !== null ? getCedarWord(count) : ""}</p>
                </div>
            </main>
            <main className={style.RightBlock}>
                <div>
                    <p className={style.title}>
                    Томск - столица кедра
                    </p>
                    <button type="submit" className={style.button}
                    onClick={props.openRegKedr}>
                        Зарегистрировать кедр
                    </button>
                    <p className={style.memoryOf}>
                    <span>Дерево</span>, как символ вечной памяти о Великой Победе
                    </p>
                </div>
            </main>
        </div>
    )
}

export default BasicInfo;