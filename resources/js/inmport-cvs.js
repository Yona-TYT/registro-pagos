
function importar_main() {
	var files = document.getElementById("archivos");
	files.value = "";
	var type_1 = "text/csv";
	var type_2 = "text/comma-separated-values";
	files.addEventListener("change", function(e) {
		var file_date = e.target.files[0];
		if(file_date){
			var current_type = file_date.type;
			//console.log(current_type);
			if(current_type == type_1 || current_type == type_2){
				Papa.parse(file_date,{
					config: {
						delimiter: "auto"
					},
					complete: function(results) {
						var selec_intg = document.getElementById("selc_integr");
						var opt = selec_intg.options[selec_intg.selectedIndex].value;
						if(opt == 3) {
							save_exp_capt(results.data);
						}
						else {
							save_exp_date(results.data);
							//console.log("Finished:",results.data);
						}
					}
				});
			}
		}
		else alert("No hay archivo seleccionado!.")
	});
}

var gl_save_idlist = new Array();
function save_exp_capt(results) {
    var data = results
    var siz_a = data.length;
	var siz_id = gl_save_idlist.length;


	//console.log("Valor ok");
	if(gl_curr_cuenta){
		for (var j = 0; j < siz_a; j++) {
		    var value = data[j];
			value = value.join("|").split("|");
			var siz_val = value.length;
			var nr = 0;
			for (var i = 0; i < siz_val; i++) {	

				//Inicia lectura de ides
				if(value[i]=="ct_inicio"){
					i++;
					var count = 0;
					for (; value[i]!="ct_fin"; i++) {
						gl_save_idlist[count] = value[i];
						//console.log(""+count+" Valor leido: "+value[i]);
						count++;
					}
					i++;
				}
				//Inicio lectura las imagenes---------------------------------------

				//console.log(""+gl_save_idlist.length+" Valor leido: "+gl_save_idlist[nr]);
				for (; nr<gl_save_idlist.length; i++) {
					//console.log(""+i+" Valor leido: "+gl_save_idlist[nr]);
					agregar_capture(value[i],(""+gl_save_cc.clave +""+ gl_save_idlist[nr]))
					nr++;
				}

			}			
		}
	
	}
	else alert("Primero seleccione una Cuenta!.");
}

var gl_save_cc = new reg_cuenta();
var gl_save_cl = new reg_cliente();

