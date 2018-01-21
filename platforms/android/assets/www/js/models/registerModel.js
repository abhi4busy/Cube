var registerModel = {
	locations: ko.observable({countries:[], states:[], cities:[], stores:[]}),
	selectedCountry: ko.observable(''),
	selectedState: ko.observable(''),
	selectedCity: ko.observable(''),
    user_id: '',
    
    resetObservables: function(){
        registerModel.locations({countries:[], states:[], cities:[], stores:[]});
        registerModel.selectedCountry('');
		registerModel.selectedState('');
		registerModel.selectedCity('');

		$$('#register input').val();
    },
    init: function(data){  
    	registerModel.resetObservables();

    	registerModel.updateLocations(data, 'country');        
    },    
    updateLocations: function(data, type){
    	switch(type){
    		case 'country':
    			registerModel.locations().countries = data;
    			break;
    		case 'state':
    			registerModel.locations().states = data;
    			break;
    		case 'city':
    			registerModel.locations().cities = data;
    			break;
    	}
    	registerModel.locations.valueHasMutated();
    },
    onCountryChange: function(){ 
    	if(registerModel.selectedCountry()){   	
	        var obj = {
	            action: 'state',
	            country: registerModel.selectedCountry()
	        };

	        serviceFacade.makeServiceCall(registerModel.loadStates, {url: 'LOCATIONS', data: obj});
    	}    	
    },
    loadStates: function(data){
    	registerModel.updateLocations(data.Data, 'state');
    },
    onStateChange: function(){    	
    	if(registerModel.selectedCountry()){
	        var obj = {
	            action: 'city',
	            state: registerModel.selectedState()
	        };

	        serviceFacade.makeServiceCall(registerModel.loadCities, {url: 'LOCATIONS', data: obj});
        }    	
    },
    loadCities: function(data){
    	registerModel.updateLocations(data.Data, 'city');
    },
    submitRegistration: function(){
    	try{
            var title = $$('.register .mrlabel').val(),
            fn = $$('.register .fname').val(),
            mn = $$('.register .mname').val(),
            ln = $$('.register .lname').val(),
            phCode = $$('.register .co_code').val(),
            phNo = $$('.register .phone').val(),
            email = $$('.register .email').val(),
            pass = $$('.register .password').val(),
            repass = $$('.register .repassword').val(),
            country = $$('.register .country select').val(),
            state = $$('.register .state select').val(),
            city = $$('.register .city select').val(),
            addr = $$('.register .address').val(),
            dob = $$('#calendar-dob').val(),
            zip = $$('.register .zip').val(),
            request = '';


            if(!indexModel.validateInput('.register .mrlabel')){
                indexModel.showValidationPopup('Please select title');
            }
            else if(!indexModel.validateInput('.register .fname')) {
                indexModel.showValidationPopup('Please enter valid first name');
            }
            else if(!indexModel.validateInput('.register .lname')){
                indexModel.showValidationPopup('Please enter valid last name');
            }
            else if(dob === ''){
                indexModel.showValidationPopup('Please enter date of birth');
            }            
            else if(!indexModel.validateInput('.register .co_code')){
                indexModel.showValidationPopup('Please enter phone code');
            }
            else if(!indexModel.validateInput('.register .phone')){
                indexModel.showValidationPopup('Please enter valid phone number');
            }
            else if(!indexModel.validateInput('.register .email')){
                indexModel.showValidationPopup('Please enter valid email');
            }
            else if(!indexModel.validateInput('.register .password')){
                indexModel.showValidationPopup('Please enter valid password');
            }
            else if(pass != repass){
                indexModel.showValidationPopup('Password do not match');
            }
            else if(country == '' || country === undefined){
                indexModel.showValidationPopup('Please select country');
            }
            else if(state == '' || state === undefined){
                indexModel.showValidationPopup('Please select state');
            }
            else if(city == '' || city === undefined){
                indexModel.showValidationPopup('Please select city');
            }
            else if(!indexModel.validateInput('.register .zip')){
                indexModel.showValidationPopup('Please enter valid zip code');
            }
            else if(!indexModel.validateInput('.register .address')){
                indexModel.showValidationPopup('Please enter valid address');
            }
            else {
                request = {
                    title: title,
                    firstname: fn,
                    middlename: mn,
                    lastname: ln,
                    email: email,
                    password: pass,
                    phone: phCode+""+phNo,
                    dob: dob,
                    country: country,
                    city: city,
                    state: state,
                    address: addr,
                    pincode: zip
                };
                serviceFacade.makeServiceCall(registerModel.registerSuccess, {url: 'REGISTER', data: request});
            }
        }
        catch(e){
            console.log(e.message);
        }
    },
    registerSuccess: function(data){
        indexModel.isNavThrReg = true;
        registerModel.user_id = data.user_id;

        var obj = {
            isRegistered: true,
            username: $$('.register .email').val(),
            password: $$('.register .password').val(),
            isLoggedin: true
        };
        utils.setUserInfo(obj);
        
        (data.catgory) ? indexModel.categories(data.catgory) : '';

        indexModel.uploadPicNav = 'register';
        indexModel.uploadPic();
        //indexModel.doLogin();
    }
};

myApp.onPageInit('register', function (page) {
    calendarDefault = myApp.calendar({
        input: '#calendar-dob'
    });
    ko.applyBindings(registerModel, document.getElementById('register'));
    registerModel.init(indexModel.registerData);
});