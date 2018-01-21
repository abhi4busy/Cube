var contactsModel = {
	init: function(){
		myApp.hideIndicator();
	},
	inviteFriend: function(data, event){
		var name = data.fullname.split(' '),
			mobile = data.mobile;

		myApp.prompt('Please enter email address', function (value) {
            var pattern = /\S+@\S+\.\S+/;
            if(!pattern.test(value)){
                indexModel.showValidationPopup('Please enter valid email address');
            }
            else {
                contactsModel.sendInvite(name, mobile, value);
            }
        });
	},
	sendInvite: function(name, mobile, email){		
		var fname='', lname='';

		if(name.length > 2){
			fname = name[0]+' '+name[1];
			lname = name[2];
		}
		else {
			fname = name[0];
			lname = name[1];
		}
		var obj = {
			user_id: indexModel.user_details().id,
			firstname: fname,
			lastname: lname,
			mobile: mobile,
			email: email
		};		
		serviceFacade.makeServiceCall(contactsModel.inviteSuccess, {url: 'INVITE', data: obj});
	},
	manualInvite: function(){
		var name = $$(".inviteToggle .name").val(),
            mobile = $$(".inviteToggle .mno").val(),
			email = $$(".inviteToggle .email").val(),
            fullname = name.split(' '),
			obj = '';

		if(!indexModel.validateInput('.inviteToggle .name')){
            indexModel.showValidationPopup('Please enter valid name');
        }
        else if(!indexModel.validateInput('.inviteToggle .mno')){
            indexModel.showValidationPopup('Please enter valid mobile number');
        }
        else if(!indexModel.validateInput('.inviteToggle .email')){
            indexModel.showValidationPopup('Please enter valid email');
        }
        else {
        	obj = {
				user_id: indexModel.user_details().id,
				firstname: fullname[0],
                lastname: (fullname[1]) ? fullname[1] : '',
				mobile: mobile,
				email: email
			};		
			serviceFacade.makeServiceCall(contactsModel.inviteSuccess, {url: 'INVITE', data: obj});
        }
		
	},
	inviteSuccess: function(data){
		indexModel.showValidationPopup('Invitation sent successfully.');
        $$(".inviteToggle input").val('');
	}	
};

myApp.onPageInit('invitefrd', function (page) {
    ko.applyBindings(contactsModel, document.getElementById('invitefrd'));
    contactsModel.init();

    $$('.navbar .inviteback').click(function(){
        mainView.router.back({url: 'html/brands.html', force: true});    
    });

    $$('.contactsToggle').on('accordion:opened', function () {
	    myApp.alert('Accordion item opened');
	    if(indexModel.contacts().length == 0) {        
	        indexModel.readContacts();
	    }
	});
});