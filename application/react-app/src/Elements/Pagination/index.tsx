import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

export default ({
   url,
   pageCurrent,
   pageMax,
   countNavigation
}: {
   url: string
   pageCurrent: number
   pageMax: number
   countNavigation?: number
}) => {
   const [count, setCount] = useState<number>(countNavigation ? countNavigation : 5)
   const [pages, setPages] = useState<{
      number: number
      active?: boolean
   }[]>([])

   useEffect(() => {
      const newPages = []
      const pageStart = pageCurrent - Math.floor(count / 2)
      for (let i = pageStart; i < pageStart + count; i++) {
         if (i < 1 || i > pageMax) {
            continue
         } else if (i === pageCurrent) {
            newPages.push({
               number: i,
               active: true
            })
         } else {
            newPages.push({
               number: i
            })
         }

      }
      setPages(newPages)
   }, [pageCurrent, pageMax])

   return (
      <div className="pagination">
         {pages.map(({ number, active }, key) => {
            return (
               <div key={key}>
                  {active ?
                     <div className={'active'}>
                        <div>{number}</div>
                     </div>
                     :
                     <div key={key}>
                        <Link to={`${url}/${number}`}>{number}</Link>
                     </div>
                  }
               </div>
            )
         })}
      </div>
   )
}