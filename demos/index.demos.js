const node = document.getElementById('app');
const node2 = document.getElementById('app2');
const { useState, useEffect, useLayoutEffect, useRef, Component, clone, createContext } = React;

function extendsFunc (Parent, Child) {
  Child.prototype = new Parent();
  Child.constructor = Child;
}

// 最简单的组件
;(function () {
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: true
  // }).render(React.createElement('div', null, 'hello'));
})();

// hooks
;(function () {
  const User = () => {
    const [age, setAge] = useState(0);
    const [name, setName] = useState('zhangsan');
    const containerRef = useRef();
    // useEffect(() => {
    //   setTimeout(() => {
    //     setAge(age + 1);
    //     setAge(age + 1);
    //     setAge(age + 1);
    //   }, 3000);
    // }, []);
    // useEffect(() => {
    //   MainLogger.info('useEffect', 'fucntion')
    //   return () => {
    //     MainLogger.info('useEffect', 'destroy')
    //   }
    // }, [age]);
    // useLayoutEffect(() => {
    //   MainLogger.info('useLayoutEffect', 'fucntion')
    //   return () => {
    //     MainLogger.info('useLayoutEffect', 'destroy')
    //   }
    // }, [age]);
    return React.createElement('div', {
      id: 'oDiv',
      ref: containerRef,
      onClick: () => {
        // setAge(1);
        // setAge(2);
        // setAge(4);
        // setAge(3);
        setAge(age + 1);
        // MainLogger.tag(`age: ${age}`);
        // setName(name + 1)
      }
    }, 
    `user: ${age};name: ${name}`
      // [
      //   React.createElement('input'),
      //   React.createElement('div', null, `user: ${age};name: ${name}`),
      // ]
    )
  }

  ReactDOM.createRoot(node, {
    unstable_concurrentUpdatesByDefault: true
  }).render(React.createElement(User, null));
  // ReactDOM.render(React.createElement(User), node);
})();

// class
;(function () {
  class User extends Component {
    constructor (props) {
      super(props);
      this.state = {
        name: 'zhangsan',
        age: 0,
        friend: {
          b: 1
        }
      }
    }
    componentDidMount () {
      document.getElementById('oDiv').addEventListener('click', () => {
        this.setState({ age: this.state.age + 1 });
        MainLogger.tag(`age: ${this.state.age}`);
        // this.setState({ age: this.state.age + 1 });
        // this.setState({ age: this.state.age + 1 });
      });
      // this.setState({
      //   friend: {
      //     a: 2
      //   }
      // }, () => {
      //   console.log(this.state);
      // })
    }
    onClick = () => {
      setTimeout(() => {
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
        this.setState({ age: this.state.age + 1 });
      })
    }
    render () {
      return (
        React.createElement('div', {
          id: 'oDiv',
          // onClick: this.onClick
        }, `user: ${this.state.age};name: ${this.state.name}`)
      )
    }
  }
  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: false
  // }).render(React.createElement(User));
  // ReactDOM.render(React.createElement(User), node)
})();
 
// useDeferredValue
;(function () {
  const User = () => {
    const [value, setValue] = useState(0);
    const [name, setName] = useState('zhangsan');
    const df = React.useDeferredValue(value);
    
    useEffect(() => {
      // setValue(1000)
    }, []);

    return React.createElement('div', {
      id: 'oDiv',
      onClick: () => {
        setValue(value + 1);
      }
    }, 
    [
      React.createElement('input', {
        onInput: (e) => {
          setValue(e.target.value)
        }
      }),
      ...new Array(+df).fill(0).map((_, idx) => (
        `user: ${idx}_${df}`
      ))
    ]);
  }

  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: false
  // }).render(React.createElement(User, null));
})();

// useDeferredValue
;(function () {
  const Demo = () => {
    const [value, setValue] = useState(0);
    const [isPending, startTransition] = React.useTransition();
    console.log('isPending:', isPending)
    return [
      React.createElement('div', { key: '0' }, `${isPending}`),
      React.createElement('input', {
        key: '1',
        onInput: (e) => {
          setValue(e.target.value);
          // startTransition(() => {
          //   setValue(e.target.value);
          // });
        }
      }),
      React.createElement(
        'div', 
        {
          key: '2',
        },
        new Array(100).fill(0).map((_, idx) => (
          `demo: ${value}_${idx}`
        )) 
      ),
    ];
  }

  // ReactDOM.createRoot(node, {
  //   unstable_concurrentUpdatesByDefault: false
  // }).render(React.createElement(Demo, null));
  // ReactDOM.render(React.createElement(Demo), node);
})();
