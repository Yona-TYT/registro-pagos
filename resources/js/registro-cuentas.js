var gl_cuenta = new reg_cuenta();
var gl_opt_moneda = 0;


function cuentas_main(){
	selec_moneda_rc();
}

function selec_moneda_rc(){
	var selec_moneda = document.getElementById("selc_moneda_cc");
	var opt = selec_moneda.options[selec_moneda.selectedIndex];
	var selec_mon_cl = document.getElementById("selc_moneda_cl");
	selec_mon_cl.options[selec_moneda.selectedIndex].selected=true;
	gl_opt_moneda = opt.value;

	get_input_value_rc();
}

function save_inputs_cuentas(){
	var gen_bs = document.getElementById("input_gnbs_cc");
	var mask = document.getElementById("text_mask_gnbs_cc");

	var genbs_rp = document.getElementById("input_gnbs");
	var mask_rp = document.getElementById("text_mask_gnbs");

	var vl_bs = gen_bs.value;
	genbs_rp = vl_bs;

	gl_general.gen_bs = parseFloat(vl_bs)? parseFloat(vl_bs).toFixed(2) : parseFloat(0).toFixed(2);
	agregar_gene_datos(gl_general);								//Se guardan los datos Generales

	var vl_mask = get_mask(vl_bs,"Bs");
	mask.value = vl_mask;
	mask_rp.value = vl_mask;
}

function get_input_value_rc(){
	var gen_bs = gl_general.gen_bs;
	var monto = document.getElementById("inputcc12");
	var mask = document.getElementById("text_maskcc12");

	var mont_dol = null;
	var mont_bs = null;
	//Dolar
	if(gl_opt_moneda == 0){
		mont_dol = parseFloat(monto.value)?parseFloat(monto.value):0;
		mont_bs = calc_dolar_a_bs(mont_dol, gen_bs);

		gl_general.temp_monto_dol_cc = mont_dol;					//Guarda el monto en dolares
		gl_general.temp_monto_bs_cc = mont_bs;						//Guarda el monto en bolivares

		mask.value = get_mask(mont_dol,"$");
	}
	//Bolivares
	else if(gl_opt_moneda == 1){
		mont_bs = parseFloat(monto.value)?parseFloat(monto.value):0;
		mont_dol = calc_bs_a_dolar(mont_bs, gen_bs);

		gl_general.temp_monto_dol_cc = mont_dol;					//Guarda el monto en dolares
		gl_general.temp_monto_bs_cc = mont_bs;						//Guarda el monto en bolivares

		mask.value = get_mask(mont_bs,"Bs");
	}

	gl_general.temp_selec = gl_opt_moneda;
	//console.log(""+mont_dol+" "+mont_bs+" "+gl_general.temp_monto_dol_cc+" "+gl_general.temp_monto_bs_cc);
}

function guardar_cuenta(){
	var nombre = document.getElementById("inputcc10");
	var desc = document.getElementById("inputcc11");
	var monto = document.getElementById("inputcc12");
	var mask = document.getElementById("text_maskcc12");

	var monto_a = gl_general.temp_monto_dol_cc;
	var monto_b = gl_general.temp_monto_bs_cc;

	var gen_bs = gl_general.gen_bs;

	if(gen_bs == 0) return alert("El valor de Precio Dolar no puede ser cero!.")

	//console.log(""+monto_a+" "+monto_b+" "+nombre.value+" "+desc.value);
	if(monto_a != "" && monto_b != "" && nombre.value != "" && desc.value != ""){

		var hoy = new Date();
		var curr_hora =  hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
		var curr_fecha = hoy.getDate()+ "-" + ( hoy.getMonth() + 1 ) + "-" + hoy.getFullYear();

		gl_cuenta.nombre = nombre.value;
		gl_cuenta.desc = desc.value;

		gl_cuenta.monto_dol = monto_a.toFixed(2);
		gl_cuenta.monto_bs = monto_b.toFixed(2);
		gl_cuenta.monto_pagado = parseFloat(0).toFixed(2);								

		gl_cuenta.fecha = curr_fecha;
		gl_cuenta.hora = curr_hora;
		gl_cuenta.estado = "Pagos Pendientes";

		gl_cuenta.clave = gl_general.cu_save_id;
		agregar_cuenta(gl_cuenta, gl_general.cu_save_id);				//Se guardan la informacion de Cuenta

		gl_general.cuentlist[gl_general.cu_save_id] = gl_cuenta.nombre + " " + gl_cuenta.desc;	//Titulo para la cuenta
		gl_general.cu_save_id++;										//Se incrementa para la siguiente cuenta
		agregar_gene_datos(gl_general);									//Se guardan los datos Generales

		crear_datalist_cc();

		nombre.value = "";
		desc.value = "";
		monto.value = "";
		mask.value = "";

	}
	else alert("No se permiten valores Vacios!.");
}

