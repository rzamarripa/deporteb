angular
.module("insude")
.controller("cantidadPorMunicipioCtrl", cantidadPorMunicipioCtrl);
function cantidadPorMunicipioCtrl($scope, $meteor, $reactive,  $state, toastr) {
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	

  this.participante_id = "";
  this.participantes_id = [];
  rc.cantidadPorMunicipio = [];
  
  rc.total = 0;
  
		
	let part = this.subscribe('participanteListado',()=>{
		if (this.getReactively('evento_id')!= undefined)	
		{		
			return [{evento_id: this.getReactively('evento_id')}]
		}	
	});
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
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
	  cantidadPorMunicipio : () => {
		  
		  if(part.ready()){
			  var arreglo = [];
			  rc.total = 0;
			  _.each(this.municipios, function(municipio){
				  arreglo.push(ParticipanteEventos.find({municipio_id : municipio._id }).count());
					rc.total += ParticipanteEventos.find({municipio_id : municipio._id}).count();																
					
			  });
			  
			  return arreglo;
		  }
		  
	  },
	   municipiosNombres : () => {
		  municipioNombre = [];
		  if(part.ready()){
			  _.each(this.municipios, function(municipio){
				  var nombre = municipio.nombre;
				  municipioNombre.push(nombre);
			  });
		  }
		  return municipioNombre;
	  },
	  graficaMunicipios : () => {
		  
		  data = [];
		  
		  if(part.ready()){
			
				data.push({
				  name: "Registrados",
				  data: rc.cantidadPorMunicipio
				});	
			}
			$('#container').highcharts( {
			    chart: { type: 'column' },
			    title: { text: 'Registrados por Municipio' },
			    subtitle: {
								text:"Municipios"
			    },
			    xAxis: {
		        categories: rc.municipiosNombres,
		        crosshair: true
			    },
			    yAxis: {
		        min: 0,
		        title: {
		          text: 'Cantidad'
		        }
			    },
			    tooltip: {
		        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		        pointFormat:  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		            					'<td style="color:{series.color};padding:0"><b>{point.y:.0f} </b></td></tr>',
		        footerFormat: '</table>',
		        shared: true,
		        useHTML: true
			    },
			    plotOptions: {
		        column: {
		          pointPadding: 0.2,
		          borderWidth: 0
		        }
			    },
			    series: data
				}
			);
			return data;
	  }
	});
	
};