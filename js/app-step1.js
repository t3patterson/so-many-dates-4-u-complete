// 0) Wired up!
console.log($)
console.log(_)
console.log(Backbone)

// TASK
//----------------------------
// PART 1:
// Using the https://randomuser.me/api/, build an application 
//   that will show profile-cards on 
//      - all users, 
//      - users by gender 

// Route Examples:
//     /(home)
//     /profiles
//     /profiles/«gender»


// Where to start????
// -----------------------------
//   -The views ?
//   -The data (ie the models) ?
//   -The routes ? 

// My advice: Start With Routes & Create Some Simple Views

// Process:
//   1) 'Extend' Backbone Router to AppRouter and execute on last line
//   2)  Set 2 most fundamental routes
//   3)  Create the methods that will execute for those routes and render sth simple to DOM


var AppRouter = Backbone.Router.extend({
  // (2) Set Fundamental Routes
  routes: {
    "single"   :  "showSingle",
    "*default" :  "showHomeList"  
  },

  // (3a) 
  showHomeList: function(){
    console.log('home page routing!')
    document.querySelector('#container').innerHTML = "<h2>Home Page -- Many Profiles Coming</h2>"
  },

  showSingle: function(){
    document.querySelector('#container').innerHTML = "<h2>Single Page -- One Person </h2>"

  },

  // (3a)
  showProfiles: function(){
    document.querySelector('#container').innerHTML = "<h2>Profiles</h2>"
  },

  // (1)
  initialize: function(){
    console.log('router on!')
    Backbone.history.start()
  }
})


// (1b) initialize the route
var myApp = new AppRouter()

