import { createEngine, createEntity, destroyEngine, getComponent, setComponent, UndefinedEntity } from '@ir-engine/ecs'
import { afterEach, assert, beforeEach, describe, it } from 'vitest'
import { SceneSettingsComponent } from './SceneSettingsComponent'

describe('SceneSettingsComponent', () => {
  let entity = UndefinedEntity
  beforeEach(() => {
    createEngine()
    entity = createEntity()
    setComponent(entity, SceneSettingsComponent)
  })
  afterEach(() => {
    destroyEngine()
  })
  it('Should set the name to SceneSettingsComponent', () => {
    assert.equal(SceneSettingsComponent.name, 'SceneSettingsComponent')
  })
  it('Should set the jsonID to EE_scene_settings', () => {
    assert.equal(SceneSettingsComponent.jsonID, 'EE_scene_settings')
  })
  it('Should set the initial data of the component correctly', () => {
    const component = getComponent(entity, SceneSettingsComponent)
    const expectedInitial = {
      thumbnailURL: '',
      loadingScreenURL: '',
      primaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      alternativeColor: '#000000',
      sceneKillHeight: -10,
      spectateEntity: null
    }
  })
})
