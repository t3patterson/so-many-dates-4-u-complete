// PART 2: Model + Collection

// SUBTASK: Successfully fetch data and put simple data on page

// `Using a single Model to fetch multiple listings is like using a pasta-bowl for drinking red wine
// ... you can do it but it's clumsy as hell and likely to be sloppy`

// if you're going to do it that way you might as well drink straight from the bottle ($.getJSON  + .innerHTML)


// PROCESS:
//   1) 'Extend' Backbone.Model constructor to a variable called ProfileModel     
//       
//   2) 'Extend' Backbone.Collection constructor to a variable called ProfileCollection   

//   3)  Create some requisite methods on the Collection:
//        a) model
//        b) url 
//        c) parse (will fill out later)

//   4)  Create an instance of Collection 

//   5)  Execute the fetch method on our instance and return the results

//   6)  Now that we know how the api returns the results, we need to 
//       build our .parse method so that we can properly create Models

//   7) 

var container_el = document.querySelector('#container')

//1) 
var ProfileModel = Backbone.Model.extend({
  initialize: function(){
  }
})

var ProfileCollection = Backbone.Collection.extend({
  model: ProfileModel,


  url: function(moreParams){
    var apiKeyParam = "apikey=7ba96d266cc84b168fab4d878d9aa141"; 
    
    var queryParams =  apiKeyParam 
    if ( moreParams ) { queryParams += '&' + moreParams}

    var fullUrl = "http://congress.api.sunlightfoundation.com/legislators?" + queryParams
    return fullUrl
  },

  parse: function(d){
    console.log('parsing collection 4 u')
    return d.results
  }
})

var AppRouter = Backbone.Router.extend({
  routes: {
    "profiles" : "showProfiles",
    "*default" : "showHomePage"  
  },

  showHomePage: function(){
    console.log('home page routing!')
    
    var modelInstance = new ProfileModel()
    var collectionInstance = new ProfileCollection({parse: true});

    collectionInstance.fetch().then(function(resData){
      console.log('A COLLECTION\n','===========')
      console.log(resData)
      console.log(collectionInstance.models)
    })
   var hotProfilesCollection = new ProfileCollection()

   hotProfilesCollection.fetch().then(function(){
      hotProfilesCollection.models
   })
 
  },


  initialize: function(){
    console.log('router on!')
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

