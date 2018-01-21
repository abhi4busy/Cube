var allItemsModel = {
	
	init: function(data){
		
	},
	addCart: function(data, event){
		var isActive = data.active,
			index = data.index,
			added = false;

		if(!isActive){
			productsModel.getSelectedProd(data);
            added = indexModel.addToCart(productsModel.selectedProduct());                    
            
            if(added){
            	indexModel.productsArray()[index].active = true;
            	indexModel.productsArray.valueHasMutated();
            	$(event.delegateTarget).addClass('btninactive');
            }            
        }		
	}
};

myApp.onPageInit('items', function (page) {
    ko.applyBindings(productsModel, document.getElementById('items'));    
    allItemsModel.init();

    // Attach 'infinite' event handler
	$$('.infinite-scroll').on('infinite', function () {
	    indexModel.doScroll();
	}); 
});