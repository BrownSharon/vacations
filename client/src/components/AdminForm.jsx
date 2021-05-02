import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useSelector,useDispatch } from 'react-redux'
import { usersData } from '../redux/states'
import { Button, FormControl, makeStyles, Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Header from './Header';
import { logoutUser } from '../redux/actions'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 450,
        },
    },
}));

export default function AdminForm() {

    const dispatch = useDispatch()
    const classes = useStyles();
    const history = useHistory()
    const user = useSelector(state => usersData).user

    const vacationID = history.location.state.id

    // for default value to dates fields and for validation 
    // const now = Date.now()

    const [error, setError] = useState([])

    const [destinationVal, setDestination] = useState("")
    const [descriptionVal, setDescription] = useState("")
    const [imgVal, setImg] = useState("")
    const [fromVal, setFromDate] = useState("2021-01-01")
    const [toVal, setToDate] = useState("2021-01-01")
    const [priceVal, setPrice] = useState(0)

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

        const res = await save(vacationID, data)

        if (!res.err) {
            history.push('/home')
        } else {
            setError(res.msg)
        }
    }

    const save = async (id, data) => {
        try {

            let { destination, description, image, from, to, price } = data
            price = Number(price)
            // get the token from storage to send in header of req to server
            const value = localStorage.getItem("token")

            if (vacationID > 0) {
                // update the vacation in database
                const res = await fetch(`http://localhost:10778/vacations/${id}`, {
                    method: "put",
                    headers: { 'Content-Type': 'application/json', 'token': JSON.parse(value) },
                    body: JSON.stringify({
                        destination,
                        description,
                        image_link: image,
                        from_date: from,
                        to_date: to,
                        price
                    })
                })
                const dataQ = await res.json()
                if(!dataQ.msg){
                    // go back to main page
                    history.push('/home')
                }else{
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
                }
            } else {
                // add the vacation to data database
                const res = await fetch(`http://localhost:10778/vacations`, {
                    method: "post",
                    headers: { 'Content-Type': 'application/json', 'token': JSON.parse(value) },
                    body: JSON.stringify({
                        destination,
                        description,
                        image_link: image,
                        from_date: from,
                        to_date: to,
                        price
                    })
                })
                const dataQ = await res.json()
                if(!dataQ.err){
                    // go back to main page
                    history.push('/home')
                }else{
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
                }
            }
        } catch (err) {
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
        }
    }

    useEffect(() => {
        if (!user.login) {
            history.push('/login')
        }
        if (user.role !== 1) {
            history.push("/home")
        }
    })

    useEffect(() => {
        (async () => {
            try {
                // get the token from storage to send in header of req to server
                const value = JSON.parse(localStorage.token)
                // if comes from edit button
                if (vacationID > 0) {
                    const res = await fetch(`http://localhost:10778/vacations/edit/`, {
                        method: "post",
                        headers: { 'Content-Type': 'application/json', 'token': value },
                        body: JSON.stringify({ id: vacationID })
                    });
                    const data = await res.json()
                    if (data.err) {
                        dispatch(logoutUser(user.userID))
                        localStorage.removeItem("token")
                        history.push('/login')
                    } else {
                        setDestination(data.msg[0].destination)
                        setDescription(data.msg[0].description)
                        setImg(data.msg[0].image_link)
                        setFromDate(data.msg[0].from_date)
                        setToDate(data.msg[0].to_date)
                        setPrice(data.msg[0].price)

                    }
                } else {
                    // if comes from add button
                    const res = await fetch(`http://localhost:10778/users/check`, {
                        method: "post",
                        headers: { 'Content-Type': 'application/json', 'token': value },

                    });
                    const data = await res.json()
                    if (data.err) {
                        dispatch(logoutUser(user.userID))
                        localStorage.removeItem("token")
                        history.push('/login')
                    }

                }
            } catch (err) {
                history.push("/login")
            }
        })()
    })

    return (
        <div>
            <Header />
            <Container>
                <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl className="form-control">
                        <TextField id="destination"
                            name="destination"
                            type="text"
                            label="destination"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter destination"
                            required
                            defaultValue={destinationVal}
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter destination before submission"
                                }
                            })}
                            error={errors.destination ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="destination" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="description"
                            name="description"
                            type="textarea"
                            label="Description"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter description"
                            multiline
                            rows={6}
                            required
                            defaultValue={descriptionVal}
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter description before submission"
                                }
                            })}
                            error={errors.description ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="description" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="image"
                            name="image"
                            type="text"
                            label="Image Link"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            placeholder="Enter image link"
                            multiline
                            rows={2}
                            required
                            defaultValue={imgVal}
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter image link before submission"
                                }
                            })}
                            error={errors.image ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="image" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="from"
                            name="from"
                            type="date"
                            label="From"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            defaultValue={fromVal}
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter date before submission"
                                }
                            })}
                            error={errors.from ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="from" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="to"
                            name="to"
                            type="date"
                            label="To"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            defaultValue={toVal}
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter date before submission"
                                }
                            })}
                            error={errors.to ? true : false}

                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="to" as="span" />
                    </FormControl>

                    <FormControl className="form-control">
                        <TextField id="price"
                            name="price"
                            type="number"
                            label="Price"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            defaultValue={priceVal}
                            required
                            inputRef={register({
                                required: {
                                    value: true,
                                    message: "Please enter price before submission"
                                }
                            })}
                            error={errors.price ? true : false}
                        />
                        <ErrorMessage className="errorMsg" errors={errors} name="price" as="span" />
                    </FormControl>
                    <div>
                        <Button variant="contained" color="primary" type="submit" value="Submit">
                            Submit
                    </Button>
                    </div>
                    <p className="errorMSG">{error}</p>
                </form>
            </Container>
        </div>
    )
}
