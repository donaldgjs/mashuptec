var n;
var idVideo = new Array(n);
var view = new Array(n);
var likes = new Array(n);
var dislikes = new Array(n);
var comment = new Array(n);
var text = "";
var videos = [];
var contenido = [];
var markers = [];
var map;

function tplawesome(e,t){
  res=e;
  for(var n=0;n<t.length;n++){
    res=res.replace(/\{\{(.*?)\}\}/g,
      function(e,r){
        return t[n][r]
      })
  }
  return res
}

//Funcion que realiza una busqueda a youtube con la palabra insertada
$(function() {
    $("form").on("submit", function(e) {

      //limpiar campos
      deleteMarkers();
      $("#itemContainer").html("");
      text = "";
      videos = [];
      contenido = [];


       e.preventDefault();
       n = encodeURIComponent($("#num").val());
       buscar = encodeURIComponent($("#search").val()).replace(/%20/g, "+");

       getAllTweets(buscar);
       var request = gapi.client.youtube.search.list({
            part: "id, snippet",
            type: "video",
            //location: "lat:\"19.4323396\",lng: \"-99.1337639\"",
            //locationRadius: "200",
            q: buscar,
            maxResults: n,
            //order: "viewCount",
            //publishedAfter: "2018-03-01T00:00:00Z"
       }); 
       request.execute(function(response) {
          var results = response.result;
          for (var i = 0; i < results.items.length; i++) {
            videos.push(results.items[i]);

            $("#itemContainer").append("<li><iframe class=\"video\" width=\"125\" height=\"125\" src=\"//www.youtube.com/embed/" + results.items[i].id.videoId +"\" frameborder=\"0\" allowfullscreen></iframe></li>");

            //<iframe class="video" width="125" height="125" src="//www.youtube.com/embed/{{videoid}}" frameborder="0" allowfullscreen></iframe>

          }
          mostrarpag();

          obtenerDatos(results);
          //$("#results").html("");
          var cont = 1;
          /*$.each(results.items, function(index, item) {
            $.get("item.html", function(data) {
              var cont = cont+1;
              if(cont == 10){
//                agregarPaginacion();
                //"title":item.snippet.title,
                $("#results").append(tplawesome(data, [{"videoid":item.id.videoId}]));
              }else{
                $("#results").append(tplawesome(data, [{"videoid":item.id.videoId}]));
              }
            });
          });*/
          //resetVideoHeight();
       });
       $('#boton_graficar').attr('disabled',false);
    });
    //$(window).on("resize", resetVideoHeight);
});

function mostrarpag() {
  /* initiate the plugin */
    $("div.holder").jPages({
      containerID  : "itemContainer",
      perPage      : 10,
      startPage    : 1,
      startRange   : 1,
      midRange     : 5,
      endRange     : 1
    });
}

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/10);
}

function init() {
    gapi.client.setApiKey("AIzaSyB02HrC6xUJYSCkBis3TNcIQGlHA5vIyt0");
    gapi.client.load("youtube", "v3", function() {
    });
}

//Obtener los datos de los videos: view, like, dislike, comment
function obtenerDatos(data){
  for (var i = 0; i < n; i++) {
    if(i != 49){
      idVideo[i] = videos[i].id.videoId;
      text += idVideo[i] + ",";
    }else{
      idVideo[i] = videos[i].id.videoId;
      text += idVideo[i];
    }
  }

  var datos = gapi.client.youtube.videos.list({
    part: "statistics, recordingDetails",
    id: text
  });

  datos.execute(function(response) {
    var results = response.result;
      for (var i = 0; i < results.items.length; i++) {
        contenido.push(results.items[i]);
              //console.log("Id Video " + results.items[i].id + " Vistas " + results.items[i].statistics.viewCount 
              //+ " likes " + results.items[i].statistics.likeCount + " Dislikes " + results.items[i].statistics.dislikeCount
              //+ " comentarios " + results.items[i].statistics.commentCount);
      }
      //console.log(contenido);
      obtenerCoordenadas(contenido);
  });
}

//librerias para charts
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);

