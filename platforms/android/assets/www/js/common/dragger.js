$$(document).on('pageInit', '.page[data-page="giftsend"]', function (e) {
    
    $(function(){ 
        if(utils.)
        $('.boxdrabable').draggable({
            //$(this).children().css("display", "none");
        });
        
        $( ".boxdrabable" ).draggable({
            start: function( event, ui ) {
                $(this).addClass("dashed");
            }
        });

        $('.drophere').droppable({
            drop: function(event, ui){
            $(this).children().css("display", "none")
            $(this).addClass("dashed");
            $(".ui-draggable-dragging").css("display", "none")
            //alert("Dropped Item in Gift Box Now Select You Friend From List");
            }
        });

        $('.drophereprofile').droppable({
            drop: function(event, ui){
            $(this).children().css("display", "none")
            $(this).addClass("dashed");
            $(".ui-draggable-dragging").css("display", "none")
            //alert("Dropped Item in Gift Box Now Select You Friend From List");
            }
        });
    });

    $( ".drophere" ).droppable({
        activeClass: "dashed"
    });

    // Close profile
    $('.profile-delete').click(function(){
        $(this).parent('.profile').hide();
    });
  
}); 