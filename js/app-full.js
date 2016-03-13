var container_el = document.querySelector('#container')

var ProfileModel = Backbone.Model.extend({

  url: function(moreParams){
    var apiKeyParam = "apikey=7ba96d266cc84b168fab4d878d9aa141"; 
    
    var queryParams =  apiKeyParam 
    if ( moreParams ) { queryParams += '&' + moreParams}

    var fullUrl = "http://congress.api.sunlightfoundation.com/legislators?" + queryParams

    this.url = fullUrl
    return fullUrl
  },

  parse: function(respData){

    var parsed = respData

    if(respData.results && respData.results.length === 1){
      parsed = respData.results[0]
    }
    return parsed
  },

  initialize: function(){
  }
})

var ProfileCollection = Backbone.Collection.extend({
  model: ProfileModel,

  url: function(masParams){
    return this.model.prototype.url.call(this, masParams)
  },

  parse: function(d){
    console.log('parsing collection 4 u')
    return d.results
  }
})

var ProfileSingleView = Backbone.View.extend({
  el: '#container',

  _buildTemplate: function(aCollection, dex){
    var htmlStr = document.querySelector('#single-view_templ').innerHTML
    var compiled = _.template(htmlStr)({bbModList: aCollection.models, initialI: dex })
    return compiled
  },

  initialize: function(c, i){
    console.log(c)
    this.coll = c
    // send default index at 0...unless sth else is specifed
    this.coll.on('sync', this.render.bind(this, 0) )
  },

  render: function(i){
    console.log('rendering:single')
    var index = 0
    if (i) {index = i}
    this.el.innerHTML = this._buildTemplate(this.coll, index)
    return this
  }
})

var ProfileMultiView = Backbone.View.extend({
  el: '#container',
  
  coll: null,

  events: {
    "click .profile-card" : "handleProfileSelect"
  },

  handleProfileSelect: function(e){
    window.location.hash = "/profile/"+e.currentTarget.id
  },

  initialize: function(collectionPls){
    this.coll = collectionPls
    this.coll.on("sync", this.render.bind(this) )
  },

  _buildTemplate: function(aCollection){
    var htmlStr = ''
    var collModels = aCollection.models
    for (var i = 0; i < collModels.length ; i++){
      var m = collModels[i]
      htmlStr += '<div class="profile-card" id='+m.get('bioguide_id')+'>' 
      htmlStr +=   '<img src="http://flathash.com/'+ m.get('bioguide_id') +'">'
      htmlStr +=   "<h5>"+ m.get('first_name') + '</br>'
      htmlStr +=   '<small>' + m.get('state_name')+ '</small>'
      htmlStr +=   '</h5>'
      htmlStr += '</div>'
    }
    return htmlStr
  },

  render: function(){
    console.log('rendering:multi')
    this.el.innerHTML = this._buildTemplate(this.coll)
    return this
  }
})

var NavView = Backbone.View.extend({
  el: 'nav',

  events: {
    'keypress input' : 'handleStateSearch',
  },

  handleStateSearch: function(evt){
    console.log(evt)
    if (evt.keyCode === 13 ) {
      var searchQ = evt.target.value 
      if( searchQ.length > 2 ) {
        alert("too long!! please give state short-name only");
        return
      }

      evt.target.value = ''
      window.location.hash = "state/" + searchQ

    }
  },

  _buildTemplate: function(){
    var htmlStr = ''
    htmlStr += '<input type="text" placeholder="Search by state! (ex: FL)">'
    return htmlStr
  },

  render: function(){
    this.el.innerHTML = this._buildTemplate()
    return this
  }
})

var AppRouter = Backbone.Router.extend({
  routes: {
    "profile/:id" : "showSingle",
    "state/:st" : "showProfilesByState",
    "*default" : "showProfiles"  
  },

  showProfiles: function(){
    console.log('home page routing!')
    this.datersCollection = new ProfileCollection();
    var manyDatersView = new ProfileMultiView(this.datersCollection)
 
    this.datersCollection.fetch()
  },

  showSingle: function(bioId){
    console.log('single')

    // collection doesn't exist or only has one value on it...
    if ( !this.datersCollection || this.datersCollection.models.length === 1){
      this.datersCollection = new ProfileCollection()
      this.datersCollection.url("bioguide_id="+bioId)
      this.datersCollection.fetch()
      var singleDaterView = new ProfileSingleView(this.datersCollection)

    } else {
      var i = this.datersCollection.findIndex({bioguide_id: bioId})
      var singleDaterViewWithMany = new ProfileSingleView(this.datersCollection )
      singleDaterViewWithMany.render(i)
    }
    
  },

  showProfilesByState: function(stateName){
    console.log(stateName)
    this.datersCollection = new ProfileCollection()
    var manyDatersView = new ProfileMultiView(this.datersCollection)
    this.datersCollection.url( 'state='+stateName.toUpperCase() )
    this.datersCollection.fetch()
  },

  initialize: function(){
    console.log('router on!')
    var navBar = new NavView()
    navBar.render()
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

