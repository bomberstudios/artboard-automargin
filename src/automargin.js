// TODO: make this a preference on Settings window
const PADDING = 32

import sketch from 'sketch'
const Settings = sketch.Settings

export function onDocumentChanged (context) {
  context.actionContext.forEach(change => {
    if ( !layerIsExcludedFromResize(change) && (layerIsInsertedOnArtboard(change) || layerIsMovedInsideArtboard(change)) ) {
      // console.log('A new layer has been inserted into an Artboard')
      let layer = sketch.fromNative(change.object())
      layer.frame.x = PADDING
      // layer.frame.y = PADDING
      layer.frame.width = layer.parent.frame.width - (PADDING * 2)
      // layer.frame.height = layer.parent.frame.height - (PADDING * 2)
    }
  })
}

function layerIsInsertedOnArtboard(change) {
  return change.type() == 3 && change.parent().object().className() == 'MSArtboardGroup'
}

function layerIsMovedInsideArtboard(change) {
  return change.type() == 1 && sketch.fromNative(change.object()).parent.type == 'Artboard'
}

function layerIsExcludedFromResize(change) {
  // TODO: Add a feature to tag layers as excluded using metadata on the layer, and not the name
  // TODO: make the pattern a Setting on preferences
  if (change.object().name().indexOf('--') == 0) {
    return true
  }
  if (sketch.fromNative(change.object()).parent.name.indexOf('--') == 0) {
    return true
  }
  return false
}

export function tagLayerExclude(context) {
  let selection = sketch.getSelectedDocument().selectedLayers
  selection.forEach( layer => {
    if (layer.name.indexOf('--') == 0) {
      // Layer is already excluded, do nothing
    } else {
      layer.name = '--' + layer.name
    }
  })
}
export function tagLayerInclude(context) {
  let selection = sketch.getSelectedDocument().selectedLayers
  selection.forEach( layer => {
    if (layer.name.indexOf('--') == 0) {
      layer.name = layer.name.substr(2)
    }
  })
}