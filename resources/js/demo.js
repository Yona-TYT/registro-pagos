function iniciar_demo() {
	
	var datos_dir = "resources/demo/datos.csv";
	var capt_dir = "resources/demo/captures.csv";

	var file_a = loadFile(datos_dir);

	console.log("File: "+file_a);
	
}

function loadFile(filePath) {
	var result = null;
	fetch(filePath)
  .then(res => res.text())
  .then(content => {
    let lines = content.split(/\n/);
    lines.forEach(line => console.log(line));
  });
	return result;
}
