function iniciar_demo() {
	
	var datos_dir = "https://raw.githubusercontent.com/Yona-TYT/registro-pagos/c3173466ab1a41d7f71cc863c5b5311820443b79/resources/demo/datos.csv";
	var capt_dir = "https://raw.githubusercontent.com/Yona-TYT/registro-pagos/c3173466ab1a41d7f71cc863c5b5311820443b79/resources/demo/datos.csv";

	var file_a = loadFile(datos_dir);

	//console.log("File: "+file_a);
	
}

function loadFile(filePath) {
	fetch(filePath)
	.then(response => response.blob())
	.then(data => 
				Papa.parse(data,{
				config: {
					delimiter: "auto"
				},
				complete: function(results) {
					save_exp_date(results.data);
					guardar_inmp_data();
					//console.log("Finished:",results.data);	
				}
			})
		);
}
