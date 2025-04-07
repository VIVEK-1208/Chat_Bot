import { useState } from 'react'
import Chat from './utils/Chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Chat />
    </>
  )
}

export default App
