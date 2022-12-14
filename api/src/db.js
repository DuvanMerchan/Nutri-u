require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/nutri-u`, {
  logging: false,
  native: false, 
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);


const { User,  Diet, Recipe, Ingredient} = sequelize.models;

// hay que corregir estas relaciones
User.hasMany(Diet)
User.hasMany(Recipe)
Diet.belongsToMany( Recipe,{ through: "diets_recipes"})
Recipe.belongsToMany(Diet,{ through: "diets_recipes"})
Recipe.belongsToMany(Ingredient,{ through: "recipes_ingredients"})
Ingredient.belongsToMany(Recipe,{ through: "recipes_ingredients"})
Diet.belongsToMany(Ingredient,{ through: "diets_ingredients"})
Ingredient.belongsToMany(Diet,{ through: "diets_ingredients"})



module.exports = {
  ...sequelize.models, 
  conn: sequelize,     
};