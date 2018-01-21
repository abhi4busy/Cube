var editProfileModel = {
	userdetail: ko.observable({fn:'', mn: '', ln: ''}),

	init: function(){
		var fullname = indexModel.user_details().name,
			phno = indexModel.user_details().phno;
		if(fullname) {
			fullname = fullname.split(' ');	
			if(fullname.length > 2){
				editProfileModel.userdetail({
					fn: fullname[0],
					mn: fullname[1],
					ln: fullname[2],
					phcode: phno.substring(0, 2),
					ph: phno.substring(2)
				});
			}
			else {
				editProfileModel.userdetail({
					fn: fullname[0],
					mn: '',
					ln: fullname[1],
					phcode: phno.substring(0, 2),
					ph: phno.substring(2)
				});
			}
		} 
	},
	updateProfile: function(){	
		var country = indexModel.user_details().country,
			state = indexModel.user_details().state,
			city = indexModel.user_details().city,
			zip = indexModel.user_details().zip,
			obj = '';

		if(country == '' || country === undefined){
            indexModel.showValidationPopup('Please select country');
        }
        else if(state == '' || state === undefined){
            indexModel.showValidationPopup('Please select state');
        }
        else if(city == '' || city === undefined){
            indexModel.showValidationPopup('Please select city');
        }
        else if(zip == ''){
            indexModel.showValidationPopup('Please enter valid zip code');
        }
        else {
        	obj = {
				user_id: indexModel.user_details().id,
				action: 'change_location',
				country: country,
				state: state,
				city: city,
				zip: zip
			};
			serviceFacade.makeServiceCall(editProfileModel.updateProfileSuccess, {url: 'SETTINGS', data: obj});		
        }
		
	},
	updateProfileSuccess: function(data){
		myApp.alert('Details updated successfully', 'Info', function(){
            indexModel.showHomePage();                    
        });
	},
	cancelEdit: function(){
		indexModel.showHomePage();
	}
};

myApp.onPageInit('profileedit', function (page) {
	ko.applyBindings(editProfileModel, document.getElementById('profileedit'));
	editProfileModel.init();	
});