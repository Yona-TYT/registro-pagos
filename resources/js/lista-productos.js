var gl_current_selec = null;


function check_edit_mode(){
	var input_edit = document.getElementById("edit_mode");
	edit_mode = input_edit.checked;
	input_edit.addEventListener("change", function(){

		chlistnameinput_a();
		reset_inputs_rv();
		activadesactiva_editmode()

	});
}

function activadesactiva_editmode(){

		var input_edit = document.getElementById("edit_mode");
		edit_mode = input_edit.checked;

		//table.remove();

		var select_name = document.getElementById("selectlistaname");
		var input_name = document.getElementById("inputlistaname");
		if(edit_mode){
			input_name.setAttribute("class","mask_style");
			select_name.setAttribute("class","element_style_hidden");
		}
		else{
			input_name.setAttribute("class","element_style_hidden");
			select_name.setAttribute("class","mask_style");
		}

		create_table(table_fila,table_col);

		if(gl_current_selec != null){
			button_selec_product(gl_current_selec);
		}
		//contador = setInterval(cambio_valor, 1000);
		//load_save_data();
}

function load_edit_input(j,i){
	var multiplo = (j*table_col);
	var input_id = j+""+i;

	var input = document.getElementById("input"+input_id);
	var tex_mask = document.getElementById("text_mask"+input_id);

	input.setAttribute(edit_mode?"readwrite":"readonly", "");
	tex_mask.setAttribute("readonly", "");
	tex_mask.setAttribute("class", edit_mode?"input_style_edicion_td":"mask_style");
	input.setAttribute("class", "element_style_hidden");

	//Cuadros de MArgen  ganancia y Precio del dolar----------------------------------------------
	tex_mask.setAttribute("onClick", edit_mode?"mostrar_input();":"");
	tex_mask.setAttribute("onSelect", edit_mode?"mostrar_input();":"");
	input.setAttribute("onFocus", edit_mode?"ocultar_input();":"");
}


function crear_lista_productos() {
	var sect_lista = document.getElementById("listageneral");
	var data_lista = document.getElementById("listproducts");
	sect_lista.innerHTML = "";
	data_lista.innerHTML = "";
	var lista_tx = "";
	var data_tx = "";
	for (var j = 0; j < table_fila; j++) {
		lista_tx += add_text_fila(j,1);
		data_tx += add_text_fila(j,2);
	}
	// agregamos la hilera a la seccion de lista
	sect_lista.innerHTML = lista_tx;
	data_lista.innerHTML = data_tx;
}

function add_text_fila(index,opt){
	//console.log("tes selc"+gl_selc)
	var r_nombre = gl_list[gl_selc].nombre[index]?gl_list[gl_selc].nombre[index]:"";
	var r_cantidad = gl_list[gl_selc].cantidad[index]?gl_list[gl_selc].cantidad[index]:0;
	var r_margen = gl_list[gl_selc].margen[index]?gl_list[gl_selc].margen[index]:0;
	var r_precio = gl_list[gl_selc].precio[index]?gl_list[gl_selc].precio[index]:0;

	r_nombre = r_nombre?r_nombre.toLowerCase():"";

	var values_tx = r_nombre+" Cantidad ("+r_cantidad+") Margen c/u ("+get_mask_simple(r_margen,"%")+") Entrada c/u ("+get_mask(r_precio,"$")+")";
	if(opt==1){
		return "<div class='div_list_style' id='divlp"+index+"'><button type='button' onclick='button_selec_product("+index+");'>Seleccionar</button> "+values_tx+"</div>";
	}
	if(opt==2){
		return "<option id='optlist"+index+"' value='"+r_nombre+"'>";
	}
}

function button_selec_product(index){
	gl_current_selec = index;

	var r_nombre = gl_list[gl_selc].nombre[index]?gl_list[gl_selc].nombre[index]:"";
	var r_cantidad = gl_list[gl_selc].cantidad[index]?gl_list[gl_selc].cantidad[index]:0;
	var r_margen = gl_list[gl_selc].margen[index]?gl_list[gl_selc].margen[index]:0;
	var r_precio = gl_list[gl_selc].precio[index]?gl_list[gl_selc].precio[index]:0;

	var nombre = document.getElementById("input10");
	var cantidad = document.getElementById("input20");
	var margen = document.getElementById("input11");
	var precio = document.getElementById("input21");
	var pdol = document.getElementById("input12");
	var pbsf = document.getElementById("input22");

	var margen_mask = document.getElementById("text_mask11");
	var precio_mask = document.getElementById("text_mask21");

	nombre.value = r_nombre.toLowerCase();
	cantidad.value = r_cantidad;
	margen.value = r_margen;
	margen_mask.value = get_mask_simple(r_margen,"%");
	precio.value = r_precio;
	precio_mask.value = get_mask(r_precio,"$");

	get_celda_value_test();
}

