var myApp = new Framework7();

var mainView = myApp.addView('#main');

var auth = false;
if (!auth) {
    mainView.router.loadPage('page/login.html');
}

var myApp = new Framework7({
    // Default title for modals
    modalTitle: 'Cube App'
 
    preroute: function (view, options) {
        console.log('preroute check....');
    },
    // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

$$(document).on('pageInit', function (e) {
    // Do something here when page loaded and initialized
    var page = e.detail.page;

    if(page.name === 'index'){
        
    }
    /*var userInfo = utils.getUserInfo();

    if(userInfo && userInfo.isRegistered){
        mainView.router.pageName('index');
    }
    else {
        mainView.router.loadPage('html/register.html');    
    }*/

    
});

//     app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//         document.addEventListener('pageInit', this.pageInit, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var userInfo = utils.getUserInfo();

//         if(userInfo && userInfo.isRegistered){
//             console.log("user registered");
//         }
//         else {
//             console.log("show registration");
//             //window.location.href = 'html/register.html';
//         }

//         //var mainView = myApp.addView('.view-main');
        
//     },
//     pageInit: function(){
//         var page = e.detail.page;
//         alert(page.name);
//         //mainView.router.load({pageName: 'register'});
//     }
//     // },
//     // applyDragEvents: function(){
//     //     $('.boxdrabable').draggable({
//     //         //$(this).children().css("display", "none");
//     //     });
        
//     //     $( ".boxdrabable" ).draggable({
//     //         start: function( event, ui ) {
//     //             $(this).addClass("dashed");
//     //         }
//     //     });

//     //     $('.drophere').droppable({
//     //         drop: function(event, ui){
//     //         $(this).children().css("display", "none")
//     //         $(this).addClass("dashed");
//     //         $(".ui-draggable-dragging").css("display", "none")
//     //         //alert("Dropped Item in Gift Box Now Select You Friend From List");
//     //         }
//     //     });

//     //     $('.drophereprofile').droppable({
//     //         drop: function(event, ui){
//     //         $(this).children().css("display", "none")
//     //         $(this).addClass("dashed");
//     //         $(".ui-draggable-dragging").css("display", "none")
//     //         //alert("Dropped Item in Gift Box Now Select You Friend From List");
//     //         }
//     //     });

//     //     $( ".drophere" ).droppable({
//     //         activeClass: "dashed"
//     //     });

//     //     // Close profile
//     //     $('.profile-delete').click(function(){
//     //         $(this).parent('.profile').hide();
//     //     });
//     // }
// };

// app.initialize();



//
/*function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block' || e.style.display=='') e.style.display = 'none';
    else e.style.display = 'block';
}
*/
 
 
// myApp.onPageInit('Index', function(page){ myApp.alert('test'); });


/*
// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage(){
    mainView.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link">Back</a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="page2" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="page2.html">Page 2</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
    return;
}*/