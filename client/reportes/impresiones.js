angular
  .module('insude')
  .controller('ImpresionesCtrl', ImpresionesCtrl);
 
function ImpresionesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
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
	
	/*
	let part = this.subscribe('participantes',()=>{
		return [{$and:[ {municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }
										,{deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" }
										,{categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" }]
						,estatus: true				
			}]
	});
	*/
	
	let part = this.subscribe('participantesCred',()=>{
		return [{municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""
						,evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" 
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" 
						,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): "" 
						,estatus: true				
			}]
	});
	
	/*
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""}
										,{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" }]}]
	});
	*/
	
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
		}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
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
		pruebas : () => {
			return Pruebas.find();
		},
		ramas : () => {
			return Ramas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					var m = Municipios.findOne(participante.municipio_id);
					participante.municipio = m.nombre;
					var e = Eventos.findOne(participante.evento_id);
					participante.evento = e.nombre;
					var d = Deportes.findOne(participante.deporte_id);
					participante.deporte = d.nombre;
					this.deporteNombre = d.nombre;
					var c = Categorias.findOne(participante.categoria_id);
					participante.categoria = 	c.nombre;
					this.categoriaNombre = c.nombre;
					var r = Ramas.findOne(participante.rama_id);
					participante.rama = 	r.nombre;
					
				})
			}
		}
		
	});
	
	 
  this.download = function(participantes) 
  {
	  
	  console.log(participantes);	
	  
		if (participantes.length == 0)
 		{
	 			toastr.error("No hay participantes seleccionados para imprmir");
				return;
		}
		
		$( "#registrar" ).prop( "disabled", true );
		Meteor.call('getGafetes', participantes, function(error, response) {
		   if(error){
			  $( "#registrar" ).prop( "disabled", false ); 
		    console.log('ERROR :', error);
		    return;
		   }
		   if (response)
			 {	
				 

				  function b64toBlob(b64Data, contentType, sliceSize) {
						  contentType = contentType || '';
						  sliceSize = sliceSize || 512;
						
						  var byteCharacters = atob(b64Data);
						  var byteArrays = [];
						
						  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						    var slice = byteCharacters.slice(offset, offset + sliceSize);
						
						    var byteNumbers = new Array(slice.length);
						    for (var i = 0; i < slice.length; i++) {
						      byteNumbers[i] = slice.charCodeAt(i);
						    }
						
						    var byteArray = new Uint8Array(byteNumbers);
						
						    byteArrays.push(byteArray);
						  }
						    
						  var blob = new Blob(byteArrays, {type: contentType});
						  return blob;
					}
					
				  //console.log("Si ");	
				  //var pdf = 'data:application/docx;base64,';
			    
					var blob = b64toBlob(response, "application/docx");
				  var url = window.URL.createObjectURL(blob);
				  
				  var dlnk = document.getElementById('dwnldLnkG');
			    dlnk.download = this.deporteNombre+'-'+this.categoriaNombre+'.docx'; 
					dlnk.href = url;
					dlnk.click();		    
				  window.URL.revokeObjectURL(url);
				  $( "#registrar" ).prop( "disabled", false );

		   }
		   
		});
	};
	
	


	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
