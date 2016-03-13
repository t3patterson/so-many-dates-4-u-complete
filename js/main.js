console.log('hello weather') //Hello mutherFucker
//changeView function invoked by the button eventlistener that takes in a clickEvent input.
var changeView = function(clickEvent) {
    var route = window.location.hash.substr(1), //define a variable to store the hash (removing the hashmark)
        routeParts = route.split('/'), //split the url on the '/' and stores as array
        lat = routeParts[1], // defining the lat
        lng = routeParts[2]// defining the long
    var buttonEl = clickEvent.target, //identifiyng the button pressed
        newView = buttonEl.value // storing the button pressed value as a newView 
    location.hash = newView + "/" + lat + "/" + lng // recreating the URL# with the newView - directs it to the correct view space
}
// This is an extension to the backbone model constructor.
// a model needs a url attribute so that its fetch method will know where to send its request. 
// we add a custom method (_generateUrl) to this constructor that builds that url attribute using an input latitude and longitude.
 // we can also parse the data prior to sending the request.
var WeatherModel = Backbone.Model.extend({
    _generateUrl: function(lat,lng) {
        this.url = "https://api.forecast.io/forecast/976151b2336a5cba8b9ad9404c7cc25e/" + lat + "," + lng + "?callback=?"
    },
    parse: function(rawData) {
        rawData.spaghetti = "noodly"
        return rawData
    }
})
//wtf// mod1.on("destroy",mod2.doSomething.bind(mod2))
// creatign a new view instance. we are extending the backbone constructor by defining the el target as location to render the view
// then we define the initialize attribute as a function stored in a variable (initView). Once the data has come back from the initView function
// the render function is run whihc stores the desired model attributes to a variable. the data is then painted onto the HTML.
var CurrentlyView = Backbone.View.extend({
    el: "#container",
//this function gets called everytime we make a new instance 
    initialize: function(someModel) { //this function takes in a model as input and then assigns that model as an attribute on this view instance. 
        // 
    // when the data comes back there is a sync event that occurs and this invokes the boundRender function, which paints the data onto the page.
    // before doing this, we must circumscribe a certain problem. because the view's render function includes the `this` keyword, the meaning of `this` is liable to change if we pass that render function around as a callback. 
     // to avoid this problem, we don't send it the original render. we use .bind to create a new function, where there is no flexible `this` keyword, no ambiguity. the new function is bound to the *current* meaning of `this`, which should be a view instance. 
        this.model = someModel
        var viewInstance = this
        var boundRender = this._render.bind(viewInstance)
        this.model.on("sync",boundRender)
    },
    _render: function() { // since a view can easily access a model as one of its own properties, it can read data from that model, and use that data to write HTML into the DOM.
        var currentlyData = this.model.attributes.currently
        this.el.innerHTML = '<p class="temp">' + currentlyData.temperature + '</p>'
    }
})

var DailyView = Backbone.View.extend({
    el: "#container",
    initialize: function(someModel) { //this function takes in a model as input and then assigns that model as an attribute on this view instance. 
        // 
    // when the data comes back there is a sync event that occurs and this invokes the boundRender function, which paints the data onto the page.
    // before doing this, we must circumscribe a certain problem. because the view's render function includes the `this` keyword, the meaning of `this` is liable to change if we pass that render function around as a callback. 
     // to avoid this problem, we don't send it the original render. we use .bind to create a new function, where there is no flexible `this` keyword, no ambiguity. the new function is bound to the *current* meaning of `this`, which should be a view instance. 
        this.model = someModel
        var viewInstance = this
        var boundRender = this._render.bind(viewInstance)
        this.model.on("sync",boundRender)
    },
    _render: function() {
        console.log(this.model)
        var daysArray = this.model.attributes.daily.data
        var htmlString = ''
        for (var i = 0; i < daysArray.length; i ++) {
            var dayObject = daysArray[i]
            htmlString += '<div class="day">'
            htmlString += '<p class="max">' + dayObject.temperatureMax.toPrecision(2) + '&deg;</p>'
            htmlString += '<p class="min">' + dayObject.temperatureMin.toPrecision(2) + '&deg;</p>'
            htmlString += '</div>'
        }
        this.el.innerHTML = htmlString      
    }
})
//extending the backbone router by inputting, in object notation, our routes and data-handling functions 
// `routes` object; each key is a route pattern that we expect backbone to recognize.
// the left hand side (keys) denotes the route pattern, and the right hand side (values) denotes the function to be invkoed
//(':' creates variables). The routes object is analagous to a set of 'if' statements. if the pattern is recognized then backbone will run the associated function.
var WeatherRouter = Backbone.Router.extend({        
    routes: {                                                       
        "current/:lat/:lng": "handleCurrentWeather",                
                                                                    
        "daily/:lat/:lng": "handleDailyWeather",
        "*default": "handleDefault"
    },
//the functions are defined below each of these functions creates a new instance of a model and view for each rendering.
// each function takes as input a lat and long, which are read in from the route (see colon notation).
// in each function a new instance of the model and view are created. The model instance 
// takes in the lat and long and uses it to build a forecast.io url, storing as its url attribute.
// the view instance takes in the weather model as an input; the view will immediately assign its render function as the callback associated with that model's "sync" event (see View constructor), 
// fetch is then called on the new model. when the data is successfully fetched after an indeterminate amount of time, the view's render function will be automatically invoked, displaying the data on the page.
// the initialize function is run to start backbone which begins to store the hisory of the #'s. this is necessary for the router to begin listening to hashchange events. 
    handleCurrentWeather: function(lat,lng) { 
        var wm = new WeatherModel()
        wm._generateUrl(lat,lng)
        var cv = new CurrentlyView(wm)
        wm.fetch()
    },
    handleDailyWeather: function(lat,lng) {
        var wm = new WeatherModel()
        wm._generateUrl(lat,lng)
        var dv = new DailyView(wm)
        wm.fetch()
    },
    handleDefault: function() {
        // get current lat long, write into the route
        var successCallback = function(positionObject) {
            var lat = positionObject.coords.latitude 
            var lng = positionObject.coords.longitude 
            location.hash = "current/" + lat + "/" + lng
        }
        var errorCallback = function(error) {
            console.log(error)
        }
        window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
    },
    initialize: function() {
        Backbone.history.start()
    }
})
var myRtr = new WeatherRouter() //Creating a new instance of the backbone router.
// global functions & eventlisteners
var buttonsContainer = document.querySelector("#buttons") //query select the button node
buttonsContainer.addEventListener('click',changeView) // add an event listener to the button container that will evoke the changeView function on a 'click'