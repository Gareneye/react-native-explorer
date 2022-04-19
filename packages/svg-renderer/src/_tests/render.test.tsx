import '../index'

import * as React from 'react'
import { View } from 'react-native'
import * as renderer from 'react-test-renderer'

import componentTreeToNodeTree from '../component-tree-to-nodes'
import renderedComponentTree from '../reapply-layouts-to-components'
import treeToSVG from '../tree-to-svg'
import { Component } from '../index'

it('handles some simple JSX', () => {
  const jsx = (
    <View
      style={{
        width: 100,
        height: 260,
        marginLeft: 40,
        marginTop: 40,
        paddingLeft: 20
      }}
    >
      <View style={{ width: 20, height: 20 }} />
      <View style={{ width: 160, height: 40, marginTop: 20 }}>
        <View
          style={{ width: 10, height: 10, marginLeft: 10, marginTop: 20 }}
        />
        <View
          style={{ width: 10, height: 10, marginLeft: 20, marginTop: 10 }}
        />
      </View>
      <View style={{ width: 20, height: 20 }} />
      <View
        style={{ width: 160, height: 40, marginTop: 20, paddingHorizontal: 10 }}
      >
        <View style={{ width: 10, height: 10, marginHorizontal: 10 }} />
        <View style={{ width: 10, height: 10, marginVertical: 10 }} />
        <View style={{ width: 10, height: 10, marginHorizontal: -10 }} />
      </View>
      <View
        style={{
          width: 160,
          height: 40,
          margin: 20,
          padding: 10,
          borderWidth: 10
        }}
      >
        <View style={{ width: 10, height: 10, margin: 10, marginLeft: 30 }} />
        <View style={{ width: 10, height: 10, margin: 10, marginTop: 0 }} />
        <View style={{ width: 10, height: 10, margin: -10, marginTop: 0 }} />
      </View>
    </View>
  )

  const component = renderer.create(jsx).toJSON()
  const settings = {
    width: 600,
    height: 400,
    wireframe: false
  }

  const rootNode = componentTreeToNodeTree(component as Component, settings)
  const rendered = renderedComponentTree(component as Component, rootNode)
  const results = treeToSVG(rendered, settings)
  expect(results).toMatchSnapshot()

  expect(component).toMatchSVGSnapshot(1024, 768)
  rootNode.freeRecursive()
})