function buscar_lista(text) {
	var result = true;
	for (var j = 0; j < table_fila; j++) {
		var div = document.getElementById("divlp"+j);
		//Obtine todas las columnas de nombres
		var r_nombre = gl_list[gl_selc].nombre[j]?gl_list[gl_selc].nombre[j]:"";
		var tx = r_nombre.toLowerCase();
		result = tx.includes(text.toLowerCase());
		//console.log("a:"+tx+"b:"+text.toLowerCase());
		if(!result){
			div.setAttribute("class","element_style_hidden");
		}
		else{
			div.setAttribute("class","div_list_style");
		}
		//gloval_test += "result:"+result+ " ";
	}
}

function mostrar_input() {
	var mask = document.activeElement;
	mask.setAttribute("placeholder", "");
	var id_name = mask.id;
	var id_input = id_name.replace("text_mask", "input"); //remplaza  palabaras en cadenas de texto

	var input = document.getElementById(id_input);
	//var fila = document.getElementById("fila"+id_a);
	//var celda = document.getElementById("celd"+id_b);
	//var input = document.getElementById("input"+id_c);
	//var mask = document.getElementById("text_mask"+id_d);

	if(input && id_name.includes("text_mask")){
		input.setAttribute("class","input_style_visible");
		mask.setAttribute("disabled", "");
		input.focus();
		if(current_element == input)
			current_element = null;

		else
			current_element = input;
	}
	return null
}

function ocultar_input()
{
	var current_input = document.activeElement;
	var current_id_name = current_input.id;
	var input_old = current_element;

	el_selec(current_id_name);
	if(input_old){
		var id_name_old = input_old.id;
		var id_mask_old = id_name_old.replace("input", "text_mask"); //remplaza  palabaras en cadenas de texto
		var mask_old = document.getElementById(id_mask_old);
		if(mask_old && id_name_old.includes("input")){
			input_old.setAttribute("class","input_style_hidden");
			mask_old.setAttribute("placeholder", "Ingrese Valor");
			mask_old.disabled=false;
			//add_message(""+id_name_old+"  "+current_id_name+"")
			if(id_name_old != current_id_name)
				current_element = null;
		}
	}
}
function get_celda_value_test(){

	if(gl_current_selec != null){
		var nombre = document.getElementById("input10");
		var cantidad = document.getElementById("input20");
		var margen = document.getElementById("input11");
		var precio = document.getElementById("input21");
		var pdol = document.getElementById("input12");
		var pbsf = document.getElementById("input22");

		var margen_mask = document.getElementById("text_mask11");
		var precio_mask = document.getElementById("text_mask21");

		var unimargen = margen.value;
		var celd_precio = precio.value;

		margen_mask.value = get_mask_simple(unimargen,"%");
		precio_mask.value = get_mask(celd_precio,"$");

		var gen_margen = document.getElementById("input04").value;

		var dolar = calc_dolarporunidad(gen_margen, unimargen, celd_precio).toFixed(2);
		pdol.value = get_mask(dolar,"$");

		var gen_bsf = document.getElementById("input02").value;
		var calc = calc_bolivarprecio(gen_bsf, dolar).toFixed(2);

		pbsf.value = get_mask(calc,"BsF");

		var sect_div = document.getElementById("divlp"+gl_current_selec);
		var values_tx = nombre.value+" Cantidad ("+cantidad.value+") Margen c/u ("+margen_mask.value+") Entrada c/u ("+precio_mask.value+")";
		sect_div.innerHTML = "<button type='button' onclick='button_selec_product("+gl_current_selec+");'>Seleccionar</button> "+values_tx;

		var opt_list = document.getElementById("optlist"+gl_current_selec);
		opt_list.value = nombre.value;

	}

}
function update_celdas_generales(){

	var celd_bolivares = document.getElementById("input02");

	var celd_bolivares_mask = document.getElementById("text_mask02");
	var numer = celd_bolivares.value;

	celd_bolivares_mask.value = get_mask(numer,"BsF");

	var rv_dolar = document.getElementById("dolar_rv");
	rv_dolar.value = get_mask(numer,"BsF");

	var celd_margen = document.getElementById("input04");
	var celd_margen_mask = document.getElementById("text_mask04");
	numer = celd_margen.value;

	celd_margen_mask.value = get_mask_simple(numer,"%");

	get_celda_value_test();
}

function remove_product(){
	if(gl_current_selec != null){
		
		var check = document.getElementById("listp_check");
		if(check.checked){
			gl_list[gl_selc].nombre.splice(gl_current_selec, 1);
			gl_list[gl_selc].cantidad.splice(gl_current_selec, 1);
			gl_list[gl_selc].margen.splice(gl_current_selec, 1);
			gl_list[gl_selc].precio.splice(gl_current_selec, 1);
			gl_list[gl_selc].listatamaño--;
			table_fila = gl_list[gl_selc].listatamaño;
			var opt = 1;
			agregarobjeto(gl_list[gl_selc], gl_selc, opt);
			crear_lista_productos();

			gl_current_selec = null;
			create_table(table_fila,table_col);
			var input_buscar = document.getElementById("buscar");
			buscar_lista(input_buscar.value);
		}
		else return alert("Primero Marque la casilla para confirmar!.");
	}
}
