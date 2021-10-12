function mostrar_gcl(index){
	var gen_bs = gl_general.gen_bs;
	var secc_gcl = document.getElementById("gestioncl");
	var cliente = gl_cliente.cliente[index];

	var input_cl =	document.createElement("input");
	input_cl.setAttribute("id", "input_gclx"+index);
	input_cl.setAttribute("type", "text");
	input_cl.setAttribute("class","mask_style");
	input_cl.setAttribute("value",cliente);
	input_cl.style.width = "250px";
	input_cl.setAttribute("onclick","chg_name_vle("+index+");");
	input_cl.setAttribute("onkeyup","chg_name_vle("+index+");");
	input_cl.setAttribute("onchange","chg_name_vle("+index+");");

	var check = "<input class='' type='checkbox' id='check_gclx"+index+"' onchange='ocultar_gclx("+index+")'/>";
	var buttq = "<button type='button' id='butt_gclx"+index+"' class='element_style_hidden' onclick='button_quit_gcl("+index+");'>X</button>";

	var monto_total = gl_cliente.monto_totl[index];
	var monto_tot_bs = calc_dolar_a_bs(monto_total, gen_bs);


	secc_gcl.innerHTML += "<div class='div_list_style' id='divgcl"+index+"'>"+buttq+" Nombre: "+ input_cl.outerHTML + " <div class='total_style'>Total: "+get_mask(monto_total,"$")+" / "+get_mask(monto_tot_bs,"Bs")+"&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp Quitar:"+check+"</div> </div>";
}

function chg_name_vle(index){
	var input = document.getElementById("input_gclx"+index);

	gl_cliente.cliente[index] = input.value;

 	agregar_cliente(gl_cliente, gl_cuenta.clave);				//Se guardan la informacion de Clientes
	mostrar_detalles_cl();
}

function ocultar_gclx(index) {
	var check = document.getElementById("check_gclx"+index).checked;
	var name = check?"butt_style_x":"element_style_hidden";

	var buttq = document.getElementById("butt_gclx"+index);
	buttq.setAttribute("class", name);	
}

function button_quit_gcl(index) {
	var butt = document.activeElement;
	butt.setAttribute("class","element_style_hidden");
	
	//gl_cliente.monto_totl[a] -= gl_cliente.monto_dol[a][b];						//Se resta el monto total

	for (var i = gl_cliente.indx_b[index]; i >=0; i--) {
		gl_cliente.desc[index].splice(i, 1);
		gl_cliente.actual_bs[index].splice(i, 1);
		gl_cliente.monto_dol[index].splice(i, 1);
		gl_cliente.monto_bs[index].splice(i, 1);
		gl_cliente.hora[index].splice(i, 1);
		gl_cliente.fecha[index].splice(i, 1);

		remove_capture(gl_cuenta.clave+""+index+""+i);
	}

	gl_cuenta.monto_pagado -= gl_cliente.monto_totl[index];

	gl_cliente.indx_b.splice(index, 1);
	gl_cliente.monto_totl.splice(index, 1);
	gl_cliente.cliente.splice(index, 1);
	gl_cliente.indx_a--;
 	agregar_cliente(gl_cliente, gl_cuenta.clave);				//Se guardan la informacion de Clientes
	gl_cuenta.hash = null;
 	agregar_cuenta(gl_cuenta, gl_cuenta.clave);					//Se guardan la informacion de Cuenta
	mostrar_detalles_cl();
}
