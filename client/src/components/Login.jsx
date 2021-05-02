import React from 'react'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { loginUser } from '../redux/actions'
import { Link, useHistory } from 'react-router-dom'
import { usersData } from '../redux/states'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button, FormControl, makeStyles, Container } from '@material-ui/core'
import Header from './Header'
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 320,
        },
    },
}));

export default function Login() {

    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch()

    const [userName, setUsername] = useState("")
    const [error, setError] = useState([])

    const user = useSelector(state => usersData)

    const { register, handleSubmit, errors } = useForm({
        mode: 'all',
        reValidateMode: 'onChange',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: true,
    });

    const onSubmit = async (data) => {

        const { username, password } = data
        const res = await login_user(username, password)

        if (!res.err) {
            dispatch(loginUser(res.msg))
            history.push('/home')
        } else {
            setError(res.msg)
        }
    }

    const login_user = async (username, password) => {
        try {
            const res = await fetch(`http://localhost:10778/users/token`, {
                method: "post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: `${username}`, password: `${password}` })
            })
            const data = await res.json()

            if (!data.err) {
                // store user token in local storage to keep user logged in if he still registered
                localStorage.setItem('token', JSON.stringify(data.msg));
                // decoded the token and get the user data
                const userFromToken = jwt_decode(data.msg)

                const userForReduxState = {
                    userID: userFromToken.userID,
                    username: userFromToken.username,
                    first_name: userFromToken.first_name,
                    role: userFromToken.role,
                    login: true
                }
                return { err: false, msg: userForReduxState }
            } else {
                return { err: true, msg: data.msg }
            }
        } catch (err) {
            return { err: true, msg: err }
        }
    }

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
                    userID: user.userID,
                    username: user.userName,
                    first_name: user.first_name,
                    role: user.role,
                    login: true
                }
                dispatch(loginUser(userToReduxState))
                return history.push('/home')
            } else {
                setUsername(userFromToken.username)
                localStorage.removeItem(token)

            }
        }
        
    }, [])

    return (

        <div >
            <Header />
            <Container>
                <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl className="form-control">
                        <TextField id="username"
                            name="username"
                            type="text"
                            label="User Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter your user name"
                            defaultValue={userName}
                            required
                            inputRef={
                                register({
                                    required: {
                                        value: true,
                                        message: "Please enter user name before submission"
                                    }
                                })
                            }
                            error={errors.username ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="username" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="password"
                            name="password"
                            type="password"
                            label="password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter your password"
                            required
                            inputRef={
                                register({
                                    required: {
                                        value: true,
                                        message: "Please enter password before submission",
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "Your password must be at least 4 characters"
                                    }
                                    // pattern: {
                                    //     value: /^ (?=.* \d)(?=.* [a - zA - Z])$ /,
                                    //     message: "Your password must contain at least one digit and one letter."
                                    // }
                                })}
                            error={errors.password ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="password" as="span" />
                    </FormControl>

                    <div className="submit">
                        <Button variant="contained" color="primary" type="submit" value="Submit">
                            Submit
                    </Button>
                    </div>
                    <p className="errorMsg">{error}</p>
                </form>
                <p>"Don't have an account yet? <Link to="/register">go to register page</Link></p>
            </Container>
        </div>
    )

}
