
var save_expdate = new Array();
var save_expdate_cell = new Array();

var save_id_filas = new Array(); 
var save_id_colum = new Array();
var save_celda = new Array();
var save_id = new Array();
//-------------------------------------------------------

var current_element = null;
var current_key = null;
var gloval_test = "";


var gl_general = new general_datos();

var gl_genactu = new general_datos();
var start_one = true;
var is_start = true;


function notSupported(){ alert("El navegador no lo soporta."); }


function butt_actu_test(){

	gl_genactu.clave = gl_general.clave;						//Clave para guardar/cargar el registro
	gl_genactu.cu_save_id = gl_general.cu_save_id;				//Clave clave mayor para el registro cuentas
	gl_genactu.cl_save_id = gl_general.cl_save_id;				//Clave clave mayor para el registro clientes

	//Gurda valores de los inputs
	gl_genactu.gen_bs = gl_general.gen_bs;

	//Guarda estado temporal de valores de cuenta
	gl_genactu.temp_monto_dol_cc = gl_general.temp_monto_dol_cc;
	gl_genactu.temp_monto_bs_cc = gl_general.temp_monto_bs_cc;

	//Guarda estado temporal de valores del cliente
	gl_genactu.temp_selec = gl_general.temp_selec;
	gl_genactu.temp_nombre = gl_general.temp_nombre;
	gl_genactu.temp_monto_dol = gl_general.temp_monto_dol;
	gl_genactu.temp_monto_bs = gl_general.temp_monto_bs;
	gl_genactu.temp_monto_pagado = gl_general.temp_monto_pagado;

	//Guarda el estado del selector
	gl_genactu.sel_moneda = gl_general.sel_moneda;

	//Se registran las fechas
	gl_genactu.index = gl_general.index;						//Index actual (Va incrementando por operacion, regresa a 0 por dia)
	gl_genactu.fecha = gl_general.fecha;					//Fecha actual
	gl_genactu.fechalist = gl_general.fechalist; 		//Lista de fechas por di

	//Gestion de las cuentas
	gl_genactu.cuentlist = gl_general.cuentlist; 		//Lista de cuentas
	gl_genactu.etdtlist = gl_general.etdtlist; 		//Marca las cuentas para ser ingnoradas

	agregar_gene_datos(gl_genactu);
	//var result = new result_list();
	//agregarobjeto(result);

	//get_celda_value(table_fila,table_col);
	//gloval_test += "input "+document.getElementById("input0").value;

	//create_table(table_fila,table_col);
	
      //for (var j = 0; j < save_expdate.length; j++) {

		//gloval_test += " ["+save_expdate[0][j]+"] ";
		//gloval_test += " ["+save_expdate[1][j]+"] ";
		//gloval_test += " ["+save_expdate[2][j]+"] ";
		//gloval_test += " ["+save_expdate[3][j]+"] ";
     //}
		//setCaretPosition("inputest", 5);
	//add_message(gloval_test);
	//gloval_test ="";

	//get_celda_value(table_fila,table_col);


}

function cursor_en_fila(id)
{
	var fila = document.getElementById("fila"+id);
	fila.setAttribute("class","fila_selec_style");
}

function cursor_no_fila(id)
{
	var fila = document.getElementById("fila"+id);
	fila.setAttribute("class","fila_style");
}

function cursor_en_button(id)
{
	var butt = document.getElementById(id);
	butt.setAttribute("class","input_style_selec");
}

function cursor_no_button(id)
{
	var butt = document.getElementById(id);
	butt.setAttribute("class","input_style_td");
}


function init(){

	check_windows_siz();

	//Crea la tabla de Registro de Pagos
	create_table_pagos();

	//Crea la tabla de Registro de Cuentas
	create_table_cuentas();

	//Iniciar Base de datos
	set_basededatos("registroagenda");

	//Leer documentos tipo hojas de datos
	//importar_datos();

	//Inicia las funciones de menu
	menu_main();


	//Panel de inicio

 	visible_element(1);


	//--------------------------------------------

	// Inicializa las funciones del registro pagos	
	pagos_main();

	// Inicializa las funciones del registro cuentas
	cuentas_main();

	export_main();

	importar_main();
	//---------------------------------------------

	var boton = document.getElementById("load_start");
	//boton.addEventListener("click", agregarobjeto);
	//boton.addEventListener("focus", cambio_valor);

	//Buscador para la lista de productos
	//var input_buscar = document.getElementById("buscar");
	//input_buscar.addEventListener("input", function(){buscar_lista(input_buscar.value);});


}

