import { Link, } from "react-router-dom";
import { TaskItem, TaskList } from '../../Elements';

export default () => {
   return (
      <div>
         <div className='panelLink'>
            <Link to="/panel">Войти в админ панель </Link>
         </div>
         <TaskList
            paginationUrl={'/page'}
            renderItem={(item) => {
               return (
                  <TaskItem item={item} link={false} />
               )
            }} />
      </div>
   )
}