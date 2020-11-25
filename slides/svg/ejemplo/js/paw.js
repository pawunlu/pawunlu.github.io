class PAW {
	static nuevoElemento(
		tag,
		atributos = {},
		contenido = "",
		escapeHTML = false,
		namespace = false
	) {
		let elemento;
		if (!namespace) {
			elemento = document.createElement(tag);
			if (!contenido.tagName)
				if (!escapeHTML) elemento.textContent = contenido;
				else {
					contenido = document.createTextNode(contenido);
					elemento.appendChild(contenido);
				}
			else elemento.appendChild(contenido);
		} else {
			elemento = document.createElementNS(namespace, tag);
		}

		for (const propiedad in atributos) {
			elemento.setAttribute(propiedad, atributos[propiedad]);
		}

		return elemento;
	}

	static nuevoSVG(tag, atributos = {}) {
		return this.nuevoElemento(tag, atributos, "", false, "http://www.w3.org/2000/svg");
	}

	static cargarScript(nombre, url = "", fnCallback = () => {}) {
		const scriptMenu = this.nuevoElemento("script", {
			name: nombre,
			src: url,
		});
		scriptMenu.addEventListener("load", fnCallback);
		document.head.appendChild(scriptMenu);
	}
}
