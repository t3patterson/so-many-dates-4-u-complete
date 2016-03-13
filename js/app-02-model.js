// PART 2: Model + Collection

// SUBTASK: Successfully fetch data and put simple data on page

// PROCESS:
//   1) 'Extend' Backbone.Model constructor to a variable called ProfileModel     
//       

//   2)  Create some requisite methods on the Modle:
//        a) url 
//        b) parse (will fill out data)

//   3)  Create an instance of ProfileModel 

//   4)  Execute the fetch method on our instance and return the results

//   5)  Now that we know how the api returns the results, we need to 
//       build our .parse method so that we can properlu store the data 
//       on our model-instances (DEMO)

//   6) 

var container_el = document.querySelector('#container')

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
   
 
  },


  initialize: function(){
    console.log('router on!')
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

