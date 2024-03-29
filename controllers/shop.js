const Product = require('../models/product');

const Cart=require('../models/card');
const cartItem = require('../models/cartItem');
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
     });
  })
  .catch((err)=>console.log(err));

};

exports.getProduct=(req,res,next)=>{
const prodId=req.params.productId;
Product.findAll({where:{id:prodId}})
.then(products=>{
  res.render('shop/product-detail',
  {
  product:products[0],
  pageTitle:products[0].title,
  path:'/products'
  });
})
.catch((err)=>console.log(err));
}

exports.getIndex = (req, res, next) => {
  req.user.getProducts()
  // Product.findAll()
  .then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
     });
  })
  .catch((err)=>console.log(err));
    
};

exports.getCart = (req, res, next) => {
 req.user.
  getCart()
  .then(cart=>{
    return cart.
              getProducts().then(products=>{
                res.render('shop/cart',{
                  path:'/cart',
                  pageTitle:'Your Cart',
                  products:products
                })
              })
              .catch(err=>console.log(err))
  })
  .catch(err=>console.log(err))
  // Cart.getCart(cart=>{
    
  //   // Product.fetchAll(
  //     req.user.getProducts(products=>{
  //     const cartProducts=[];
  //     for(product of products){
  //       const cartProductData=cart.products.find(prod=> prod.id===product.id);
  //       if(cartProductData){
  //         cartProducts.push({productData:product,qty:cartProductData.qty});
  //       }
  //     }

  //   });

  // });

};

exports.postCart = (req, res, next) => {
  const prodId=req.body.productId;
  let fetchedCart;
  let newQty=1;
  req.user.getCart()
  .then(cart=>{
    fetchedCart=cart;
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    let product;
     if(products.length > 0){
      product=products[0];
     }
     if(product){
      const oldQty=product.cartItem.quantity;
      newQty=oldQty+1;
      return product;
     }
     return Product.findByPk(prodId);
  })
  .then(product=>{
    return fetchedCart.addProduct(product,{through : {quantity:newQty}});
   }).catch(err=>console.log(err))
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))
//   console.log(prodId);
//   Product.findById(prodId,product=>{
//     Cart.addProduct(prodId,product.price);
//   });
//  res.redirect('/cart');
};

exports.postCartDeleteProduct=(req,res,next)=>{
const prodId=req.body.productId;
req.user.getCart()
.then(cart=>{
  return cart.getProducts({where: {id:prodId}})
})
.then(products=>{
  const product=products[0];
  return product.cartItem.destroy();
})
.then(()=>{
  res.redirect('./cart');
})
.catch(err=>console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
