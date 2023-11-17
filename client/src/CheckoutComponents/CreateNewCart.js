import React,{useState, useContext, useEffect} from "react";
import UserContext from "../UserComponents/UserContext";
import ApiUrlContext from "../Api";
function CreateNewCart({addCart}){

    const [user, setUser] = useContext(UserContext)
    const apiUrl = useContext(ApiUrlContext)
    const [cartName, setCartName] = useState('')
    // const [cartStatus, setCartStatus] = useState('')

    useEffect(() => {
        fetch(`${apiUrl}check_session`).then((response) => {
          if (response.ok) {
            response.json().then((user) => setUser(user));
          }
        });
      }, []);


    const handleCartCreation = () => {
        let new_cart={
            'total' : 0,
            'cart_name' : cartName,
            'cart_status' : 'ACTIVE',
            'created_at': new Date().toISOString(),
            'user_id' : user?.id
        }
        fetch(`${apiUrl}carts`, {
            method: "POST",
            body: JSON.stringify(new_cart),
            headers: {
              "Content-Type": "application/json"
            }
          }).then((resp) => {
            if (resp.ok) {
              resp.json().then((new_cart) => {
                console.log(new_cart)
                addCart(new_cart)
              });
            }
          })
      }

    return(
        <div>
        <input
          type="text"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
          placeholder="Cart Name"
        />

        {/* <input
          type="text"
          value={cartStatus}
          onChange={(e) => setCartStatus(e.target.value)}
          placeholder="Cart Status"
        /> */}
        <button onClick={handleCartCreation}>Create Cart</button>
      </div>
    )
}

export default CreateNewCart