class PAW {
	static nuevoElemento(
		tag,
		atributos = {},
		contenido = "",
		escapeHTML = false
	) {
		const elemento = document.createElement(tag);

		for (const propiedad in atributos) {
			elemento.setAttribute(propiedad, atributos[propiedad]);
		}

		if (!contenido.tagName)
			if (!escapeHTML) elemento.textContent = contenido;
			else {
				contenido = document.createTextNode(contenido);
				elemento.appendChild(contenido);
			}
		else elemento.appendChild(contenido);

		return elemento;
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