function crear_datalist_cc() {
	var data_lista = document.getElementById("list_datacc");
	data_lista.innerHTML = "";
	console.log("Finished:"+gl_general.cu_save_id)
	for (var j = 0; j <gl_general.cu_save_id; j++) {
		data_lista.innerHTML += "<option value='"+gl_general.cuentlist[j]+"'>";
	}
}

var gl_venta_rv = new  venta_actual();
var nw_index = new Array();
var nw_clave = new Array();
var nw_cantidad = new Array();
var nw_desc = new Array();
function button_reg_venta(nr) {

	if(gl_lista_rv.index[nr] != null){
		var select = document.getElementById("selcregvent");
		var sel_nombre = select.options[select.selectedIndex].innerHTML;

		var clave = gl_lista_rv.clave[nr];
//	console.log("Finished:"+clave +"  "+gl_list[gl_selc].clave);

		var index = gl_lista_rv.index[nr];
		var nombre = gl_lista_rv.nombre[nr];
		var cantidad = gl_lista_rv.cantidad[nr];
		var precio = gl_lista_rv.precio[nr];
		var margen = gl_lista_rv.margen[nr];
		var total = gl_lista_rv.totalvent[nr];
		var genmargen = gl_listname.genmargen;
		var genprecbs = gl_listname.genprecio;

		if(clave == gl_selc){
			//Para guardar datos de producto
			nw_index[gl_venta_rv.count] = index;
			nw_clave[gl_venta_rv.count] = clave;
			nw_cantidad[gl_venta_rv.count] = cantidad;
			nw_desc[gl_venta_rv.count] = parseFloat(total.value);

			gl_venta_rv.listnomb[gl_venta_rv.count] = sel_nombre;
			gl_venta_rv.clave[gl_venta_rv.count] = clave;
			gl_venta_rv.index[gl_venta_rv.count] = index;
			gl_venta_rv.nombre[gl_venta_rv.count] = nombre;
			gl_venta_rv.totalvent[gl_venta_rv.count] = parseFloat(total.value);

			var calc_precio = calc_dolarporunidad(genmargen, margen, precio);
			var calc_precbs = calc_bolivarprecio(genprecbs, calc_precio);

			gl_venta_rv.prdol[gl_venta_rv.count] = calc_precio;
			gl_venta_rv.prbsf[gl_venta_rv.count] = calc_precbs;
		}

		var comp = comparar_rv(index);

		if(comp){
			gl_venta_rv.count++;
			mostrar_lista_rv();
		}
		else {
			alert("Producto duplicado, use el boton [Quitar].");
		}
	}
}

function comparar_rv(index) {
	var nr = gl_venta_rv.count;
	for (var i = 0; i <nr; i++) {
		var clave = gl_venta_rv.clave[i];
		if(clave==gl_selc){
			var new_index = gl_venta_rv.index[i];
			if(new_index == index){
				return false;
				break;
			}
		}
	}
	return true;
}

