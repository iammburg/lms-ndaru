import React, { ReactElement } from 'react'
import LoginForm from './components/LoginForm'

export default async function page(): Promise<ReactElement> {
  return (
    <div>
      <LoginForm></LoginForm>
    </div>
  )
}
