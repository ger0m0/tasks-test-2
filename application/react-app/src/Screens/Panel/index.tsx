import { Link } from "react-router-dom";
import { PanelAccess, TaskItem, TaskList } from "../../Elements";

export default () => {
   return (
      <PanelAccess>
         <div>
            <h2>Admin Panel</h2>
            <TaskList
               paginationUrl={'/panel/page'}
               renderItem={(item) => {
                  return (<TaskItem item={item} link={true} />)
               }} />
         </div>
      </PanelAccess>
   )
}