function mostrar_lista_rv() {

	var secc_reg = document.getElementById("registroactual");
	var total_dol = document.getElementById("rv_totaldol");
	var total_bsf = document.getElementById("rv_totalbsf");
	var cl_nombre = document.getElementById("rv_clnombre");

	secc_reg.innerHTML = "";
	var venta_tx = "";
	var hist_tx = "";
	var t_dol = 0;
	var t_bsf = 0;

	var nr = gl_venta_rv.count;
	for (var i = 0; i <nr; i++) {
		var sel_nombre = gl_venta_rv.listnomb[i];
		var index = gl_venta_rv.index[i];
		var nombre = gl_venta_rv.nombre[i];
		//var precio = gl_venta_rv.precio[i];
		//var margen = gl_venta_rv.margen[i];
		var total = gl_venta_rv.totalvent[i];
		var prdol = gl_venta_rv.prdol[i];
		var prbsf = gl_venta_rv.prbsf[i];

		var calc_precio = prdol*total;
		var calc_precbs = prbsf*total;

		t_dol += calc_precio;
		t_bsf += calc_precbs;

		//console.log(prdol+"  "+ total);
		var butt = "<button type='button' onclick='button_borr_venta("+i+");'>Quitar</button>";
		var detalles = "["+total+"] "+nombre+" c/u: "+get_mask(prdol,"$")+" / "+get_mask(prbsf,"Bsf ")+" <div class='total_style'>Total: "+get_mask(calc_precio,"$")+" / "+get_mask(calc_precbs,"Bsf &nbsp;</div>");
		venta_tx= "<div class='div_list_style' id='divrv"+i+"'>" + butt + detalles + "</div>";

		secc_reg.innerHTML += venta_tx;
		hist_tx += "<div class='div_his_list_style'>"+detalles+"</div>";
	}

	total_dol.value = get_mask(t_dol,"$");
	total_bsf.value = get_mask(t_bsf,"Bsf");

	gl_lista_ventas.detalles[gl_lista_ventas.index] = hist_tx;
	gl_lista_ventas.totaldol[gl_lista_ventas.index] = t_dol;
	gl_lista_ventas.totalbsf[gl_lista_ventas.index] = t_bsf;

	gl_lista_ventas.pdtindex[gl_lista_ventas.index] = nw_index;
	gl_lista_ventas.pdtclave[gl_lista_ventas.index] = nw_clave;
	gl_lista_ventas.pdtcantidad[gl_lista_ventas.index] = nw_cantidad;
	gl_lista_ventas.pdtdesc[gl_lista_ventas.index] = nw_desc;

}

function button_borr_venta(index){
	
	var clave = gl_venta_rv.clave[index];
	//if(clave==gl_list[gl_selc].clave){
		document.getElementById("divrv"+index).remove();
		gl_venta_rv.listnomb.splice(index, 1);
		gl_venta_rv.clave.splice(index, 1);
		gl_venta_rv.index.splice(index, 1);
		gl_venta_rv.nombre.splice(index, 1);
		gl_venta_rv.prdol.splice(index, 1);
		gl_venta_rv.prbsf.splice(index, 1);
		gl_venta_rv.totalvent.splice(index, 1);

		gl_venta_rv.count--;
		mostrar_lista_rv()
	//}
}

function reset_inputs_rv() {
	gl_lista_rv = new lista_actual_rv();
	if(gl_mobil){
		var input_nomb = document.getElementById("rvinput"+1+""+0);
		var input_cant = document.getElementById("rvinput"+1+""+1);
		var input_pdol = document.getElementById("rvinput"+1+""+2);
		var input_pdbs = document.getElementById("rvinput"+1+""+3);
		var input_tvent = document.getElementById("rvinput"+1+""+4);


		input_nomb.value = "";
		input_cant.value = "";
		input_pdol.value = "";
		input_pdbs.value = "";
		input_tvent.value = "1";
	}
	else {
		var siz_fil = 5;
		for (var i = 1; i < siz_fil; i++) {
			var input_nomb = document.getElementById("rvinput"+i+""+0);
			var input_cant = document.getElementById("rvinput"+i+""+1);
			var input_pdol = document.getElementById("rvinput"+i+""+2);
			var input_pdbs = document.getElementById("rvinput"+i+""+3);
			var input_tvent = document.getElementById("rvinput"+i+""+4);


			input_nomb.value = "";
			input_cant.value = "";
			input_pdol.value = "";
			input_pdbs.value = "";
			input_tvent.value = "1";

			//gloval_test += "result:"+result+ " ";
		}
	}
}

