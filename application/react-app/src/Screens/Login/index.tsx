import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../Context';
import { Form } from '../../Elements';

export default () => {
   const app = useContext(AppContext)
   const navigate = useNavigate();

   useEffect(() => {
      if (app.user?.access === 1) {
         navigate('/panel')
      }
   }, [app.user]);

   return (
      <div>
         <h2>Вход</h2>
         <Form
            action={`${app.url}/api/auth.login`}
            onSubmit={(response) => {
               if (!response.error) {
                  app.login(response.data)
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
                           name='login'
                           type='text'
                           placeholder='Введите admin'
                        />
                     </div>
                     <div>
                        <input
                           name='password'
                           type={'password'}
                           placeholder='Введите 123'
                        />
                     </div>
                     <div>
                        <input type={'submit'} value='Войти' />
                     </div>
                  </div>
               )
            }} />
      </div>
   );
}