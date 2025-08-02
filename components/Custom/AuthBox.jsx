import React, { use , useState } from 'react'

import { useGoogleLogin } from '@react-oauth/google'
import {SigninDialog,googleLogin} from './SigninDialog'
function AuthBox() {
    const [openDialog, setOpenDialog] = useState(false);
  return (
  <div></div>
  )
}

export default AuthBox
