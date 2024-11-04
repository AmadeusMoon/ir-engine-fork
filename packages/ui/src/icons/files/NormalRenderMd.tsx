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

import type { SVGProps } from 'react'
import * as React from 'react'
import { Ref, forwardRef } from 'react'
const NormalRenderMd = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    role="img"
    stroke="currentColor"
    ref={ref}
    {...props}
  >
    <path
      fill="#080808"
      fillRule="evenodd"
      d="M16.583 10a6.583 6.583 0 1 1-13.167 0 6.583 6.583 0 0 1 13.167 0m1.75 0a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0M9.165 6.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667m-2.5 1.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667M10 9.167a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(NormalRenderMd)
export default ForwardRef
