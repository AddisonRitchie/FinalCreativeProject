var app = new Vue({
  el: '#app',
  data: {
    items: [],
    testArt:"",
    styleID: "",
    contentID:  "",
    toggle: false,

  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },

async doArtClick(imageID) {
  if (this.toggle) {
    this.styleID = imageID;
    await this.doArt();
  }
  else {
    this.contentID = imageID;
  }
  this.toggle = !this.toggle;
  
},

    async doArt() {
      try {
          // var styleItem = this.items[0];
          // var contentItem = this.items[1];
          // var styleItem = this.styleID;
          // var contentItem = this.contentID;
          
          // console.log("styelItem._id: " + styleItem._id);
          // console.log("contentItem._id: " + contentItem._id);
          
          
        let response = await axios.get("/api/items/" + this.styleID + "/" + this.contentID, {

          styleImage: this.styleID,
          contentImage: this.contentID,
        });
        this.testArt = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },

  doArtOld() {
    var testImagePath = this.items[0].path;
    console.log("Test Image Path: " + testImagePath);
    this.testArt = testImagePath;
  },
  
  },
  created() {
    this.getItems();
  },

});