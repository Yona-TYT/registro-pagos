
function menu_main(){

	selec_moneda_chg();

}



function mostrar_lista_menu(){
	var lista = document.getElementById("menulist");
	var class_name = lista.className;
	if(class_name == "element_style_hidden")
		lista.setAttribute("class","");
	else
		lista.setAttribute("class","element_style_hidden");
}

function visible_element(opt) {
	var lista = document.getElementById("menulist");
	lista.setAttribute("class","element_style_hidden");

	//Cambia el titulo del al menu seleccionado
	var title = document.getElementById("div_title");
	var menu_opt = document.getElementById("menuopt"+opt);
	title.innerHTML = menu_opt.innerHTML;

	for(var j = 1; j<6;j++){
		var bot_temp = document.getElementById("butopt"+j);
		bot_temp.setAttribute("class","butt_menu_style");
		
	}

	var bott = document.getElementById("butopt"+opt);
	if(bott)
		bott.setAttribute("class","butt_selec_style");


	var menu_regpg = document.getElementById("seccion1");
	var menu_regcc = document.getElementById("seccion2");
	var menu_hist = document.getElementById("seccion3");
	var menu_gest = document.getElementById("seccion4");
	var menu_impr_expr = document.getElementById("seccion5");

	//Registro de Pagos
	if(opt==1) {
		menu_gest.setAttribute("class","element_style_hidden");
		menu_impr_expr.setAttribute("class","element_style_hidden");
		menu_hist.setAttribute("class","element_style_hidden");
		menu_regcc.setAttribute("class","element_style_hidden");
		menu_regpg.setAttribute("class","label_style");

	}
	//Registro de Cuentas
	if(opt==2) {
		menu_gest.setAttribute("class","element_style_hidden");
		menu_impr_expr.setAttribute("class","element_style_hidden");
		menu_regpg.setAttribute("class","element_style_hidden");
		menu_hist.setAttribute("class","element_style_hidden");
		menu_regcc.setAttribute("class","label_style");
	}
	//Gestion de Datos
	if(opt==3) {
		menu_gest.setAttribute("class","label_style");
		menu_impr_expr.setAttribute("class","element_style_hidden");
		menu_regpg.setAttribute("class","element_style_hidden");
		menu_hist.setAttribute("class","element_style_hidden");
		menu_regcc.setAttribute("class","element_style_hidden");

	}
	//Historial de Pagos
	if(opt==4) {
		menu_gest.setAttribute("class","element_style_hidden");
		menu_impr_expr.setAttribute("class","element_style_hidden");
		menu_regpg.setAttribute("class","element_style_hidden");
		menu_regcc.setAttribute("class","element_style_hidden");
		menu_hist.setAttribute("class","label_style");

	}
	//Importar/Exportar datos
	if(opt==5) {
		menu_gest.setAttribute("class","element_style_hidden");
		menu_regpg.setAttribute("class","element_style_hidden");
		menu_hist.setAttribute("class","element_style_hidden");
		menu_regcc.setAttribute("class","element_style_hidden");
		menu_impr_expr.setAttribute("class","label_style");
	}
}


function selec_moneda_chg(){
	var selec_moneda = document.getElementById("selc_moneda");
	var opt = selec_moneda.options[selec_moneda.selectedIndex];

	gl_opt_moneda = opt.value;

	get_input_value_rc();
	save_inputs_cliente();
}

function save_inputs_chg(){
	var gen_bs = document.getElementById("input_gnbs");
	var mask = document.getElementById("text_mask_gnbs");

	var vl_bs = gen_bs.value;
	gl_general.gen_bs = parseFloat(vl_bs)? parseFloat(vl_bs).toFixed(2) : parseFloat(0).toFixed(2);
	agregar_gene_datos(gl_general);								//Se guardan los datos Generales

	var vl_mask = get_mask(vl_bs,"Bs");
	mask.value = vl_mask;

	save_inputs_cliente();
	start_inputs_pagos();
	get_input_value_rc();
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

function ocultar_input(otros = false)
{
	var current_input = document.activeElement;
	var current_id_name = current_input.id;
	var input_old = current_element;

	var result = true;
	if(!otros){				//Otros inputs distintos a los de ingresar valores numericos
		try {
			el_selec(current_id_name);
		}
		catch (err) {
			result = false;
		}
	}
	
	if(input_old && result){
		var id_name_old = input_old.id;
		var id_mask_old = id_name_old.replace("input", "text_mask"); //remplaza  palabaras en cadenas de texto
		var mask_old = document.getElementById(id_mask_old);
		if(mask_old && id_name_old.includes("input")){
			input_old.setAttribute("class","input_style_hidden");
			mask_old.setAttribute("placeholder", "Ingrese Valor");
			mask_old.disabled=false;
			if(id_name_old != current_id_name)
				current_element = null;
		}
	}
}


function el_selec(id){
	var elm = document.getElementById(id);
	elm.select();
}
function el_unselec(){
	var elm = document.activeElement;
	var sel = elm.blur();

}






