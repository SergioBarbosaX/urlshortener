const urlModel                = require( '../models/urlModel' );

const checkIfShortedUrlExists = ( urlShorted, res ) => {
  urlModel.findOne({shortUrl: urlShorted}, ( err, foundUrl ) => {
    if ( err )      
      return console.log( err );
    if ( foundUrl )
    // Make request to load the webpage
      res.redirect(foundUrl.url);
    else 
      res.json( {"error":"invalid URL"} );
  });
}

// Main
exports.getURL = ( req, res ) => {
  const urlShorted = req.params.urlShorted;
  
  checkIfShortedUrlExists(urlShorted, res);
}