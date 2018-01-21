var $$ = Dom7,
    // Loading flag
    loading = false,
 
    // Max items to load
    maxItems = 100,
     
    // Append items per load
    itemsPerLoad = 10,

    // Initialize your app
    myApp = new Framework7({
        // Default title for modals
        modalTitle: 'Cube App',
        
        // Hide and show indicator during ajax requests
        onAjaxStart: function (xhr) {
            myApp.showIndicator();
        },
        onAjaxComplete: function (xhr) {
            myApp.hideIndicator();
        }
    }),
    mainView = myApp.addView('.view-main', {dynamicNavbar: true}),
    calendarDefault = myApp.calendar({
        input: '#calendar-dob'
    }),
    indexModel = {
        isOffline: false,
        registerData: '',
        brandsData: '', 
        user_details: ko.observable(''),  
        locations: ko.observable({countries:[], states:[], cities:[], stores:[]}),
        birthdays: [],
        profilepic: ko.observable(''),
        brands: ko.observableArray([]),
        purchasedProds: ko.observableArray(''),
        payConfirm: ko.observable({refno:'', pin:''}),
        contacts: ko.observableArray([]),
        cubies: ko.observableArray([]),
        selectedCubie: ko.observable(''),
        myCubeData: '',
        confirmNavigation: '',
        sendgiftnavigation: '',
        uploadPicNav: 'menu',
        isLoginPopupOpen: false,
        editProfilePopupOpen: false,
        categories: ko.observableArray([]),
        favSelected: ko.observableArray([]),
        isNavThrReg: false,
        lastIndex: 0, // Last loaded index for pagination
        pageNo: 1,
        paginationParams: {
            isDefault: true,
            isPagination: false,
            sort_by: 'name',
            sort_type: 'asc',
            pageNo: 1
        },
        productsArray: ko.observableArray([]),

        init: function(){
            var userInfo = utils.getUserInfo(),
                isRegistered = (userInfo) ? userInfo.isRegistered : '',
                isLoggedin = (userInfo) ? userInfo.isLoggedin : '';

            if(isRegistered){        
                if(isLoggedin){            
                    (indexModel.brandsData.length == 0) ? indexModel.doLogin() : '';
                }
                else {
                    indexModel.showLogin();
                }
            }
            else {
                $$(".navbar").hide();
                serviceFacade.makeServiceCall(indexModel.showRegistration, {url: 'LOCATIONS', data: {action: 'country'}}, 'register');
            }
        },
        showRegistration: function(data, action){
            if(data.Data){
                indexModel.registerData = data.Data;
                (action == 'register') ? mainView.router.loadPage('html/register.html') : mainView.router.loadPage('html/profile-edit.html');
            }
        },        
        showValidationPopup: function(message){
            myApp.alert(message, 'Alert');
        },
        showErrorPopup: function(message){
            myApp.alert(message, 'Error');
        },
        showSuccessPopup: function(message){
            myApp.alert(message, 'Success');
        },
        onOffline: function(){
            indexModel.isOffline = true;
            indexModel.showValidationPopup('Network connectivity not available');
        },
        refreshCurrentPage: function(){
            mainView.router.refreshPage();
        },
        blurInputs: function(){
            $("input,select").blur();
        },
        validateInput: function(ele){
            var pattern = '',
                input = $$(ele).val(),
                type = $$(ele).attr('type');

            switch(type){
                case 'number': 
                    pattern=/^\d+$/;
                    break;
                case 'text': 
                    pattern=/^[A-z0-9\s]+$/;
                    break;
                case 'email': 
                    pattern=/\S+@\S+\.\S+/;
                    break;
                default:
                    pattern=/^[A-z0-9\s]+$/;
                    break;
            }

            if($.trim(input) === ''){
                return false;
            }
            else if(!pattern.test(input)){
                return false;
            }
            else {
                return true;
            }
        },
        formatCardNo: function(cardno){
            var part1 = cardno.substring(0, 4),
                part2 = cardno.substring(4, 8),
                part3 = cardno.substring(8, 12),
                part4 = cardno.substring(12, 16);

            return part1 + part2.replace(/\d/g, 'X') + part3.replace(/\d/g, 'X') + part4;            
        },
        getMaxYears: function(){            
            var currentYear = new Date().getFullYear(), years = [],
            maxYear = currentYear + 30;

            while ( maxYear >= currentYear ) {
                    years.push(currentYear++);
            } 

            return years;
        },
        applyEvents: function(selector, handler){
            $$(selector).off('click', handler);    
            $$(selector).on('click', handler);   
        },
        showCartItems: function(){
            var cartInfo = utils.getCartInfo(),
                items = (cartInfo.items) ? cartInfo.items : 0;

            if(items > 0){
                mainView.router.loadPage('html/cart.html');
            }
            else {
                indexModel.showValidationPopup('Cart is empty!');
            }
        },
        showHomePage: function(){
            (indexModel.editProfilePopupOpen) ? myApp.closeModal('.popup-uploadpicture') : '';
            mainView.router.loadPage('html/brands.html');   
        },
        showLogin: function(){  
            indexModel.isLoginPopupOpen = true;                    
            myApp.loginScreen();        
            $$('.login-screen input').val('');            
        },
        isBindingApplied: function(id){
            return !!ko.dataFor(document.getElementById(id));
        },
        doLogin: function(){
            var userInfo = utils.getUserInfo(),
                request = {
                email: userInfo.username,
                password: userInfo.password
            };

            serviceFacade.makeServiceCall(indexModel.loginSuccess, {url: 'LOGIN', data: request}, request);

        },
        loginClick: function(){
            try{
                var username = $$('.login-screen input[name="username"]').val(),
                    password = $$('.login-screen input[name="password"]').val(),
                    request='', data='';

                if(!username || !password){
                    indexModel.showValidationPopup('Please enter Email ID and Password');
                }
                else {
                    request = {
                        email: username,
                        password: password
                    };
                    data = {
                        email: username,
                        password: password,
                        profilePic: ''
                    };

                    serviceFacade.makeServiceCall(indexModel.loginSuccess, {url: 'LOGIN', data: request}, data);
                }
            }
            catch(e){
                console.log(e.message);
            }
        },
        loginSuccess: function(data, userInfo){
            
            if(data){   
                var obj = {
                    isRegistered: true,
                    username: userInfo.email,
                    password: userInfo.password,
                    isLoggedin: true
                };
                utils.setUserInfo(obj);
                indexModel.locations({
                    countries: data.countries,
                    cities: data.cities,
                    states: data.states,
                    stores: data.stores
                });

                indexModel.user_details({
                    id: data.user_id,
                    name:data.name,
                    email:userInfo.email,
                    dob:data.dob,
                    phno:data.phone_no,
                    zip:data.zip,
                    city: (data.city_id) ? data.city_id : '',
                    cityDesc: (data.city_name) ? data.city_name : '',
                    state: (data.state_id) ? data.state_id : '',
                    stateDesc: (data.state_name) ? data.state_name : '',
                    country: (data.country_id) ? data.country_id : '',
                    countryDesc: (data.country_name) ? data.country_name : '',
                    store: '',
                    cards: (data.cards) ? data.cards : ''
                });                
                indexModel.uploadPicNav = 'menu';
                indexModel.birthdays = data.birthday;
                (data.profile_pic) ? indexModel.profilepic(data.profile_pic) : indexModel.profilepic('img/profile_pic.png');

                if(data.catgory) {
                    indexModel.categories(data.catgory);                    
                    indexModel.favSelected([]);
                } 


                /*indexModel.user_details().id = data.user_id;
                indexModel.user_details().name = data.name;
                indexModel.user_details().city = (data.city_id) ? data.city_id : '';
                indexModel.user_details().cityDesc = (data.city_name) ? data.city_name : '';
                indexModel.user_details().state = (data.state_id) ? data.state_id : '';
                indexModel.user_details().country = (data.country_id) ? data.country_id : '';
                indexModel.user_details().countryDesc = (data.country_name) ? data.country_name : '';
                indexModel.user_details().store = '';
                indexModel.user_details.valueHasMutated();

                indexModel.locations().countries = data.countries;
                indexModel.locations().cities = data.cities;
                indexModel.locations().states = data.states;
                indexModel.locations().stores = data.stores;
                indexModel.locations.valueHasMutated();*/
            }
            serviceFacade.makeServiceCall(indexModel.showBrands, {url: 'BRANDS', data: {city: indexModel.user_details().city, store: 0}});
        },
        setLocations: function(data, type){
            switch(type){
                case 'country':
                    indexModel.locations().countries = data;
                    break;
                case 'state':
                    indexModel.locations().states = data;
                    break;
                case 'city':
                    indexModel.locations().cities = data;                
                    break;
                case 'store':
                    indexModel.locations().stores = data;
                    break;
            }
            indexModel.locations.valueHasMutated();
        },
        updateLocation: function(data, type){
            indexModel.setLocations(data.Data, type);
        },
        onCountryChange: function(){
            if(indexModel.user_details().country){  
                indexModel.user_details().countryDesc = $$('.country select option[value="'+indexModel.user_details().country+'"]').text();
                var obj = {
                    action: 'state',
                    country: indexModel.user_details().country
                };
                indexModel.locations().states = [];
                indexModel.locations().cities = [];
                indexModel.locations().stores = [];
                indexModel.user_details().state = '';
                indexModel.user_details().city = '';
                indexModel.user_details().store = '';
                indexModel.brands([]);
                indexModel.locations.valueHasMutated();
                indexModel.user_details.valueHasMutated();

                serviceFacade.makeServiceCall(indexModel.updateLocation, {url: 'LOCATIONS', data: obj}, 'state');
            }
        },    
        onStateChange: function(){
            if(indexModel.user_details().state){ 
                indexModel.user_details().stateDesc = $$('.state select option[value="'+indexModel.user_details().state+'"]').text();   
                var obj = {
                    action: 'city',
                    state: indexModel.user_details().state
                };
                indexModel.locations().cities = [];
                indexModel.locations().stores = [];
                indexModel.user_details().city = '';
                indexModel.user_details().store = '';
                indexModel.brands([]);
                indexModel.locations.valueHasMutated();
                indexModel.user_details.valueHasMutated();

                serviceFacade.makeServiceCall(indexModel.updateLocation, {url: 'LOCATIONS', data: obj}, 'city');
            }
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

                serviceFacade.makeServiceCall(indexModel.updateLocation, {url: 'STORES', data: obj}, 'store');
            }
        },
        onStoreChange: function(){
            /*if(indexModel.user_details().store){
                indexModel.user_details().storeDesc = $$('.store select option[value="'+indexModel.user_details().store+'"]').text();
                indexModel.user_details.valueHasMutated();
            }*/
        },
        showBrands: function(data){
            if(data.Data){
                indexModel.brandsData = data.Data;

                $$(".navbar").show();
                if(indexModel.isNavThrReg){
                    myApp.showIndicator();

                    indexModel.sendInvite();                    
                }
                else {
                    mainView.router.loadPage({url: 'html/brands.html', reload: true});

                    (indexModel.isLoginPopupOpen) ? myApp.closeModal('.login-screen') : '';
                    (indexModel.editProfilePopupOpen) ? myApp.closeModal('.popup-uploadpicture') : '';
                }
            }
            else {
                myApp.alert('Error fetching details! Please login again.', 'Alert', function(){
                    indexModel.showLogin();                    
                });
            }
        },
        checkProductExists: function(product_id){
            var cartInfo = utils.getCartInfo(),
                products = (cartInfo.products) ? cartInfo.products : [],
                index = -1;

            for(var i=0; i<products.length; i++){
                if(products[i].id == product_id){
                    index = i;
                    break;
                }
            }

            return (index == -1) ? false : true;
        },
        addToCart: function(data){
            try{
                var cartInfo = utils.getCartInfo(),
                    products = (cartInfo.products) ? cartInfo.products : [],
                    items = (cartInfo.items) ? cartInfo.items : 0,
                    total = (cartInfo.totalCost) ? cartInfo.totalCost : 0,
                    price = parseFloat(data.price),
                    obj = '', index = -1;

                products.push(data);
                items = items + 1;
                total = total + price;

                obj = {
                    products: products,
                    totalCost: total,
                    items: items
                };
                utils.setCartInfo(obj);         
                $$('.cap').text(items);

                indexModel.showValidationPopup('Item added to cart successfully.');                           
                return true;
            }
            catch(e){
                return false;
                console.log(e.message);
            }

        },
        removeCartItem: function(product_id){
            var cartInfo = utils.getCartInfo(),
                products = (cartInfo.products) ? cartInfo.products : [],
                total = (cartInfo.totalCost) ? cartInfo.totalCost : 0,
                items = (cartInfo.items) ? cartInfo.items : 0,
                index = -1,
                obj = '';

            for(var i=0; i<products.length; i++){
                if(products[i].id == product_id){
                    index = i;
                    break;
                }
            }
            if(index != -1) {           
                items = items - 1;          
                total = (items != 0) ? total - parseFloat(products[index].price) : 0;
                products.splice(index, 1);
                            
                obj = {
                    products: products,
                    totalCost: total,
                    items: items
                };
                utils.setCartInfo(obj);         
                $$('.cap').text(items);

                if(items > 0){
                    mainView.router.refreshPage();
                    indexModel.showValidationPopup('Item removed successfully.');
                }
                else {
                    myApp.alert('Cart empty !!!', 'Alert', function(){
                        mainView.router.back();
                    });
                }
            } 
        },
        resetCart: function(){
            var cart_details = {
                products: [],
                totalCost: '',
                items: 0
            }
            utils.setCartInfo(cart_details);
        },
        getbrands: function(){
            var brands = [];
            if(indexModel && indexModel.purchasedProds().products && indexModel.purchasedProds().products.length > 0){
                for(var i=0; i<indexModel.purchasedProds().products.length; i++){
                    brands.push(indexModel.purchasedProds().products[i].brand);
                }
            }
            return brands;
        },
        getProds: function(){
            var prods = [];
            if(indexModel && indexModel.purchasedProds().products && indexModel.purchasedProds().products.length > 0){
                for(var i=0; i<indexModel.purchasedProds().products.length; i++){
                    prods.push(indexModel.purchasedProds().products[i].name);
                }
            }
            return prods;
        },
        getLocation: function(){
            var loc = '',
            store = (indexModel.user_details().storeDesc) ? indexModel.user_details().storeDesc+", " : '';
            
            if(indexModel && indexModel.user_details()){
                loc = store+indexModel.user_details().cityDesc+", "+indexModel.user_details().countryDesc;
            }
            return loc;
        },
        getTotalCost: function(){
            var total = 0;
            if(indexModel && indexModel.purchasedProds().products && indexModel.purchasedProds().totalPay){
                total = indexModel.purchasedProds().totalPay;
            }
            return total;
        },
        confirmPay: function(data, event){
            var info = '',month='', cardinfo='',
                cards = indexModel.user_details().cards;

            if(cards){
                if(cards.length > 1){
                    cardinfo = cards[0].cardno+'_'+cards[0].expdate+'_'+cards[0].name;
                }
                else {
                    cardinfo = cards[0].cardno+'_'+cards[0].expdate+'_'+cards[0].name;
                }
            }
            else {
                month = paymentModel.cardinfo().expdate.split(' '),
                cardinfo = paymentModel.cardinfo().cardno+'_'+app.months[month[0]]+'-'+month[1]+'_'+paymentModel.cardinfo().name;
            }

            if(indexModel.purchasedProds().products.length > 0){
                for(var i=0; i<indexModel.purchasedProds().products.length; i++){
                    info += indexModel.purchasedProds().products[i].id+'_'+indexModel.purchasedProds().products[i].price +',';
                    /*info.push({
                        id: cube.payment_info.products[i].id,
                        price: cube.payment_info.products[i].price.substring(1)
                    });*/   
                }
                info = info.substring(0, info.length-1)
            }
            var obj = {
                user_id: indexModel.user_details().id,
                //store_id: indexModel.user_details().store,
                total: indexModel.purchasedProds().totalPay,
                products: info,
                cardinfo: cardinfo
            };        
            serviceFacade.makeServiceCall(indexModel.paymentSuccess, {url: 'ORDERS', data: obj});
        },
        paymentSuccess: function(data){
            if(data){
                indexModel.payConfirm({
                   refno: '46834980982384023', 
                   pin: '#****'
                });                

                indexModel.resetCart();
                mainView.router.loadPage('html/confirmation.html');
            }
        },
        readContacts: function(){
            if(indexModel.contacts().length == 0) {
                myApp.showIndicator();
                // find all contacts with 'Bob' in any name field
                var options      = new ContactFindOptions();
                options.filter   = "";
                options.multiple = true;
                var fields       = ["displayName", "name", "phoneNumbers"]; //here you would add phoneNumbers

                navigator.contacts.find(fields, indexModel.readContactsSuccess, indexModel.readContactsFail, options);
            }
        },
        readContactsSuccess: function(contacts, reload){
            var fullname='', firstname='', lastname='', phno='';
            indexModel.contacts([]);

            for(var i=0; i<contacts.length; i++){
                if(contacts[i].phoneNumbers != null) {
                    
                    if(contacts[i].displayName){
                        fullname = contacts[i].displayName;
                    }
                    else if(contacts[i].name) {
                        fullname = contacts[i].name.formatted;
                    }
                    //fullname = (contacts[i].displayName) ? (contacts[i].displayName) : '';               
                    phno = contacts[i].phoneNumbers[0].value.replace(/\D/g,"");            

                    indexModel.contacts().push({fullname: fullname, mobile: phno});
                }
            }
            indexModel.contacts.valueHasMutated();
            myApp.hideIndicator();
            //cube.contacts = cube.contacts.sort(cube_contacts.cSort);

            //(reload) ? mainView.router.reloadPage() : mainView.router.loadPage('html/invite_friend.html');
        },
        filterContacts: function(key){
            myApp.showIndicator();
            // find all contacts with 'Bob' in any name field
            var options      = new ContactFindOptions();
            options.filter   = key;
            options.multiple = true;
            var fields       = ["displayName", "name", "phoneNumbers"]; //here you would add phoneNumbers

            navigator.contacts.find(fields, cube.readContactsSuccess, cube.readContactsFail, options, true);
        },
        readContactsFail: function(){
            myApp.hideIndicator();
            cube.validationPopup('Unable to fetch contacts.');
        },
        myCube: function(data, event){
            var obj = {
                user_id: indexModel.user_details().id
            };
            serviceFacade.makeServiceCall(indexModel.loadCube, {url: 'MYCUBE', data: obj});
        },
        loadCube: function(data){
            var items = '', purchased=false, gifted=false, sent=false;
            
            if(data.purchased && data.purchased.length > 0){
                items = indexModel.validateItem(data.purchased);
                (items.length > 0) ? purchased=true : purchased=false;
            }
            if(data.Gifted_to_me && data.Gifted_to_me.length > 0){
                items = indexModel.validateItem(data.Gifted_to_me);
                (items.length > 0) ? gifted=true : gifted=false;
            }
            if(data.sent && data.sent.length > 0){
                items = indexModel.validateItem(data.sent);
                (items.length > 0) ? sent=true : sent=false;
            }

            if(purchased || gifted || sent){
                indexModel.myCubeData = data;
                indexModel.sendgiftnavigation = 'cube';
                mainView.router.loadPage('html/gift_box.html');
            }
            else {
                indexModel.showValidationPopup('No items available.');
            }
        },
        validateItem: function(data){
            var items = [];
            for(var i=0; i<data.length; i++){
                if(data[i].status == 1){
                    (data[i].image_path.indexOf('http') == -1) ? data[i].image_path = app.app_URL.DOMAIN+data[i].image_path : '';
                    items.push(data[i]);                
                }
            }
            return items;
        },
        sendGift: function(data, event){
            var obj = {
                action: 'remaining_gift',
                user_id: indexModel.user_details().id
            };
            serviceFacade.makeServiceCall(indexModel.showGiftSendPage, {url: 'SEND_GIFT', data: obj}, data);
        },
        sendInvite: function(data, event){
            //close popup if from registration
            setTimeout(function(){
                (indexModel.isLoginPopupOpen) ? myApp.closeModal('.login-screen') : '';
                (indexModel.editProfilePopupOpen) ? myApp.closeModal('.popup-uploadpicture') : '';
            }, 1000);

            mainView.router.loadPage('html/invite_friend.html');            
        },
        doLogout: function(data, event){
            utils.setUserLogin(false);
            setTimeout(function(){
                indexModel.showLogin();
            }, 500);            
        },
        selectFriend: function(data, event){
            var name = data.name,
                mobile = data.mobile;
            indexModel.selectedCubie({
                id: data.id,
                name: name,
                mobile: mobile
            });
            sendGiftModel.btnlbl(name+" : "+mobile);
            sendGiftModel.btnlbl.valueHasMutated();

            myApp.closeModal('.popup-friends');
        },        
        showGiftSendPage: function(data, action){
            if(data.data && data.data.length > 0){
                indexModel.sendgiftnavigation = 'gift';
                /*if(data.data){
                    for(var i=0; i<data.data.length; i++){
                        data.data[i].product_name = data.data[i].product;
                        data.data[i].brand_name = data.data[i].brand;
                        data.data[i].order_id = data.data[i].id;
                        data.data[i].image_path = data.data[i].image;
                    }
                }
                var obj = {
                    title: 'Cube A Friend',
                    type: 'purchased',
                    data: data.data
                };
                myCubeModel.viewmoreData(obj);
                mainView.router.loadPage('html/viewmore.html');*/
                
                myCubeModel.giftData = {
                    product: data.data,
                    friend: '',
                    navigation: 'gift'
                }     

                if(action && action == 'reload'){
                    sendGiftModel.init(myCubeModel.giftData);
                    mainView.router.reloadPage();
                }  
                else {
                    mainView.router.loadPage({'url': 'html/gift_send.html', 'ignoreCache': true});        
                }
            }
            else {
                indexModel.showValidationPopup('No items available.');
            }
        },
        uploadPic: function(action){
            var favourites = utils.getFavourites();
            if(favourites){
                favourites = favourites.split(',');
                indexModel.favSelected(favourites);
            }

            $$('.btnlbl').text('no file selected...');
            $('.popup-uploadpicture li').prop('checked', false);
            myApp.popup('.popup-uploadpicture');
        },
        openFile: function(){
            myApp.showIndicator();
            navigator.camera.getPicture(indexModel.getPhoto, function(message) {
                myApp.hideIndicator();
                indexModel.showValidationPopup('get picture failed');
            }, {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }); 
        },
        getPhoto: function(imageURI){   
            myApp.hideIndicator();                 
            indexModel.profilepic(imageURI);
            $$('.btnlbl').text(imageURI);            
        },
        uploadPhoto: function(){            
            var imageURI = indexModel.profilepic(),
                params = new Object(),
                options = new FileUploadOptions();
            
            try{
                if($$('.btnlbl').text().indexOf('no file') == -1){
                    myApp.showIndicator();

                    var favourites = $('#favbox:checked').map(function() {return this.value;}).get().join(',');
                    if(favourites){
                        utils.setFavourites(favourites);
                    }

                    options.fileKey = "uploaded_file";
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    console.log(options.fileName);

                    params.action = "upload";
                    params.user_id = (indexModel.uploadPicNav == 'register') ? registerModel.user_id : indexModel.user_details().id;            
                    options.params = params;
                    options.chunkedMode = false;

                    console.log('uploading photo............'); 
                    var ft = new FileTransfer();
                    ft.upload(imageURI, app.app_URL['PHOTO'], function(result){                    
                        console.log(JSON.stringify(result));
                        utils.setProfilePic(imageURI);

                        myApp.hideIndicator();
                        myApp.alert('Profile picture uploaded successfully', 'Info', function(){
                            (indexModel.uploadPicNav == 'menu') ? indexModel.showHomePage() : indexModel.doLogin();                    
                        });

                    }, function(error){
                        myApp.hideIndicator();
                        indexModel.showValidationPopup('Profile picture upload failed');
                        console.log(JSON.stringify(error));
                    }, options);
                }
                else {
                    indexModel.showValidationPopup('Please select profile picture');
                }
            }catch(e){
                console.log(e.message);
            }
        },
        editProfile: function(){
            serviceFacade.makeServiceCall(indexModel.showRegistration, {url: 'LOCATIONS', data: {action: 'country'}}, 'edit');    
        },
        filterProds: function(data, event){
            var category = data;
        },                
        /*getProducts: function(data, success){
            if(data.isReset) {
                data.sort_by = 'name',
                data.sort_type = 'asc';
            }
            var obj = {
                    action: 'get_products',
                    brand_id: data.brand_id,
                    //categories: favourites,
                    sort_by: data.sort_by,
                    sort_type: data.sort_type,
                    page: data.pageNo
                };
            serviceFacade.makeServiceCall(success, {url: 'PRODUCTS', data: obj}, data);
        },
        showAllProducts: function(data, info) {
            if(data.Data){
                //1st load
                if(info.isReset) {
                    data.brand_info = {
                        brand_id: info.brand_id, 
                        brand_name: info.brand_name
                    };
                    brandsModel.products = data;
                    mainView.router.loadPage('html/items.html');
                }
                //pagination
                else {
                    // Reset loading flag
                    loading = false;

                    indexModel.lastIndex = indexModel.lastIndex + 10;
                    (data.next_page) ? indexModel.pageNo=indexModel.pageNo+1 : ''; 
                    
                    if (indexModel.lastIndex >= maxItems || !data.next_page) {
                      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                      myApp.detachInfiniteScroll($$('.infinite-scroll'));

                      // Remove preloader
                      $$('.infinite-scroll-preloader').remove();

                      //return;
                    }

                    var newData = indexModel.validateProduct(data),
                        array = [];
                    if(info.action === 'all') {
                        array = allItemsModel.products().concat(newData.Data);
                    }
                    else {
                        array = productsModel.products().concat(newData.Data);
                    }                

                    (info.action === 'all') ? allItemsModel.products(array) : productsModel.products(array);                    
                    console.log("LEN ::: "+allItemsModel.products().length);
                }
            }
            else {
                indexModel.showValidationPopup('No items available!');
            }
        }, */               
        validateProduct: function(data) {
            if(data.Data && data.Data.length > 0){
                for(var i=0; i<data.Data.length; i++){
                    var prod = data.Data[i];
                    prod.active = indexModel.checkProductExists(prod.product_id);
                    prod.index = i;
                    (prod.image_path.indexOf('http') == -1) ? prod.image_path = app.app_URL.DOMAIN+prod.image_path : '';
                }
            }
            return data;
        },
        sortProducts: function() {
            var sort = $$("#allSort").val();

            //reset parms
            indexModel.productsArray([]);
            indexModel.paginationParams.isDefault = false;
            indexModel.paginationParams.isPagination = true;
            indexModel.paginationParams.pageNo = 1;
            indexModel.paginationParams.count = 0;

            switch(sort) {
                case 'name': 
                    indexModel.paginationParams.sort_by = 'name'; 
                    indexModel.paginationParams.sort_type = 'asc';
                    break;
                case 'low': 
                    indexModel.paginationParams.sort_by = 'price'; 
                    indexModel.paginationParams.sort_type = 'asc';
                    break;
                case 'high': 
                    indexModel.paginationParams.sort_by = 'price'; 
                    indexModel.paginationParams.sort_type = 'desc';
                    break;
                default:
                    indexModel.paginationParams.sort_by = '';
                    indexModel.paginationParams.sort_type = '';
                    break;
            }
            indexModel.getAllProducts();
        },
        reloadBrands: function(){
            mainView.router.loadPage('html/brands.html');
        },
        resetPaginationParams: function() {
            indexModel.paginationParams = {
                isDefault: true,
                isPagination: false,
                sort_by: '',
                sort_type: '',
                pageNo: 1,
                brand_id: '',
                brand_name: '',
                count: 0
            };
            indexModel.productsArray([]);            
        },
        doScroll: function() {
            // Exit, if loading in progress
            if (loading) return;

            // Set loading flag
            loading = true;

            indexModel.paginationParams.isDefault = false;
            indexModel.paginationParams.isPagination = true;

            indexModel.getAllProducts();
        },
        itemClickHandler: function(){
            indexModel.resetPaginationParams();
            indexModel.getAllProducts(indexModel.showItems);
        },
        getAllProducts: function(sucHandler) {            
            var obj = {
                action: 'get_products',
                brand_id: indexModel.paginationParams.brand_id,
                sort_by: indexModel.paginationParams.sort_by,
                sort_type: indexModel.paginationParams.sort_type,
                page: indexModel.paginationParams.pageNo
            };
            serviceFacade.makeServiceCall(indexModel.productsSuccess, {url: 'PRODUCTS', data: obj}, sucHandler);   
        },
        productsSuccess: function(data, sucHandler) {
            var newData = '';
            if(data.Data) {
                newData = indexModel.validateProduct(data);

                if(indexModel.paginationParams.isPagination) {
                    indexModel.performPagination(newData);
                }
                else {
                    indexModel.productsArray(data.Data);
                    sucHandler(newData);
                }
            }
            else {
                indexModel.showValidationPopup('No items available!');
            }
        },
        performPagination: function(data) {
            try {
                // Reset loading flag
                loading = false;

                indexModel.paginationParams.count = indexModel.paginationParams.count + 10;
                (data.next_page) ? indexModel.paginationParams.pageNo++ : ''; 
                
                console.log(indexModel.paginationParams.count);
                if (indexModel.paginationParams.count >= maxItems || !data.next_page) {
                    console.log("pagination removed........");
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));

                    // Remove preloader
                    $$('.infinite-scroll-preloader').remove();

                    //return;
                }

                var array = [];
                array = indexModel.productsArray().concat(data.Data);
                indexModel.productsArray(array);
                console.log("Array :: "+indexModel.productsArray().length);
            } catch(e) {
                console.log(e.message);
            }
        },
        showItems: function(data) {
            data.brand_info = {
                brand_id: indexModel.paginationParams.brand_id, 
                brand_name: indexModel.paginationParams.brand_name
            };            
            mainView.router.loadPage('html/items.html');
        }
    };

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    document.addEventListener("offline", indexModel.onOffline, false);    
});

