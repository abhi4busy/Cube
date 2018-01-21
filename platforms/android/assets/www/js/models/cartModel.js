var cartModel = {
	cartItems: ko.observableArray([]),
	cartTotal: ko.observable(''),

	init: function(){
		var cartInfo = utils.getCartInfo(),
			products = (cartInfo.products) ? cartInfo.products : [],
			total = (cartInfo.totalCost) ? cartInfo.totalCost : 0,
			brands = [], prods = [],array = [], info = {};

		if(products.length > 0){
			for(var i=0; i<products.length; i++){
				(brands.indexOf(products[i].brand) === -1) ? brands.push(products[i].brand) : '';
				info = {
	                id: products[i].id,
	                image: '',
	                name: products[i].name,
	                price: products[i].price,
	                brand: products[i].brand
	            };
	            array.push(info);
			}
			cartModel.cartItems(products);
			cartModel.cartTotal('Cart Total $'+total);

			indexModel.purchasedProds({
	        	products: array,
	        	totalPay: total
	        });            
	        indexModel.purchasedProds.valueHasMutated();

			/*cube.payment_info = {
	            totalPay : 0,
	            brands: [],
	            products: []
	        };

	        cube.payment_info.totalPay = '$'+total;
	        cube.payment_info.brands.push(brands);
	        cube.payment_info.products = prods;*/
		}	
	},
	removeItem: function(data, event){
		var id = data.id;
		indexModel.removeCartItem(id);
	},
	payNow: function(){
		//if(indexModel.user_details().store){
            mainView.router.loadPage('html/payment.html');
        /*}
        else {
            myApp.alert('Please select store before proceeding', 'Alert', function(){
                myApp.popup('.popup-country');                    
            });            
        }*/
	}
};

myApp.onPageInit('cart', function (page) {
	ko.applyBindings(cartModel, document.getElementById('cart'));
	cartModel.init();	
});