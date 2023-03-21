import { useContext } from 'react';
import { Link, Outlet } from "react-router-dom";
import { Task } from '../../../..';
import { AppContext } from '../../Context';

export default ({
   item,
   link
}: {
   item: Task
   link: boolean
}) => {
   return (
      <div className='taskItem'>
         <div className='taskItem__name'>
            {link ?
               <Link to={`/panel/edit/${item.id}`}>{item.name}</Link>
               :
               item.name
            }
         </div>
         <div>Email: {item.email}</div>
         <div>Статус: {(item.status === 1) ? 'Выполнено' : 'Создана'}</div>
         {(item.editor === 1) &&
            <div>отредактировано администратором</div>
         }
         <div>Описание: {item.text}</div>
      </div>
   )
}