//graficar
function drawChart() {
    $("#boton_graficar").click(function () {
      var tipo = encodeURIComponent($("#opt").val());
      var data = new google.visualization.DataTable();
      data.addColumn('string','Video');
      var estadisticas = [];

      if (tipo === "view") {
        data.addColumn('number','Vistas');
        for (var i = 0; i < videos.length; i++) {
          estadisticas[i] = new Array(videos[i].snippet.title,parseInt(contenido[i].statistics.viewCount));
        }
        data.addRows(estadisticas);
      }else
      if (tipo === "likes"){
        data.addColumn('number','Likes');
        for (var i = 0; i < videos.length; i++) {
          estadisticas[i] = new Array(videos[i].snippet.title,parseInt(contenido[i].statistics.likeCount));
        }
        data.addRows(estadisticas);
      }else
      if (tipo === "dislikes") {
        data.addColumn('number','Dislikes');
        for (var i = 0; i < videos.length; i++) {
          estadisticas[i] = new Array(videos[i].snippet.title,parseInt(contenido[i].statistics.dislikeCount));
        }
        data.addRows(estadisticas);
      }else
      if (tipo === "comment") {
        data.addColumn('number','Comment');
        for (var i = 0; i < videos.length; i++) {
          estadisticas[i] = new Array(videos[i].snippet.title,parseInt(contenido[i].statistics.commentCount));
        }
        data.addRows(estadisticas);
      }

      var opciones = {'title':'Estadisticas por Video',
              'width':350,
              'height':300
            };
      var grafica = new google.visualization.BarChart(document.getElementById('grafica'));
      grafica.draw(data,opciones);

      document.getElementById('grafica').style.visibility = "visible";
    });     
}

// Creando el mapa
function initMap(){
      var options = {
          zoom:3,
          center:{lat:18.4668,lng:-99.9495} //{lat:17.0864265,lng:-96.7861078}
        }
      map = new google.maps.Map(document.getElementById('map'), options);
}

//Agregar marcadores al mapa
function obtenerCoordenadas(contenido){
  for (var i = 0; i < contenido.length; i++) {
    if(contenido[i].recordingDetails){
      if (contenido[i].recordingDetails.location) {
        if (contenido[i].recordingDetails.location.latitude && contenido[i].recordingDetails.location.longitude) {

          var frame = '<iframe class="video" width="200" height="150" src="//www.youtube.com/embed/' + videos[i].id.videoId + '" frameborder="0" encrypted-media" allowfullscreen></iframe>'

          addMarker({
            coords:{
              lat:parseFloat(contenido[i].recordingDetails.location.latitude), 
              lng:parseFloat(contenido[i].recordingDetails.location.longitude)
            },
            content: frame, //'<iframe class="video" width="160" height="50" src="https://www.youtube.com/embed/' + id + 'frameborder="0" encrypted-media" allowfullscreen></iframe>',
            iconImage: 'img/video.png'
          });

        }
      }
      /*markers[i].push({
      coords:{lat:contenido[i].recordingDetails.location.latitude, lng:contenido[i].recordingDetails.location.longitude},
      content: '<h1>'+ videos[i].snippet.title +'</h1>'
    });*/
      
    }
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:map,
        });
        markers.push(marker);

        if(props.iconImage){
          marker.setIcon(props.iconImage);
        }
        
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });

          marker.addListener('click', function() {
            infowindow.close(map, marker);
          });
        }
}

function getAllTweets(label){
  $.ajax( {
    type: 'get',
    url: 'twitterCode.php',
    data: {
      'label': label,
    },
    cache: false,
    success: function(data, textStatus, jqXHR) {
      //console.log(data.statuses);
      for(i=0; i<data.statuses.length; i++){
        if(data.statuses[i].coordinates != null){
          console.log(data.statuses[i]);
          longitud = data.statuses[i].coordinates['coordinates'][0];
          latitud = data.statuses[i].coordinates['coordinates'][1];
          addMarker({
              coords:{lat:parseFloat(latitud), lng:parseFloat(longitud)},
              iconImage: 'img/twitter.png',
              content: '<p>' + data.statuses[i].text + '</p>' + '<p>' + data.statuses[i].place.full_name + '</p>'
          });
        }
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
    }
  } );

  return false;
}