function save_exp_date(results) {
	//Array doble para registrar multiples datos por cliente
	var sav_a = new Array();
	var sav_b = new Array();
	var sav_c = new Array();
	var sav_d = new Array();
	var sav_e = new Array();
	var sav_f = new Array();
    var data = results
    var siz_a = data.length;
	for (var j = 0; j < siz_a; j++) {
        var value = data[j];
      	value.join("|").split("|");
		var siz_val = value.length;
		//console.log("Valor leido: ? "+ siz_val);	
		var i_a = 0;
        for (var i = 0; i < siz_val; i++) {	//Inicio lectura de Cuenta---------------------------------------
			//console.log("Valor leido: "+value[i]);
			if( j == 0 && i == 0){
				if (value[i] != "cc_inicio"){
					return alert("Archivo de respaldo Errado!.")
					break;
				}
			}
			if(value[i]=="cc_inicio"){
				i++;
				var nr = 0;
				for (; value[i] != "cc_fin"; i++) {
					//Se obtienen los datos de Cuenta
					if(nr==0){
						gl_save_cc.clave = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==1){
						gl_save_cc.nombre = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==2){
						gl_save_cc.desc = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==3){
						gl_save_cc.monto_dol = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==4){
						gl_save_cc.monto_bs = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==5){
						gl_save_cc.monto_pagado = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==6){
						gl_save_cc.fecha = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==7){
						gl_save_cc.hora = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					else if(nr==8){
						gl_save_cc.estado = value[i];
						//console.log("Valor leido: "+value[i]);
					}
					nr++;	
				}
			}	//----------------------------------------------------------------------------------------------------
			if(value[i]=="cl_list_inicio"){		//Inicio lectura cliente lista---------------------------------------
				i++;
				var i_b = 0;
				var nr_a = 0;
				for (; value[i] != "cl_list_fin"; i++) {
					//Se obtienen los datos de primer nivel del array
					if(nr_a==0){
						gl_save_cl.indx_a = parseInt(value[i]);
						//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
					}
					if(nr_a==1){
						gl_save_cl.indx_b[i_a] = parseInt(value[i]);
						//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
					}
					if(nr_a==2){	
						gl_save_cl.cliente[i_a] = value[i];
						//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
					}
					if(nr_a==3){
						gl_save_cl.monto_totl[i_a] = parseFloat(value[i]);
						//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
					}
					if(value[i]=="cl_inicio"){	//Inicio lectura del cliente -----------
						i++;
						var nr = 0;
						for (; value[i] != "cl_fin"; i++) {
							//Se obtienen los datos de segundo nivel del array
							if(nr == 0){
								sav_a[i_b] = parseFloat(value[i]);
								gl_save_cl.actual_bs[i_a] = sav_a;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							else if(nr == 1){
								sav_b[i_b] = parseFloat(value[i]);
								gl_save_cl.monto_dol[i_a] = sav_b;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							else if(nr == 2){
								sav_c[i_b] = parseFloat(value[i]);
								gl_save_cl.monto_bs[i_a] = sav_c;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							else if(nr == 3){
								sav_d[i_b] = value[i];
								gl_save_cl.fecha[i_a] = sav_d;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							else if(nr == 4){
								sav_e[i_b] = value[i];
								gl_save_cl.hora[i_a] = sav_e;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							else if(nr == 5){
								sav_f[i_b] = value[i]==""?"n/a":value[i];
								gl_save_cl.desc[i_a] = sav_f;
								//console.log(""+i_a+","+i_b+" Valor leido: "+value[i]);
							}
							nr++;
						}
						i_b++;
					}	//---------------------------------------------------------------
					nr_a++;
				}
				i_a++;
				sav_a = new Array();
				sav_b = new Array();
				sav_c = new Array();
				sav_d = new Array();
				sav_e = new Array();
			}	//------------------------------------------------------------------------------------------------------
			if(value[i]=="SHA-256"){
				i++;
				gl_save_cc.hash = value[i];
				//console.log(" Valor leido: "+value[i]);
			}

		}
	}
	//	console.log(" Valor leido 2: "+gl_save_cl.fecha[0][0]);
}

function butt_integrar() {

	var selec_intg = document.getElementById("selc_integr");
	var opt = selec_intg.options[selec_intg.selectedIndex].value;
	if(opt == 3) {
		//alert("Voy aqui"+gl_save_idlist.length);
		var siz = gl_save_idlist.length;
		if(siz > 0){
		}
		else alert("Debes cargar un respaldo primero, captures: "+ siz);
	}
	else {
		var hash = gl_save_cc.hash;
		//console.log(" Valor leido hash: "+hash);
		//alert("Primero Seleccione un Archivo Valido!. "+hash);
		
		if(hash){
			var nombre = gl_save_cc.nombre;
			var desc = gl_save_cc.desc;
			var titulo = nombre + " " + desc;	//Titulo para la cuenta
			titulo = titulo.toLowerCase();
			var result = false;
			for (var j = 0; j<gl_general.cu_save_id; j++) {
				var save_tx = gl_general.cuentlist[j];
				if (save_tx!="") save_tx = save_tx.toLowerCase();
				else continue;
				result = save_tx.search(new RegExp("(^)" + titulo + "($)"));

				if(result != -1){
					mostrar_inmp_cc(j);
					//console.log(" Valor leido: "+hash);
					break;
				}
			}
			if(result == -1 || result === false) {

				gl_save_cc.clave = gl_general.cu_save_id;
				gl_save_cl.start = true;
				gl_save_cl.clave = gl_general.cu_save_id;
				agregar_cuenta(gl_save_cc, gl_general.cu_save_id);				//Se guardan la informacion de Cuenta
	 			agregar_cliente(gl_save_cl, gl_save_cc.clave);					//Se guardan la informacion de Clientes

				gl_general.cuentlist[gl_general.cu_save_id] = titulo;				//Titulo para la cuenta
				gl_general.etdtlist[gl_general.cu_save_id] = true;
				gl_general.cu_save_id++;											//Se incrementa para la siguiente cuenta
				agregar_gene_datos(gl_general);									//Se guardan los datos Generales

				crear_datalist_cc();
				mostrar_detalles_cl();
				alert("Proceso Completado!.");
			}
		}
		else alert("Primero Seleccione un Archivo Valido!. "+hash);
	}
}


//Manejo de datos para las cuentas-----------------------------------------
function mostrar_inmp_cc(clave) {
	var transaccion = bd.transaction(["cuenta_deposito"]);
	var almacen = transaccion.objectStore("cuenta_deposito");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_inmp_cc);
}

function obtener_inmp_cc(evento) {
	var resultado = evento.target.result;
	if(resultado){
		var cuenta = resultado.rg_cuenta;

		gl_save_cc.clave = cuenta.clave;
		gl_save_cc.monto_dol = cuenta.monto_dol;
		gl_save_cc.monto_bs = cuenta.monto_bs;
		gl_save_cc.monto_pagado = cuenta.monto_pagado;
		gl_save_cc.fecha = cuenta.fecha;
		gl_save_cc.hora = cuenta.hora;
		gl_save_cc.estado = cuenta.estado;

		var selec_intg = document.getElementById("selc_integr");
		var opt = selec_intg.options[selec_intg.selectedIndex].value;

		if(opt == 0){
			if(gl_save_cc.hash != cuenta.hash) {
				mostrar_inmp_cl(cuenta.clave);
			}
			else alert("Estos datos ya estan guardados!.");
		}
		else if(opt == 1){
			if (gl_save_cl.indx_a > 0) gl_save_cl.start = true;
		//console.log(" Valor leido:  "+gl_save_cl.start);	
			agregar_cuenta(gl_save_cc, gl_save_cc.clave);					//Se guardan la informacion de Cuenta
			agregar_cliente(gl_save_cl, gl_save_cc.clave);					//Se guardan la informacion de Clientes

			crear_datalist_cc();
			mostrar_detalles_cl();
			alert("Proceso Completado!.");
		}
		

	}
}
//----------------------------------------------------------------------

//Manejo de datos para los Clientes-----------------------------------------
function mostrar_inmp_cl(clave) {
	var transaccion = bd.transaction(["cuenta_clientes"]);
	var almacen = transaccion.objectStore("cuenta_clientes");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_inmp_cl);
}

function obtener_inmp_cl(evento) {
	var resultado = evento.target.result;
	if(resultado){
		//Array doble para registrar multiples datos por cliente
		var sav_a = new Array();
		var sav_b = new Array();
		var sav_c = new Array();
		var sav_d = new Array();
		var sav_e = new Array();
		var cl = resultado.rg_cliente;

		if (gl_save_cl.indx_a > 0) gl_save_cl.start = true;

		var list = cl.cliente;
		var siz = list.length;

		var tx_b = gl_save_cl.cliente.join(",");
		tx_b = tx_b.replace(/$/, ",");
		var tx_a = "";
		for (var j = 0; j < siz; j++) {
			var nombre = list[j];
			if(tx_b.includes(nombre+",")){
				for (var i = 0; i < gl_save_cl.indx_a; i++) {
					if (nombre == gl_save_cl.cliente[i]){
						//cl.indx_b[j]++;
						for(var nr = 0; nr < gl_save_cl.indx_b[i]+(1); nr++) {
							cl.indx_b[j] ++;
							cl.actual_bs[j][cl.indx_b[j]] = gl_save_cl.actual_bs[i][nr];
							cl.monto_dol[j][cl.indx_b[j]] = gl_save_cl.monto_dol[i][nr];
							cl.monto_bs[j][cl.indx_b[j]] = gl_save_cl.monto_bs[i][nr];
							cl.fecha[j][cl.indx_b[j]] = gl_save_cl.fecha[i][nr];
							cl.hora[j][cl.indx_b[j]] = gl_save_cl.hora[i][nr];
							cl.desc[j][cl.indx_b[j]] = gl_save_cl.desc[i][nr];

							//console.log("j: "+j+" cl.indx_b: "+cl.indx_b[j]+" i: "+i+" nr: "+nr+" Dolar: "+gl_save_cl.monto_dol[i][nr]);	
							cl.monto_totl[j] += gl_save_cl.monto_dol[i][nr];


							//console.log(" Valor leido: "+i+" "+nr+" "+cl.fecha[j][cl.indx_b[j]+nr]);	
						}						
					}
						var sav_a = new Array();
						var sav_b = new Array();
						var sav_c = new Array();
						var sav_d = new Array();
						var sav_e = new Array();
				}
				//console.log(" Valor leido 2: "+nombre);
				tx_b = tx_b.replace(new RegExp("(^|[\,])" + nombre + "([\,]|$)"), "");

				//console.log(" Valor leido: "+list[j]);
				//console.log(" Valor leido: "+tx_b);
			}
		}

		tx_b = tx_b.replace(/^[\,]/, "");
		tx_b = tx_b.replace(/[\,]$/, "");

		var nw_list = tx_b.split(",");

		// Se analiza en busca de nombres de clienbtes nuevos =====================================================================
		var indx_a = siz;
		for (var j = 0; j < nw_list.length; j++) {
			var test_name = nw_list[j];
		//console.log(" Valor leido: "+test_name);
			for (var i = 0; i < gl_save_cl.indx_a; i++) {
				if (test_name == gl_save_cl.cliente[i]){
					cl.indx_b[indx_a] = gl_save_cl.indx_b[i];
					cl.cliente[indx_a] = gl_save_cl.cliente[i];
					cl.actual_bs[indx_a] = gl_save_cl.actual_bs[i];
					cl.monto_dol[indx_a] = gl_save_cl.monto_dol[i];
					cl.monto_bs[indx_a] = gl_save_cl.monto_bs[i];
					cl.fecha[indx_a] = gl_save_cl.fecha[i];
					cl.hora[indx_a] = gl_save_cl.hora[i];
					cl.desc[indx_a] = gl_save_cl.desc[i];

					cl.monto_totl[indx_a] += gl_save_cl.monto_totl[i];

					cl.indx_a++;

					console.log(" Valor Test Name: "+test_name);
				}
			}
		}
		//==============================================================================================================================

		agregar_cuenta(gl_save_cc, gl_save_cc.clave);				//Se guardan la informacion de Cuenta
 		agregar_cliente(cl, gl_save_cc.clave);					//Se guardan la informacion de Clientes
		crear_datalist_cc();
		mostrar_detalles_cl();
		alert("Proceso Completado!.");
	}
}
//----------------------------------------------------------------------

function compare_save_cl(nombre){
	for (var i = 0; i < gl_save_cl.indx_a; i++) {
		if (nombre == gl_save_cl.cliente[i])
			return true;
	}
	return null;
}




