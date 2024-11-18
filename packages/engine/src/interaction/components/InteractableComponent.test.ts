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
  EntityUUID,
  UUIDComponent,
  UndefinedEntity,
  createEngine,
  createEntity,
  destroyEngine,
  getComponent,
  removeComponent,
  setComponent
} from '@ir-engine/ecs'
import { InferReturnType } from '@ir-engine/hyperflux'
import { TransformComponent } from '@ir-engine/spatial'
import { BoundingBoxComponent } from '@ir-engine/spatial/src/transform/components/BoundingBoxComponents'
import { isArray } from 'lodash'
import { Box3, Vector3 } from 'three'
import { v4 } from 'uuid'
import { afterEach, assert, beforeEach, describe, it } from 'vitest'
import { createUI } from '../functions/createUI'
import {
  InteractableComponent,
  XRUIActivationType,
  XRUIVisibilityOverride,
  addInteractableUI
} from './InteractableComponent'

describe('InteractableComponent.ts', async () => {
  let entity = UndefinedEntity
  let entity2 = UndefinedEntity

  beforeEach(async () => {
    createEngine()
    entity = createEntity()
    entity2 = createEntity()
  })

  afterEach(() => {
    destroyEngine()
  })

  describe('addInteractableUI', () => {
    it('Should return early if no label for InteractableComponent', () => {
      setComponent(entity, InteractableComponent, { label: undefined })
      const result = addInteractableUI(entity)
      assert.equal(result, undefined)
    })
    it('Should return early if label is an empty string for InteractableComponent', () => {
      setComponent(entity, InteractableComponent, { label: '' })
      const result = addInteractableUI(entity)
      assert.equal(result, undefined)
    })
    it('Should return early if uiEntity from InteractableComponent is undefined and label defined as non empty string', () => {
      setComponent(entity, InteractableComponent, { label: 'E', uiEntity: UndefinedEntity })
      const result = addInteractableUI(entity)
      assert.equal(result, undefined)
    })
    it('Should create reference to UI for uiEntity of InteractableComponent of entity', () => {
      const initialUIEntity = getComponent(entity, InteractableComponent).uiEntity
      addInteractableUI(entity)
      const changedUIEntity = getComponent(entity, InteractableComponent).uiEntity
      assert.notEqual(initialUIEntity, changedUIEntity)
    })
    it('Should update the boundingBox if the BoundingBoxComponent is present on entity and it has a box key and that box key value is not empty. And set the center value to the position on InteractableComponent of uiEntity of entity', () => {
      setComponent(entity, InteractableComponent, { label: 'E', uiEntity: entity })
      const uiEntity = getComponent(entity, InteractableComponent).uiEntity
      setComponent(entity, BoundingBoxComponent, { box: new Box3(new Vector3(0, 0, 0), new Vector3(0, 0, 0)) })
      const box1 = getComponent(entity, BoundingBoxComponent).box
      const box1Min = new Vector3(0, 0, 0)
      const box1Max = new Vector3(0, 0, 0)
      // Sanity check
      assert.equal(box1.min, box1Min)
      assert.equal(box1.max, box1Max)
      addInteractableUI(entity)
      setComponent(entity, BoundingBoxComponent, { box: new Box3(new Vector3(1, 2, 3), new Vector3(1, 2, 3)) })
      const box2 = getComponent(entity, BoundingBoxComponent).box
      const box2Min = new Vector3(1, 2, 3)
      const box2Max = new Vector3(1, 2, 3)
      // Check values changed correctly
      assert.equal(box2.min, box2Min)
      assert.equal(box2.max, box2Max)
      let expected
      box2.getCenter(expected)
      const actual = getComponent(uiEntity, TransformComponent).position
      assert.equal(actual, expected)
    })
    it('Should get the center of TransformComponent position in the world, if the BoundingBoxComponent is not present on entity or it is present but does not have a box or it has a box but box is empty. and set it to the uiEntity of InteractableComponent of entity', () => {
      setComponent(entity, InteractableComponent, { label: 'E', uiEntity: entity })
      addInteractableUI(entity)
      const newCenter = new Vector3(2, 2, 2)
      const expected = TransformComponent.getWorldPosition(entity, newCenter)
      const uiEntity = getComponent(entity, InteractableComponent).uiEntity
      const actual = getComponent(uiEntity, TransformComponent).position
      assert.equal(expected, actual)
    })
    it('Should correctly set uiEntity to new created uiEntity', () => {
      // Check if values changed
      setComponent(entity, InteractableComponent, { label: 'E', uiEntity: entity })
      const interactable = getComponent(entity, InteractableComponent)
      const uiEntity = interactable.uiEntity
      addInteractableUI(entity)
      const newUIEntity = getComponent(entity, InteractableComponent).uiEntity
      assert.notEqual(uiEntity, newUIEntity)
      // Check if values are correct
      createUI(entity2, interactable.label, interactable.uiInteractable).entity
      const expected = getComponent(entity, InteractableComponent).uiEntity
      assert.equal(expected, uiEntity)
    })
  })

  // describe('updateInteractableUI', () => {
  //   const interactComponent = getComponent(entity, InteractableComponent)
  //   const xrui = getOptionalComponent(interactComponent.uiEntity, XRUIComponent)
  //   const xruiTransform = getOptionalComponent(interactComponent.uiEntity, TransformComponent)

  //   it('Should return early if no avatar entity', () => {
  //     const result = updateInteractableUI(UndefinedEntity)
  //     assert.equal(result, undefined)
  //   })
  //   it('Should return early if no interactable component on avatar entity', () => {
  //     removeComponent(entity, InteractableComponent)
  //     const result = updateInteractableUI(entity)
  //     assert.equal(result, undefined)

  //   })
  //   it('Should return early if the uiEntity of the interactable component of avatar entity is undefined', () => {
  //     const result = updateInteractableUI(entity)
  //     assert.equal(result, undefined)
  //   })
  //   it('Should',()=>{})
  //   it('Should',()=>{})
  //   it('Should',()=>{})
  //   it('Should',()=>{})
  //   it('Should',()=>{})
  // })

  describe('InteractableComponent', async () => {
    it('Should set the component name to InteractableComponen', () => {
      assert.equal(InteractableComponent.name, 'InteractableComponent')
    })
    it('Should set the jsonID to EE_interactable', () => {
      assert.equal(InteractableComponent.jsonID, 'EE_interactable')
    })
    it('Should set the initial data correctly', () => {
      setComponent(entity, UUIDComponent, v4() as EntityUUID)
      setComponent(entity, InteractableComponent)
      const entityUUID = getComponent(entity, UUIDComponent)
      const initialValues = getComponent(entity, InteractableComponent)
      const expectedInitialValues = {
        canInteract: false,
        uiInteractable: true,
        uiEntity: UndefinedEntity,
        label: 'E',
        uiVisibilityOverride: XRUIVisibilityOverride.none,
        uiActivationType: XRUIActivationType.proximity,
        activationDistance: 2,
        clickInteract: false,
        highlighted: false,
        callbacks: []
      }
      const expectedNewValues = {
        canInteract: true,
        uiInteractable: false,
        uiEntity: entity,
        label: 'S',
        uiVisibilityOverride: XRUIVisibilityOverride.on,
        uiActivationType: XRUIActivationType.hover,
        activationDistance: 3,
        clickInteract: true,
        highlighted: true,
        callbacks: [
          {
            callbackID: 'ID',
            target: entityUUID
          }
        ]
      }
      const assertDatasetsEquals = (
        actual: InferReturnType<typeof initialValues>,
        expected: InferReturnType<typeof initialValues>
      ) => {
        for (const [_key, value] of Object.entries(actual)) {
          if (isArray(value) && value.length > 0) {
            assert.equal(value[0].callbackID, expected[0].callbackID)
            assert.equal(value[0].target, expected[0].target)
          }
        }
      }
      assertDatasetsEquals(initialValues, expectedInitialValues)
      // Sanity check
      removeComponent(entity, InteractableComponent)
      setComponent(entity, InteractableComponent, expectedNewValues)
      assertDatasetsEquals(initialValues, expectedNewValues)
    })

    // describe('Reactor', async () => {
    //   it('Should set the DistanceFromCameraComponent', async () => {
    //     const component = getComponent(entity, DistanceFromCameraComponent)
    //     assert.equal(!!component, true)
    //   })
    //   it('Should set the DistanceFromlocalClientComponent', () => {
    //     const component = getComponent(entity, DistanceFromLocalClientComponent)
    //     assert.equal(!!component, true)
    //   })
    //   it('Should set the BoundingBoxComponent', () => {
    //     const component = getComponent(entity, BoundingBoxComponent)
    //     assert.equal(!!component, true)
    //   })
    //   it('Should remove the DistanceFromCameraComponent', () => {
    //     removeComponent(entity, InteractableComponent)
    //     const component = getComponent(entity, DistanceFromCameraComponent)
    //     assert.notEqual(!!component, true)
    //   })
    //   it('Should remove the DistanceFromlocalClientComponent', () => {
    //     removeComponent(entity, InteractableComponent)
    //     const component = getComponent(entity, DistanceFromLocalClientComponent)
    //     assert.notEqual(!!component, true)
    //   })
    //   it('Should remove the BoundingBoxComponent', () => {
    //     removeComponent(entity, InteractableComponent)
    //     const component = getComponent(entity, BoundingBoxComponent)
    //     assert.notEqual(!!component, true)
    //   })
    // })

    it('Should ', () => {})
  })
})
