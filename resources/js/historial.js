gl_curr_optsel = 0;

var gl_hist_pg = new reg_cliente();

function mostrar_historial() {
	var secc_hist = document.getElementById("histpg");
	secc_hist.innerHTML = "";
	//console.log(""+gl_hist_pg.fecha.length);
	for (var j = gl_hist_pg.fecha.length-1;j >=0 ; j--) {
		secc_hist.innerHTML +=  "<div class='div_list_style' id='divpg"+j+"'>["+gl_hist_pg.fecha[j]+" "+gl_hist_pg.hora[j]+"] "+ gl_hist_pg.cliente[j] +", monto: "+get_mask(gl_hist_pg.monto_dol[j],"$")+" / "+get_mask(gl_hist_pg.monto_bs[j],"Bs")+"</div> ";
	}
}

function preloder_filtro_fec() {
	var selec = document.getElementById("selchisfec");

	var index = gl_hist_pg.fechalist.length;
	//console.log(""+index);
	var selc_tx = "";
	selc_tx += "<option id='fech"+index+1+"' value='"+index+1+"'>Todas</option>";
	for (var j = index; j >= 0; j--) {
		var name = gl_hist_pg.fechalist[j]
		if(name){
			selc_tx += "<option id='fech"+j+"' value='"+j+"'>"+name+"</option>";
		}
	}
	selec.innerHTML = selc_tx;
	selec.setAttribute("onchange","action_filtro_fec('selchisfec');");

	//gl_curr_optsel = current_opt?parseInt(current_opt.value):0;
}

function action_filtro_fec() {
	var selec = document.getElementById("selchisfec");
	var current_opt = selec.options[selec.selectedIndex];
	var selc_tx = current_opt.innerHTML;

	//console.log(""+selc_tx);
	var secc_hist = document.getElementById("histpg");
	secc_hist.innerHTML = "";
	for (var j = gl_hist_pg.fecha.length-1;j >= 0; j--) {
		if(selc_tx == gl_hist_pg.fecha[j] || selc_tx == "Todas"){
			secc_hist.innerHTML +=  "<div class='div_list_style' id='divpg"+j+"'>["+gl_hist_pg.fecha[j]+" "+gl_hist_pg.hora[j]+"] "+ gl_hist_pg.cliente[j] +", monto: "+get_mask(gl_hist_pg.monto_dol[j],"$")+" / "+get_mask(gl_hist_pg.monto_bs[j],"Bs")+"</div> ";
		}
	}


}

function eliminar_todo(opt){
	var butt = document.getElementById("buthist");
	var label = document.getElementById("histlabel");
	var check = document.getElementById("histcheck");

	if(opt==0){
		label.setAttribute("class", "cajas_style");
		check.checked = false;
		butt.setAttribute("onclick", "eliminar_todo(1)");
		alert("Estas a punto de borrar todo, marque la casilla para confirmar y vuelva a pulsar.");
	}
	if(opt==1){
		label.setAttribute("class", "input_style_hidden");
		butt.setAttribute("onclick", "eliminar_todo(0)");
		if(check.checked){
			check.checked = false;
			clear_history();
			alert("Se ha borrado Todo el Historial.");
		}
	}
}
function clear_history(){

	for (var j = 0; j <= 10; j++) {	
		remove_capture(j);
	}

	remove_general(0);

	for (var j = 0; j <= gl_general.cu_save_id; j++) {
		remove_cuenta(j);
	}

	for (var j = 0; j <= gl_general.cu_save_id; j++) {
		remove_cliente(j);
	}
}
function test_imgs(){
	var sect = document.getElementById("test_imgs");

	sect.innerHTML = "";
	for (var j = 0;j < gl_captures.length ; j++) {

		var img = document.createElement("img");
		img.src = gl_captures[j];
		sect.appendChild(img);
		sect.innerHTML += "Clave: "+gl_new_id[j+1]+" Index: "+j+"";
	}

}


