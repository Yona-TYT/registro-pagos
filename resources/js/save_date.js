var bd;
function set_basededatos(name)
{
	var solicitud = indexedDB.open(name, 1);
	solicitud.addEventListener("error", mostrarerror);
	solicitud.addEventListener("success", comenzar);
	solicitud.addEventListener("upgradeneeded", crearbd);
}

function mostrarerror(evento) {
	alert("Error: tyt tyt " + evento.code + " " + evento.message);
}
function comenzar(evento) {
	bd = evento.target.result;
	var clave = 0;					//Siempre sera 0
	mostrar_general(clave);			//Se cargan los datos generales guardados
}

//Se crean todos los almacenes
function crearbd(evento) {
	var basededatos = evento.target.result;

	//Guarda los datos generales
	var alma_general = basededatos.createObjectStore("general_datos", {keyPath:"id", autoIncrement: true});
	alma_general.createIndex("buscarnombre", "nombre", {unique: true});

	//Guarda los datos de la Cuenta
	var alma_depositos = basededatos.createObjectStore("cuenta_deposito", {keyPath:"id", autoIncrement: true});
	alma_depositos.createIndex("buscarnombre", "nombre", {unique: true});

	//Guarda los datos de cada Cliente
	var alma_clientes = basededatos.createObjectStore("cuenta_clientes", {keyPath:"id", autoIncrement: true});
	alma_clientes.createIndex("buscarnombre", "nombre", {unique: true});

}

//Guarda los datos generales
function agregar_gene_datos(datos) {
	var transaccion = bd.transaction(["general_datos"], "readwrite");
	var almacen = transaccion.objectStore("general_datos");
	var solicitud = almacen.put({id: datos.clave, datos_gene: datos});
}

//Guarda los datos de la Cuenta
function agregar_cuenta(datos,calve) {
	var transaccion = bd.transaction(["cuenta_deposito"], "readwrite");
	var almacen = transaccion.objectStore("cuenta_deposito");
	var solicitud = almacen.put({id: calve, rg_cuenta: datos});
}

//Guarda los datos de los Clientes
function agregar_cliente(datos,clave) {
	var transaccion = bd.transaction(["cuenta_clientes"], "readwrite");
	var almacen = transaccion.objectStore("cuenta_clientes");
	var solicitud = almacen.put({id: clave, rg_cliente: datos});
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

//Manejo de datos generales -----------------------------------------
function mostrar_general(clave) {
	var transaccion = bd.transaction(["general_datos"]);
	var almacen = transaccion.objectStore("general_datos");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_general);
	
}

function obtener_general(evento) {
	var resultado = evento.target.result;
	if(resultado){
		gl_general = resultado.datos_gene;

		//----------------------------------------------
		var gen_bs = document.getElementById("input_gnbs");
		var mask_bs = document.getElementById("text_mask_gnbs");
		var genbs_cc = document.getElementById("input_gnbs_cc");

		var vl_bs = gl_general.gen_bs;
		gen_bs.value = vl_bs;

		var vl_mask = get_mask(vl_bs,"Bs");
		mask_bs.value = vl_mask;
		genbs_cc.value = vl_mask;
		//----------------------------------------------

		var hoy = new Date();
		var curr_fecha = hoy.getDate()+ "-" + ( hoy.getMonth() + 1 ) + "-" + hoy.getFullYear();

		var index = gl_general.index;
		var fecha = gl_general.fecha;

		if(!fecha){
			gl_general.fecha = curr_fecha;
			gl_general.fechalist[gl_general.index] = "Vacio";
		}
		else if(curr_fecha != fecha){
			gl_general.fecha = curr_fecha;
		}
		mostrar_cuentas(gl_general.cu_save_id);
		mostrar_clientes(gl_general.cl_save_id);
		crear_datalist_cc();
	}
}
//----------------------------------------------------------------------

//Manejo de datos para las cuentas-----------------------------------------
function mostrar_cuentas(clave) {
	var transaccion = bd.transaction(["cuenta_deposito"]);
	var almacen = transaccion.objectStore("cuenta_deposito");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_cuentas);
}

function obtener_cuentas(evento) {
	gl_cuenta = new reg_cuenta();
	var resultado = evento.target.result;
	if(resultado){
		gl_cuenta = resultado.rg_cuenta;
		start_inputs_pagos();
	}
}
//----------------------------------------------------------------------

//Manejo de datos para los Clientes-----------------------------------------
function mostrar_clientes(clave) {
	var transaccion = bd.transaction(["cuenta_clientes"]);
	var almacen = transaccion.objectStore("cuenta_clientes");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_clientes);
}

