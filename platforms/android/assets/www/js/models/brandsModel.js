var brandsModel = {	
    birthdays: ko.observableArray(),
    products: [],
    pageNo: 1,

	init: function(data){
		try{
            brandsModel.birthdays = (indexModel.birthdays && indexModel.birthdays.length>0) ? indexModel.birthdays : [];
            
            for(var i=0; i<data.length; i++){
                (data[i].image_path.indexOf('http') == -1) ? data[i].image_path = app.app_URL.DOMAIN+data[i].image_path : '';
            }
            indexModel.brands(data);
        }
        catch(e){
            console.log(e.message);
        }
	},
    isEven: ko.computed(function(index){
        return (brandsModel && indexModel.brands().length%2 != 0 && index == indexModel.brands().length-1) ? true : false;
    }),
    bdayFriends: ko.computed(function(){
        return (brandsModel && brandsModel.birthdays().length > 0) ? brandsModel.birthdays().toString() : '';
    }),    
    onStoreChange: function(){
        if(indexModel.user_details().store){
            indexModel.user_details().storeDesc = $$('.store select option[value="'+indexModel.user_details().store+'"]').text();
            indexModel.user_details.valueHasMutated();

            var obj = {
                city: 0,
                store: indexModel.user_details().store
            };

            serviceFacade.makeServiceCall(brandsModel.reloadBrands, {url: 'BRANDS', data: obj});
        }
    },
    reloadBrands: function(data){
        brandsModel.init(data.Data);
    },
    onCityChange: function(){
        if(indexModel.user_details().city){  
            indexModel.user_details().cityDesc = $$('.city select option[value="'+indexModel.user_details().city+'"]').text();  
            var obj = {
                city: indexModel.user_details().city
            };            
            indexModel.locations().stores = [];
            indexModel.user_details().store = '';
            indexModel.brands([]);
            indexModel.locations.valueHasMutated();
            indexModel.user_details.valueHasMutated();

            serviceFacade.makeServiceCall(brandsModel.updateLocation, {url: 'STORES', data: obj}, 'store');
        }
    },
    updateLocation: function(data){
        indexModel.locations().stores = data.Data;
        indexModel.locations.valueHasMutated();

        brandsModel.getBrands();
    },    
    getBrands: function(){
        var obj = {
            city: indexModel.user_details().city,
            store: 0
        };
        serviceFacade.makeServiceCall(brandsModel.reloadBrands, {url: 'BRANDS', data: obj});
    },
    brandDetails: function(data, event){
        /*var brand_id = data.brand_id,
            brand_name = data.brand_name,
            favourites = utils.getFavourites();

        data.pageNo = brandsModel.pageNo;        
        data.isReset = true;
        data.action = 'brand';

        indexModel.getProducts(data, brandsModel.showProducts);*/

        indexModel.resetPaginationParams();

        indexModel.paginationParams.brand_id = data.brand_id;
        indexModel.paginationParams.brand_name = data.brand_name;
        indexModel.paginationParams.sort_by = 'name';
        indexModel.paginationParams.sort_type = 'asc';

        indexModel.getAllProducts(brandsModel.showProducts);
    },    
    showProducts: function(data, brand_info){
        if(data.Data){
            //data.brand_info = brand_info;
            //brandsModel.products = data;
            mainView.router.loadPage('html/products.html');
        }
    }    
};

var brandspage = myApp.onPageInit('brands', function (page) {
    //if(indexModel.brands().length == 0){
        ko.applyBindings(brandsModel, document.getElementById('brands'));        
        brandsModel.init(indexModel.brandsData);
    //}
});