//We can also add callback for all pages:
myApp.onPageInit('*', function (page) {
    $("input,select").blur();

    //set cart
    var cartInfo = utils.getCartInfo(),
        items = (cartInfo.items) ? cartInfo.items : 0;

    $$('.cap').text(items);

    indexModel.applyEvents('.icon-refresh', indexModel.refreshCurrentPage);
    indexModel.applyEvents('.navbar .cart', indexModel.showCartItems);
    indexModel.applyEvents('.navbar .logo', indexModel.showHomePage);

});

$$('.popup-uploadpicture').on('opened', function () {
    indexModel.editProfilePopupOpen = true;
});
$$('.popup-uploadpicture').on('close', function () {
    indexModel.editProfilePopupOpen = false;
});

/*$$('.login-screen').on('opened', function () {
    indexModel.isLoginPopupOpen = true;
});
$$('.login-screen').on('close', function () {
    indexModel.isLoginPopupOpen = false;
});*/  

myApp.onPageInit('index', function (page) {
    if(!indexModel || indexModel.brandsData.length == 0){
        ko.applyBindings(indexModel);
        indexModel.init();
    }

    $$(document).on('input', 'input[type=text],input[type=number]', function(e) {
        var that = $$(this),
            maxlength = that.attr('maxlength');
        if ($.isNumeric(maxlength) && that.val().length >= maxlength) {
            if (that.val().length == maxlength) {
                e.preventDefault();
                return;
            }
            that.val(that.val().substr(0, maxlength));
        }
    });
}).trigger();
