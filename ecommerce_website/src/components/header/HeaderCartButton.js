import React, { useContext } from 'react';

import classes from './HeaderCartButton.module.css';
import Cart from '../cart/Cart';
import cartContext from '../store/cart-context';
import showCartContext from '../store/showCart-context';

const HeaderCartButton = () => {
  const cartCtx = useContext(cartContext);
  const showCartCtx = useContext(showCartContext);

  let cartQuantity = 0;

  if (cartCtx.item) {
    cartCtx.item.forEach((item) => {
      cartQuantity += item.quantity;
    });
  }

  return (
    <React.Fragment>
      <button className={classes.button} onClick={showCartCtx.showCart}>
        <span>Cart</span>
        <span>{cartQuantity}</span>
      </button>
      {showCartCtx.cartState && <Cart onClick={showCartCtx.hideCart} />}
    </React.Fragment>
  );
};

export default HeaderCartButton;
