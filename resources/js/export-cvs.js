
var gl_save_list = new save_list_ex();

function importar_main() {
}

function importar_datos() {
	var files = document.getElementById("archivos");
	var type_1 = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	var type_3 = "application/vnd.ms-excel.sheet.macroEnabled.12"
	var type_4 = "application/vnd.ms-excel"
	var type_2 = "text/csv";
	files.addEventListener("change", function(e) {
		var file_date = e.target.files[0];
		if(file_date){
			var current_type = file_date.type;
			console.log(current_type);
			if(current_type == type_1 || current_type == type_3 || current_type == type_4){
				var reader = new FileReader();
				reader.readAsArrayBuffer(file_date);
				reader.onload = function(e) {
					var data = new Uint8Array(reader.result);
					var wb = XLSX.read(data,{type:'array'});
					var htmlstr = XLSX.write(wb,{sheet:wb.SheetNames[0], type:'binary',bookType:'csv'});

					//save_exp_date([htmlstr]);				//gloval_test = file_date.type;

					Papa.parse(htmlstr,{
						config: {
							delimiter: "auto"
						},
						complete: function(results) {
							save_exp_date(results.data);
							mostrar_tabla();
						}
					});

				}
			}
			if(current_type == type_2){
				Papa.parse(file_date,{
					config: {
						delimiter: "auto"
					},
					complete: function(results) {
						save_exp_date(results.data);
						//console.log("Finished:",results.data);
						mostrar_tabla();
					}
				});
			}
		}
	});
}

function mostrar_tabla() {
	var select = document.getElementById("startfila");
	var st_value = select.options[select.selectedIndex];
	var start = parseInt(st_value.value);
	//console.log("Ddd"+start);
	for (i = 0; i < 4; i++) {
        for (j = 0; j <7 && save_expdate[i+start]; j++) {
			var celda = document.getElementById("celda01"+i+j);
			var save = save_expdate[i+start][j];
			if(save){
				celda.innerHTML = save;
			}
			else celda.innerHTML = "";
		}
    }
}

function save_exp_date(results) {
    var data = results
	save_expdate = new Array();
	doc_siz_fila = data.length;
	gl_save_list.filas = data.length;
    for (var i = 0; i < data.length; i++) {

        var row = data[i];
        var cells = row.join(",").split(",");
		save_expdate[i] = new Array();
        for (var j = 0; j < cells.length; j++) {

			if(cells[j].includes("ï»¿"))
				cells[j] = cells[j].replaceAll("ï»¿", "");

			if(cells[j].includes("Ã")){
				cells[j] = cells[j].replaceAll("Ã", "Ñ");
				cells[j] = cells[j].replaceAll("Ã³", "ó");
				cells[j] = cells[j].replaceAll("Ã", "Ó");
			}
			if(cells[j].includes("ã"))
				cells[j] = cells[j].replaceAll("ã", "ñ");

			save_expdate[i][j] = cells[j];
			
        }
		if(i==0)
		doc_siz_col = cells.length;
    }
}


function recovery_data() {
	gl_result_temp = new result_list_a();


	var select = document.getElementById("listbasedato");

	var current_opt = select.options[select.selectedIndex];
	var clave = current_opt.value;


	gl_result_temp.listatamaño=doc_siz_fila;

	var index = gl_save_list.start_filas_index;

	//console.log(index);
    for (var i = index; (save_expdate[0] && i < doc_siz_fila ); i++) {
        for (var j = 0;( j < save_expdate[0].length); j++) {
			if(j == gl_save_list.nombre_index){
				gl_result_temp.nombre[i-index] = save_expdate[i][j];
			}
			if(j == gl_save_list.cantida_index){
				gl_result_temp.cantidad[i-index] = save_expdate[i][j];
			}
			if(j == gl_save_list.precio_index){
				gl_result_temp.precio[i-index] = save_expdate[i][j];
			}
			//console.log(gl_result_temp.precio[i]);
			gl_result_temp.margen[i] = 0;		
        }
    }
	remove_empy_name();			//Quita filas con nombres vacios
	var opt = 1;
	start_one = true;
	agregarobjeto(gl_result_temp, parseInt(clave), opt);
 	reset_preview();
	gl_result_temp = new result_list_a();
	alert("Lista Guardada Correctamente.");
}

