const { User, Brewery, Event } = require("../models");
const client = require("../config/db");
const breweries = require("./breweries.json");
const axios = require("axios");
const striptags = require("striptags");
const { faker } = require("@faker-js/faker");

faker.locale = "fr";

const reqConfig = {
  method: "get",
  url: "https://api.geoapify.com/v1/geocode/search",
  params: {
    text: "",
    apiKey: "90ce7c3086e14917a93e2b33fe67aeae",
  },
};

const fakeCategories = ["blonde", "brune", "ambrée", "blanche", "IPA"];
const params = fakeCategories.map((_, index) => `($${index + 1})`).join(", ");
const categories = [];

(async () => {
  await client.query(
    'TRUNCATE TABLE "user", "brewery", "category", "brewery_has_category", "event", "participate" RESTART IDENTITY CASCADE'
  );

  const results = await client.query(
    `
        INSERT INTO "category"
        ("tag")
        VALUES
        ${params}
        RETURNING *
      `,
    fakeCategories
  );

  if (results?.rowCount > 0) {
    categories.push(...results.rows);
  }

  // Get random value between 1 and chosen number (ex: 10)
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  // Get random category among defined categories list
  async function getRandomCategory(list) {
    const categoryIds = [];

    for (let i = 0; i <= getRandomNumber(0, fakeCategories.length - 1); i++) {
      const { id } = list[getRandomNumber(0, categories.length - 1)];

      categoryIds.push(id);
    }

    return categoryIds;
  }

  async function getGeoLocation(address) {
    reqConfig.params.text = address;

    const response = await axios(reqConfig);

    return response.data.features;
  }

  const filteredBreweries = breweries.features.filter(
    (brewery) =>
      brewery["properties"].name.length > 2 &&
      brewery["properties"].address.length > 2
  );

  filteredBreweries.forEach(async (filteredBrewery, index) => {
    if (index >= 200) return; // 500 brewery maximum in the database

    // Create fake user
    const roles = ["user", "brewer"];
    const fakeUser = {
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase().trim(),
      password: "$2y$10$fulWNnn/aBRls33vO0ProuAQy1VQs.fS98qo9ge.FBeR88ukuD6N.", // Plain password: 11111tT/
      role: roles[getRandomNumber(0, 1)],
    };

    const user = new User(fakeUser);
    const registeredUser = await user.register();

    const address = await getGeoLocation(filteredBrewery["properties"].address);
    const generatedCategory = await getRandomCategory(categories);

    if (address[0] && registeredUser.role === "brewer") {
      const fakeBrewery = {
        title: striptags(filteredBrewery["properties"].name), // 'striptags' method remove unwanted HTML tags
        phone: faker.phone.number(),
        description: striptags(filteredBrewery["properties"].description),
        address: address[0]["properties"].formatted,
        lat: address[0]["properties"]["lat"],
        lon: address[0]["properties"]["lon"],
        image: { path: faker.image.nature(640, 480, true), filename: null },
        user_id: registeredUser.id,
        categories: generatedCategory,
      };

      const brewery = new Brewery(fakeBrewery);

      let breweriesList;

      await brewery
        .addBrewery()
        .then((res) => {
          console.log(res);
          return (breweriesList = res);
        })
        .catch((err) => console.log(err));

      const randomBrewery =
        breweriesList[getRandomNumber(0, breweriesList.length - 1)];
      // Create fake event
      const fakeEvent = {
        title: `Dégustation numéro ${getRandomNumber(1, 1000)}`,
        description:
          "Et officiis vero ut ullam autem ad dolorem vitae sit dignissimos dicta a maiores odit sit sequi quod aut sapiente ducimus. Ad internos quia ex ipsum corrupti vel vero fugit est recusandae eaque sed laudantium quaerat sit quibusdam illo rem nisi ipsam.",
        eventStart: faker.date.between(
          "2020-01-01T00:00:00.000Z",
          "2030-01-01T00:00:00.000Z"
        ),
        breweryId: randomBrewery.id,
        ownerId: randomBrewery.user_id,
      };

      const event = new Event(fakeEvent);

      await event
        .addEvent()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      // Create fake participant
      await Event.setParticipant(registeredUser.id, randomBrewery.id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  });
})();
