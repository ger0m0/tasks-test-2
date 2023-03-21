import { useState, useContext, useEffect, JSXElementConstructor } from 'react';
import { Link, useParams } from "react-router-dom";
import { emailValidate } from '../../modules/form-validate';
import axios from 'axios';
import { AppContext } from '../../Context';
import { Error } from '../../../..';

export default ({
   action,
   renderItem,
   onSubmit,
   get
}: {

   action: string
   renderItem: (data: { [key: string]: any }, error?: Error) => any
   onSubmit?: (response: any) => void
   get?: string
}) => {
   const app = useContext(AppContext)
   const [data, setData] = useState<{ [key: string]: any }>({})
   const [error, setError] = useState<Error>()
   const [render, setRender] = useState<any>()

   useEffect(() => {
      if (get) {
         axios.get(get).then((response) => {
            setData(response.data.data)
         })
      }
   }, [])

   useEffect(() => {
      setRender(renderItem(data, error))
   }, [data, error])

   const submit = async (event: any) => {
      event.preventDefault();
      if (!error) {
         const formData = new FormData()
         for (const name in data) {
            formData.set(name, data[name])
         }

         const response = await axios.post(action, formData, { withCredentials: true })
         if (response.data.error) {
            setError(response.data.error)
         } else {
            if (!get) { event.target.reset() }
         }
         if (onSubmit) onSubmit(response.data)
      } else {
         setError(app.errorCodes['8'])
      }
   }

   const change = async (event: any) => {
      if (error) setError(undefined)
      let value: any = event.target.value
      if (event.target.type === 'email') {
         if (event.target.value.length > 0 && !emailValidate(event.target.value)) {
            setError(app.errorCodes['3'])
         }
      } else if (event.target.type === 'checkbox') {
         value = !data[event.target.name]
      }

      setData((prev) => {
         let newData: { [key: string]: any } = {}
         for (const name in prev) { newData[name] = prev[name] }
         return Object.assign(newData, { [event.target.name]: value })
      })
   }

   const reset = async (event: any) => {
      setData({})
   }

   return (
      <form onSubmit={submit} onChange={change} onReset={reset}>
         {render}
      </form>
   )
}