class PAWMenu {
	static iniciar(selectorContenedor, configuracion) {
		/* Conseguir el elemento contenedor */
		const contenedor = !selectorContenedor.tagname
			? document.querySelector(selectorContenedor)
			: selectorContenedor;

		if (!contenedor.tagname) {
			console.info("No se encuentra el contenedor indicado");
		}

		document.head.appendChild(
			PAW.nuevoElemento("link", {
				rel: "styleSheet",
				href: "js/components/styles/pawmenu.css",
			})
		);
		console.log(contenedor);
		contenedor.classList.add("PAW-Menu");

		/* Agrego botón comportamiento menu */

		let botonMenu = PAW.nuevoElemento("button", {
			class: "PAW-MenuAbrir",
		});

		botonMenu.addEventListener("click", (event) => {
			if (event.target.classList.contains("PAW-MenuAbrir")) {
				event.target.classList.remove("PAW-MenuAbrir");
				event.target.classList.add("PAW-MenuCerrar");
				contenedor.classList.remove("PAW-MenuCerrado");
				contenedor.classList.add("PAW-MenuAbierto");
			} else {
				event.target.classList.remove("PAW-MenuCerrar");
				event.target.classList.add("PAW-MenuAbrir");
				contenedor.classList.remove("PAW-MenuAbierto");
				contenedor.classList.add("PAW-MenuCerrado");
			}
		});

		contenedor.insertBefore(botonMenu, contenedor.querySelector("ul"));
	}
}
