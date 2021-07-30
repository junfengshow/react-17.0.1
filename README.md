## react源码阅读
通过nodemon监听文件的变化，重新进行编译。
html文件中引入编译之后的react文件。
再在源码中需要的地方打日志，经过上述过程查看到日志输出点的内容。
## 启动
npm run build


log：
MainLogger: 主流程
EventsLogger: 事件相关的logger
SchedulerLogger：调度器的logger
RenderLogger：render阶段的logger

