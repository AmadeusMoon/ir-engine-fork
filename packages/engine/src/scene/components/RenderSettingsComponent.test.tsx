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

import {
  createEngine,
  createEntity,
  destroyEngine,
  EntityUUID,
  getComponent,
  setComponent,
  UndefinedEntity
} from '@ir-engine/ecs'
import { RendererComponent } from '@ir-engine/spatial/src/renderer/WebGLRendererSystem'
import { EntityTreeComponent } from '@ir-engine/spatial/src/transform/components/EntityTree'
import { mockSpatialEngine } from '@ir-engine/spatial/tests/util/mockSpatialEngine'
import { afterEach, assert, beforeEach, describe, it } from 'vitest'
import { RenderSettingsComponent } from './RenderSettingsComponent'

describe('RenderSettingsComponent.ts', () => {
  let entity = UndefinedEntity
  let rendererEntity = UndefinedEntity

  const assertDatasetsEquals = (actual, expected) => {
    for (const [key, value] of Object.entries(actual)) {
      assert.equal(actual[key], expected[key])
    }
  }

  beforeEach(() => {
    createEngine()
    mockSpatialEngine()
    entity = createEntity()
    rendererEntity = createEntity()
    setComponent(entity, EntityTreeComponent)
    setComponent(entity, RenderSettingsComponent)
    setComponent(rendererEntity, RendererComponent)
  })

  afterEach(() => {
    destroyEngine()
  })

  it('Should set the component name to RenderSettingsComponent', () => {
    assert.equal(RenderSettingsComponent.name, 'RenderSettingsComponent')
  })
  it('Should set the component jsonID to EE_render_settings', () => {
    assert.equal(RenderSettingsComponent.jsonID, 'EE_render_settings')
  })
  it('Should set the initial data correctly', () => {
    const componentActualData = getComponent(entity, RenderSettingsComponent)
    const componentExpectedData = {
      primaryLight: '' as EntityUUID,
      csm: true,
      cascades: 5,
      toneMapping: 1,
      toneMappingExposure: 0.8,
      shadowMapType: 2
    }
    assertDatasetsEquals(componentActualData, componentExpectedData)
  })

  describe('Reactor', async () => {
    it('Should set and update the toneMapping value of the entity RenderComponent renderer ', async () => {
      const setComp = getComponent(entity, RenderSettingsComponent).toneMapping
      const renderer = getComponent(rendererEntity, RendererComponent).renderContext
      console.log('sas', renderer)
    })
  })
})
