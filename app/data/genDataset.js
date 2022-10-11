const user = require('../models/User');
const Brewery = require('../models/Brewery');

const Category = require('../models/Category');
const categories = async () => (await Category.getAll()).map(e => e.id);

const json = require('../data/brasseries.json');
const axios = require('axios');

const striptags = require('striptags');
const { faker } = require('@faker-js/faker');

faker.locale = 'fr';

const reqConfig = {
  method: 'get',
  url: 'https://api.geoapify.com/v1/geocode/search',
  params: {
    text: '',
    apiKey: '90ce7c3086e14917a93e2b33fe67aeae'
  }
};

async function getGeoLocation(address){
  
  reqConfig.params.text = address;
  const req = await axios(reqConfig);
  return req.data.features;
}

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const filter = breweries => breweries.filter(e => e["properties"].name.length > 2 && e["properties"].address.length > 2);

  const breweries = filter(json.features);

  breweries.forEach(async (item, i) => {

      if(i >= 500) return;

      const User = new user({
        name: faker.name.fullName(),
        email: (faker.internet.email()).toLowerCase(),
        password: 'Admin420!',
        role: 'brewer'
    });

    async function generateCategory(){
      const cat = await categories();
      const category = cat[random(0, cat.length-1)];
      return category;
    }

    const brewer = await User.register();
    const address = await getGeoLocation(item["properties"].address);
    const generatedCategory = await generateCategory();

      if(address[0]){

        const brewery = {
          title: striptags(item["properties"].name),
          phone: faker.phone.number(),
          desc: striptags(item["properties"].description),
          address: address[0]["properties"].formatted,
          img: faker.image.nature(640, 480, true),
          userId: User.id,
          geoLoc: {lat: address[0]["properties"]["lat"], lon: address[0]["properties"]["lon"]}
        }

        const Brew = new Brewery({
          title: brewery.title,
          phone: brewery.phone,
          description: brewery.desc,
          address: brewery.address,
          image: brewery.img,
          user_id: brewer.id,
          lat: brewery.geoLoc.lat,
          lon: brewery.geoLoc.lon,
          categories: [{id: generatedCategory}]
        });
      
        await Brew.addBrewery().then(r => console.log(r)).catch(err => console.log(err));
      }
});
