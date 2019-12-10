const express = require('express');
const bodyParser = require("body-parser");
var CloudmersiveValidateApiClient = require('cloudmersive-validate-api-client');
var CloudmersiveImageApiClient = require('cloudmersive-image-api-client');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML
deepai.setApiKey('dd37af3d-c8b2-4a1c-8a11-a1720b8766a3');


var gStylePath = "./public/images/A-Feast-for-Crows-2784353.jpg";
var gContentPath = "./public/images/becoming.jpg";
var gResultingArtURL = "Another Test";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



var defaultClient = CloudmersiveValidateApiClient.ApiClient.instance;
var imageAPIClient = CloudmersiveImageApiClient.ApiClient.instance;

// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = "d9e7ebc2-70db-4ceb-accb-69139a4a664c"

var domainAPI = new CloudmersiveValidateApiClient.DomainApi()

var domain = "cloudmersive.com"; // {String} Domain name to check, for example \"cloudmersive.com\".  The input is a string so be sure to enclose it in double-quotes.


var initialCallback = function(error, data, response) {
  if (error) {
    console.error(error);
  }
  else {
    console.log('API called successfully. Returned data: ' + data);
  }
};

domainAPI.domainCheck(domain, initialCallback);



// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  info: String,
  artpath: String, // the new cloudMersive converted image
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  },

  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return cb(err)

      // cb(null, raw.toString('hex') + path.extname(file.originalname))
      // cb(null, raw.toString('hex') + file.originalname)
    })
  }

});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/') //Declare it here where you want to store
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); //You can give name here file.****
  }
});
var uploadNewVersion = multer({
  storage: storage
});


// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', uploadNewVersion.single('photo'), async(req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

var imageClient = CloudmersiveImageApiClient.ApiClient.instance;

// Configure API key authorization: Apikey
var ImageApikey = imageClient.authentications['Apikey'];
ImageApikey.apiKey = "d9e7ebc2-70db-4ceb-accb-69139a4a664c"

var imageApi = new CloudmersiveImageApiClient.ArtisticApi();
var imageStyle = "undie";

// var imageBytes = fs.readFileSync('C:\\temp\\input.jpg');
// var imageFile = 

var imageCallback = function(error, data, response) {
  if (error) {
    console.error(error);
  }
  else {
    console.log('API called successfully.');
    console.log('API called successfully. Returned data: ' + data);

  }
};


// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async(req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    info: req.body.itemDescription,
  });
  try {

    //         // before saving the file, try to convert the image to art using CloudMersive

    // var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

    // // Configure API key authorization: Apikey
    // var Apikey = defaultClient.authentications['Apikey'];
    // Apikey.apiKey = "YOUR API KEY"

    // var api = new CloudmersiveImageApiClient.FaceApi()

    // // var imageBytes = fs.readFileSync('C:\\temp\\input.jpg');

    // var callback = function (error, data, response) {
    //     if (error) {
    //         console.error(error);
    //         res.end('Error\n');
    //     } else {
    //         console.log('API called successfully.');

    //         res.writeHead(200, { 'Content-Type': 'image/png' });
    //         res.end(data, 'binary');

    //         //res.end(data);
    //     }
    // };

    // // api.faceCropFirst( Buffer.from(imageBytes.buffer), callback); 
    //     await api.faceCropFirst( Buffer.from(item.path), callback); 
    // imageApi.artisticPainting("undie", item.path, imageCallback)


    //NOT WORKING THE WAY I WANT SO COMMENTING OUT
    // console.log("About to call itemSave");
    // var fullItemPath = "./public" + item.path;
    // item.save()
    // .then(() => {
    //   console.log("About to call artisticPainting" + " fullItemPath==> " + fullItemPath);
    //   var imageFile = Buffer.from(fs.readFileSync(fullItemPath).buffer); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.

    //   imageApi.artisticPainting("udnie", "." + imageFile, imageCallback)
    //   })
    // .then(newResult => {
    //         console.log("About to call res.send")

    //   res.send(item)}
    //   )
    // .catch(error=> {
    //   console.log("Error in Artistic: " + error)
    // })


    await item.save();
    res.send(item);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});




// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items/ARCHIVE', async(req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    info: req.body.itemDescription,
  });
  // try {

  //         // before saving the file, try to convert the image to art using CloudMersive

  // var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

  // // Configure API key authorization: Apikey
  // var Apikey = defaultClient.authentications['Apikey'];
  // Apikey.apiKey = "YOUR API KEY"

  // var api = new CloudmersiveImageApiClient.FaceApi()

  // // var imageBytes = fs.readFileSync('C:\\temp\\input.jpg');

  // var callback = function (error, data, response) {
  //     if (error) {
  //         console.error(error);
  //         res.end('Error\n');
  //     } else {
  //         console.log('API called successfully.');

  //         res.writeHead(200, { 'Content-Type': 'image/png' });
  //         res.end(data, 'binary');

  //         //res.end(data);
  //     }
  // };

  // // api.faceCropFirst( Buffer.from(imageBytes.buffer), callback); 
  //     await api.faceCropFirst( Buffer.from(item.path), callback); 
  console.log("About to call artisticPainting");
  var imageFile = Buffer.from(fs.readFileSync(item.path).buffer); // File | Image file to perform the operation on.  Common file formats such as PNG, JPEG are supported.
  // imageApi.artisticPainting("undie", item.path, imageCallback)
  imageApi.artisticPainting("udnie", imageFile, imageCallback)
    .then(() => {
      console.log("About to call item.save")
      item.save()
    })
    .then(newResult => {
      console.log("About to call res.send")

      res.send(item)
    })
    .catch(error => {
      console.log("Error in Artistic: " + error)
    })


  // await item.save();
  // res.send(item);
  // } catch (error) {
  //   console.log(error);
  //   res.sendStatus(500);
  // }
});





