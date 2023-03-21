import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Task } from '../../../..';
import { AppContext } from '../../Context';
import Pagination from '../Pagination';

export default ({
   paginationUrl,
   renderItem
}: {
   paginationUrl: string
   renderItem: (item: Task) => any
}) => {
   const app = useContext(AppContext)
   const params = useParams()

   const [pageCurrent, setPageCurrent] = useState<number>((params.id && parseInt(params.id)) ? parseInt(params.id) : 1)

   const getOffset = () => {
      return (pageCurrent - 1) * count
   }

   useEffect(() => {
      if (params.id && parseInt(params.id) && parseInt(params.id) !== pageCurrent) {
         setPageCurrent(parseInt(params.id))
      } else if (!params.id && pageCurrent !== 1) {
         setPageCurrent(1)
      }
   }, [params])

   useEffect(() => {
      setOffset(getOffset())
   }, [pageCurrent])

   const [render, setRender] = useState<any[]>([])
   const [list, setList] = useState<Task[]>([])
   const [count, setCount] = useState<number>(3)
   const [offset, setOffset] = useState<number>(getOffset())
   const [sort, setSort] = useState('')
   const [pageMax, setPageMax] = useState<number>(0)

   useEffect(() => {
      getList()
   }, [offset, count, sort])

   const getList = async () => {
      const response = await axios.get(`${app.url}/api/task.getList?offset=${offset}&count=${count}&sort=${sort}`)
      if (response.status === 200) {
         setList(response.data.data)

         const newCountPages = Math.ceil(response.data.countMax / count)
         if (newCountPages !== pageMax) {
            setPageMax(newCountPages)
         }
      }
   }

   useEffect(() => {
      const renderList: Task[] = []
      list.map((item, key) => {
         renderList.push(renderItem(item))
      })
      setRender(renderList)
   }, [list])

   return (
      <div>
         <div className='headerTasks'>
            <div className='sortBlock'>
               <div className='sortBlock__text'>Сортировать:</div>
               <div>
                  <select onChange={(e) => { setSort(e.target.value) }}>
                     <option value='{"name":"id","order":"desc"}'>сначала новые</option>
                     <option value='{"name":"name","order":"asc"}'>имя по возрастанию</option>
                     <option value='{"name":"name","order":"desc"}'>имя по убыванию</option>
                     <option value='{"name":"email","order":"asc"}'>почта по возрастанию</option>
                     <option value='{"name":"email","order":"desc"}'>почта по убыванию</option>
                     <option value='{"name":"status","order":"desc"}'>сперва выполненные</option>
                  </select>
               </div>
            </div>
            <Link to="/task-add">Добавить задачу</Link>
         </div>
         <Pagination
            url={paginationUrl}
            pageCurrent={pageCurrent}
            pageMax={pageMax}
         />
         <div className='taskWrap'>
            {render.map((item, key) => {
               return (
                  <div key={key}>
                     {item}
                  </div>
               )
            })}
         </div>
      </div >
   )
}