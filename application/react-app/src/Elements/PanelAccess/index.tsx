import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from '../../Context';

export default ({
   children
}: {
   children?: any
}) => {
   const app = useContext(AppContext)
   const navigate = useNavigate();

   useEffect(() => {
      if (!app.user) {
         navigate("/login")
      } else if (app.user.access !== 1) {
         navigate("/")
      }
   }, [app.user]);

   return (
      <>
         {app.user?.access === 1 &&
            <>{children}</>
         }
      </>
   )
}