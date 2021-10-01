var gl_cliente = new reg_cliente();
var gl_curr_cuenta = false;
function pagos_main(){
	selec_moneda_cl();

	//Buscador para las cuentas
	var input_cuenta = document.getElementById("buscar_cc");
	input_cuenta.addEventListener("input", function(){buscar_lista_cuenta();});
	input_cuenta.addEventListener("click", function(){el_selec("buscar_cc");});
}

function selec_moneda_cl(){
	var selec_moneda = document.getElementById("selc_moneda_cl");
	var opt = selec_moneda.options[selec_moneda.selectedIndex];
	var selec_mon_cc = document.getElementById("selc_moneda_cc");
	selec_mon_cc.options[selec_moneda.selectedIndex].selected=true;
	gl_opt_moneda = opt.value;

	save_inputs_cliente();

}

function buscar_lista_cuenta()
{
	var text = document.getElementById("buscar_cc").value;
	reset_inputs_pagos();
	var result = false;

	//console.log("Finished: "+gl_curr_cuenta);
	for (var j = 0; j<gl_general.cu_save_id; j++) {
		var nombre = gl_general.cuentlist[j];
		if (nombre!=null) nombre = nombre.toLowerCase();
		else continue;
		result = nombre.includes(text.toLowerCase());

		if(result){
			gl_curr_cuenta = true;
			mostrar_cuentas(j);
			mostrar_clientes(j);
			start_inputs_pagos();
			break;
		}
	}
}

function reset_inputs_pagos() {
	var input_nomb = document.getElementById("pginput"+1+""+0);
	var input_mont = document.getElementById("pginput"+1+""+1);
	var input_paga = document.getElementById("pginput"+1+""+2);

	input_nomb.value = "";
	input_mont.value = "";
	input_paga.value = "";
}

function start_inputs_pagos() {
	var nombre = gl_cuenta.nombre + " - " + gl_cuenta.desc;	//Titulo para la cuenta
	var monto = gl_opt_moneda == 0?get_mask(gl_cuenta.monto_dol,"$"):get_mask(gl_cuenta.monto_bs,"Bs");

	var gen_bs = gl_general.gen_bs;
	var monto_tot_bs = calc_dolar_a_bs(gl_cuenta.monto_pagado, gen_bs);
	var pagado = gl_opt_moneda == 0?get_mask(gl_cuenta.monto_pagado,"$"):get_mask(monto_tot_bs,"Bs");

	var input_nomb = document.getElementById("pginput"+1+""+0);
	var input_mont = document.getElementById("pginput"+1+""+1);
	var input_paga = document.getElementById("pginput"+1+""+2);

	input_nomb.value = nombre;
	input_mont.value = monto;
	input_paga.value = pagado;

	//Test cambia tamaño de la fuente para ajustar a l espacio pequeño
	if(nombre.length>20)
		input_nomb.style.fontSize = "80%";

	//----------------------------------------------------------------
}

function save_inputs_pagos(){
	var gen_bs = document.getElementById("input_gnbs");
	var mask = document.getElementById("text_mask_gnbs");

	var genbs_cc = document.getElementById("input_gnbs_cc");
	var mask_cc = document.getElementById("text_mask_gnbs_cc");

	var vl_bs = gen_bs.value;
	genbs_cc.value = vl_bs;

	gl_general.gen_bs = parseFloat(vl_bs)? parseFloat(vl_bs).toFixed(2) : parseFloat(0).toFixed(2);
	agregar_gene_datos(gl_general);								//Se guardan los datos Generales

	var vl_mask = get_mask(vl_bs,"Bs");
	mask.value = vl_mask;
	mask_cc.value = vl_mask;
}

function save_inputs_cliente(){
	var gen_bs = gl_general.gen_bs;
	var mask = document.getElementById("text_mask_monto_pg");
	var monto = document.getElementById("input_monto_pg");

	var mont_dol = null;
	var mont_bs = null;
	//Dolar
	if(gl_opt_moneda == 0){
		mont_dol = parseFloat(monto.value)?parseFloat(monto.value):0;
		mont_bs = calc_dolar_a_bs(mont_dol, gen_bs);

		gl_general.temp_monto_dol = mont_dol;					//Guarda el monto en dolares
		gl_general.temp_monto_bs = mont_bs;						//Guarda el monto en bolivares

		mask.value = get_mask(mont_dol,"$");
	}
	//Bolivares
	else if(gl_opt_moneda == 1){
		mont_bs = parseFloat(monto.value)?parseFloat(monto.value):0;
		mont_dol = calc_bs_a_dolar(mont_bs, gen_bs);

		gl_general.temp_monto_dol = mont_dol;					//Guarda el monto en dolares
		gl_general.temp_monto_bs = mont_bs;						//Guarda el monto en bolivares

		mask.value = get_mask(mont_bs,"Bs");
	}
	
	gl_general.temp_selec = gl_opt_moneda;

	buscar_lista_cuenta();
}


