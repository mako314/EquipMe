function UserLogin(){


    return(
        <>
    <h1>Login Form</h1>
    <form onSubmit = {handleLogin}>
        <label>Username: </label>
        <input id = "username" type = "text" />
        <button type = "submit">Login</button>
    </form>

    <h1>Logout Form</h1>
    <button onClick = {handleLogout}>Logout</button>

    <br />

    <button onClick = {handleCheckSession}>Check Session</button>
    </>

    )
}