function obtener_clientes(evento) {
	gl_cliente = new reg_cliente();
	var resultado = evento.target.result;
	if(resultado){
		gl_cliente = resultado.rg_cliente;
	}
	mostrar_detalles_cl();
	crear_datalist_cl();
}
//----------------------------------------------------------------------

// Elimina los datos de los almacenes ----------------------------------
function remove_general(clave) {
	var transaccion = bd.transaction(["general_datos"], "readwrite");
	var almacen = transaccion.objectStore("general_datos");
	var solicitud = almacen.delete(clave);
}

function remove_cuenta(clave) {
	var transaccion = bd.transaction(["cuenta_deposito"], "readwrite");
	var almacen = transaccion.objectStore("cuenta_deposito");
	var solicitud = almacen.delete(clave);
}

function remove_cliente(clave) {
	var transaccion = bd.transaction(["cuenta_clientes"], "readwrite");
	var almacen = transaccion.objectStore("cuenta_clientes");
	var solicitud = almacen.delete(clave);
}

//--------------------------------------------------------------------------

//Manejo de datos desde el selector de fechas -----------------------------------------
function mostrar_selec(clave) {
	var transaccion = bd.transaction(["ventas_saves"]);
	var almacen = transaccion.objectStore("ventas_saves");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_selec);
	
}
function obtener_selec(evento) {
	var resultado = evento.target.result;
	gl_hist_save = new all_ventas();

	console.log(gl_hist_date.save_id);	
	if(resultado){
		//var id = resultado.id;
		gl_hist_save = resultado.rventas;
		var nr = gl_hist_save.index;
		for (var j = nr-1;  j >= 0; j--) {
			crear_historial(j);
		}		
	}
		//console.log(""+resultado.id+" fech index");
}
//---------------------------------------------------------------------------------------


//Manejo de datos para el control del historial ------------------------------
function mostrar_hist_date(clave) {
	var transaccion = bd.transaction(["history_data"]);
	var almacen = transaccion.objectStore("history_data");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_hist_date);
	
}

function obtener_hist_date(evento) {
	var resultado = evento.target.result;

	if(resultado){
		gl_hist_date = resultado.data_his;
		mostrar_ventas(gl_hist_date.save_id);
	}
	preloder_selec_list("selectlistaname");
}
//----------------------------------------------------------------------

//Datos generales
function general_datos() {
	this.clave = 0;						//Clave para guardar/cargar el registro
	this.cu_save_id = 0;				//Clave clave mayor para el registro cuentas
	this.cl_save_id = 0;				//Clave clave mayor para el registro clientes

	//Gurda valores de los inputs
	this.gen_bs = 0;

	//Guarda estado temporal de valores de cuenta
	this.temp_monto_dol_cc = 0;
	this.temp_monto_bs_cc = 0;

	//Guarda estado temporal de valores del cliente
	this.temp_selec = 0;
	this.temp_nombre = "";
	this.temp_monto_dol = 0;
	this.temp_monto_bs = 0;
	this.temp_monto_pagado = 0;

	//Guarda el estado del selector
	this.sel_moneda = 0;

	//Se registran las fechas
	this.index = 0;						//Index actual (Va incrementando por operacion, regresa a 0 por dia)
	this.fecha = null;					//Fecha actual
	this.fechalist = new Array(); 		//Lista de fechas por di

	this.cuentlist = new Array(); 		//Lista de cuentas
}

//Datos de la cuenta
function reg_cuenta() {
	this.clave = 0;						//Clave para guardar/cargar el registro

	this.nombre = null;					//Nombre de propietario
	this.desc = null;					//Texto descritivo
	this.monto_dol = 0;					//Monto en dolares
	this.monto_bs = 0;					//Monto en bs
	this.monto_pagado = 0;				//Monto pagado por todos los Clientes
	this.detalles = null;				//Detalles del registro

	this.fecha = null;
	this.hora = null;
	this.estado = null;
}

//Datos de cada cliente
function reg_cliente() {
	this.clave = 0;						//Clave para guardar/cargar el registro
	this.indx_a = 0;					//index maximo para los arrays
	this.indx_b = new Array();					//index maximo para los arrays

	this.cliente = new Array();			//Nombre de cada Cliente
	this.monto_totl = new Array();		//Monoto total de cada cliente

	this.actual_bs = new Array();		//Precio del dolara al momento de registrar
	this.desc = new Array();			//Texto descritivo
	this.monto_dol = new Array();		//Monto en dolares
	this.monto_bs = new Array();		//Monto en bs
	this.detalles = new Array();		//Detalles del registro

	this.fecha = new Array();
	this.hora = new Array();
	this.estado = new Array();
}


