  
  /*var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-28718218-1']);
  _gaq.push(['_trackPageview']);*/

  /*(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

 
  /* when document is ready */
  $(function(){
    
  });

  function inicio(){
    for (var i = 1; i <= 50; i++) {
        //var text = "img/img (" + i + ").jpg"
      $("#itemContainer").append("<li><img src = \"img/img ("+i+").jpg\" alt=\"image\"></li>");
      
    }

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
  