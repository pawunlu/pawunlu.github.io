class PAWEjemplo {
	constructor() {
		PAW.cargarScript("PAWMenu", "js/components/pawmenu.js", () => {
			PAWMenu.iniciar("nav");
		});
	}
}

let app = new PAWEjemplo();
