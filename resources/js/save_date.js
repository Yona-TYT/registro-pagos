var bd;
function set_basededatos(name)
{
	var solicitud = indexedDB.open(name, 2);
	solicitud.addEventListener("error", mostrarerror);
	solicitud.addEventListener("success", comenzar);
	solicitud.addEventListener("upgradeneeded", crearbd);
}

function mostrarerror(evento) {
	alert("Error:  " + evento.code + " " + evento.message);
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

	//Guarda los Captures de cada pago
	var alma_capture = basededatos.createObjectStore("capture_clientes", {keyPath:"id", autoIncrement: true});
	alma_capture.createIndex("buscarnombre", "nombre", {unique: true});

	if (confirm("Mostrar datos de demostracion?.")) {
		//Iniciar la lectura de archivos de demostracion
		iniciar_demo();
	}
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

//Guarda los Captures de los pagos
function agregar_capture(datos,clave) {
	var transaccion = bd.transaction(["capture_clientes"], "readwrite");
	var almacen = transaccion.objectStore("capture_clientes");
	var solicitud = almacen.put({id: clave, rg_capture: datos});
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

		gl_opt_moneda = gl_general.temp_selec;
		var selec_moneda = document.getElementById("selc_moneda");
		selec_moneda.options[gl_opt_moneda].selected = true;

		//console.log("Claave gn "+gl_general.cu_save_id +" Nr: "+gl_cliente.indx_a)
		//----------------------------------------------
		var gen_bs = document.getElementById("input_gnbs");
		var mask_bs = document.getElementById("text_mask_gnbs");

		var vl_bs = gl_general.gen_bs;
		gen_bs.value = vl_bs;

		var vl_mask = get_mask(vl_bs,"Bs");
		mask_bs.value = vl_mask;
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
	else{
		gl_general.demo =  null;
	}

	if(gl_general.demo ==  null){

		if (confirm("Mostrar datos de demostracion?.") == false) {
			gl_general.demo = false;
			agregar_gene_datos(gl_general);
		}
		else {
			//Iniciar la lectura de archivos de demostracion
			iniciar_demo();
		}
	}
	console.log(""+gl_general.demo+" "+gl_general.fecha);

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
	}
	//console.log("Claave cc "+gl_cuenta.clave +" Nr: "+gl_cliente.indx_a)
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

//Manejo de Captures de pago -----------------------------------------
function mostrar_captures(clave,name) {
	var transaccion = bd.transaction(["capture_clientes"]);
	var almacen = transaccion.objectStore("capture_clientes");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", function(){obtener_captures(event, name);});

}

function obtener_captures(evento, name) {
	var resultado = evento.target.result;
	if(resultado){
		var index =	resultado.id;
		var capt = resultado.rg_capture;
		//gl_general.captid.push(capt);
		//alert("Add");
		var elem = document.getElementById(name);
		//Test
		//div.innerHTML += ""+index+"";
		var img = elem.getElementsByTagName("img")[0];

		//console.log(index);
		img.src = capt;
	}
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
	gl_cliente = new reg_cliente();

	var transaccion = bd.transaction(["cuenta_clientes"], "readwrite");
	var almacen = transaccion.objectStore("cuenta_clientes");
	var solicitud = almacen.delete(clave);
}

function remove_capture(clave) {

	var transaccion = bd.transaction(["capture_clientes"], "readwrite");
	var almacen = transaccion.objectStore("capture_clientes");
	var solicitud = almacen.delete(clave);
}



//--------------------------------------------------------------------------

//Datos generales
function general_datos() {
	this.clave = 0;						//Clave para guardar/cargar el registro
	this.cu_save_id = 0;				//Clave clave mayor para el registro cuentas
	this.cl_save_id = 0;				//Clave clave mayor para el registro clientes
	this.demo = null;

	//Guarda valor de input bolivares
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

	//Gestion de las cuentas
	this.cuentlist = new Array(); 		//Lista de cuentas
	this.etdtlist = new Array(); 		//Marca las cuentas para ser ingnoradas

	//Gestion de los captures
	this.captid = new Array();			//Guarda ids de los captures
	this.etdcapt = new Array();			//Guarda ids de los captures
}

//Datos de la cuenta
function reg_cuenta() {
	this.clave = 0;						//Clave para guardar/cargar el registro
	this.hash = null;					//Hash para identificar la cuenta

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
	this.start = false;					//Para saber si ha sido guardada o no en el almacen
	this.clave = 0;						//Clave para guardar/cargar el registro
	this.indx_a = 0;					//index maximo para los arrays
	this.pagoid = new Array();
	this.indx_b = new Array();			//index maximo para los arrays

	this.fechalist = new Array(); 		//Lista de fechas para el historial

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


