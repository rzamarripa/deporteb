angular
  .module('insude')
  .controller('listadoCtrl', listadoCtrl);
 
function listadoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	this.eventoNombre = "";
	this.deporteNombre = "";
	this.categoriaNombre = "";
	
	
	let part = this.subscribe('participanteListado',()=>{
				
				var user = Meteor.users.findOne(Meteor.userId());
				if (user.roles[0] != "admin")
						this.evento.municipio_id = user.profile.municipio_id;
				
				console.log(this.evento.municipio_id);
				
				if (this.getReactively('evento.municipio_id') != undefined && this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') == undefined)
				{			
							return [{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
										  ,municipio_id : this.getReactively('evento.municipio_id')
										  }];
				} else if (this.getReactively('evento.municipio_id') != undefined && this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') != undefined)
				{
							return [{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
										  ,municipio_id : this.getReactively('evento.municipio_id')
										  ,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
										  }];
					
					
				}   			  
	});
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('categorias',()=>{
		return [{}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{}]
	});

	this.subscribe('ramas',()=>{
		return [{}]
	});
	
	this.helpers({
	  participantes : () => {
		  return ParticipanteEventos.find();
	  },
		municipios : () => {
			return Municipios.find();
		},
		eventos : () => {
			return Eventos.find();
		},
		deportes : () => {
			return Deportes.find();
		},
		categorias : () => {
			return Categorias.find();
		},
		ramas : () => {
			return Ramas.find();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		
	});
	
	this.download = function(participantes) 
  {
	  
		if (participantes.length == 0)
 		{
	 			toastr.error("No hay participantes para generar cédula");
				return;
		}
		
	
			var participantesArray = [];
					participantesArray.push(["NUM", "NOMBRE", "APELLIDO PATERNO", "APELLIDO MATERNO", "FECHA NACIMIENTO", "CURP", "DEPORTE", "CATEGORIA", "RAMA", "PRUEBAS","FUNCION ESPECIFICA"]);
					var con = 1;
			 _.each(rc.participantes, function(participante){
					
					
					if (participante.municipio_id != "s/a")				 
				 	{
						 	var m = Municipios.findOne(participante.municipio_id);
							participante.municipio = m.nombre;
					}
					else
							participante.municipio ="";
							
					if (participante.evento_id != "s/a")				 
				 	{
							var e = Eventos.findOne(participante.evento_id);
							participante.evento = e.nombre;
					}
					else
							participante.evento = "";
							
					if (participante.deporte_id != "s/a")				 
				 	{
							var d = Deportes.findOne(participante.deporte_id);
							participante.deporte = d.nombre;
					}
					else
							participante.deporte = "Sin Deporte";
					
					if (participante.categoria_id != "s/a")		 
				 	{		
							var c = Categorias.findOne(participante.categoria_id);
							participante.categoria = c.nombre;
					}
					else
							participante.categoria = "Sin Categoría";
					
					if (participante.rama_id != "s/a")				 
				 	{
							var r = Ramas.findOne(participante.rama_id);
							participante.rama =  r.nombre;
					}		
					else
							participante.rama = "Sin Rama";
							
							
					var pruebas = "";
					if (participante.pruebas != undefined)
					{
							for	(i=0; i<participante.pruebas.length; i++)
							{
									var p = Pruebas.findOne(participante.pruebas[i]);
									console.log(p);
									if (p != undefined)
									{
										if (i + 1 == participante.pruebas.length)
											pruebas = pruebas + p.nombre;
										else
											pruebas = pruebas + p.nombre + ", ";	
									}
							}
					}		
					//console.log(pruebas);
						
				 	participantesArray.push([con, participante.nombre, participante.apellidoPaterno, participante.apellidoMaterno, (participante.fechaNacimiento.getUTCDate() +"/"+ (participante.fechaNacimiento.getUTCMonth()+1) +"/"+ participante.fechaNacimiento.getUTCFullYear()), participante.curp, participante.deporte, participante.categoria, participante.rama, pruebas, participante.funcionEspecifica]);
				 	con++;
			})	 
			
			loading(true);
			Meteor.call('getExcel', participantesArray, function(error, response) {
				   if(error){
				    console.log('ERROR :', error);
				    loading(false);
				    return;
				   }else{
					 	loading(false);
					  var pdf = 'data:application/xlsx;base64,';
				    var dlnk = document.getElementById('dwnldLnk');
				    dlnk.download = 'Lista.xlsx'; 
						dlnk.href = pdf+response;
						dlnk.click();
				   }
			});	
		
	};
	
	this.reset = function() 
  {
			rc.evento = {};
	}
	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Hombre")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Mujer"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
