var confirmationModel = {
	isVisible: ko.observable(false),

	init: function(){		
		myApp.closeModal('.popup-payment');

		(indexModel.confirmNavigation == 'newpay') ? confirmationModel.isVisible(true) : confirmationModel.isVisible(false);
	}
};

myApp.onPageInit('confirmation', function (page) {
    ko.applyBindings(confirmationModel, document.getElementById('confirmation'));    
    confirmationModel.init();

    $$('.navbar a.confirmback').click(function(){
    	if(indexModel.confirmNavigation == 'newpay') {
        	indexModel.showHomePage();
    	}
    	else {
    		mainView.router.back();
    	}
    });
});