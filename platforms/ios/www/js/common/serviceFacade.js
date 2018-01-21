var serviceFacade = {
    makeServiceCall: function(success, params, metadata, errorHandler){
        if(!indexModel.isOffline){
            myApp.showIndicator();
            console.log("Service Call ::: "+ params.url + " PARAMS ::: "+ JSON.stringify(params.data));
            $$.ajax({
                url : app.app_URL[params.url],
                data: params.data,
                async : true,
                cache : false,
                method : 'POST',
                timeout: 20000,
                success : function(data){
                    serviceFacade.processSucess(data, success, metadata, params.url, errorHandler);
                },
                error: function(err){                    
                    serviceFacade.handleError(err);
                }
            });
        }
        else {
            alert('Network connectivity failed.');
        }
    },
    handleError: function(error){
        myApp.hideIndicator();
        indexModel.showErrorPopup('Could not connect to server, please try again later.');
    },
    processSucess: function(data, success, metadata, key, errorHandler){
        try{
            if(data && data != null && data !== 'null'){
                console.log("Service Response ::: "+ data );

                if(typeof data === "string"){
                   data = $.parseJSON(data);
                }

                var code = data.status;

                switch(code){
                    case 1:
                        setTimeout(function(){
                            myApp.hideIndicator();
                        }, 1000);
                        success(data, metadata); 
                        break;

                    default: 
                        /*if( key === 'LOGIN'){
                            indexModel.showLogin();
                        } 
                        else*/ if(errorHandler != undefined && typeof errorHandler == 'function'){
                            errorHandler();
                        }   
                        else {
                            indexModel.showErrorPopup(data.msg);
                        }                        
                        myApp.hideIndicator();
                        break;
                }
            }
            else {
                indexModel.showErrorPopup('Could not connect to server, please try again later.');
                myApp.hideIndicator();
            }
        }catch(e){
            console.log(e.message);
            indexModel.showErrorPopup('Service unavailable, please try again later.');
            myApp.hideIndicator();
        }
    }
};