// Get a list of all of the items in the museum.
app.get('/api/items', async(req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item from the museum
app.delete('/api/items/:itemId', async(req, res) => {
  console.log("Deleting item from museum");

  const id = req.params.itemId;
  var myQuery = { _id: id };
  // var emptyQuery = {};

  try {
    Item.deleteOne(myQuery, (err, result) => {
      if (err) {
        console.log("Error Deleting: " + err);
      }

    });

  }
  catch (error) {
    console.log(error);
  }

})

function fetchArtCreation() {
  console.log("in fetchArtCreation")
  console.log("stylePath: " + gStylePath)
  console.log("contentPath: " + gContentPath)
  return deepai.callStandardApi("fast-style-transfer", { //neural-style, fast-style-transfer
    style: fs.createReadStream(gStylePath),
    content: fs.createReadStream(gContentPath),
  }).then(resp => {
    gResultingArtURL = resp.output_url
    console.log(resp)
    return (resp)
  })
}

const fetchArtCreationWorkingSorta = async() => {
  console.log("in fetchArtCreation");
  console.log("stylePath: " + gStylePath);
  console.log("contentPath: " + gContentPath);
  (async function() {
    var resp = await deepai.callStandardApi("neural-style", { //neural-style, fast-style-transfer
      style: fs.createReadStream(gStylePath),
      content: fs.createReadStream(gContentPath),
    });
    console.log(resp);
    gResultingArtURL = resp.output_url;
    console.log("gResultingArtURL: " + gResultingArtURL);

    return (resp);
  })()

}

function getStylePath(myQuery) {
  console.log("in getStylePath");
  return Item.findOne(myQuery)
    .then(resultingItem => {
      if (resultingItem) {
        gStylePath = "./public" + resultingItem.path;
        console.log("gStylePath: " + gStylePath);
      }
      else {
        console.log("Error getStylePath");
      }
    })
    .catch(error => console.error('Failed to find the one getStylePath: ${error}'))

}

// function getStylePath (myQuery) {
//   console.log("in getStylePath");
//   Item.findOne(myQuery)
//   .then (resultingItem => {
//     if(resultingItem) {
//       gStylePath =  "./public" + resultingItem.path;
//         console.log("gStylePath: "+ gStylePath);

//       return new Promise.resolve(resultingItem);
//     }
//     else {
//       console.log("Error getStylePath");
//     }
//   })
//   .catch (error => console.error('Failed to find the one getStylePath: ${error}'))

// }

function getContentPath(myQuery) {
  console.log("in getContentPath");
  return Item.findOne(myQuery)
    .then(resultingItem => {
      if (resultingItem) {
        gContentPath = "./public" + resultingItem.path;
        console.log("gContentPath: " + gContentPath);
      }
      else {
        console.log("Error getContentPath");
      }
    })
    .catch(error => console.error('Failed to find the one getContentPath: ${error}'))

}


// get two images and create art
app.get('/api/items/:styleImageID/:contentImageID/:WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', async(req, res) => {
  console.log("Creating New Art from two images");

  const styleImage = req.params.styleImageID;
  const contentImage = req.params.contentImageID;

  console.log("styleImage: " + styleImage);
  console.log("contentImage: " + contentImage);

  var myStyleQuery = { _id: styleImage };
  var myContentQuery = { _id: contentImage };


  await getStylePath(myStyleQuery);
  await getContentPath(myContentQuery);

  try {
    const newArtUL = await fetchArtCreation(gStylePath, gContentPath)
    res.send(gResultingArtURL);
  }
  catch (error) {
    console.error("Error fetching new art creation: " + error);
  }
  //.then (res.send(gResultingArtURL));


  // fetchArtCreation(gStylePath, gContentPath)
  // .then (responseFromDeep => {
  //   console.log ("In the responseFromDeep");
  //     if (responseFromDeep.error) {
  //     console.error('Failed to find the one responseFromDeep: ${err}');
  //     res.sendStatus(500);

  //   }
  //   else {
  //     console.log("resultingArt SUCCESS!!!!!")
  //   }

  // }).catch((error) => {
  //   // this catch will get executed if either fetchArtCreation() or json() promises get rejected. 
  //   // if we wanted to handle fetch() and json() promise rejections separately, we would place two cathes, with first one coming after fetch().

  //         console.error('Error somewhere in the fetchArtCreation promis chain: ${err}');

  // })


  //   (await async function() {
  //     console.log("about to call DEEP AI API")
  //       console.log("stylePath: " + gStylePath);
  //   console.log("contentPath: " + gContentPath);

  //     var resp =  deepai.callStandardApi("neural-style", {
  //             content: fs.createReadStream(gStylePath),
  //             style: fs.createReadStream(gContentPath),
  //     });
  //     console.log(resp);
  // })


  // .then (resultingArt =>  {
  //   res.send(resultingArt);
  // })
  // .catch (err => {
  //   if (err) {
  //     console.error('Failed to find create new art: ${err}');
  //     res.sendStatus(500);

  //   }
  //   else {
  //     console.log("resultingArt SUCCESS!!!!!")
  //   }
  // })


  // getStylePath(myStyleQuery)
  // .then (styleItem => getContentPath(myContentQuery))
  // .then (contentItem => fetchArtCreation(gStylePath, gContentPath))
  // .then (resultingArt =>  {
  //   res.send(resultingArt);
  // })
  // .catch (err => {
  //   if (err) {
  //     console.error('Failed to find the one tiem: ${err}');
  //     res.sendStatus(500);

  //   }
  //   else {
  //     console.log("resultingArt SUCCESS!!!!!")
  //   }
  // })

})

// get two images and create art
app.get('/api/items/:styleImageID/:contentImageID/', async(req, res) => {
  console.log("Creating New Art from two images");

  const styleImage = req.params.styleImageID;
  const contentImage = req.params.contentImageID;

  console.log("styleImage: " + styleImage);
  console.log("contentImage: " + contentImage);

  var myStyleQuery = { _id: styleImage };
  var myContentQuery = { _id: contentImage };


  getStylePath(myStyleQuery)
    .then((styleItem) => {
      console.log("promise chain: styleItem: " + styleItem)
      return getContentPath(myContentQuery) //this is the promise chain that WORKS
    }).then((contentItem) => {
      console.log("promise chain: contentItem: " + contentItem)
      return (fetchArtCreation())
    }).then((deepAIURL) => {
      console.log("promise chain: deepAIURL: " + deepAIURL.output_url)
      res.send(deepAIURL.output_url)
    }).catch(err => {
      if (err) {
        console.error('Failed to create new art: ${err}');
        res.sendStatus(500);

      }
      else {
        console.log("resultingArt SUCCESS!!!!!")
      }
    })

})


//Edit an item in musem: id of an item is in the path, and a title is in the params
app.put('/api/items/:itemId', async(req, res) => {
  console.log("Editing an item from museum");

  const id = req.params.itemId;
  var newTitle = req.body.title;
  var newDescription = req.body.itemDescription;
  console.log(newTitle);
  var myQuery = { _id: id };
  // var emptyQuery = {};

  Item.findOne(myQuery)
    .then(resultingItem => {
      if (resultingItem) {

        resultingItem.title = newTitle;
        resultingItem.info = newDescription;
        resultingItem.save();
      }
      else {
        console.log("Error Editing");
      }
    })
    .catch(error => console.error('Failed to find the one tiem: ${error}'))

  // try {
  //     Item.findOne(myQuery, (err, result) => {
  //       if(err) {
  //         console.log("Error Editing: " + err);
  //       }
  //       else {
  //         //replace old title with new title


  //         item.save();
  //       }

  //     });

  // } catch (error) {
  //   console.log(error);
  // }

})

app.listen(8080, () => console.log('Server listening on port 8080!'));
