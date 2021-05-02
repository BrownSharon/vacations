import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usersData } from '../redux/states'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import { logoutUser } from '../redux/actions'

const useStyles = makeStyles((theme) => ({

    media: {
        height: 20,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function UserVacationCard({ vacation, setVacations }) {

    const dispatch = useDispatch()
    const user = useSelector(state => usersData).user
    const history = useHistory()

    // 2 state of the buttons follow/unfollow and the counter  
    const [follow, setFollow] = useState(false)
    const [followersCounter, setFollowersCounter] = useState(0)

    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (user.role !== 2) {
            history.push("/login")
        }
    })

    // handle the display follow/unfollow for each vacation 
    useEffect(() => {
        (async () => {
            try {

                const res = await fetch(`http://localhost:10778/followers/${user.userID}/${vacation.id}`)
                const data = await res.json()

                if (!data.err) {
                    data.msg.isVacationFollowedByUser.find(item => item.vacation_id === vacation.id) ? setFollow(true) : setFollow(false)
                    return setVacations(data.msg.vacationQ)
                } else {
                    dispatch(logoutUser(user.userID))
                    localStorage.removeItem("token")
                    history.push('/login')
                }

            } catch (err) {
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
            }
        })()
    }, [])

    // handle the display of the amount of followers of each vacation in the user display only 
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:10778/followers/${vacation.id}`)
                const data = await res.json()
                if (!data.err) {
                    setFollowersCounter(data.msg[0].followersForVacation)
                } else {
                    dispatch(logoutUser(user.userID))
                    localStorage.removeItem("token")
                    history.push('/login')
                }
            } catch (err) {
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
            }
        })()
    })

    // handel the button follow/unfollow
    const changeStatusFollow = async (fallow, user) => {
        // get the token from storage to send in header of req to server
        const value = JSON.parse(localStorage.getItem("token"))

        // if the user is following the vacation, and clicking the button
        // delete the vacation from followers table
        if (fallow) {
            try {
                const res = await fetch(`http://localhost:10778/followers/${vacation.id}`, {
                    method: "delete",
                    headers: { 'Content-Type': 'application/json', 'token': value },
                    body: JSON.stringify({ userID: `${user.userID}` })
                })

                const data = await res.json()
                if (!data.err) {
                    setVacations(data.msg)
                    setFollowersCounter(followersCounter - 1)
                    setFollow(false)
                } else {
                    dispatch(logoutUser(user.userID))
                    localStorage.removeItem("token")
                    history.push('/login')
                }
            } catch (err) {
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
            }
        } else {
            try {
                // add the vacation to the followers table
                const res = await fetch(`http://localhost:10778/followers/${vacation.id}`, {
                    method: "post",
                    headers: { 'Content-Type': 'application/json', 'token': value },
                    body: JSON.stringify({ userID: `${user.userID}` })
                })

                const data = await res.json()
                if (!data.err) {
                    setVacations(data.msg)
                    setFollowersCounter(followersCounter + 1)
                    setFollow(true)
                } else {
                    dispatch(logoutUser(user.userID))
                    localStorage.removeItem("token")
                    history.push('/login')
                }

            } catch (err) {
                dispatch(logoutUser(user.userID))
                localStorage.removeItem("token")
                history.push('/login')
            }
        }

    }

    return (
        <div className="card">
            <MuiThemeProvider>
                <Card className={classes.root}>
                    <CardHeader
                        title={`${vacation.destination}`}
                    />
                    <CardMedia
                        className={classes.media}
                        image={vacation.image_link}
                        title={vacation.destination}

                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            From: {`${vacation.from_date}`}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            To: {`${vacation.to_date}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Price: {`${vacation.price}`}$
                        </Typography>

                        <Button aria-label="follow" variant="contained" color="primary" onClick={() => changeStatusFollow(follow, user)}>{follow ? "UnFollow" : "Follow"}</Button>

                    </CardContent>
                    <CardActions>

                        <Button aria-label="counter" variant="contained">{followersCounter} Followers</Button>

                        <IconButton
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                            <Typography variant="body2" color="textSecondary" component="p">
                                More Info
                        </Typography>
                        </IconButton>
                    </CardActions>
                    <Collapse className="moreInfo" in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                {`${vacation.description}`}
                            </Typography>

                        </CardContent>
                    </Collapse>
                </Card>
            </MuiThemeProvider>
        </div>


    )
}
