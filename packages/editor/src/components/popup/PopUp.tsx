/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/ir-engine/ir-engine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Infinite Reality Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Infinite Reality Engine team.

All portions of the code written by the Infinite Reality Engine team are Copyright © 2021-2023 
Infinite Reality Engine. All Rights Reserved.
*/

import React, { useEffect, useState } from 'react'
import { MdInfo } from 'react-icons/md'

import './PopUp.css'

// Import the external CSS file

const PopUp = ({
  tag,
  message,
  visibleDuration = 3000,
  icon = <MdInfo className="inline-block shrink-0 text-2xl" />,
  className
}) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, visibleDuration)

    return () => clearTimeout(timer)
  }, [visibleDuration])

  return (
    <div className={`popup-container ${className}`} style={{ opacity: visible ? 1 : 0 }}>
      <div className={`popup-icon-box ${className}`}>{icon}</div>
      <div className={`popup-content ${className}`}>{message}</div>
    </div>
  )
}

export default PopUp
