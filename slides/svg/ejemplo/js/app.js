class AppPAW {
    constructor() {
        let panel = PAW.nuevoSVG("svg", {class: "paw-panelDestello", viewBox: "0 0 100vw 100vh"});
        panel.addEventListener("click", event => {
            panel.appendChild( new Brillo(event.clientX, event.clientY));
        } );
        document.body.appendChild(panel);
    }
}

class Brillo {
    /*Configuraciones */
    _tamanoMinimo = parseInt(window.innerWidth / 30);
    _tamanoMaximo = parseInt(window.innerWidth / 10);
    _tamano = this._tamanoMinimo + parseInt(Math.random() * (this._tamanoMaximo - this._tamanoMinimo));
    _claseCSS = "paw-brillo";
    _cantidadDeColores = 3;

    constructor(x, y){  
        const destello = PAW.nuevoSVG("circle", {
            "cx" : x + "px",
            "cy": y + "px",
            "r": this._tamano + "px",
            "class": this._claseCSS + " brillo" + parseInt(Math.random()* this._cantidadDeColores)
        });

        /* Inicio transicion de aparicion */
        setTimeout(() => {destello.classList.add("aparece")}, 100);

        destello.addEventListener("transitionend", event => {
            const esteDestello = event.target;
            if (esteDestello.classList.contains("aparece")) {
                /* Cuando el destello termina de aparecer iniciamos transición para que desaparezca */
                esteDestello.classList.remove("aparece");
            } else {
                setTimeout(() => {
                    /* Elimino el elemento SVG cuando desaparece */
                    esteDestello.parentNode.removeChild(esteDestello);
                }, 1000);
            }
        });
        return destello;
    }
}

let appPAW;
document.addEventListener("DOMContentLoaded", () => {
    appPAW = new AppPAW();
});