var productsModel = {
	products: ko.observableArray(),
	brandinfo: ko.observable({brand_name: '', brand_id: ''}),
	selectedProduct: ko.observable(),
	prodData: '',

	init: function(data){
		/*pending items
		1. add active class for already added item
		*/
		//if(data){
			productsModel.brandinfo({
				brand_name: indexModel.paginationParams.brand_name,
				brand_id: indexModel.paginationParams.brand_id
			});



			/*if(data.Data && data.Data.length > 0){
				for(var i=0; i<data.Data.length; i++){
					var prod = data.Data[i];
					prod.active = indexModel.checkProductExists(prod.product_id);
					prod.index = i;
		            (prod.image_path.indexOf('http') == -1) ? prod.image_path = app.app_URL.DOMAIN+prod.image_path : '';
		        }

				productsModel.products(data.Data);	
			}*/
		//}		
	},
	selectedBrand: ko.computed(function(){
		return (productsModel && productsModel.brandinfo() && productsModel.brandinfo().brand_name) ? productsModel.brandinfo().brand_name : '';
	}, productsModel),
	getSelectedProd: function(data){
		try{
			productsModel.selectedProduct({
	            id: data.product_id,
	            name: data.product_name,
	            image: data.image_path,
	            price: data.price,
	            desc: data.description,
	            brand: data.brand_name
	        });
		}catch(e){
			console.log(e.message);
		}
	},
	showDetails: function(data, event){
		productsModel.getSelectedProd(data);

		productsModel.prodData = productsModel.selectedProduct();
        mainView.router.loadPage('html/details.html');
	},
	addCart: function(data, event){
		var isActive = data.active,
			index = data.index,
			added = false;

		if(!isActive){
			productsModel.getSelectedProd(data);

            //if(indexModel.user_details().store){
                added = indexModel.addToCart(productsModel.selectedProduct());                    
                if(added){
                	indexModel.productsArray()[index].active = true;
                	indexModel.productsArray.valueHasMutated();
                	$(event.delegateTarget).addClass('btninactive');
                }
            /*}
            else {
                myApp.alert('Please select store before proceeding', 'Alert', function(){
                    myApp.popup('.popup-country');                    
                });
                
            }*/
        }		
	}
};

myApp.onPageInit('products', function (page) {
	console.log('init products......');
	//if(!productsModel || productsModel.products().length == 0){
	    ko.applyBindings(productsModel, document.getElementById('products'));    
	    productsModel.init();
	//}
});
myApp.onPageReinit('products', function (page) {
	console.log('reinit products......');
});