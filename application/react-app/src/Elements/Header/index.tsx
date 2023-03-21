import { useContext } from 'react';
import { Outlet } from "react-router-dom";
import { AppContext } from '../../Context';

export default () => {
   const app = useContext(AppContext)

   return (
      <div>
         {app.user &&
            <div className='logout' onClick={app.logout}>Выход там →</div>
         }
         <Outlet />
      </div>
   );
}
