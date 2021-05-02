import React from 'react'
import './App.css';
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import VacationList from './components/VacationList';
import AdminForm from './components/AdminForm';
import Graph from './components/Graph';
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser } from './redux/actions'
import { usersData } from './redux/states'
import { useEffect } from 'react'

function App() {

  const dispatch = useDispatch()
  const user = useSelector(state => usersData).user
  const history = useHistory()

  useEffect(() => {

    const token = localStorage.token
  
    if (token) {
      
      // check if there is token in localStorage
      // decoded the token and get the user data
      const userFromToken = jwt_decode(token)
      // check the validation of the data
      const now = Date.now()
      const expDate = userFromToken.exp * 1000

      if (expDate > now) {
        const userToReduxState = {
          userID: userFromToken.userID,
          username: userFromToken.username,
          first_name: userFromToken.first_name,
          role: userFromToken.role,
          login: true
        }
        dispatch(loginUser(userToReduxState))
      } else if (user.login) {
        dispatch(logoutUser(userFromToken.userID))
        localStorage.removeItem("token")
      }
    }

  }, [user, history])


  return (
    <div className="App">

      <Router>

        <Switch>
          {/* login page */}
          <Route path="/login" component={Login} />
          {/* registration page */}
          <Route path="/register" component={Register} />
          {/* home page */}
          <Route path="/home" component={VacationList} />
          {/* admin handle vacation page */}
          {/* admin graph page */}
          <Route path="/handleVacation" component={AdminForm} />
          {/* admin graph page */}
          <Route path="/followers/" component={Graph} />
          <Redirect from='/' to='/login' />

        </Switch>
      </Router>

    </div>
  );
}

export default App;
