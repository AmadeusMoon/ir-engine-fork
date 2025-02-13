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

import { act, render } from '@testing-library/react'
import assert from 'assert'
import React from 'react'
import sinon from 'sinon'
import { BoxGeometry, Color, LineBasicMaterial, Material, Mesh, MeshBasicMaterial, SphereGeometry } from 'three'
import { afterEach, beforeEach, describe, it } from 'vitest'

import {
  getComponent,
  getMutableComponent,
  hasComponent,
  removeComponent,
  setComponent,
  UndefinedEntity
} from '@ir-engine/ecs'
import { destroyEngine } from '@ir-engine/ecs/src/Engine'
import { createEntity, removeEntity } from '@ir-engine/ecs/src/EntityFunctions'
import { State } from '@ir-engine/hyperflux'

import { createEngine } from '@ir-engine/ecs/src/Engine'
import { Geometry } from '../../common/constants/Geometry'
import { GroupComponent } from './GroupComponent'
import { MeshComponent, useMeshComponent } from './MeshComponent'

describe('MeshComponent', () => {
  describe('IDs', () => {
    it('should initialize the MeshComponent.name field with the expected value', () => {
      assert.equal(MeshComponent.name, 'MeshComponent')
    })

    it('should initialize the MeshComponent.jsonID field with the expected value', () => {
      assert.equal(MeshComponent.jsonID, 'EE_mesh')
    })
  }) //:: IDs

  describe('onInit', () => {
    let testEntity = UndefinedEntity

    beforeEach(async () => {
      createEngine()
      testEntity = createEntity()
    })

    afterEach(() => {
      removeEntity(testEntity)
      return destroyEngine()
    })

    it('should initialize the component correctly', () => {
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: 0xffff00 })

      setComponent(testEntity, MeshComponent, new Mesh(geometry, material))

      assert(hasComponent(testEntity, MeshComponent))
      const data = getComponent(testEntity, MeshComponent)
      assert.equal(data.geometry === geometry, true)
      assert.equal(data.material === material, true)

      removeComponent(testEntity, MeshComponent)

      assert(!hasComponent(testEntity, MeshComponent))
    })

    it("shouldn't serialize the mesh", () => {
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: 0xffff00 })

      setComponent(testEntity, MeshComponent, new Mesh(geometry, material))
      const data = getComponent(testEntity, MeshComponent)
      const json = MeshComponent.toJSON(data)
      assert(json === null)
    })
  }) //:: onInit

  describe('onSet', () => {
    let testEntity = UndefinedEntity

    beforeEach(async () => {
      createEngine()
      testEntity = createEntity()
    })

    afterEach(() => {
      removeEntity(testEntity)
      return destroyEngine()
    })

    it('should throw an error if the data assigned does not provide a valid `MeshComponent.geometry` object', () => {
      assert.throws(() => setComponent(testEntity, MeshComponent))
    })

    it('should change the values of an initialized MeshComponent', () => {
      const Initial = new Mesh(new SphereGeometry())
      const Expected = new Mesh(new BoxGeometry())
      setComponent(testEntity, MeshComponent, Initial)
      const before = getComponent(testEntity, MeshComponent)
      assert.equal(before.uuid, Initial.uuid)
      // Run and Check the result
      setComponent(testEntity, MeshComponent, Expected)
      const result = getComponent(testEntity, MeshComponent)
      assert.notEqual(result.uuid, Initial.uuid)
      assert.equal(result.uuid, Expected.uuid)
    })
  }) //:: onSet

  describe('reactor', () => {
    let testEntity = UndefinedEntity

    beforeEach(async () => {
      createEngine()
      testEntity = createEntity()
    })

    afterEach(() => {
      removeEntity(testEntity)
      return destroyEngine()
    })

    it('should trigger when component changes', () => {
      const Initial = new Mesh(new SphereGeometry())
      const Expected = new Mesh(new BoxGeometry())
      setComponent(testEntity, MeshComponent, Initial)
      const before = getComponent(testEntity, MeshComponent)
      assert.equal(before.uuid, Initial.uuid)
      // Run and Check the result
      getMutableComponent(testEntity, MeshComponent).set(Expected)
      const result = getComponent(testEntity, MeshComponent)
      assert.notEqual(result.uuid, Initial.uuid)
      assert.equal(result.uuid, Expected.uuid)
    })

    it('should trigger when component.geometry changes', () => {
      const Initial = new SphereGeometry()
      const Expected = new BoxGeometry()
      const mesh = new Mesh(Initial)
      setComponent(testEntity, MeshComponent, mesh)
      const before = getComponent(testEntity, MeshComponent).geometry
      assert.equal(before.uuid, Initial.uuid)
      // Run and Check the result
      getMutableComponent(testEntity, MeshComponent).geometry.set(Expected)
      const result = getComponent(testEntity, MeshComponent).geometry
      assert.notEqual(result.uuid, Initial.uuid)
      assert.equal(result.uuid, Expected.uuid)
    })

    it('should trigger when component.material changes', () => {
      const Initial = new Material()
      const Expected = new Material()
      const mesh = new Mesh(new BoxGeometry())
      mesh.material = Initial
      setComponent(testEntity, MeshComponent, mesh)
      const before = getComponent(testEntity, MeshComponent).material as Material
      assert.equal(before.uuid, Initial.uuid)
      // Run and Check the result
      getMutableComponent(testEntity, MeshComponent).material.set(Expected)
      const result = getComponent(testEntity, MeshComponent).material as Material
      assert.notEqual(result.uuid, Initial.uuid)
      assert.equal(result.uuid, Expected.uuid)
    })
  }) //:: reactor

  describe('useMeshComponent', () => {
    beforeEach(async () => {
      createEngine()
    })

    afterEach(() => {
      return destroyEngine()
    })

    it('should create a mesh correctly', () => {
      const entity = createEntity()
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: 0xffff00 })

      assert.doesNotThrow(() => {
        const Reactor = () => {
          const mesh = useMeshComponent(entity, geometry, material)
          return <></>
        }

        const { rerender, unmount } = render(<Reactor />)

        assert(hasComponent(entity, MeshComponent))
        const mesh = getComponent(entity, MeshComponent)
        assert(hasComponent(entity, GroupComponent) && getComponent(entity, GroupComponent).includes(mesh))
        assert(mesh.userData['ignoreOnExport'])
        unmount()
      })
    })

    /** @todo */
    it.skip('should dispose resources correctly', async () => {
      const entity = createEntity()
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: 0xffff00 })

      const spy = sinon.spy()
      geometry.dispose = spy
      material.dispose = spy

      const Reactor = () => {
        const mesh = useMeshComponent(entity, geometry, material)
        return <></>
      }

      const { rerender, unmount } = render(<Reactor />)

      assert(hasComponent(entity, MeshComponent))
      await act(() => rerender(<Reactor />))
      sinon.assert.calledTwice(spy)
      removeEntity(entity)
    })

    it.skip("should update the mesh's geometry correctly", async () => {
      const entity = createEntity()
      const geometry = new BoxGeometry(1, 1, 1)
      const geometry2 = new SphereGeometry(0.5)
      const material = new MeshBasicMaterial({ color: 0xffff00 })

      const geoUUID = geometry.uuid

      const spy = sinon.spy()
      geometry.dispose = spy

      let meshState = undefined as undefined | State<Mesh<BoxGeometry | SphereGeometry, Material>>
      const Reactor = () => {
        const mesh = useMeshComponent(entity, geometry, material)
        meshState = mesh
        return <></>
      }

      const { rerender, unmount } = render(<Reactor />)

      assert(hasComponent(entity, MeshComponent))
      assert(meshState)
      assert(meshState.geometry.value)
      assert(meshState.geometry.type.value === 'BoxGeometry')
      meshState.geometry.set(geometry2)

      await act(() => rerender(<Reactor />))

      sinon.assert.calledOnce(spy)
      assert(meshState)
      assert(meshState.geometry.value)
      assert(meshState.geometry.type.value === ('SphereGeometry' as any))
      unmount()
      removeEntity(entity)
    })

    it.skip("should update the mesh's material correctly", async () => {
      const entity = createEntity()
      const geometry = new BoxGeometry(1, 1, 1)
      const material = new MeshBasicMaterial({ color: 0xdadada })
      const material2 = new LineBasicMaterial({ color: 0xffff00 })

      const matUUID = material.uuid

      const spy = sinon.spy()
      material.dispose = spy

      let meshState = undefined as undefined | State<Mesh<Geometry, MeshBasicMaterial | LineBasicMaterial>>
      const Reactor = () => {
        const mesh = useMeshComponent(entity, geometry, material)
        meshState = mesh
        return <></>
      }

      const { rerender, unmount } = render(<Reactor />)

      assert(hasComponent(entity, MeshComponent))
      await act(() => rerender(<Reactor />))

      assert(meshState)
      assert(meshState.material.value)
      assert(meshState.material.type.value === 'MeshBasicMaterial')
      assert(meshState.material.color.value.getHex() === 0xdadada)
      meshState.material.set(material2)

      await act(() => rerender(<Reactor />))

      sinon.assert.calledOnce(spy)
      assert(meshState)
      assert(meshState.material.type.value === ('LineBasicMaterial' as any))
      assert(meshState.material.color.value.getHex() === 0xffff00)
      meshState.material.color.set(new Color(0x000000))

      await act(() => rerender(<Reactor />))

      // Dispose wasn't called again because just a property was changed in the material, not the material itself
      sinon.assert.calledOnce(spy)
      assert(meshState)
      assert(meshState.material.type.value === ('LineBasicMaterial' as any))
      assert(meshState.material.color.value.getHex() === 0x000000)
      unmount()
      removeEntity(entity)
    })
  }) //:: useMeshComponent
})
