import React, { ReactElement } from 'react'
import SignupForm from './components/SignupForm'

export default async function page(): Promise<ReactElement> {
  return (
    <div>
      <SignupForm></SignupForm>
    </div>
  )
}
