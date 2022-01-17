// 全局变量
var logger = function () {}
var codeLineToggle = function () {}
var showChild = function () {}

;(function (wid) {
  let baseKeyIndex = 0, baseKeyObj = {}

  function getElementType (elementKey) {
    let _elementType = ''
    if (!elementKey) {
      _elementType = 'root'
    } else if (typeof elementKey === 'string') {
      _elementType = elementKey
    } else {
      _elementType = elementKey.displayName || elementKey.name||''
    } 
    return _elementType
  }
  function getDisplayNameFromInstance (instance, attr) {
    
    if (!instance) {
      return attr
    }
    let type = typeof instance === 'object'
    if (instance instanceof Map) {
      return 'Map'
    }
    if (instance instanceof WeakMap) {
      return 'WeakMap'
    }
    if (instance instanceof Set) {
      return 'Set'
    }
    if (instance instanceof WeakSet) {
      return 'WeakSet'
    }
    let displayName = instance.__proto__.constructor.name
    if (displayName !== 'Object') {
      if (displayName === 'Component') {
        return 'ComponentInstance '
      }
      return displayName
    } 
    // 普通对象 todo
    return 'Object'
  }
  // 获取对象的简洁信息 key: value
  function getSimpleInfo (params, attr) {
    if (!params) {
      return attr
    }
    if (attr === 'stateNode') {
      return getDisplayNameFromInstance(params, attr)
    }

    if (
      params instanceof Map ||
      params instanceof Set ||
      params instanceof WeakMap ||
      params instanceof WeakSet 
    ) {
      return params.__proto__.constructor.name + `(${params.size})`
    } 
    if (params instanceof Array) {
      return params.__proto__.constructor.name + `(${params.length})`
    } 

    let str = '', index = 0
    for (let a in params) {
      if (index >= 1) {
        str += ' ...'
        break
      }
      let type = typeof params[a]
      if (type === 'string' || type === 'number' || type === 'boolean') {
        str += `${a}: ${!params[a] && type ==='string' ? "''" : params[a] },`
      } else if (type === 'funciton') {
        str += `${a}: funciton ${a},`
      } else {
        str += `${a}: ${a},`
      }
      
      index++
    }
    if (str) {
      str = '{' + str + '}'
    }
    return str
  }

  function setKeyAndValue (key, value) {
    let isCustomerAttr = key.indexOf('Str') !== -1
    let isEmptyString = !value && typeof value === 'string'
    return isCustomerAttr 
      ? `<div class='attribute'><strong>${key}</strong>: <i>${value}</i>,&nbsp;</div>`
      : `<div class='attribute'><strong>${key}</strong>: ${isEmptyString ? "''" : value},&nbsp;</div>`
  }

  codeLineToggle = function (_this, event) {
    event.stopPropagation()
    let parentNode = _this.parentNode
    let target = parentNode.childNode
    if (parentNode.className.indexOf('code-wrap-expends') === -1) {
      target.className = 'code-expends'
      parentNode.className = 'code-wrap code-wrap-expends'
    } else {
      target.className = 'code-line'
      parentNode.className = 'code-wrap'
    }
  }
  function buildParams (params) {
    if (typeof params === 'function') {
      return params.name;
    }
    if (
      params === null || typeof params !== 'object'
    ) {
      return params + ''
    } 
    if (params instanceof Map) {
      return 'Map'
    }
    let jsonObj = {}
    let tags = ''
    
    for (let attr in params) {
      if (!params[attr]) {
        tags += setKeyAndValue(attr, params[attr])
      } else if (attr === 'elementType' || attr === 'type') {
        tags += setKeyAndValue(attr, getElementType(params[attr]))
      } else if (typeof params[attr] === 'object') {
        let key = ++baseKeyIndex
        baseKeyObj[key] = params[attr]
        let str = `
          <span class='span-coder'>
            <a 
              data-key=${key} 
              onclick='showChild(event)'
              class='a-coder'
            >${getSimpleInfo(params[attr], attr)}</a>
          </span>
        `
        tags += setKeyAndValue(attr, str)
      } else if (typeof params[attr] === 'symbol') {
        tags += setKeyAndValue(attr, 'symbol')
      } else if (typeof params[attr] === 'function') {
        tags += setKeyAndValue(attr, 'function')
      } else {
        tags += setKeyAndValue(attr, params[attr])
      } 
    }
    return tags 
  }

  showChild = function (e) {
    e.stopPropagation()
    let _target = e.target
    if (_target.parentNode.childNode) {
      _target.parentNode.removeChild(_target.parentNode.childNode)
      _target.parentNode.removeChild(_target.parentNode.childNodeLine)
      _target.parentNode.childNode = undefined
      _target.parentNode.childNodeLine = undefined
      return
    }
    let key = _target.getAttribute('data-key')
    let data = baseKeyObj[key]
    let tags = buildParams(data)
    if (!tags) {
      tags = Array.isArray(data) ? '[]' : '{}'
    }
    let node = document.createElement('div')
    node.className = 'code-wrap coder-show'
    node.innerHTML = `${tags}`
    let lineNode = document.createElement('div')
    lineNode.className='coder-show-line'
    _target.parentNode.childNode = node
    _target.parentNode.childNodeLine = lineNode
    _target.parentNode.appendChild(node)
    _target.parentNode.appendChild(lineNode)
  } 

  const info = function (a, b, level) {
    let data = a
    let title 
    let instanceType
    if (typeof a === 'string') {
      title = a
      data = b
    }
    if (data) {
      instanceType = data.__proto__.constructor.name
    }

    let 
      str = '', 
      tags = '', 
      container = document.getElementById('showLogger')
    
    tags = buildParams(data)

    let codeNode = document.createElement('div'), 
    codeLine = document.createElement('div')
    codeNode.className = 'code-wrap'
    codeNode.innerHTML = `
      <h3  
        onclick='codeLineToggle(this, event)'
      >${title || ''}${instanceType ? ` (${instanceType})` : ''}:</h3>
    `
    codeLine.className = 'code-line'
    codeLine.innerHTML = `${tags}`
    codeNode.childNode = codeLine
    codeNode.appendChild(codeLine)
    container.appendChild(codeNode)
  }

  const step = function (phase, fiber) {
    const container = document.getElementById('showLogger')
    const codeNode = document.createElement('div')
    codeNode.className = 'step-wrap'
    let str = `
      <h3  
        class='title-step'
      >${phase}:</h3>
    `
    if (fiber && typeof fiber === 'object') {
      let displayName = fiber.__proto__.constructor.name
      let attributes = ''
      if (displayName === 'FiberNode') {
        ;[
          'lanes',
          'childLanes'
        ].forEach((attr) => {
          attributes += `<em>${attr}</em>: <span>${fiber[attr]}</span>; `
        })
        str += `<div>
          ${getElementType(fiber.elementType)}(${fiber.tagStr})
          ~ 
          ${attributes}
        </div>` 
      } else {
        let attributes = ''
        let index = 0
        for (let attr in fiber) {
          if (index >= 5) {
            break
          }
          index++
          attributes += `<em>${attr}</em>: <span>${fiber[attr]}</span>; `
        }
        str += `<div>${attributes}</div>` 
      }
    } else {
      str += fiber
    }
    codeNode.innerHTML = str
    container.appendChild(codeNode)
  }

  const warn = function () {
    const container = document.getElementById('showLogger')
    const infoNode = document.createElement('div')
    let title = arguments[0]
    let rest = Array.prototype.slice.call(arguments, 1)
    let str = `<span>${title}</span>`
    rest && rest.forEach((a) => {
      str += `<span>${a}</span>`
    })
    infoNode.className = 'warn-node-wrap'
    infoNode.innerHTML = str
    container.appendChild(infoNode)
  }
  const tag = function () {
    const container = document.getElementById('showLogger');
    const infoNode = document.createElement('dl');
    let title = arguments[0];
    let rest = Array.prototype.slice.call(arguments, 1)
    let str = `<dt>${title}</dt>`
    rest && rest.forEach((a) => {
      str += `<dd>${a}</dd>`
    })
    infoNode.className = 'tag-node-wrap'
    infoNode.innerHTML = '##&nbsp;' + str + '&nbsp;##'
    container.appendChild(infoNode) 
  }

  const line = function (title, end) {
    const isRender = this.isRender;
    const container = document.getElementById('showLogger')
    const infoNode = document.createElement('div');
    let infoNodeClassName = 'page-line',
    titleNode;
    if (typeof title === 'string') { 
      infoNodeClassName += isRender ? ' page-line-color-green' : ' page-line-color-blue'
      titleNode = document.createElement('div')
      titleNode.className = 'page-line-title' + (isRender ? ' page-line-title-green' : '');
      titleNode.innerText = `## ${title}`
    }

    infoNode.className = infoNodeClassName

    if (!end) {
      // 不是结尾 文字放线下方
      container.appendChild(infoNode)
    }
    
    if (titleNode) {
      container.appendChild(titleNode)
    }
    // 结尾 提示文字放线上方
    if (end) {
      container.appendChild(infoNode)
    }
  }

  let _rows = []
  const compare = function (phase, fiber) {
    if (!fiber) {
      return
    }
    const { expirationTime, childExpirationTime, elementType } = fiber
    _rows.push({
      phase, 
      expirationTime, 
      childExpirationTime,
      elementType: getElementType(elementType)
    })
  }

  const commitLog = function () {

  }

  // ---------------------------------------------------------
  let methods = {
    step, warn, tag, info, line, compare
  }
  wid.Logger = methods
  function composeMethods (methods, canUse) {
    const result = {}
    for (let attr in methods) {
      result[attr] = function () {}
    }
    if (!canUse) {
      return result;
    }
    return methods
  }

  // 主流程
  wid.MainLogger = composeMethods(methods, true)
  // events
  wid.EventsLogger = composeMethods(methods, false)
  // scheduler
  wid.SchedulerLogger = composeMethods(methods, true)
  // render阶段
  wid.RenderLogger = {
    ...composeMethods(methods, true),
    isRender: false
  }
  // commit阶段
  wid.CommitLogger = composeMethods(methods, true);
  // hooks 
  wid.HooksLogger = composeMethods(methods, true);

  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('actions').onclick = function (e) {
      e.stopPropagation()
    }
    document.getElementById('sync').onclick = function (e) {
      e.stopPropagation()
      window.location.reload()
    }
    document.getElementById('clear').onclick = function (e) {
      
      document.getElementById('showLogger').innerHTML = ''
      _rows.length = 0
    }
    document.getElementById('compare').onclick = function (e) {
      if (document.getElementById('compareContainer')) {
        return
      }
      const compareNode = document.createElement('div')
      compareNode.id = 'compareContainer'
      compareNode.className = 'compare-wrap'
      let table = `<div class='compare-close'><a id='compareClose'>关闭</a></div>` 
      table += '<table>'
      table += '<thead>' 
      table += '<tr>'
      table += `
        <th>phase</th>
        <th>elementType</th>
        <th>expirationTime</th>
        <th>childExpirationTime</th>
      `
      table += '</tr>'
      table += '</thead>'
      table += '<tbody>' 
      _rows.forEach((item) => {
        table += '<tr>'
        table += `
          <td>${item.phase}</td>
          <td>${item.elementType}</td>
          <td>${item.expirationTime}</td>
          <td>${item.childExpirationTime}</td>
        `
        table += '</tr>'
      })
      table += '</tbody>' 
      table += '</table>'
      compareNode.innerHTML = table
      
      document.body.appendChild(compareNode)
      document.getElementById('compareClose').onclick = function () {
        compareNode.outerHTML = ''
      }
    }
  })

})(window);