//Array doble para registrar multiples datos por cliente
gl_actual_bs = new Array();
gl_monto_dol = new Array();
gl_monto_bs = new Array();
gl_detalles = new Array();
gl_fecha = new Array();
gl_hora = new Array();
//------------------------------------------------------

function button_reg_pago(){
	if(!gl_curr_cuenta) return alert("Primero Debe Elejir una Cuenta!.");
	var gen_bs = gl_general.gen_bs;
	var nombre = document.getElementById("input_nombre_pg");
	var vl_nombre = nombre.value;
	var mask = document.getElementById("text_mask_monto_pg");
	var monto = document.getElementById("input_monto_pg");

	var monto_a = gl_general.temp_monto_dol;
	var monto_b = gl_general.temp_monto_bs;

	if(vl_nombre != "" && monto_a != 0 && monto_b != 0){
		var hoy = new Date();
		var curr_hora =  hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
		var curr_fecha = hoy.getDate()+ "-" + ( hoy.getMonth() + 1 ) + "-" + hoy.getFullYear();

		var index = gl_general.index;
		var fecha = gl_general.fecha;
		if(!fecha){
			gl_general.fecha = curr_fecha;
			gl_general.fechalist[gl_general.index] = curr_fecha;
		}
		else if(curr_fecha != fecha){
			gl_general.fecha = curr_fecha;
			gl_general.index++;
			gl_general.fechalist[gl_general.index] = curr_fecha;
		}

		var res = cliente_check(vl_nombre);			//Compara si el nombre del cliente existe
		var index_a = res.a;
		var index_b = res.b;



		gl_actual_bs[index_b] = gen_bs;
		gl_monto_dol[index_b] = monto_a;
		gl_monto_bs[index_b] = monto_b;
		gl_detalles[index_b] = "Proximamente";
		gl_fecha[index_b] = curr_fecha;
		gl_hora[index_b] = curr_hora;

		gl_cliente.actual_bs[index_a] = gl_actual_bs;
		gl_cliente.monto_dol[index_a] = gl_monto_dol;
		gl_cliente.monto_bs[index_a] = gl_monto_bs;
		gl_cliente.detalles[index_a] = gl_detalles;
		gl_cliente.fecha[index_a] = gl_fecha;
		gl_cliente.hora[index_a] = gl_hora;

		gl_cliente.cliente[index_a] = vl_nombre.toLowerCase();
		if (gl_cliente.monto_totl[index_a]) gl_cliente.monto_totl[index_a] += monto_a
		else gl_cliente.monto_totl[index_a] = monto_a;


		console.log("Save Ind a "+index_a+" Monto Dol: "+monto_a+" total: "+gl_cliente.monto_totl[index_a]);

		gl_cliente.start = true;									//Se marca como iniciado
		gl_cliente.clave = gl_cuenta.clave;
 		agregar_cliente(gl_cliente, gl_cuenta.clave);				//Se guardan la informacion de Clientes
		agregar_gene_datos(gl_general);
		nombre.value = "";
		mask.value = "";
		monto.value = "";
		mostrar_detalles_cl();

		gl_actual_bs = new Array();
		gl_monto_dol = new Array();
		gl_monto_bs = new Array();
		gl_detalles = new Array();
		gl_fecha = new Array();
		gl_hora = new Array();

	}
	else alert("No se permiten valores Vacios!.");
}

function cliente_check(text) {
	text = text.toLowerCase();
	var index = new index_resul();
	var nomb_list = gl_cliente.cliente;
	//nomb_list.reverse();
	var result = false;
	var siz = nomb_list.length;
	index.a = siz;
	for (var j = 0; j < siz ; j++) {
		var name = nomb_list[j].toLowerCase();
		result = name.includes(text);

		//console.log("index a "+index.a +" buscar: "+name+" text: "+text+" res: "+result+ " siz: "+siz)
		if(result){
			index.a = j;
			gl_cliente.indx_b[index.a]++;
			index.b = gl_cliente.indx_b[index.a];

			gl_actual_bs = gl_cliente.actual_bs[index.a];
			gl_monto_dol = gl_cliente.monto_dol[index.a];
			gl_monto_bs = gl_cliente.monto_bs[index.a];
			gl_detalles = gl_cliente.detalles[index.a];
			gl_fecha = gl_cliente.fecha[index.a];
			gl_hora = gl_cliente.hora[index.a];

			break;
		}
	}

	if(!result){
		if(!gl_cliente.indx_b[index.a])	gl_cliente.indx_b[index.a] = 0;
		gl_cliente.cliente[index.a] = text;
		gl_cliente.indx_a++;
		gl_cliente.indx_b[index.a] = 0;

		var data_lista = document.getElementById("listcliente");
		data_lista.innerHTML += "<option value='"+text+"'>";
	}
	return index;
}

