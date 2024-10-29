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
const ContainerMd = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M17.083 6.065 10 10.001m0 0L2.917 6.065M10 10.001v7.916m7.5-4.534V6.618c0-.285 0-.428-.042-.555a.8.8 0 0 0-.178-.304c-.091-.098-.216-.168-.466-.306l-6.166-3.426c-.237-.131-.355-.197-.48-.223a.8.8 0 0 0-.336 0c-.125.026-.243.092-.48.223L3.186 5.453c-.25.138-.375.208-.465.306a.8.8 0 0 0-.179.304c-.042.127-.042.27-.042.555v6.765c0 .285 0 .428.042.555a.8.8 0 0 0 .179.303c.09.1.215.168.465.307l6.166 3.426c.237.131.355.197.48.223.11.023.225.023.336 0 .125-.026.243-.092.48-.223l6.166-3.426c.25-.139.375-.208.465-.306a.8.8 0 0 0 .179-.304c.042-.127.042-.27.042-.555"
    />
  </svg>
)
const ForwardRef = forwardRef(ContainerMd)
export default ForwardRef
