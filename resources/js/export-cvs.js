var gl_captures = new Array();
var gl_capt_id = new Array();

var gl_new_id = new Array();			//Se construye un nuevo array con ids

function export_main() {
	var check = document.getElementById("captcheck");
	check.checked = false;
}


function butt_guardar_datos() {
	var check = document.getElementById("captcheck").checked;
	start_array_capt();
	if(check)
		capt_datos_csv();

	else
		cuent_datos_csv();
}

function capt_datos_csv() {
	var contenido = "",
		d = new Date(),
		blob,
		reader,
		save,
		clicEvent;
	//creamos contenido del archivo
	contenido += gl_captures.join("&") ;		//Se agregan las claves de captures
	
	//creamos el blob
	blob =  new Blob(["\ufeff", contenido], {type: 'text/csv'});
	//creamos el reader
	var reader = new FileReader();
	reader.onload = function (event) {
		//escuchamos su evento load y creamos un enlace en dom
		save = document.createElement('a');
		save.href = event.target.result;
		save.target = '_blank';
		//aquí le damos nombre al archivo
		save.download = "captures" + "_"+ d.getDate() + "_" + (d.getMonth()+1) + "_" + d.getFullYear() + "_" + d.getHours() + d.getMinutes() + d.getSeconds()+".csv";
		try {
			//creamos un evento click
			clicEvent = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
		} catch (e) {
			//si llega aquí es que probablemente implemente la forma antigua de crear un enlace
			clicEvent = document.createEvent("MouseEvent");
			clicEvent.initEvent('click', true, true);
		}
		//disparamos el evento
		save.dispatchEvent(clicEvent);
		//liberamos el objeto window.URL
		(window.URL || window.webkitURL).revokeObjectURL(save.href);
	}
	//leemos como url
	reader.readAsDataURL(blob);

	//Desmarca el checkbox
	var check = document.getElementById("captcheck");
	check.checked = false;

}

function cuent_datos_csv() {

	var cuenta = crear_array_cc();
	var cliente = crear_array_cl();
	if(!gl_curr_cuenta) return alert("Debes Seleccionar una Cuenta!.");
	//comprobamos compatibilidad
	if(window.Blob && (window.URL || window.webkitURL)){
		var contenido = "";
		contenido += cuenta.join("|") + "\n";			//Se agregan datos de cuenta
		contenido += cliente.join("|") + "\n";			//Se agregan datos de cliente

		//Esto genera los hast
		(async function() {
			const hash = await sha256(contenido);
		}());
		sha256(contenido).then(hash => start_save(hash, cuenta, cliente));

	}
	else {
		//el navegador no admite esta opción
		alert("Su navegador no permite esta acción");
	}
}


