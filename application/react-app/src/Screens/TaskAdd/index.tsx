import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../Context';
import { Form } from '../../Elements';

export default () => {
   const app = useContext(AppContext)
   const navigate = useNavigate();

   return (
      <div>
         <h2>Добавляем задачу</h2>
         <Form
            action={`${app.url}/api/task.add`}
            onSubmit={(response) => {
               if (!response.data.error) {
                  navigate('/')
               }
            }}
            renderItem={(item, error) => {
               return (
                  <div className='form'>
                     <div className='error'>
                        {error?.message}
                     </div>
                     <div>
                        <input
                           name='name'
                           type={'text'}
                           placeholder='Введите имя'
                           value={item.name}
                        />
                     </div>
                     <div>
                        <input
                           name='email'
                           type={'email'}
                           placeholder='Введите email'
                           value={item.email}
                        />
                     </div>
                     <div>
                        <textarea
                           name='text'
                           placeholder='Введите описание задачи'
                        >{item.text}</textarea>
                     </div>
                     <div>
                        <input type={'submit'} value='Сохранить' />
                     </div>
                  </div>
               )
            }} />
      </div>
   )
}