import React from "react";
import style from "./popup.module.css";

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClosing: false
        };
    }

    handleClose = () => {
        this.setState({ isClosing: true });
        setTimeout(() => {
            this.props.closePopUp();
        }, 300); // Время анимации
    }

    handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            this.handleClose();
        }
    }

    render() {
        const { isClosing } = this.state;
        return (
            <div className={`${style.overlay} ${isClosing ? style.closing : ''}`} onClick={this.handleOverlayClick}>
                <div className={`${style.content} ${this.props.contentClass ? style[this.props.contentClass] : ''} ${isClosing ? style.closing : ''}`}>
                    <header className={style.header}>
                        <img 
                            src='/close-icon.png' 
                            alt="закрыть"
                            className={style.close}
                            onClick={this.handleClose}
                        />
                    </header>
                    <main className={style[this.props.object]}><this.props.obj/></main>
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
}

export default PopUp;


