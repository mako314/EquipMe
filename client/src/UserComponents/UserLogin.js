import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import  UserContext  from './UserContext';
import { UserSessionContext } from './SessionContext';
import ApiUrlContext from '../Api';

function UserLogin(){

    //Take me to my page scotty,
    const navigate = useNavigate();

    // const [user, setUser] = useState(null); // stores user on client-side
    const [user, setUser] = useContext(UserContext)
    const apiUrl = useContext(ApiUrlContext)
    const { currentUser, role, setCurrentUser, setRole } = UserSessionContext()

    console.log(user);

    // grabs current session from server-side and sets state
    // function handleCheckSession() {
    //     fetch("/check_session").then((resp) => {
    //       if (resp.ok) {
    //         resp.json().then((user) => setUser(user));
    //       }
    //     });
    // }

    // sends information to server-side, sets session, and sets state
    function handleLogin(e) {
        e.preventDefault();

        let email = e.target.email.value;
        let password = e.target.password.value;

        fetch(`${apiUrl}login`, {
            method: "POST",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify( { email, password } ),
          }).then((resp) => {
            if (resp.ok) {
              resp.json().then((data) => {
                console.log(data.user)
                setUser(data.user)
                setCurrentUser(data.user)
                setRole('user')
                navigate(`/user/profile/${data.id}`); // <-------- navigates to the profile
              });
            }
          });
    }

    // removes session, removes state
    function handleLogout() {
        fetch(`${apiUrl}logout`, {
            method: "DELETE"
        }).then(setUser(null))
    }


    return(
      <section>
  <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
    <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-white rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
      <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
        <div className="w-full px-6 py-3">
          <div>
            <div className="mt-3 text-left sm:mt-5">
              <div className="inline-flex items-center w-full">
                <h3 className="text-lg font-bold text-neutral-600 l eading-6 lg:text-5xl">Sign in</h3>
              </div>
              <div className="mt-4 text-base text-gray-500">
                <p>Welcome Back!</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
              <form onSubmit = {handleLogin}>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="text" name="email" id="email" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your email"/>
            </div>
            <br></br>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input type="text" name="password" id="password" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your password"/>
            </div>
            <div className="flex flex-col mt-4 lg:space-y-2">

               {/* LOG IN BUTTON TO THIS */}
              <button type="submit" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-amber-500 rounded-xl hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign in</button>

            </div>
            </form>
          </div>
        </div>
        <div className="order-first hidden w-full lg:block">
          <img className="object-cover h-full bg-cover rounded-l-lg" src="https://ali-practice-aws-bucket.s3.amazonaws.com/equipme.png" alt=""/>
        </div>
      </div>
    </div>
  </div>
</section>


    )
}

export default UserLogin;