const node = document.getElementById('app');
const node2 = document.getElementById('app2');
const { useState, useEffect, Component, clone, createContext } = React

;(function () {
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


  // const Context = createContext();
  function ShowAge () {
    this.state = {
      age: 0, gender: 0
    }
  }
  // ShowAge.contextType = Context;
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
    // console.log('context', this.context) 
    // {name:"zhangsan"}
    return React.createElement(
      'a', 
      {
        onClick: this.onClick.bind(this),
        style: {
          display: 'block'
        }
      }, 
      `age: ${age} -- gender: ${gender}`
    );
  }
  ShowAge.prototype.componentDidMount = function () {
    MainLogger.tag('----------componentDidMount---------')
  }
  ShowAge.prototype.componentDidUpdate = function (prevProps, prevState) {
    MainLogger.tag('----------componentDidUpdate---------')
    // MainLogger.info(prevProps, prevState)
  }
  
  function Button () {
    const [count, setCount] = React.useState(0);
    const [age, setAge] = React.useState('age: ');
    return React.createElement('button', {
      onClick: () => {
        setCount(count + 1)
      }
    }, '提交' + count)
  }
  function Wrap () {
    return React.createElement('div', null, [
      React.createElement(ShowAge, { key: 1 }),
      React.createElement(Button, { key: 2 })
    ]);
  }
  // 测试setState
  ReactDOM.createRoot(node, {
    unstable_concurrentUpdatesByDefault: true
  }).render(
    React.createElement(Wrap)
    // React.createElement(
    //   Context.Provider, 
    //   {
    //     value: {name: 'zhangsan'}
    //   }, 
    //   React.createElement(ShowAge)
    // )
  );

  // ----------------------------------------------------------------------
  // 测试hooks
  function HooksDemoCount (props) {
    const [count, setCount] = useState()

    // useEffect(() => {
    //   Logger.step('useEffect', 'sync')
    // })

    const onChange = (e) => {
      const _v = e.target.value
      setCount(_v);
    }

    return React.createElement('div', {
      className: 'click-container',
    }, [
      React.createElement('input', { key: '1', value: count, onChange, placeholder: '请输入' }),
      React.createElement( 'div', { key: '2' }, props.count)
    ])
  }
  class HooksDemo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: ''
      }
    }

    componentDidMount () {}
    onChange () {}
    render () {
      return (
        React.createElement(HooksDemoCount, { count: 1 })
      )
    }
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(HooksDemo));

  // ----------------------------------------------------------------------
  // concurrent模式 最简单的Hook
  function JustHookDemo () {
    const [value, setValue] = useState('');
    const onChange = (e) => {
      const val = e.target.value;
      setValue(val);
    }
    return React.createElement('input', { value, placeholder: '请输入', onChange })
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(JustHookDemo));

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
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(DiffDemo));
})();

// 事件 -- 捕获/冒泡
;(() => {
  function EventsDemo () {
    const isCapture = false;
    const { useRef, useEffect, useState } = React;
    const wrapRef = useRef(null);
    const innerRef = useRef(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
      node.addEventListener('click', function () {
        EventsLogger.step('native click', 'container')
      })
      wrapRef.current.addEventListener('click', function () {
        EventsLogger.step('native click', 'wrap')
        // setCount(count + 1)
      }, isCapture);
      innerRef.current.addEventListener('click', function () {
        EventsLogger.step('native click', 'inner')
        // setCount(count + 1)
      }, isCapture);
    }, [])

    // react 合成事件
    const clickWrap = () => {
      EventsLogger.step('react click', 'wrap')
      // setCount(count + 1)
    }
    const clickInnner = () => {
      EventsLogger.step('react click', 'inner')
      // setCount(count + 1)
    }
    return (
      React.createElement('div', {
        [isCapture?'onClickCapture':'onClick']: clickWrap,
        ref: wrapRef,
      }, React.createElement('a', {
        [isCapture?'onClickCapture':'onClick']: clickInnner,
        ref: innerRef,
      }, 'aaaa: ' + count))
    );
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement(EventsDemo));
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
