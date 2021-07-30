
;(function () {
  const node = document.getElementById('app')
  const node2 = document.getElementById('app2')
  const { useState, useEffect, Component, clone } = React
  let array = new Array(1000).fill(1000);
  function extendsFunc (Parent, Child) {
    Child.prototype = new Parent();
    Child.constructor = Child;
  }

  // 最简单的方式

  // ReactDOM.createRoot(node, {
  //   // 开启concurrent mode的参数之一
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement('div', null, 'hello world'));
  // ReactDOM.render(
  //   React.createElement('div', null, 'hello world'),
  //   node
  // )
  // 多次setState  
  function InputDemo (props, context) {
    this.state = {
      value: ''
    }
    this.onChange = this.onChange.bind(this)
  }
  extendsFunc(Component, InputDemo)
  InputDemo.prototype.onChange = function (e) {
    const { value } = e.target
    this.setState({ value });
    // this.setState({ value: value + 1 })
    // this.setState({ value: value + 2 })
    this.setState({
      value
    })
  }
  InputDemo.prototype.render = function () {
    const { value, platArray } = this.state 
    if (platArray && platArray.length) {
      return platArray;
    }
    // return React.createElement('input', {
    //   type: 'text',
    //   value,
    //   onChange: this.onChange,
    //   placeholder: '请输入名称',
    //   key: '1'
    // });
    return [
      React.createElement('input', {
        type: 'text',
        value,
        onChange: this.onChange,
        placeholder: '请输入名称',
        key: '1001'
      }),
      React.createElement('div', { 
        key: '1002' 
      }, 'hello world')
    ];
  }
  InputDemo.prototype.componentDidMount = function () {
    MainLogger.step('componentDidMount', 'componentDidMount')
  }
  // input change
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(InputDemo));

  function ShowAge () {
    this.state = {
      age: 0, gender: 0
    }
  }
  extendsFunc(Component, ShowAge)
  ShowAge.prototype.onClick = function () {
    this.setState({
      age: 1, gender: 1
    })
    this.setState({
      age: 2
    })
  }
  ShowAge.prototype.render = function () {
    const { age, gender } = this.state
    Logger.info('render age: ', this.state.age)
    return React.createElement('div', {
      onClick: this.onClick.bind(this)
    }, `age: ${age} -- gender: ${gender}`)
  }
  ShowAge.prototype.componentDidMount = function () {
    
  }
  ShowAge.prototype.componentDidUpdate = function (prevProps, prevState) {
    console.log('----------componentDidUpdate---------')
    console.log(prevProps, prevState)
  }
  // 测试setState
  // ReactDOM.render(React.createElement(ShowAge), node)

  // ----------------------------------------------------------------------
  // 测试hooks
  function ComponentWrap (props, context) {
    this.state = { count: 1 }
  }
  extendsFunc(Component, ComponentWrap)
  
  ComponentWrap.prototype.componentDidMount = function () {
    // this.setState({ count: 2 })
    // this.setState({ count: 3 })
  }
  ComponentWrap.prototype.render = function () {
    const { count } = this.state
    return React.createElement(ShowCountWrap, { count })
  }

  // input
  function ShowCount ({ onChange, value }) {
    return React.createElement('input', {
      onChange,
      value 
    })
  }
  // div
  function ShowCountWrap (props) {
    const [count, setCount] = useState(1)

    // useEffect(() => {
    //   Logger.step('useEffect', 'sync')
    // })

    const onChange = (e) => {
      const _v = e.target.value
      setCount(_v)
      setCount(_v)
      setCount(_v)
    }

    return React.createElement('div', {
      className: 'click-container',
    }, [
      React.createElement(
        ShowCount, 
        { key: '1', value: count, onChange }
      ),
      React.createElement( 'div', { key: '2' }, props.count)
    ])
  }
  // ReactDOM.render(React.createElement(ComponentWrap), node)

  // ----------------------------------------------------------------------
  // concurrent模式
  function Concurrent () {
    this.state = {
      platArray: array,
      dist: 1
    }
  }
  extendsFunc(Component, Concurrent)
  Concurrent.prototype.render = function () {
    const { platArray } = this.state;
    return React.createElement('div', {
      onClick: this.onClick.bind(this)
    }, platArray.map((item, i) => React.createElement('div', {key: i}, i * this.state.dist)))
  }
  Concurrent.prototype.onClick = function () {
    console.log('onclick');
    this.setState({ dist: 2 })
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(Concurrent, null, null));


  // ----------------------------------------------------------------------
  // diff
  function DiffDemo (props, context) {
    this.state = { value: '' };
    this.onChange = this.onChange.bind(this);
  }
  extendsFunc(Component, DiffDemo)
  DiffDemo.prototype.onChange = function (e) {
    const { value } = e.target;
    this.setState({ value });
  }
  DiffDemo.prototype.render = function () {
    const { value } = this.state;
    return value % 2 === 0 
    ? [
      React.createElement('input', {
        type: 'text',
        value: this.state.value,
        onChange: this.onChange,
        placeholder: 'input something',
        key: '1001'
      }),
      React.createElement('div', { 
        key: '1002' 
      }, 'hello world'),
    ]
    : [
      React.createElement('input', {
        type: 'text',
        value: this.state.value,
        onChange: this.onChange,
        placeholder: 'input something',
        key: '1001'
      }),
      React.createElement('div', { 
        key: '1002' 
      }, 'hello world'),
      React.createElement('div', { 
        key: '1002' 
      }, 'add line'),
    ];
  }
  DiffDemo.prototype.componentDidMount = function () {
    MainLogger.step('componentDidMount', 'componentDidMount')
  }
  ReactDOM.createRoot(node, {
    unstable_concurrentUpdatesByDefault: true
  }).render(React.createElement(DiffDemo));
})();

// ;(function () {
//   function setFrame () {
//     Logger.tag('setFrame')
//   }
//   window.requestAnimationFrame(() => {
//     Logger.tag('requestAnimationFrame')
//     setFrame()
//   })
// })();