function start_save(hash, cuenta, cliente) {
	//console.log(hash);
	var contenido = "",
		d = new Date(),
		blob,
		reader,
		save,
		clicEvent;
	//creamos contenido del archivo

	contenido += cuenta.join("|") + "\n";			//Se agregan datos de cuenta
	contenido += cliente.join("|") + "\n";			//Se agregan datos de cliente
	contenido += "|SHA-256|"+hash+"|";				//Se agrega un hash para los datos
	contenido += gl_capt_id.join("|") + "\n";		//Se agregan las claves de captures
	
	//creamos el blob
	blob =  new Blob(["\ufeff", contenido], {type: 'text/csv'});
	//creamos el reader
	var reader = new FileReader();
	reader.onload = function (event) {
		//escuchamos su evento load y creamos un enlace en dom
		save = document.createElement('a');
		save.href = event.target.result;
		save.target = '_blank';
		//aquí le damos nombre al archivo
		save.download = cuenta[2] + "-respaldo" + "_"+ d.getDate() + "_" + (d.getMonth()+1) + "_" + d.getFullYear() + "_" + d.getHours() + d.getMinutes() + d.getSeconds()+".csv";
		try {
			//creamos un evento click
			clicEvent = new MouseEvent('click', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
		} catch (e) {
			//si llega aquí es que probablemente implemente la forma antigua de crear un enlace
			clicEvent = document.createEvent("MouseEvent");
			clicEvent.initEvent('click', true, true);
		}
		//disparamos el evento
		save.dispatchEvent(clicEvent);
		//liberamos el objeto window.URL
		(window.URL || window.webkitURL).revokeObjectURL(save.href);
	}
	//leemos como url
	reader.readAsDataURL(blob);

	//Desmarca el checkbox
	var check = document.getElementById("captcheck");
	check.checked = false;

}

function crear_array_cc() {

	var nombre = check_text_resv(gl_cuenta.nombre)?gl_cuenta.nombre:"null";
	var desc = check_text_resv(gl_cuenta.desc)?gl_cuenta.desc:"null";
	
	var result = 	[	"cc_inicio",
						gl_cuenta.clave, nombre, desc, 
						gl_cuenta.monto_dol, gl_cuenta.monto_bs,
						gl_cuenta.monto_pagado, gl_cuenta.fecha,
						gl_cuenta.hora, gl_cuenta.estado,
						"cc_fin"
					];
	return result;
}

function crear_array_cl() {
	var result = new Array();

	if(gl_cliente.start){
		for (var j = 0;j < gl_cliente.indx_a; j++) {
			var cliente = check_text_resv(gl_cliente.cliente[j])?gl_cliente.cliente[j]:"null";
			result.push("cl_list_inicio");
			result.push(gl_cliente.indx_a);
			result.push(gl_cliente.indx_b[j]);
			result.push(gl_cliente.cliente[j]);
			result.push(gl_cliente.monto_totl[j]);
			for (var i = 0; i < gl_cliente.indx_b[j]+1; i++) {
				var desc = "";
				var er = true;
				try {
					gl_cliente.desc[j][i];
				}
				catch (err) {
					er = false;
				}
				if(er) desc = gl_cliente.desc[j][i];

				result.push("cl_inicio");
				result.push(gl_cliente.actual_bs[j][i]);
				result.push(gl_cliente.monto_dol[j][i]);
				result.push(gl_cliente.monto_bs[j][i]);

				result.push(gl_cliente.fecha[j][i]);
				result.push(gl_cliente.hora[j][i]);
				result.push(desc);
				result.push("cl_fin");
			}
			result.push("cl_list_fin");
		}
	}
	else {
		result.push("cl_list_inicio");
		result.push("cl_inicio");
		result.push("cl_fin");
		result.push("cl_list_fin");
	}
	return result;
}

function crear_array_capt(e) {
	var check = e.target.checked;
	//console.log(""+check+"");
	if(gl_curr_cuenta &&  gl_cliente.start){
		if(check){
			//alert("Test "+gl_capt_id.length);
			start_array_capt();
		}
	}
}

function start_array_capt() {
	gl_captures = new Array();
	gl_new_id = new Array();

	
	for (var j = 0;j < gl_capt_id.length; j++) {

		//console.log(" "+gl_capt_id[j]);
		var clave = gl_capt_id[j];
		mostrar_capt_exp(""+clave+"");
		//for (var i = 0; i < gl_cliente.indx_b[j]+1; i++) {
			//var clave = ""+j+""+i;
			//console.log(""+clave+" "+gl_cliente.indx_a);
			//mostrar_capt_exp(clave);
		//}
	}
	//gl_captures.push("ct_fin");
}

//Manejo de Captures de pago -----------------------------------------
function mostrar_capt_exp(clave) {
	var transaccion = bd.transaction(["capture_clientes"]);
	var almacen = transaccion.objectStore("capture_clientes");
	var solicitud = almacen.get(clave);
	solicitud.addEventListener("success", obtener_capt_exp);
}

function obtener_capt_exp(evento) {
	var resultado = evento.target.result;
	if(resultado){
		var index =	resultado.id;
		var capt = resultado.rg_capture;
		gl_captures.push(capt);
		//gl_new_id.push(index);
		//console.log(""+index+"");
	
	}
	else alert("Noppppp");
}
//----------------------------------------------------------------------

function check_text_resv(text) {
	var palabras_resv = ["cc_inicio", "cc_fin", "cl_list_inicio", "cl_list_fin", "cl_inicio", "cl_fin", "SHA-256", "null" , "ct_inicio" , "ct_fin"];
	for (var j = 0; j < palabras_resv.length; j++) {
		//console.log(text);
		if( text == palabras_resv[j]){
			alert("Texto no permitido ("+text+")!.");
			return false;
		}
	}
	return true;
}

async function sha256(message) {

    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}



