import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { registerUser } from '../redux/actions'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button, FormControl, makeStyles, Container } from '@material-ui/core'
import Header from './Header';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 320,
        },
    },
}));

export default function Register() {

    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch()

    const [error, setError] = useState([])

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

    const onSubmit = async (userData) => {

        const { firstName, lastName, userName, password } = userData

        const res = await addUser(firstName, lastName, userName, password)
    

        if (!res.err) {
            dispatch(registerUser(res.msg))
            history.push('/login')
        } else {
            setError(res.msg)
        }
    }

    const addUser = async (firstName, lastName, userName, password) => {
        try {
            const res = await fetch(`http://localhost:10778/users`, {
                method: "post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name: `${firstName}`, last_name: `${lastName}`, user_name: `${userName}`, password: `${password}` })
            })
            const data = await res.json()

            if (data.err) {
                return { err: true, msg: data.msg }
            } else {
                const user = {
                    userID: data.msg,
                    username: userName,
                    first_name: firstName,
                    role: 2,
                    login: false
                }

                return { err: false, msg: user }
            }
        } catch (err) {
            return { err: true, msg: err }
        }
    }



    return (

        <div >
            <Header />
            <Container>
                <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl className="form-control">
                        <TextField id="firstName"
                            name="firstName"
                            type="text"
                            label="First Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter your first name"
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter first name before submission"
                                }
                            })}
                            error={errors.firstName ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="firstName" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            label="Last Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter last name before submission"
                                }
                            })}
                            error={errors.lastName ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="lastName" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="userName"
                            name="userName"
                            type="text"
                            placeholder="Enter your user name"
                            label="User Name"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter user name before submission"
                                }
                            })}
                            error={errors.userName ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="userName" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            label="Password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter password before submission"
                                },
                                minLength: {
                                    value: 4,
                                    message: "Your password must be at least 4 characters"
                                }
                                // pattern: {
                                //     value: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
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
                    <p className="errorMSG">{error}</p>
                </form>
                <p>"All ready a costumer? <Link to="/login">go to login page</Link></p>
            </Container>
        </div >
    )
}
