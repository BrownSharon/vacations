import React from 'react'
import UserVacationCard from './UserVacationCard'
import AdminVacationCard from './AdminVacationCard'
import Header from './Header';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usersData } from '../redux/states'
import { useHistory } from 'react-router-dom'
import { logoutUser } from '../redux/actions'

export default function VacationList() {

    const dispatch = useDispatch()
    const user = useSelector(state => usersData).user
    const history = useHistory()
    const [Vacations, setVacations] = useState([])

   
    useEffect(() => {
        (async () => {
            try {

                // get the token from storage to send in header of req to server
                const value = JSON.parse(localStorage.token)

                const res = await fetch('http://localhost:10778/vacations/home', {
                    method: "get",
                    headers: { 'Content-Type': 'application/json', 'token': value }
                })
                const data = await res.json()
                if (!data.err) {
                    setVacations(data.msg)
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
    }, [user, history])

    return (
        <div>
            <Header />
            <div maxWidth='md' className="vacationList">
                {Vacations.map(vacation => user.role === 2 ? <UserVacationCard vacation={vacation} setVacations={setVacations} key={vacation.id} /> : <AdminVacationCard vacation={vacation} setVacations={setVacations} key={vacation.id} />)}
            </div>
        </div>
    )
}