function remove_empy_name(){
	var siz = gl_result_temp.listatamaño;
    for (var j = 0;j<siz ; j++) {
		if(!gl_result_temp.nombre[j] ){
			gl_result_temp.listatamaño--;
		}
		else if(gl_result_temp.nombre[j].length==0){
			gl_result_temp.nombre.splice(j, 1);
			gl_result_temp.cantidad.splice(j, 1);
			gl_result_temp.margen.splice(j, 1);
			gl_result_temp.precio.splice(j, 1);
			gl_result_temp.listatamaño--;
		}
	}
}

function tableformato(results) {

    var table = "<table id='tableformato'>";
    var data = results.data;
	var colum_name = ["Columna A","Columna B","Columna C","Columna D","Columna E","Columna F","Columna G"];
	var name_siz = colum_name.length;
	var fila_name = ["Fila 1", "Fila 2", "Fila 3", "Fila 4"]

    for (i = 0; i < data.length-1 && i<4; i++) {
        table += "<tr class='fila_style' id="+"fila01"+i+">";
        var row = data[i];
        var cells = row.join(",").split(",");

		if(i ==0){
			table += "<tr class='fila_style' id="+"exfila"+i+">";
			table += "<td class='celda_style_name'></td>";
		    for (j = 0; j < cells.length; j++) {	
					if(j==name_siz)break
		   			table += "<td class='celda_style_name' id="+"exceldacol"+i+j+"> "+colum_name[j]+"</td>"; //Nombres para el numero de columnas	
				
			}
			table += "</tr>";
		}

		if(i < data.length-1)
			table += "<td class='celda_style_name' id="+"exceldafil"+i+"> "+fila_name[i]+"</td>"; //Nombres para el numero de filas
        for (j = 0; j < cells.length; j++) {
			if(j==name_siz)break

            table += "<td class='celda_style' id="+"celda01"+i+j+"></td>";
        }
        table += "</tr>";
    }
    table += "</table>";
}

function example_preview() {
	var cuadro = document.getElementById("templatetable");
    var table = "<table id='tableformato'>";
    var data = "";
	var colum_name = ["Nombre Producto", "Cantidad Dispon.", "Precio Entrada"];
	var name_siz = colum_name.length;
    for (i = 0; i<4; i++) {
		if(i ==0){
			table += "<tr class='fila_style' id="+"exfila2"+i+">";

		    for (j = 0; j < 3; j++) {	
		   			table += "<td class='celda_style_name' id="+"exceldacol2"+i+j+"> "+colum_name[j]+"</td>"; //Nombres para el numero de columnas		
			}
			table += "</tr>";
		}
        table += "<tr class='fila_style' id="+"fila02"+i+">";
        for (j = 0; j <3 ; j++) {

            table += "<td class='celda_style' id="+"celda01"+i+j+"><input type='text' class='input_text_style' id="+"exinput2"+i+""+j+" readonly></td>";
        }
        table += "</tr>";
    }
    table += "</table>";
	cuadro.innerHTML += table;
}

