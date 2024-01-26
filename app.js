const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Product=require('./models/product');
const User=require('./models/user');
// db.execute('Select * from products')
// .then((result)=>{console.log(result)})
// .catch((err)=>{console.log(err)});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);

sequelize.sync()
.then((result)=>{
    // console.log(result);
    return User.findByPK(1);
    // app.listen(3000);
}).then(user=>{
    if(!user){
        return User.create({name:'max',enail:'test@admin.com'});
    }
    return user;
})
.then(user=>{
    console.log(user);
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});


