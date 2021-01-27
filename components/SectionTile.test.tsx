import React from 'react'
import ReactDOM from 'react-dom'
import {act} from 'react-dom/test-utils'
import SectionTile from './SectionTile'
import {Section} from 'models/section'

let container: Element

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

function getSection(): Section {
  return {
    collectionId: 'testCollection',
    createdAt: new Date(),
    creatorId: 'testCreator',
    id: 'testId',
    quizCount: 1,
    title: 'testTitle',
    updatedAt: new Date(),
  }
}

describe('SectionTile', () => {
  it('無料の問題集の場合', () => {
    const section = getSection()
    act(() => {
      ReactDOM.render(
        <SectionTile
          section={section}
          isMySection={false}
          needPayment={false}
          parchased={false}
        />,
        container
      )
    })
    const div = container.querySelector('div')
    expect(div.className).toContain('bg-white')
    // 実行ボタンが表示されている
    expect(div).toContainHTML(
      'href="/collections/testCollection/sections/testId/play"'
    )
  })
  it('有料の問題集で未購入の場合', () => {
    const section = getSection()
    act(() => {
      ReactDOM.render(
        <SectionTile
          section={section}
          isMySection={false}
          needPayment={true}
          parchased={false}
        />,
        container
      )
    })
    const div = container.querySelector('div')
    expect(div.className).not.toContain('bg-white')
    // 実行ボタンが表示されていない
    expect(div).not.toContainHTML(
      'href="/collections/testCollection/sections/testId/play"'
    )
  })
  it('有料の問題集で、購入済みの場合', () => {
    const section = getSection()
    act(() => {
      ReactDOM.render(
        <SectionTile
          section={section}
          isMySection={false}
          needPayment={true}
          parchased={true}
        />,
        container
      )
    })
    const div = container.querySelector('div')
    expect(div.className).toContain('bg-white')
    // 実行ボタンが表示されている
    expect(div).toContainHTML(
      'href="/collections/testCollection/sections/testId/play"'
    )
  })
})