function table_preview_ex() {
	for (var i = 0; i<4; i++) {
		var input_fila = document.getElementById("fila01"+i+"");
		//input_fila.setAttribute("onmouseover", "cursor_en_fila_ex("+i+");" );
		//input_fila.setAttribute("onmouseout", "cursor_no_fila_ex("+i+");" );
		for (var j = 0; j<7; j++) {
			var input_colum = document.getElementById("check0"+j+"");
			input_colum.setAttribute("onclick", "cursor_click_input_ex("+j+");" );

			var colum_name = document.getElementById("exceldacol0"+j+"");
			colum_name.setAttribute("onmouseover", "cursor_en_colum_ex("+j+");" );
			colum_name.setAttribute("onmouseout", "cursor_no_colum_ex("+j+");" );

			var colum = document.getElementById("celda01"+i+""+j+"");
			colum.setAttribute("onmouseover", "cursor_en_colum_ex("+j+");" );
			colum.setAttribute("onmouseout", "cursor_no_colum_ex("+j+");" );
			colum.setAttribute("onclick", "cursor_click_colum_ex("+j+");" );
		}
	}
}

function cursor_en_colum_ex(j) {

	for (var i = 0; i<4; i++) {
		var colum = document.getElementById("celda01"+i+""+j);
		var class_name = colum.className;
		if(class_name != "colum_click_style")
			colum.setAttribute("class","colum_selec_style");
	
	}
}

function cursor_no_colum_ex(j) {
	for (var i = 0; i<4; i++) {
		var colum = document.getElementById("celda01"+i+""+j);
		var class_name = colum.className;
		if(class_name != "colum_click_style")
			colum.setAttribute("class","celda_style");
	}	
}
function cursor_click_colum_ex(j) {
	for (var i = 0; i<4; i++) {
		var input_colum = document.getElementById("check0"+j+"");
		input_colum.checked = true;
		var colum = document.getElementById("celda01"+i+""+j);
		var class_name = colum.className;
		if(class_name == "colum_click_style"){
			colum.setAttribute("class","celda_style");
			input_colum.checked = false;
		}
		else
			colum.setAttribute("class","colum_click_style");
	}
}
function cursor_click_input_ex(j) {
	for (var i = 0; i<4; i++) {
		var input_colum = document.getElementById("check0"+j+"");
		var colum = document.getElementById("celda01"+i+""+j);
		if(input_colum.checked){
			colum.setAttribute("class","colum_click_style");
		}
		else{
			colum.setAttribute("class","celda_style");
		}
	}	
}

function cursor_en_fila_ex(j) {

	for (var i = 0; i<5; i++) {
		var input_fila = document.getElementById("fila01"+i+"");
		if(i>=j){
			input_fila.setAttribute("class","fila_selec_style");
		}
		else {
			input_fila.setAttribute("class","fila_style");
		}	
	}
}

function cursor_no_fila_ex(j) {

	for (var i = 0; i<j; i++) {
		var input_fila = document.getElementById("fila01"+(i)+"");
		input_fila.setAttribute("class","fila_style");
	}
}
function focus_celda_ex(id){
	var input = document.getElementById(id);
	input.checked = true;
	input.focus();
	//console.log("focus");
}

