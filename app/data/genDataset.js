const user = require('../models/User');

const User = new user({
    name: 'John Deau',
    email: 'john@gmail.com',
    password: 'Admin420!',
    role: 'brewer'
});
User.register();

// const brewery = require('../models/Brewery');
// const Brewery = new brewery();

// const json = require('../data/brasseries.json');
// const axios = require('axios');

// const striptags = require('striptags');
// const { faker } = require('@faker-js/faker');

// faker.locale = 'fr';

// const reqConfig = {
//   method: 'get',
//   url: 'https://api.geoapify.com/v1/geocode/search',
//   params: {
//     text: '',
//     apiKey: '90ce7c3086e14917a93e2b33fe67aeae'
//   }
// };

// async function getGeoLocation(address){

//   reqConfig.params.text = address;
//   const req = await axios(reqConfig);
//   return req.data.features;
// }

// const filter = breweries => {

//   let filtered;
//   filtered = breweries.filter(e => e["properties"].name.length > 2 && e["properties"].address.length > 2);
//   return filtered;
// }

//   const dataset=[];
//   const breweries = filter(json.features);

//   breweries.forEach(async (item, i) => {

//       if(i >= 500) return;
//       const address = await getGeoLocation(item["properties"].address);
    
//       if(address[0]){
    
//         const brewery = {
//           title: striptags(item["properties"].name),
//           phone: faker.phone.number(),
//           desc: striptags(item["properties"].description),
//           address: address[0]["properties"].formatted,
//           img: faker.image.nature(640, 480, true),
//           userId: '',
//           geoLoc: {lat: address[0]["properties"]["lat"], lon: address[0]["properties"]["lon"]}
//         }
      
//         dataset.push(brewery);
//       }
    
//       console.log(dataset);

// });
