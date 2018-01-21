var myCubeModel = {
	purchased: ko.observableArray([]),
	giftsend: ko.observableArray([]),
	giftreceived: ko.observableArray([]),
	giftData: '',	
	viewmoreData: ko.observable(''),

	init: function(data){
		myCubeModel.purchased([]);
		myCubeModel.giftsend([]);
		myCubeModel.giftreceived([]);

		var items = '';
		if(data.purchased && data.purchased.length > 0){
			items = indexModel.validateItem(data.purchased);
			myCubeModel.purchased(items);
		}
		if(data.Gifted_to_me && data.Gifted_to_me.length > 0){
			items = indexModel.validateItem(data.Gifted_to_me);
			myCubeModel.giftreceived(items);
		}
		if(data.sent && data.sent.length > 0){
			items = indexModel.validateItem(data.sent);
			myCubeModel.giftsend(items);
		}
	},	
	showMore: function(data, event){
		var action = $(event.delegateTarget).data('cls'),
			obj = {};
		switch(action){
			case 'purchased':
				obj = {
					title: 'Items In Hand',
					type: action,
					data: myCubeModel.purchased()
				};				
				break;

			case 'sent':
				obj = {
					title: 'YOU CUBED: (SENT)',
					type: action,
					data: myCubeModel.giftsend()
				};
				break;

			case 'received':
				obj = {
					title: 'CUBED BY: (RECIEVED)',
					type: action,
					data: myCubeModel.giftreceived()
				};
				break;
		}		
		myCubeModel.viewmoreData(obj);
        mainView.router.loadPage('html/viewmore.html');
	},
	showDetails: function(data, event){
        indexModel.purchasedProds([]);
        
		var ele = $$(this).closest('.items'),
            product_name = data.product_name,
            brand_name = data.brand_name,
            order_id = data.order_id,
            price = data.price,
            products = [],
            obj = '',
            product = {
                id: order_id,
                image: '',
                name: product_name,
                brand: brand_name,
                price: price
            };
        products.push(product);

        indexModel.confirmNavigation = 'mycube';
        indexModel.purchasedProds({
        	products: products,
        	totalPay: price
        });            
        indexModel.purchasedProds.valueHasMutated();

        /*obj = {
            products : products,
            totalCost: price,
            items: 1
        };*/
        //cube_payConfirm.cartInfo = obj;
        mainView.router.loadPage('html/confirmation.html');
	},
	sendGift: function(data, event){
		var prod = [{
			product: data.product_name,
			brand: data.brand_name,
			id: data.order_id
		}];
		myCubeModel.giftData = {
			product: prod,
			friend: '',
			navigation: 'item'
		}		
		mainView.router.loadPage({'url': 'html/gift_send.html', 'ignoreCache': true});
	}
};
myApp.onPageInit('giftbox', function (page) {
	ko.applyBindings(myCubeModel, document.getElementById('giftbox'));
	myCubeModel.init(indexModel.myCubeData);

	$$('.navbar .cubeback').click(function(){
        mainView.router.back({url: 'html/brands.html', force: true});    
    });
});