function iniciar_demo() {
	
	var datos_dir = "https://raw.githubusercontent.com/Yona-TYT/registro-pagos/gh-pages/resources/demo/datos.csv";
	var capt_dir = "https://raw.githubusercontent.com/Yona-TYT/registro-pagos/gh-pages/resources/demo/captures.csv";

	loadFile_data(datos_dir);
	loadFile_cap(capt_dir);

	//console.log("File: "+file_a);
	
}

function loadFile_data(filePath) {
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
				}
			})
		);
}

function loadFile_cap(filePath) {
	fetch(filePath)
	.then(response => response.blob())
	.then(data => 
				Papa.parse(data,{
				config: {
					delimiter: "auto"
				},
				complete: function(results) {
					save_exp_capt(results.data);

				}
			})
		);
}
