const { Category } = require('./app/models/');

const test = {
    async test() {
        const result =  await Category.getAll();

        console.log(result)
    }
}

test.test()