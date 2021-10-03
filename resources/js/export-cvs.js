
function arrayObjToCsv() {
	var cuenta = crear_array_cc();
	var cliente = crear_array_cl();
	if(!gl_curr_cuenta) return alert("Debes Seleccionar una Cuenta!.");
	//comprobamos compatibilidad
	if(window.Blob && (window.URL || window.webkitURL)){
		var contenido = "",
			d = new Date(),
			blob,
			reader,
			save,
			clicEvent;
		//creamos contenido del archivo
		contenido += cuenta.join(",") + "\n";			//Se agregan datos de cuenta
		contenido += cliente.join(",") + "\n";			//Se agregan datos de cliente

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
			save.download = "datos-guardados_"+ d.getDate() + "_" + (d.getMonth()+1) + "_" + d.getFullYear() + "_" + d.getHours() + d.getMinutes() + d.getSeconds()+".csv";
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
	}
	else {
		//el navegador no admite esta opción
		alert("Su navegador no permite esta acción");
	}
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
			result.push(j);
			result.push(cliente);
			result.push(gl_cliente.monto_totl[j]);
			for (var i = 0; i < gl_cliente.indx_b[j]+1; i++) {
				result.push("cl_inicio");
				result.push(i);
				result.push(gl_cliente.actual_bs[j][i]);
				result.push(gl_cliente.monto_dol[j][i]);
				result.push(gl_cliente.monto_bs[j][i]);

				result.push(gl_cliente.fecha[j][i]);
				result.push(gl_cliente.hora[j][i]);
				result.push("cl_fin");
			}
			result.push("cl_list_fin");
		}
	}
	else result.push("null");

	return result;
}

function check_text_resv(text) {
	var palabras_resv = ["cc_inicio", "cc_fin", "cl_list_inicio", "cl_list_fin", "cl_inicio", "cl_fin"];
	for (var j = 0; j < palabras_resv.length; j++) {
		console.log(text);
		if( text == palabras_resv[j]){
			alert("Texto no permitido ("+text+")!.");
			return false;
		}
	}
	return true;
}

