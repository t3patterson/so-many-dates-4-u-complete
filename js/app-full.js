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
    console.log(respData)

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

  _buildTemplate: function(aModel){
    var htmlStr = document.querySelector('#single-view_templ').innerHTML
    console.log(htmlStr)
    var compiled = _.template(htmlStr)({bbMod: aModel})
    console.log(compiled)
    return compiled
  },

  initialize: function(m){
    this.model = m
    this.model.on('change', this.render.bind(this) )
  },

  render: function(){
    console.log('rendering:;;;;')
    console.log(this.el)
    this.el.innerHTML = this._buildTemplate(this.model)
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
    console.log(this.coll)
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
    console.log(htmlStr)
    return htmlStr
  },

  render: function(){
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
    
    var datersCollection = new ProfileCollection();
    var manyDatersView = new ProfileMultiView(datersCollection)
 
    datersCollection.fetch()
  },

  showSingle: function(bioId){
    console.log('single')
    var singleDater = new ProfileModel()
    var singleDaterView = new ProfileSingleView(singleDater)
    singleDater.url("bioguide_id="+bioId)
    singleDater.fetch()
  },

  showProfilesByState: function(stateName){
    console.log(stateName)
    var datersCollection = new ProfileCollection()
    var manyDatersView = new ProfileMultiView(datersCollection)
    datersCollection.url( 'state='+stateName.toUpperCase() )
    datersCollection.fetch()
  },

  initialize: function(){
    console.log('router on!')
    var navBar = new NavView()
    navBar.render()
    Backbone.history.start()
  }
})

var myApp = new AppRouter()

