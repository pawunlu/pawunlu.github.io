/*Inicializa funcionalidad */
document.addEventListener("DOMContentLoaded", (e) => {
	buscador = new Buscador(
		document.querySelector("form"),
		document.querySelector(".resultadosProcesados")
	);
	console.log(buscador);
});

class Buscador {
	tamanoMinimo = 3;
	apikey = "";
	urlAPI = "http://www.omdbapi.com/";

	loader = PAW.nuevoElemento("div", { class: "loader" });

	constructor(formulario, contenedor) {
		this.form =
			typeof formulario == "string"
				? document.querySelector(formulario)
				: formulario;
		this.input = formulario.querySelector("input[type='search']");
		this.button = formulario.querySelector("button[type='submit']");
		this.tipo = formulario.querySelector("input[type='radio'");
		this.inputapikey = formulario.querySelector("input#apiKey");
		this.apikey = this.inputapikey.value;
		this.contenedor =
			typeof contenedor == "string"
				? document.querySelector(contenedor)
				: contenedor;

		this.contenedorLimpio = this.contenedor.cloneNode();
		this.limpiarContenedor();

		this.button.addEventListener("click", (e) => {
			this.buscar(e);
		});
		return {};
	}

	buscar(e) {
		e.preventDefault();
		console.log(e);
		if (this.input.value.length >= this.tamanoMinimo) {
			this.limpiarContenedor();
			console.log(this.tipo);
			const urlGET =
				this.urlAPI +
				"?apikey=" +
				this.apikey +
				"&" +
				"type=" +
				(this.tipo.checked ? "movie" : "series") +
				"&" +
				"s=" +
				this.input.value;
			console.log(urlGET);

			this.ponerLoader();
			/* 
                Si fuera por POST usar FormData
                -------------------------------
                
                var dataSend = new FormData(this.formulario);
                var request = new Request(this.urlAPI, {
                    method: 'POST',
                    body: dataSend
                });
                */

			fetch(urlGET)
				.then((response) => {
					if (response.status >= 200 && response.status < 300) {
						console.log(response);
					}
					if (response.status == 401) {
						//Mostrar que hay error en la APIKey o si no llegó al límite
						throw "Error de identificación con la API";
					}
					return response.json();
				})
				.then((data) => {
					console.log(data);
					if (data.Response == "True") {
						this.procesaResultados(data);
					} else {
						// Mostrar mensaje "Sin Resultados"
						this.mostrarError("No se encuentran resultados");
					}
					this.sacarLoader();
				})
				.catch((err) => {
					console.error(err);
					//Mostrar Error en la recepción de datos
					this.mostrarError("Error al conectar con la API");
				});
		}

		this.inputapikey.addEventListener("blur", (e) => {
			e.preventDefault();
			console.log("APIkey: " + e.target.value);
			this.apikey = e.target.value;
		});
	}

	limpiarContenedor() {
		const padre = this.contenedor.parentElement;
		padre.removeChild(this.contenedor);
		this.contenedor = this.contenedorLimpio.cloneNode();
		padre.appendChild(this.contenedor);
		padre.classList.add("vacio");
	}

	ponerLoader(elemento) {
		elemento = elemento || this.contenedor;
		elemento.appendChild(this.loader);
	}

	sacarLoader(elemento) {
		if (!elemento) {
			const padre = this.contenedor.parentElement;
			padre.classList.remove("vacio");
			padre.classList.add("lleno");
		}
		elemento = elemento || this.contenedor;
		elemento.removeChild(this.loader);
	}

	mostrarError(error, elemento) {
		elemento = elemento || this.contenedor;
		const mensaje = PAW.nuevoElemento("h2", { class: "error" }, error);
		elemento.appendChild(mensaje);
		this.sacarLoader();
	}

	procesaResultados(data) {
		/* Resultado de busqueda
        {
            Poster: url
            Title: titulo
            Type: "movie" o "series"
            Year: AAAA
            imdbID: tt9999999
        }
        */
		data.Search.forEach((elemento, i) => {
			let article = this.generaCard(elemento);
			article.addEventListener("click", (e) => {
				this.consigueMasInfo(e);
			});
			this.contenedor.appendChild(article);
		});
	}