function guardar_venta() {

	var cl_nombre = document.getElementById("rv_clnombre");
	if(gl_venta_rv.count>0){

		//console.log("Finished:" + (cl_nombre.value == ""?"N/A": cl_nombre.value));

		var input_pend = document.getElementById("pend_mark");
		if(input_pend.checked)
			gl_lista_ventas.estado[gl_lista_ventas.index] = "Pendiente";
		else
			gl_lista_ventas.estado[gl_lista_ventas.index] = "Aprobada";

		input_pend.checked = false;

		gl_lista_ventas.cliente[gl_lista_ventas.index] = (cl_nombre.value == ""?"N/A": cl_nombre.value);

		var tx_cl = (cl_nombre.value == ""?"N/A": cl_nombre.value);
		cliente_check(tx_cl.toLowerCase());

		var hoy = new Date();

		//Restaura los datos de venta y arreglos
		gl_venta_rv = new  venta_actual();
		nw_index = new Array();
		nw_clave = new Array();
		nw_cantidad = new Array();
		nw_desc = new Array();

		var secc_reg = document.getElementById("registroactual");

		var index = gl_hist_date.index;
		var indexfec = gl_lista_ventas.indexfec;
		var fechalist = gl_lista_ventas.fechalist[indexfec];
		
		var prdol = gl_lista_ventas.totaldol[index];
		var prbsf = gl_lista_ventas.totalbsf[index];



		var hoy = new Date();
		var hora =  hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
		var curr_fecha = hoy.getDate()+ "-" + ( hoy.getMonth() + 1 ) + "-" + hoy.getFullYear();

		var fecha = gl_hist_date.fecha;

		if(fecha != curr_fecha) {
			if(!fecha) {
				gl_hist_date.fecha = curr_fecha;
				gl_hist_date.fechalist[gl_hist_date.index] = curr_fecha;
			}
			else {
				gl_hist_date.index = 0;
				gl_hist_date.save_id++;
				gl_hist_date.fecha = curr_fecha;
				gl_hist_date.fechalist[gl_hist_date.save_id] = curr_fecha;
			}
		}

		gl_lista_ventas.hora[index] = hora;
		gl_lista_ventas.fecha[index] = curr_fecha;


		descontar_pdt(index);


		//Cambia a la siguiente venta
		gl_hist_date.index++;
		gl_lista_ventas.index = gl_hist_date.index;
		//----------------------------------------

		document.getElementById("rv_totaldol").value = 0;
		document.getElementById("rv_totalbsf").value = 0;
		cl_nombre.value = "";
		secc_reg.innerHTML = "";

		agregarnombres(gl_listname);			//Datos de lista de clientes
		agregar_his_data(gl_hist_date);			//Datos control de historial
		agregarventas(gl_lista_ventas);			//Datos De la venta
		mostrar_ventas(gl_hist_date.save_id);	//Muestra la venta en el historial
	}
	else {
		alert("La lista esta vacia!.");
	}
}

function descontar_pdt(lindex) {
	var listindex = gl_lista_ventas.pdtindex[lindex];
	var listclave = gl_lista_ventas.pdtclave[lindex];
	var listcantidad = gl_lista_ventas.pdtcantidad[lindex];
	var listdesc = gl_lista_ventas.pdtdesc[lindex];
	for (var j = 0; j < listindex.length ; j++) {

		var nr_a = listcantidad[j];
		var nr_b = listdesc[j];
		var nw_cant = nr_a - nr_b;

		var index = listindex[j];
		var clave = listclave[j];

		gl_list[clave].cantidad[index] = nw_cant;
		agregarobjeto(gl_list[clave], clave, 1);//1 es para lectura y escritra
	}
	start_one = true;
	mostrar_lista(gl_selc);
}



function lista_actual_rv() {
	this.clave = new Array();
	this.index = new Array();
	this.nombre = new Array();
	this.cantidad = new Array();
	this.precio = new Array();
	this.margen = new Array();
	this.totalvent = new Array();
}

function venta_actual() {
	this.count = 0;
	this.listnomb = new Array();
	this.clave = new Array();
	this.index = new Array();
	this.nombrecl = new Array();
	this.nombre = new Array();
	this.prdol = new Array();
	this.prbsf = new Array();
	this.totalvent = new Array();
}
