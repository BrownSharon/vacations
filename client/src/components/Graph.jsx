import React from 'react'
import { VictoryBar, VictoryAxis, VictoryTheme, VictoryChart, VictoryLabel } from 'victory';
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { usersData } from '../redux/states'
import Header from './Header';
import { logoutUser } from '../redux/actions'

export default function Graph() {
    
    const dispatch = useDispatch()
    const [followersData, setFollowersData] = useState([])
    const history = useHistory()
    const user = useSelector(state => usersData).user
    
    useEffect(() => {
        if (!user.login){
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

                const res = await fetch(`http://localhost:10778/followers/`, {
                    method: "get",
                    headers: { 'Content-Type': 'application/json', 'token': value }
                });
                const data = await res.json()
                if (data.err) {
                    dispatch(logoutUser(user.userID))
                    localStorage.removeItem("token")
                    history.push('/login')
                } else {
                    setFollowersData(data.msg);
                }
            } catch (err) {
                history.push('/login')

            }
        })()
    }, [])

    

    return (
        <div>
             <Header/>
            <div className="graph">
                <VictoryChart
                    domainPadding={20}
                    scale={{ x: "destination" }}
                    theme={VictoryTheme.material}>

                    <VictoryLabel text="Vacations by followers" x={225} y={30} textAnchor="middle" />

                    <VictoryAxis
                        // tickValues specifies both the number of ticks and where
                        // they are placed on the axis
                        tickValues={[1, 2, 3, 4]}
                        tickFormat={followersData.map(xValue => xValue.destination)}
                    />
                    <VictoryAxis
                        dependentAxis
                        // tickFormat specifies how ticks should be displayed
                        tickFormat={followersData.map(yValue => yValue.numberOfFollowers)}
                    />
                    <VictoryBar
                        style={{ data: { fill: " #7f4bdf" } }}
                        data={followersData}
                        x={"destination"}
                        y={"numberOfFollowers"} />
                </VictoryChart>
            </div>
        </div>
    )
}