	generaCard(elemento) {
		let article = PAW.nuevoElemento("article", { "data-id": elemento.imdbID });
		let adelante = PAW.nuevoElemento("section", { class: "adelante" });
		let atras = PAW.nuevoElemento("section", { class: "atras" });
		let imagen = PAW.nuevoElemento("img", {
			src: elemento.Poster,
		});
		let caratula = PAW.nuevoElemento("picture", {}, imagen, true);
		let titulo = PAW.nuevoElemento("figcaption", {}, elemento.Title);
		let anio = PAW.nuevoElemento("p", { class: "anio" }, elemento.Year);
		caratula.appendChild(titulo);
		adelante.appendChild(caratula);
		adelante.appendChild(anio);
		article.appendChild(adelante);
		article.appendChild(atras);
		return article;
	}

	consigueMasInfo(e) {
		console.log(e);
		let article;
		if (e.target.tagName == "article") {
			article = e.target;
		} else {
			article = e.target.closest("article");
		}
		article.classList.toggle("masInfo");
		if (article.classList.contains("masInfo")) {
			const urlGET =
				this.urlAPI +
				"?apikey=" +
				this.apikey +
				"&i=" +
				article.getAttribute("data-id");
			article.classList.add("masInfo");
			const masInfo = article.querySelector(".atras");
			this.ponerLoader(masInfo);
			console.log(urlGET);
			fetch(urlGET)
				.then((response) => {
					if (response.status >= 200 && response.status < 300) {
						console.log(response);
					}
					if (response.status == 401) {
						/* Lanza una excepcion que rompe la promesa*/
						throw "Error de identificación con la API";
					}
					return response.json();
				})
				.then((data) => {
					console.log(data);
					if (data.Response == "True") {
						this.agregaMasInfo(data, masInfo);
					} else {
						// Mostrar mensaje "Sin Resultados"
						this.mostrarError("No se encuentran resultados", masInfo);
					}
					this.sacarLoader(masInfo);
				})
				.catch((err) => {
					console.error(err);
					//Mostrar Error en la recepción de datos
					this.mostrarError("Error al conectar con la API", masInfo);
				});
		}
	}

	agregaMasInfo(data, masInfo) {
		/* Resultado API 
        {
            Actors: "Robert Downey Jr., Terrence Howard, Jeff Bridges, Gwyneth Paltrow"
            ​Awards: "Nominated for 2 Oscars. Another 21 wins & 71 nominations."
            ​BoxOffice: "$319,034,126"
            ​Country: "USA, Canada"
            ​DVD: "23 Nov 2015"
            ​Director: "Jon Favreau"
            ​Genre: "Action, Adventure, Sci-Fi"
            ​Language: "English, Persian, Urdu, Arabic, Kurdish, Hindi, Hungarian"
            ​Metascore: "79"
            ​Plot: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil."
            ​Poster: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
            ​Production: "Marvel Enterprises, Paramount"
            ​Rated: "PG-13"
            ​Ratings: Array(3) [ {…}, {…}, {…} ]
            ​Released: "02 May 2008"
            ​Response: "True"
            ​Runtime: "126 min"
            ​Title: "Iron Man"
            ​Type: "movie"
            ​Website: "N/A"
            ​Writer: "Mark Fergus (screenplay), Hawk Ostby (screenplay), Art Marcum (screenplay), Matt Holloway (screenplay), Stan Lee (characters), Don Heck (characters), Larry Lieber (characters), Jack Kirby (characters)"
            ​Year: "2008"
            ​imdbID: "tt0371746"
            ​imdbRating: "7.9"
            imdbVotes: "958,015"

			%Si es Serie
			​totalSeasons: Cantidad

        }
        */
		
		//Si está vacio
		if (masInfo.childElementCount == 1) {
			const titulo = PAW.nuevoElemento("h2", {}, data.Title);
			const descripcion = PAW.nuevoElemento("p", { class: "plot" }, data.Plot);
			const actores = PAW.nuevoElemento("p", { class: "actores" }, data.Actors);
			const titActores = PAW.nuevoElemento("h3", { class: "cast" }, "Cast");

			masInfo.appendChild(titulo);
			masInfo.appendChild(descripcion);
			masInfo.appendChild(titActores);
			masInfo.appendChild(actores);

			/* Si es una serie */
			if (data.totalSeasons) {
				masInfo.appendChild(
					PAW.nuevoElemento(
						"p",
						{ class: "seasons" },
						((data.Year[data.Year.length - 1] == "–")? "Van ": "Fueron ") + 
						data.totalSeasons + " temporada" + ((data.totalSeasons > 1)? "s": '')
					)
				);
				console.log(data.Year[data.Year.length - 1]);
				let termino = (data.Year[data.Year.length - 1] == "–")? "continua": "finalizada";
				masInfo.classList.add(termino);
			}
		}
	}
}
