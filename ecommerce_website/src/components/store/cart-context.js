import React, { useEffect, useState, useCallback } from 'react';

// context is created here
const cartContext = React.createContext({
  item: [],
  quantity: 0,
  addItem: () => {},
  removeItem: () => {},
  purchased: () => {},
  logoutCartHandler: () => {},
  loginCartHandler: () => {},
});

// useremail from local storage

export const CartContextProvider = (props) => {
  let userEmail;
  if (localStorage.getItem('tokenId')) {
    userEmail = JSON.parse(localStorage.getItem('tokenId')).email;
    userEmail = userEmail.replace(/[@.]/g, '');
  }
  // console.log(userEmail);

  const [cartState, setCartState] = useState({ item: [], totalAmount: 0 });
  // Adding cart data
  const addItem = (newItem) => {
    let updatedItem = [...cartState.item];
    let updatedAmount = cartState.totalAmount;

    const addingItem = async () => {
      updatedAmount = updatedAmount + newItem.price * newItem.quantity;

      const cartItemIndex = cartState.item.findIndex(
        (item) => item.title === newItem.title
      );

      if (cartItemIndex === -1) {
        // console.log('not same');
        try {
          const res = await fetch(
            `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}`,
            {
              method: 'POST',
              body: JSON.stringify({
                title: newItem.title,
                price: newItem.price,
                imageUrl: newItem.imageUrl,
                quantity: newItem.quantity,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();
          updatedItem = [...updatedItem, data];
          setCartState({ item: updatedItem, totalAmount: updatedAmount });
        } catch (err) {
          console.log(err.message);
        }
      } else {
        // console.log('same');
        // console.log(cartState.item[cartItemIndex]._id);
        const newQuantity = (cartState.item[cartItemIndex].quantity += 1);
        try {
          await fetch(
            `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}/${cartState.item[cartItemIndex]._id}`,
            {
              method: 'PUT',
              body: JSON.stringify({
                title: newItem.title,
                price: newItem.price,
                imageUrl: newItem.imageUrl,
                quantity: newQuantity,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          updatedItem[cartItemIndex].quantity = newQuantity;
          setCartState({ item: updatedItem, totalAmount: updatedAmount });
        } catch (err) {
          console.log(err.message);
        }
      }
    };

    addingItem();
  };

  const removeItem = (title) => {
    let updatedItem = [...cartState.item];
    let updatedAmount = cartState.totalAmount;

    const removingItem = async () => {
      const cartItemIndex = updatedItem.findIndex(
        (item) => item.title === title
      );

      if (updatedItem[cartItemIndex].quantity === 1) {
        try {
          await fetch(
            `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}/${cartState.item[cartItemIndex]._id}`,
            {
              method: 'DELETE',
            }
          );
          updatedAmount = updatedAmount - updatedItem[cartItemIndex].price;
          updatedItem = updatedItem.filter((item) => item.title !== title);
          setCartState({ item: updatedItem, totalAmount: updatedAmount });
        } catch (err) {
          console.log(err.message);
        }
      } else {
        try {
          await fetch(
            `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}/${cartState.item[cartItemIndex]._id}`,
            {
              method: 'PUT',
              body: JSON.stringify({
                title: updatedItem[cartItemIndex].title,
                price: updatedItem[cartItemIndex].price,
                imageUrl: updatedItem[cartItemIndex].imageUrl,
                quantity: updatedItem[cartItemIndex].quantity - 1,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          updatedAmount = updatedAmount - updatedItem[cartItemIndex].price;
          updatedItem[cartItemIndex].quantity -= 1;
          setCartState({ item: updatedItem, totalAmount: updatedAmount });
        } catch (err) {
          console.log(err.message);
        }
      }
    };

    removingItem();
  };

  const purchased = () => {
    alert('Your order has been placed');

    cartState.item.forEach(async (item) => {
      try {
        await fetch(
          `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}/${item._id}`,
          {
            method: 'DELETE',
          }
        );
      } catch (err) {
        console.log(err.message);
      }
    });
    setCartState({ item: [], totalAmount: 0 });
  };

  // login cart handler
  const loginCartHandler = useCallback(async () => {
    if (userEmail) {
      try {

        const response = await fetch(
          `https://crudcrud.com/api/310616e6a2a0415a9fb86af83a1f6a7a/cartItem${userEmail}`
        );

        const data = await response.json();
        console.log(data);

        if (data.length > 0) {
          let refreshedItem = [];
          let refreshedAmount = 0;

          data.forEach((item) => {
            refreshedItem.push(item);
            refreshedAmount += item.price * item.quantity;
          });
          setCartState({ item: refreshedItem, totalAmount: refreshedAmount });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  },[userEmail]);

  // logout Cart handler
  const logoutCartHandler = () => {
    setCartState({ item: [], totalAmount: 0 });
  };

  // // fetching cart data on refresh
  useEffect(() => {
    loginCartHandler();
  }, [loginCartHandler]);

  const contextValues = {
    item: cartState.item,
    totalAmount: cartState.totalAmount,
    addItem: addItem,
    removeItem: removeItem,
    purchased: purchased,
    logoutCartHandler: logoutCartHandler,
    loginCartHandler: loginCartHandler,
  };

  return (
    <cartContext.Provider value={contextValues}>
      {props.children}
    </cartContext.Provider>
  );
};
export default cartContext;