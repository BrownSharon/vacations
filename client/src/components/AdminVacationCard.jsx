import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import 'fontsource-roboto';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usersData } from '../redux/states'
import { logoutUser } from '../redux/actions'

const useStyles = makeStyles((theme) => ({
    media: {
        height: 20,
        paddingTop: '60%', // 16:9
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
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function AdminVacationCard({ vacation, setVacations }) {

    const dispatch = useDispatch()
    const history = useHistory()
    const classes = useStyles();
    const user = useSelector(state => usersData).user


    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (user.role !== 1) {
            history.push("/login")
        }
    })

    const deleteVacation = async (id) => {
        try {
            // get the token from storage to send in header of req to server
            const value = JSON.parse(localStorage.token)
            const res = await fetch(`http://localhost:10778/vacations/${id}`, {
                method: "delete",
                headers: { 'Content-Type': 'application/json', 'token': value },
            })
            const data = await res.json()
            if(!data.err){
                setVacations(data.msg)
            }else{
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

                    </CardContent>
                    <CardActions className="action">
                        <div className="row">
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

                            <Collapse className="moreInfo" in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>
                                        {`${vacation.description}`}
                                    </Typography>

                                </CardContent>
                            </Collapse>
                        </div>
                        <div className="row">
                            <IconButton onClick={() => {
                                history.push('/handleVacation', { id: vacation.id })
                            }}>
                                <EditIcon aria-label="edit" variant="contained" color="primary" />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => deleteVacation(vacation.id)} className={classes.margin}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardActions>
                </Card>
            </MuiThemeProvider>
        </div>

    )
}
