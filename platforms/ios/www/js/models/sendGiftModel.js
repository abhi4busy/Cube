var sendGiftModel = {
	giftProduct: ko.observableArray(''),
	btnlbl: ko.observable('Select your friend'),
	selectedProd: '',

	init: function(data){
		indexModel.selectedCubie({
			id: '',
			name: '',
			mobile: ''
		});
		sendGiftModel.btnlbl('Select your friend');

		sendGiftModel.giftProduct([]);
		sendGiftModel.selectedProd = '';

		sendGiftModel.giftProduct(data.product);

		sendGiftModel.applyDragDrop();		
	},
	noFriends: function(){
		if(cube_myCube.cubedFriends.length == 0){
	        myApp.confirm('No frineds!! Do you want to send invite?', function () {
	            cube.readContacts();
	        });
	    }
	},
	loadFriends: function(data){
		if(data){
			indexModel.cubies(data.Data);
			myApp.popup('.popup-friends');
		}			             
	},
	getFriendsList: function(){
		if(indexModel.cubies().length == 0){
            var obj = {
                user_id: indexModel.user_details().id
            };
            serviceFacade.makeServiceCall(sendGiftModel.loadFriends, {url: 'FRIENDS', data: obj}, '', sendGiftModel.noFriends);
        }
        else {
            myApp.popup('.popup-friends');
        }
	},	
	setGiftDetails: function(){
		var id='', name='', brand='';

		id = $(this).find('span').attr('data-order');
    	name = $(this).find('span').text();
    	brand = $(this).find('span').attr('data-brand');

    	/*cube_myCube.giftProduct = {
			product: name,
			brand: brand,
			id: id
		};*/
	},
	sendGift: function(){
		myApp.confirm('Do you want to send gift to '+indexModel.selectedCubie().name, function () {
	        var obj = {
                action: 'send_gift',
                user_id: indexModel.user_details().id,
                order_id: sendGiftModel.selectedProd.id,
                friend_id: indexModel.selectedCubie().id
            };
            serviceFacade.makeServiceCall(sendGiftModel.sendGiftSuccess, {url: 'SEND_GIFT', data: obj}, this);
	    });			
	},
	sendGiftSuccess: function(data){
		myApp.alert('Gift successfully sent to '+indexModel.selectedCubie().name, 'Alert', function(){
            if(indexModel.sendgiftnavigation == 'cube') {
            	indexModel.myCube();
            } 
            else {
            	if(sendGiftModel.giftProduct().length == 1){
            		indexModel.showHomePage();
            	}
            	else {
            		indexModel.sendGift('reload');
            	}
            }
        });
	},
	applyDragDrop: function(){
		$( ".boxdrabable" ).draggable({
	        revert: 'valid',
	        start: function( event, ui ) {
	            $(this).addClass("dashed");
	            /*if(typeof cube_myCube.giftProduct.id == 'undefined' || cube_myCube.giftProduct.id == '') {
	            	
	            }*/	            
	        },
	        stop: function(){
	        	sendGiftModel.selectedProd = {
	        		id: $(this).find('span').data('id'),
	        		name: $(this).find('span').text()
	        	};
	        }
	    });

	    $('.drophere').droppable({
	        activeClass: "dashed",
	        drop: function(event, ui){
	            if(indexModel.selectedCubie().id){
	            	sendGiftModel.sendGift();            
	            }
	            else {
	                indexModel.showValidationPopup('Please select friend');
	            }
	        }
	    });
	}
};

myApp.onPageInit('giftsend', function (page) {
	ko.applyBindings(sendGiftModel, document.getElementById('giftsend'));
	sendGiftModel.init(myCubeModel.giftData);	

	$$('.navbar .giftback').click(function(){
        mainView.router.back({url: 'html/brands.html', force: true});    
    });
});