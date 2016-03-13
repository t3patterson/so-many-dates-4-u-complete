// PART 1 : The Router

// Where to start????
//   -The views ?
//   -The data (ie the models) ?
//   -The routes ? 

// SUBTASK: Build router, basic routes & populate w/ simple HTML

// PROCESS:
//   0)  Make sure you are wired up!

//   1) 'Extend' Backbone Router to AppRouter and execute on last line

//   2)  Set 2 most fundamental routes

//   3)  Create the methods that will execute for those routes and render sth simple to DOM

// 0) Wired up!
console.log($)
console.log(_)
console.log(Backbone)

var container_el = document.querySelector('#container')

var AppRouter = Backbone.Router.extend({
  // (2) Set Fundamental Routes
  routes: {
    "profile" :  "showSingle",
    "*default" : "showHomePage"  
  },

  // (3a) 
  showHomePage: function(){
    console.log('home page routing!')
    container_el.innerHTML = "<h2>Home Page</h2>"
  },

  // (3a)
  showSingle: function(){
    container_el.innerHTML = "<h2>From somewhere</h2>"
  },

  // (1)
  initialize: function(){
    console.log('router on!')
    Backbone.history.start()
  }
})


// (1b) initialize the route
var myApp = new AppRouter()

