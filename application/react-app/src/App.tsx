import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ErrorCodes, User } from '../..';
import { Header } from './Elements';
import axios from 'axios';
import { AppContext } from './Context';
import { Home, Login, NotFound, Panel, TaskAdd, TaskEdit } from './Screens';



export default () => {
  const url = useRef(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000').current
  const [user, setUser] = useState<User>()
  const [errorCodes, setErrorCodes] = useState<ErrorCodes>({})

  useEffect(() => {
    axios.post(`${url}/api/auth.login`, {}, { withCredentials: true })
      .then((response) => {
        if (response.data.data) {
          setUser(response.data.data)
        }
      })

    axios.get(`${url}/error-codes.json`)
      .then((response) => {
        setErrorCodes(response.data)
      })
  }, [])

  const login = async (user: User) => {
    setUser(user)
  };

  const logout = async () => {
    const response = await axios.post(`${url}/api/auth.logout`, {}, { withCredentials: true })
    if (!response.data.error) {
      setUser(undefined)
      return true
    }
    return false
  };

  return (
    <AppContext.Provider value={{
      url,
      login,
      logout,
      errorCodes,
      user
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="/page/:id" element={<Home />} />
            <Route path="task-add" element={<TaskAdd />} />
            <Route path="panel" element={<Panel />} />
            <Route path="panel/page/:id" element={<Panel />} />
            <Route path="panel/edit/:id" element={<TaskEdit />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider >
  );
}