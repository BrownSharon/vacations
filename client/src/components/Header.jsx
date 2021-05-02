import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/actions'
import { usersData } from '../redux/states'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header() {

    const classes = useStyles();
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => usersData).user
    const [userStatus, setUserStatus] = useState("")


    useEffect(() => {
        if (user.login && user.role === 1){
            setUserStatus("admin")
        }else if (user.login && user.role === 2){
            setUserStatus("user")
        }else{
            setUserStatus("guest")
        }
    }, [user, history])

    return (
        <div className="header">
           
            <AppBar position="static">
                <Toolbar>
                    <div>
                        <Typography variant="h6" className={classes.title}>
                            Hello {userStatus === "guest" ? "Guest":`${user.first_name}`}
                        </Typography>
                        {userStatus === "admin" ? <div>
                            <Button color="inherit" onClick={() => history.push('/followers')}>Followers Graph
                            </Button>
                            <Button color="inherit" onClick={() => {
                                history.push('/handleVacation', { id: 0 })
                            }}>Add Vacation
                            </Button>
                            <Button color="inherit" onClick={() => history.push('/home')}>Home</Button></div> : ""}
                        </div>
                    <Typography variant="h2" className={classes.title}>
                        Yosi Tours
                    </Typography>

                    {userStatus === "guest" ? "": <Button color="inherit"
                        onClick={() => {
                            dispatch(logoutUser(user.userId))
                            localStorage.removeItem("token")
                            history.push('/login')
                        }}>Logout</Button>}

                </Toolbar>
            </AppBar>

        </div >

    )
}
