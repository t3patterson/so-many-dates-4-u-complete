// PART 2: Model

// SUBTASK: Successfully fetch data and put simple data on page

// PROCESS:
//   1) 'Extend' Backbone Model to a variable called ProfileModel     
//   2)  Create the required properties:
//        a) url
//        b) parse (will fill out data)

//   3)  Create instance of model inside route
//   4)  Execute the fetch method and return the results


var AppRouter = Backbone.Router.extend({
  routes: {
    "profile" : "showProfiles",
    "*default" : "showHomePage"  
  },

  showHomePage: function(){
    console.log('home page routing!')
    document.querySelector('#container').innerHTML = "<h2>Home Page</h2>"
    
  },

  showOneProfile: function(){
    document.querySelector('#container').innerHTML = "<h2>Profile -- Single </h2>"
  },

  initialize: function(){
    console.log('router on!')
    Backbone.history.start()
  }
})


var myApp = new AppRouter()

