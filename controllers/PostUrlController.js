const dns                     = require('dns');
const urlModel                = require( '../models/urlModel' );

const saveUrl = ( URL, res ) => {
  urlModel.findOne( ).sort({shortUrl: -1}).exec( ( err, foundUrl ) => { 
    if ( err )      
      return console.log( err );
    
    const newUrl = new urlModel ( );
    newUrl.url   = URL;
    if ( foundUrl ) {
      newUrl.shortUrl = ( parseInt ( foundUrl.shortUrl, 10 ) + 1 ).toString( );
    }
    else 
      newUrl.shortUrl = parseInt( 1, 10 ).toString( );
    
    newUrl.save( err => {
      if (err)
        return console.log( err );
      res.json({"original_url": URL, "short_url": newUrl.shortUrl});
    } )
  })
};

const checkIfUrlExists = ( URL, res ) => {
  urlModel.findOne({url: URL}, ( err, foundUrl ) => {
    if ( err )      
      return console.log( err );
    if ( foundUrl )
      res.json({"original_url": URL, "short_url": foundUrl.shortUrl});
    else
      saveUrl ( URL, res );
  })
};


// Main function
exports.postURL = ( req, res ) => {
  const URL                   = req.body.url;
  const urlRegExp             = /(http(s)?:\/\/)?(www\.)?\w+\.\w{1,3}(\/\w+\/?)*/
  const validUrl              = urlRegExp.test(URL);
  const domainSubdomainRegExp = /(www\.)?\w+\.\w{1,3}/;
  const domainSubdomain       = URL.match(domainSubdomainRegExp);
  
  if (validUrl) {
    dns.lookup(domainSubdomain[0], (err, addresses, family) => {
      if (err === null) {
        // Short url
        checkIfUrlExists( URL, res );
      }
      else
        res.json( {"error":"invalid URL"} );
      });
  }
  else
    res.json( {"error":"invalid URL"} );
};