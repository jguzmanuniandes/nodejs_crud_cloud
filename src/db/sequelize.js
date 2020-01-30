const config = {
    host     : '172.24.42.42',
    username : 'root',
    password : '!@aA12345',
    database : 'proyecto0' 
}

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql'
});

//(async () => {
//    try {
//        await sequelize.authenticate();
//        console.log('Connection has been established successfully.');
//    } catch (error) {
//        console.error('Unable to connect to the database:', error);
//    }
//})();

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
})


module.exports = sequelize