function index_resul() {
	this.a = 0;
	this.b = 0;
}

function crear_datalist_cl() {
	var data_lista = document.getElementById("listcliente");
	data_lista.innerHTML = "";
	for (var j = 0; j < gl_cliente.indx_a; j++) {
		data_lista.innerHTML += "<option value='"+gl_cliente.cliente[j]+"'>";
	}
}


function mostrar_detalles_cc(){
	var secc_det = document.getElementById("detalles_cc");

	var monto_d = "<div class='div_list_style'> Monto ($): "+ get_mask(gl_cuenta.monto_dol,"$") +"</div>";
	var monto_b = "<div class='div_list_style'> Monto (Bs: "+ get_mask(gl_cuenta.monto_bs,"Bs") +"</div>";
	var monto_p = "<div class='div_list_style'> Pagado: "+ get_mask(gl_cuenta.monto_pagado,"$") +"</div>";
	var estado = "<div class='div_list_style'> Estado: "+ gl_cuenta.estado +"</div>";
	var fecha = "<div class='div_list_style'> Fecha: "+ gl_cuenta.fecha +"</div>";
	var hora = "<div class='div_list_style'> Hora: "+ gl_cuenta.hora +"</div>";

	secc_det.innerHTML = "<div class=''>"+ monto_d + monto_b + monto_p + estado + fecha + hora +"</div>";	
}
function button_detalles_cc() {
console.log("Test"+ gl_curr_cuenta)
	var secc_det = document.getElementById("detalles_cc");
	var class_name = secc_det.className;
	if(class_name == "element_style_hidden")
		secc_det.setAttribute("class", "label_style");
	else
		secc_det.setAttribute("class", "element_style_hidden");
}


function mostrar_detalles_cl(){
	var secc_cc = document.getElementById("detalles_cc");
	secc_cc.innerHTML = "";
	var secc_reg = document.getElementById("registroactual");
	secc_reg.innerHTML = "";
	//console.log("Div Ind a "+gl_cliente.indx_a+" Ind b "+gl_cliente.indx_b[0]);
	gl_cuenta.monto_pagado = 0;
	var gen_bs = gl_general.gen_bs;
	if(gl_curr_cuenta){
		if(gl_cliente.start){
			for (var j = 0;j < gl_cliente.indx_a; j++) {
				var cliente = gl_cliente.cliente[j];
				var monto_total = gl_cliente.monto_totl[j];
				gl_cuenta.monto_pagado += monto_total;
				var monto_tot_bs = calc_dolar_a_bs(monto_total, gen_bs);
				var buttm = "<button type='button' class='butt_style' onclick='button_detalles_pg("+j+");'>Detalles</button>";
				var detalles = "";
				for (var i = 0; i < gl_cliente.indx_b[j]+1; i++) {
					var actual_bs = gl_cliente.actual_bs[j][i];
					var monto_dol = gl_cliente.monto_dol[j][i];
					var monto_bs = gl_cliente.monto_bs[j][i];

					var fecha = gl_cliente.fecha[j][i];
					var hora = gl_cliente.hora[j][i];

					detalles += "<div class='div_list_style'>["+(i+1)+"] Monto: "+get_mask(monto_dol,"$")+" / "+get_mask(monto_bs,"Bs")+" &nbsp <strong>Fecha: "+fecha+" "+hora+"</strong></div>";
				}
				var inside = "<div class='element_style_hidden' id='div_pag"+j+"'>"+ detalles +"</div>";
				secc_reg.innerHTML +=  "<div class='div_list_style' id='divpg"+j+"'>"+buttm+" Cliente: "+ cliente + " <div class='total_style'>Total: "+get_mask(monto_total,"$")+" / "+get_mask(monto_tot_bs,"Bs")+"</div> "+ inside+"</div>";
			}
		}
		start_inputs_pagos();
		mostrar_detalles_cc();
	}
}
function button_detalles_pg(index) {
	var secc_det = document.getElementById("div_pag"+index);
	var class_name = secc_det.className;
	if(class_name == "element_style_hidden")
		secc_det.setAttribute("class", "");
	else
		secc_det.setAttribute("class", "element_style_hidden");
}

