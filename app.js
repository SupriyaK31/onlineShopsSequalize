const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize=require('./util/database');
const app = express();
const Product=require('./models/product');
const User=require('./models/user');
const Cart=require('./models/card');
const cartItem=require('./models/cartItem');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// db.execute('Select * from products')
// .then((result)=>{console.log(result)})
// .catch((err)=>{console.log(err)});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{ console.log(err)});
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User,{ constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);
Cart.hasOne(User);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{ through : cartItem});
Cart.belongsToMany(User,{ through:cartItem});
sequelize
.sync()
// .sync({force:true})
.then((result)=>{
    return User.findByPk(1);
})
.then((user)=>{
    if(!user){
        return User.create({ name: 'Max', email: 'test@admin.com' });
    }
    return user;
}).then((user)=>{
    return user.createCart();
})
.then((cart)=>{
    //  console.log(user);
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
});