var in_use = [false, false, false, false, false, false, false, false];
var in_selec = [false, false, false, false, false, false, false, false];
var in_colum = [null, null, null, null, null, null, null, null];
function button_selelc_fila(){

	var sel_start = document.getElementById("startfila");
	var st_value = sel_start.options[sel_start.selectedIndex];
	var start = parseInt(st_value.value);
	var opt = 0;
	var inc = 0;
	var radio = document.getElementsByName("fila");   
    for(i = 0; i < radio.length; i++) { 
        if(radio[i].checked){
			opt = i;
			break;
		}
		inc++;
    } 

	gl_save_list.start_filas_index = inc+start;
	var select = document.getElementById("listcolum");

	var col_nr = 0;


	for (var i = 0; i<7 ; i++) {
		if(col_nr>2) break;
		var input_colum = document.getElementById("check0"+i+"");
		var sel_value = select.value=="default"?col_nr:select.value;
		if(input_colum.checked){

			if(!in_use[i]){
			if(!in_selec[sel_value]){

				for (var j = 0; j<4 && save_expdate[(j+start)]; j++) {
					var exinput= document.getElementById("exinput2"+j+""+(sel_value));
					if(j>=opt){
						if(exinput){

							//add_message(save_celda[2][0]);
							exinput.value= save_expdate[j+start][input_colum.value];
							if(sel_value==0){
								//console.log("Nombre:" +gl_save_list.nombre_index + " "+sel_value);
								gl_save_list.nombre_index = input_colum.value;
								//console.log("Nombre:" +save_expdate[0].length);
							}

							if(sel_value==1){
								gl_save_list.cantida_index = input_colum.value;
								//console.log("Cantidad:" +gl_save_list.cantida_index);
							}

							if(sel_value==2){
								gl_save_list.precio_index = input_colum.value;
								//console.log("Precio:" +gl_save_list.precio_index);
							}
		
						}
					}
					else {
						exinput.value= "";
					}
				}
				in_selec[sel_value]=true;
				in_use[input_colum.value]=true;
				in_colum[sel_value]=i;
		}
				//if(col_nr == sel_value)

				//col_nr++;
				//continue;
			}


			col_nr++;
		}
		else {

			if(select.value=="default"){
				//console.log("block i:"+i+"--"+in_use[i]);
				//console.log("block in_selec:"+sel_value+"--"+in_selec[sel_value]);
				//console.log("block col_nr:"+col_nr+"--"+in_use[col_nr]);
				if (in_use[i]){
					for (var col = 0; col<3; col++) {
						if (in_colum[col]==i){
							for (var j = 0; j<4; j++) {
								var exinput= document.getElementById("exinput2"+j+""+col);
								if(exinput){
									exinput.value= "";

									if(col==0){
										gl_save_list.nombre_index = 0;
										//console.log("Nombre:" +save_expdate[0].length);
									}

									if(col==1){
										gl_save_list.cantida_index = 0;
										//console.log("Cantidad:" +gl_save_list.cantida_index);
									}

									if(col==2){
										gl_save_list.precio_index = 0;
										//console.log("Precio:" +gl_save_list.precio_index);
									}
								}
							}
							in_use[i] = false;
							in_selec[col]=false;
							in_colum[col]=null;
							break;							
						}
					}			
				}
				continue
			}
			if(in_use[i]){
				for (var col = 0; col<3; col++) {
					if (in_colum[col]==i && in_selec[col]){
						for (var j = 0; j<4; j++) {
							var exinput= document.getElementById("exinput2"+j+""+col);
							if(exinput){
								exinput.value= "";

								if(col==0){
									gl_save_list.nombre_index = 0;
									//console.log("Nombre:" +save_expdate[0].length);
								}

								if(col==1){
									gl_save_list.cantida_index = 0;
									//console.log("Nombre:" +gl_save_list.nombre_index);
								}

								if(col==2){
									gl_save_list.precio_index = 0;
									//console.log("Precio:" +gl_save_list.precio_index);
								}
							}
						}
						in_use[i] = false;
						in_selec[col]=false;
						in_colum[col]=null;
					}
				}
			}
		}
	}	
}
function reset_preview(){
	in_use = [false, false, false, false, false, false, false, false];
	in_selec = [false, false, false, false, false, false, false, false];
	in_colum = [null, null, null, null, null, null, null, null];

	gl_save_list.nombre_index = 0;
	gl_save_list.cantida_index = 0;
	gl_save_list.precio_index = 0;
	gl_save_list.filas_index = 0;
	gl_save_list.start_filas_index = 3;
	for (var i = 0; i<3; i++) {
		for (var j = 0; j<4; j++) {
			var exinput= document.getElementById("exinput2"+j+""+i);
			if(exinput){
				exinput.value= "";
			}
		}							
	}
}
function save_list_ex() {
	this.filas_index = 0;
	this.start_filas_index = 3;
	this.nombre_index = 0;
	this.cantida_index = 0;
	this.precio_index = 0;
}

