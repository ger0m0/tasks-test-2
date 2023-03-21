import { Link} from "react-router-dom";

export default () => {
   return (
      <div>
         <h2>Страница не найдена!</h2>
         <div className='text-align-center'>
            <Link to="/">Вернуться на главную</Link>
         </div>
      </div>
   )
}