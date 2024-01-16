const Sequelize= require('sequelize');

const sequelize=new Sequelize('node-completes','root','pass_12345',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;