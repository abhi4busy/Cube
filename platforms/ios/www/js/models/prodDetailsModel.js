var prodDetailsModel = {
	prodinfo: ko.observable(),

	init: function(data){
		prodDetailsModel.prodinfo(data);
	},
	buyNow: function(data, event){
		//if(indexModel.user_details().store){
            indexModel.purchasedProds([]);
            var id = data.id,
            	name = data.name,
            	brand = data.brand,
            	price = data.price,
            	totalPay = data.price,
            	array = [],
            	prod = {
            		id: id,
            		name: name,
            		price: price,
            		brand: brand
            	};
            	
            array.push(prod);
                        
            indexModel.purchasedProds({
            	products: array,
            	totalPay: totalPay
            });            
            indexModel.purchasedProds.valueHasMutated();

            mainView.router.loadPage('html/payment.html');
        /*}
        else {
            myApp.alert('Please select store before proceeding', 'Alert', function(){
                myApp.popup('.popup-country');                    
            });
        }*/
		
	},
    onSocialSuccess: function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    },
    onSocialError: function(msg) {
      console.log("Sharing failed with message: " + msg);
    },
	socialShare: function(data, event){        
		//window.plugins.socialsharing.share('Just cubed!!! Did you?', 'Cube');

        var options = {
            message: 'Just cubed!!! Did you?', // not supported on some apps (Facebook, Instagram)
            subject: 'My Cube', // fi. for email
            files: ['', ''], // an array of filenames either locally or remotely
            url: '',
            chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }
        window.plugins.socialsharing.shareWithOptions(options, prodDetailsModel.onSocialSuccess, prodDetailsModel.onSocialError);
	}
};

myApp.onPageInit('details', function (page) {
	console.log('init details......');
	//if(!prodDetailsModel || !productsModel.prodinfo) {
	    ko.applyBindings(prodDetailsModel, document.getElementById('details'));    
	    prodDetailsModel.init(productsModel.prodData);
	//}
});

myApp.onPageReinit('details', function (page) {
	console.log('reinit details......');
});
/*$$('.popup-payment').on('open', function () {
	ko.applyBindings(prodDetailsModel, document.getElementById('#popup-payment'));    
    //cube.showPaymentSummary('.popup-payment', false);
    //cube.applyEvents('.popup-payment a.item-link', cube.makePayment);
});*/