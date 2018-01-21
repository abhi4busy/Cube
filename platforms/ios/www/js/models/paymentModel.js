var paymentModel = {
	cardinfo: ko.observable(''),

	init: function(){
		var pickerDescribe = myApp.picker({
	        input: '#datepicker',
	        rotateEffect: true,
	        cols: [
	            {
	                textAlign: 'left',
	                values: ('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec').split(' ')
	            },
	            {
	                values: indexModel.getMaxYears()
	            }
	        ]
	    }); 
        if(indexModel.user_details().cards){
            $$('.payment .cardnumber').attr('type', 'text');
            $$('.payment input').attr('readonly', 'readonly');
            $$('.payment .ccv').removeAttr('readonly');

            var cards = indexModel.user_details().cards,
                date = cards[0].expdate.split('-');

            paymentModel.cardinfo({
                name: cards[0].name,
                ccv: '',
                expdate: app.nummonths[date[0]]+' '+date[1],
                cardno: indexModel.formatCardNo(cards[0].cardno)
            });            
        }
        else {
            paymentModel.cardinfo({
                name: '',
                ccv: '',
                expdate: '',
                cardno: ''
            });
    	    $$('.payment input').val('');
        }
	},
	payNow: function(data, event){
        indexModel.blurInputs();

		var name = paymentModel.cardinfo().name,
            ccv = paymentModel.cardinfo().ccv,
            expDate = paymentModel.cardinfo().expdate,
            cardno = paymentModel.cardinfo().cardno,
            date = new Date(),
            today = new Date(),
            expSplit = (expDate) ? expDate.split(' ') : ''; 

        if(expDate){            
            date.setMonth(app.months[expSplit[0]]);    
            date.setFullYear(expSplit[1]);
        }
        
        if(!indexModel.validateInput('.payment .cardnumber')){
            indexModel.showValidationPopup('Please enter valid card number');
        }
        else if(cardno.length < 16){
            indexModel.showValidationPopup('Please enter valid card number');
        }
        else if(!indexModel.validateInput('.payment .name')){
            indexModel.showValidationPopup('Please enter valid name');
        }
        else if(!indexModel.validateInput('.payment .ccv')) {
            indexModel.showValidationPopup('Please enter valid CCV');
        }
        else if(ccv.length != 3) {
            indexModel.showValidationPopup('Please enter valid CCV');
        }
        else if(!indexModel.validateInput('.payment .expdate')){
            indexModel.showValidationPopup('Please select valid expiry date');
        }
        else if(date < today){
            indexModel.showValidationPopup('Please select valid expiry date');
        }        
        else {
            indexModel.confirmNavigation = 'newpay';
            myApp.popup('.popup-payment');
        }
	}
};

myApp.onPageInit('payment', function (page) {
	//if(!paymentModel || !paymentModel.cardinfo){
	    ko.applyBindings(paymentModel, document.getElementById('payment'));    
	    paymentModel.init();
	//}
});