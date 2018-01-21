var viewMoreModel = {
	pagedata: ko.observable(''),
	isPurchase: ko.observable(false),

	init: function(data){
		viewMoreModel.pagedata(data);
		(viewMoreModel.pagedata().type == 'purchased') ? viewMoreModel.isPurchase(true) : viewMoreModel.isPurchase(false);
	},
	/*isPurchase: ko.computed(function(){
		return (viewMoreModel && viewMoreModel.pagedata() && viewMoreModel.pagedata().type == 'purchased') ? true : false;
	}, this),*/
	showDetails: function(data, event){
		myCubeModel.showDetails(data, event);
	},
	sendGift: function(data, event){
		myCubeModel.sendGift(data, event);
	}
};

myApp.onPageInit('viewmore', function (page) {
	ko.applyBindings(viewMoreModel, document.getElementById('viewmore'));
	viewMoreModel.init(myCubeModel.viewmoreData());

	$$('.navbar .cubeback').click(function(){
        mainView.router.back({url: 'html/brands.html', force: true});    
    });
});