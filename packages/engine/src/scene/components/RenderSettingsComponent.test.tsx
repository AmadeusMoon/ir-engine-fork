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
import { mockEngineRenderer } from '@ir-engine/spatial/tests/util/MockEngineRenderer'
import { mockSpatialEngine } from '@ir-engine/spatial/tests/util/mockSpatialEngine'
import { CineonToneMapping } from 'three'
import { afterEach, assert, beforeEach, describe, it } from 'vitest'
import { RenderSettingsComponent } from './RenderSettingsComponent'

describe('RenderSettingsComponent.ts', () => {
  let entity = UndefinedEntity
  const assertDatasetsEquals = (actual, expected) => {
    for (const [key, value] of Object.entries(actual)) {
      assert.equal(actual[key], expected[key])
    }
  }

  beforeEach(() => {
    createEngine()
    mockSpatialEngine()
    entity = createEntity()
    setComponent(entity, EntityTreeComponent)
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
    setComponent(entity, RenderSettingsComponent)
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
      setComponent(entity, RendererComponent, { renderer: null })
      const rendererNull = getComponent(entity, RendererComponent).renderer?.toneMapping
      // Sanity check if renderer null
      assert.equal(rendererNull, null)
      setComponent(entity, RendererComponent, { renderer: undefined })
      const rendererUndefined = getComponent(entity, RendererComponent).renderer?.toneMapping
      // Sanity check if renderer undefined
      assert.equal(rendererUndefined, undefined)
      // Mock renderer
      mockEngineRenderer(entity)
      setComponent(entity, RenderSettingsComponent, { toneMapping: CineonToneMapping })
      const rendererSettings = getComponent(entity, RenderSettingsComponent)
      const renderer = getComponent(entity, RendererComponent).renderer?.toneMapping
      // The RendererComponent should have its render.toneMapping set to the value of RendererSettingsComponent.toneMapping
      assert.equal(renderer, rendererSettings.toneMapping)
    })
  })
})