window.addEventListener("resize", check_windows_siz);

document.addEventListener('click', function() {

	var input = document.activeElement;
	var class_name = input.className;
	if(class_name != "" && class_name != "input_style_visible"){
		var otros = true;
		ocultar_input(otros);
	}

}); 

window.addEventListener("keypress", function() {

		var key = window.event.key;

		current_key = key;
//add_message("");
		var input = document.activeElement;
		var class_name = input.className;

//console.log("key"+class_name);

		if(class_name == "input_style_visible"){
    		return soloNumeros(event);
		}
		else if(class_name == "mask_style" || class_name == "input_style_edicion_td"){
    		return soloLetras(event);
		}
		else if(class_name == "input_desc_style")
			  return soloAlfnNumer(event);
});
window.addEventListener("keyup", function() {
	var input = document.activeElement;
	var class_name = input.className;

	current_key = null;
	if(class_name == "input_style_visible"){
		input.addEventListener("keyup", function(){ 
		return soltar_tecla(event);
		}, false);
	}
	var key = window.event.key;
	if(key == "Enter"){
		var id_name = input.id;
				//add_message(id_name);
		if(id_name.includes("input")){
			var class_name = input.className;
			//add_message(class_name);
			if(class_name == "input_style_visible"){
				ocultar_input()
			}
		}
		input.blur();
	}
	if(key == "Tab"){
		var id_name = input.id;
		//id_name = id_name.replace("text_mask", "input"); //remplaza  palabaras en cadenas de texto
		//add_message(id_name);
		var mask = document.getElementById(id_name.replace("input", "text_mask"));
		if(mask && id_name.includes("input")){
			input.setAttribute("class","input_style_hidden");
			mask.setAttribute("readwrite", "");
			mask.focus();
		}
	}
});

//Solo permite introducir números.
function soloNumeros(e){
	var input_test = document.getElementById("inputest");

	var input = document.activeElement;
	var num = input.value;
    var key = window.event ? e.which : e.keyCode;
	//console.log("key: "+key);
	//console.log("value: "+num);
	if(key == 46){
		if (num == "")
			return e.preventDefault();

	 	else if(!num.includes(".")){
			return null;
		}
		
	}
	else if(key == 45){
		if (num == "")
			return e.preventDefault();

	 	else if(!num.includes("-")){
			return null;
		}
	}

    if (key < 48 || key > 57) {
        //Usando la definición del DOM level 2, "return" NO funciona.
        e.preventDefault();
    }

}

//Solo permite introducir letras.
function soloLetras(e){
	var input_test = document.getElementById("inputest");

	var input = document.activeElement;
	var num = input.value;
    var key = window.event ? e.which : e.keyCode;
	//console.log("key: "+key);
    if ((key < 97 || key > 122) && (key < 65 || key > 90) ) {
        //Usando la definición del DOM level 2, "return" NO funciona.
		if(key != 241 && key != 209 && key != 32){
        	e.preventDefault();
		}
    }

}

//Solo permite introducir letras y numeros.
function soloAlfnNumer(e){
	var input_test = document.getElementById("inputest");

	var input = document.activeElement;
	var num = input.value;
    var key = window.event ? e.which : e.keyCode;
	//console.log("key: "+key);
    if ((key < 97 || key > 122) && (key < 65 || key > 90) && (key < 48 || key > 57) ) {
        //Usando la definición del DOM level 2, "return" NO funciona.
		if(key != 241 && key != 209 && key != 32){
        	e.preventDefault();
		}
    }

}

function soltar_tecla(e){
	var key = window.event.key;
	//add_message(key);
	if(key == "."){
		var input_test = document.getElementById("inputest");

		var input = document.activeElement;
		var num = input.value;
	 	if (!num.includes(".")){
			//input.value = remplace_test(num);
			//input.value = parseFloat(input.value).toFixed(2);
			return null;
		}
	}
}
function remplace_test(num) {
	//num = num.replace(/(\.)(\d){2,}/g, 128);
	 num = num.replace(/($)/g, ".00");
	 //num.replace(/\.$/, "128");
	// num.replace(/[\.]$/, 128);
	//add_message(num);
	return num;
}





