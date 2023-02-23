import React, { useEffect, useState} from "react";
import Message from "./message";

const withLoading = (InputComponent: React.FunctionComponent, fetchData: Function) => {
  return function WrappedComponent() {
    const [data, setData] = useState<any>(null)

    const fetch = async () => {
      const data = await fetchData()
      setData(data)
    }

    useEffect(() => {
      fetch().catch(e => console.log(e))
    }, [])

    return data ? <InputComponent {...data}/> : <Message message="Loading..." color="success"></Message>
  }
}

export default withLoading
