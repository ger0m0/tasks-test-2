import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context";
import { Form, PanelAccess } from "../../Elements";

export default () => {
  const app = useContext(AppContext)
  const params = useParams()
  const navigate = useNavigate();

  return (
    <PanelAccess>
      <div>
        <div className='text-align-center'>
          <Link to={'/panel'}>Список тут</Link>
        </div>
        <Form
          get={`${app.url}/api/task.getForm?id=${params.id}`}
          action={`${app.url}/api/task.edit`}
          onSubmit={(response) => {
            console.log(response);
            
            if (response.error?.code === 7) {
              app.logout()
            }else{
              navigate('/panel')
            }
          }}
          renderItem={(item, error) => {
            return (
              <div className='form'>
                <div className='error'>
                  {error?.message}
                </div>
                <div>
                  <textarea
                    name='text'
                    placeholder='Введите описание задачи'
                    value={item.text}
                  ></textarea>
                </div>
                <div>
                  <label>
                    <input readOnly name='status' checked={item?.status ? true : false} type={'checkbox'} />
                    <span>Выполнено</span>
                  </label>
                </div>
                <div>
                  <input type={'submit'} value='Сохранить' />
                </div>
              </div>
            )
          }} />
      </div>
    </PanelAccess>
  )
}