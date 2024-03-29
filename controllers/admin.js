const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
  .createProduct({
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
  })
  // Product.create({
  //   title:title,
  //   price:price,
  //   imageUrl:imageUrl,
  //   description:description
  // })
  .then((result)=>{
    console.log('product Created');
    res.redirect('/admin/products');
})
  .catch((err)=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;
  console.log(editMode);
  if(!editMode){
    return res.redirect('/');
  }
    const prodId=req.params.productId;
    // console.log(prodId);
      Product.findByPk(prodId)
      .then(product=>{
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing:true,
          product:product
        });
      })
      .catch((err)=>console.log(err))

};
exports.postEditProduct= (req,res,next)=>{
  const prodId=req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  req.user.getProduct({where: {id:prodId}})
  // Product.findByPk(prodId)
  .then(product=>{
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.description=updatedDescription;
    product.imageUrl=updatedImageUrl;
    return product.save();
  })
  .then(result=>{
    console.log('product updated')
    res.redirect('/admin/products');
  })
  .catch((err)=>console.log(err))
  
};
exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()
  .then(products=>{ 
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  
};

exports.postDeleteProduct=(req,res,next)=>{
const prodId=req.body.productId;
Product.findByPk(prodId)
.then(product=>{
  return product.destroy();
})
.then((result)=>{
  console.log('Product Deleted');
  res.redirect('/admin/products');
})
.catch((err)=>console.log(err));

};
