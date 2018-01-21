var utils = {
    getUserInfo: function(){
        var usrInfo='';
        if (window.localStorage) {
            if (localStorage.getItem("userInfo")) {
                usrInfo = JSON.parse(localStorage.getItem("userInfo"));
            }
            return usrInfo;
        }
    },
    setUserInfo: function(obj){
        var usrInfo;
        if (window.localStorage) {
            if (!localStorage.getItem("userInfo")) {
                usrInfo = {
                    isRegistered: obj.isRegistered,
                    username: obj.username,
                    password: obj.password,
                    isLoggedin: obj.isLoggedin
                };                
            } else {
                usrInfo = JSON.parse(localStorage.getItem("userInfo"));
                usrInfo = obj;
            }
            localStorage.setItem("userInfo", JSON.stringify(usrInfo));
        }
    },
    setUserLogin: function(isLoggedin){
        var usrInfo;
        if (window.localStorage) {            
            usrInfo = JSON.parse(localStorage.getItem("userInfo"));
            usrInfo.isLoggedin = isLoggedin;
            
            localStorage.setItem("userInfo", JSON.stringify(usrInfo));
        }
    },
    setProfilePic: function(imagePath){
        var usrInfo;
        if (window.localStorage) {            
            usrInfo = JSON.parse(localStorage.getItem("userInfo"));
            usrInfo.profilePic = imagePath;
            
            localStorage.setItem("userInfo", JSON.stringify(usrInfo));
        }
    },
    getCartInfo: function(){
        var cartInfo='';
        if (window.localStorage) {
            if (localStorage.getItem("cartInfo")) {
                cartInfo = JSON.parse(localStorage.getItem("cartInfo"));
            }
            return cartInfo;
        }
    },
    setCartInfo: function(obj){
        var cartInfo;
        if (window.localStorage) {
            cartInfo = obj;
            localStorage.setItem("cartInfo", JSON.stringify(cartInfo));
        }
    },
    getFavourites: function(){
        var fav='';
        if (window.localStorage) {
            if (localStorage.getItem("favourites")) {
                fav = JSON.parse(localStorage.getItem("favourites"));
            }
            return fav;
        }
    },
    setFavourites: function(obj){
        if (window.localStorage) {
            localStorage.setItem("favourites", JSON.stringify(obj));
        }
    }
};