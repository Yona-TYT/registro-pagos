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
	crear_datalist_cl();
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
	
	if (gcl_j != null) return alert("Procesando datos...");

	var temp_cliente = new reg_cliente();

	gl_cuenta.monto_pagado -= gl_cliente.monto_totl[index];

	temp_cliente.indx_a = gl_cliente.indx_a;

	temp_cliente.start = gl_cliente.start;					//Para saber si ha sido guardada o no en el almacen
	temp_cliente.clave = gl_cliente.clave;	

	var des = 0;
	for (var j = 0; j < gl_cliente.indx_a; j++) {

		if(j == index) {
			des = 1;
			continue;
		}
		temp_cliente.indx_b[j-des] = gl_cliente.indx_b[j];
		temp_cliente.monto_totl[j-des] = gl_cliente.monto_totl[j];
		temp_cliente.cliente[j-des] = gl_cliente.cliente[j];

		//Array dobles -------------------------
		temp_cliente.desc[j-des] = gl_cliente.desc[j];
		temp_cliente.actual_bs[j-des] = gl_cliente.actual_bs[j];
		temp_cliente.monto_dol[j-des] = gl_cliente.monto_dol[j];
		temp_cliente.monto_bs[j-des] = gl_cliente.monto_bs[j];
		temp_cliente.hora[j-des] = gl_cliente.hora[j];
		temp_cliente.fecha[j-des] = gl_cliente.fecha[j];
		//---------------------------------------
	}

	temp_cliente.indx_a--;
 	agregar_cliente(temp_cliente, gl_cuenta.clave);				//Se guardan la informacion de Clientes
	gl_cuenta.hash = null;
 	agregar_cuenta(gl_cuenta, gl_cuenta.clave);					//Se guardan la informacion de Cuenta



	gcl_j = index;
	//console.log(" Test index: "+index );
	cont_gcl = setInterval(retardo_capt_gc, 10);

}

//cont_gcl = setInterval(retardo_capt_gc, 1000);

//contador para esperar mientras los valores se cargan
var seg_gcl = 0;
var cont_gcl;		// = setInterval(cambio_valor, 1000);
var gcl_j = null;
var gcl_i = 0;
function retardo_capt_gc(start = false){
	if(seg_gcl>0 || start){ 
		if(gcl_j < gl_cliente.indx_a){
			if (gcl_i < gl_cliente.indx_b[gcl_j+1]+1){
				seg_gcl=0;
				mostrar_capt_gcl(""+gl_cuenta.clave+""+(gcl_j+1)+""+gcl_i+"", ""+gl_cuenta.clave+""+(gcl_j)+""+gcl_i+"");
				gcl_i++;
			}
			else {
				gcl_i = 0;
				gcl_j++;
			}
		}
		else{
			clearInterval(cont_gcl);
			buscar_lista_cuenta();
			alert("El cliente ha sido borrado!.");

			//Se reinician los valores
			seg_gcl=0;
			gcl_i = 0;
			gcl_j = null;
		}
	}
	seg_gcl++;
}

//Manejo de Captures de pago -----------------------------------------
function mostrar_capt_gcl(clave,clave_nuev) {
	//console.log(""+clave+"");
	var transaccion = bd.transaction(["capture_clientes"]);
	var almacen = transaccion.objectStore("capture_clientes");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", function(){obtener_capt_gcl(event, clave_nuev);});
}

function obtener_capt_gcl(evento, clave_nuev) {
	var resultado = evento.target.result;
	if(resultado){
		var index =	resultado.id;
		var capt = resultado.rg_capture;

		//console.log(" Test gcl "+index +" New ID: "+clave_nuev );
		agregar_capture(capt,clave_nuev);

	}
}
//----------------------------------------------------------------------



