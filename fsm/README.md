# 有限状态机简单应用

因为项目中有用到状态机，而自己并不是特别的了解，就是熟悉下状态机的应用和实用第三方javascript-state-machine v3版本
环境：Cocos Creator 2.1.1
第三方状态机的库：<https://github.com/KylePeace/javascript-state-machine/tree/v3>

## 一 有限状态机

有限状态机（英语：finite-state machine，缩写：FSM）又称有限状态自动机，简称状态机，是表示有限个状态以及在这些状态之 间的转移和动作等行为的数学模型。

以上为百度百科中的定义，我认为最简单状态机其实就是switch...case

```JavaScript
    switch(state):{
        case "attack":
            xxx
            break
        case "run"   :
            xxx
            break
        case "idle"  :
            xxx
            break
    }
```

但是随着项目变得复杂，switch...case已不能满足，所以要使用状态机使项目更加的清晰，只关心当前状态的开或者关闭

## 二 状态转移表

每个状态机都应有一个状态转移表，使其更加的清晰。具体来说就是，某个状态通过什么条件可以转移到某一个状态，项目的例子中我使用了两个状态机，相互嵌套。

以下就是两个状态转移表

表1 总的状态转移表

|状态    |玩家状态    |敌人状态    |
|-------|------      |---        |
|玩家状态|  x        | 玩家攻击结束|  
|敌人状态|敌人攻击结束|     x      |

表2 玩家状态转移表

|状态    |攻击状态|待机状态|移动状态|
|-------|------  |---     |----   |
|攻击状态|  x     | 攻击结束|  攻击结束|
|待机状态|点击攻击按钮|x|点击移动按钮|
|移动状态|点击攻击按钮|x|x|



$
主状态机main=
\begin{cases}
 \text{player}\\
 \text{enemy}
\end{cases}
$




$
子状态机player=
\begin{cases}
 \text{攻击attack}\\
 \text{待机idle}\\
 \text{移动run}
\end{cases}
$

流程图:

```mermaid
    graph TB
    id1(开始)-->id2[main]
    id2--初始状态为player状态-->id3[player]
    id3-->id4[是否攻击]
    id4 --攻击,切换为enemy-->id2
    id3-->run
    id3-->idle
    run-->id3
    idle-->id3
    id2-->enemy
    enemy-->id6[攻击]
    id6--切换为player状态-->id2
```

## 三  使用第三方状态机库

    本文实用的是javascript-state-machine v3版本

##### 1.下载这个库文件，在Cocos Creator中设置为插件脚本,就可以直接实用不需要再require

                           图1 导入为插件脚本
![scriptplug](./image/scriptplug.png)

##### 2. 创建状态机

直接new StateMachine

```javascript
    let turnFsm  = new StateMachine({
        init:"player",//初始状态
        data: {"manager":manager},
        transitions: [
            {name: 'init',from: "none",to: 'player'},
            {name: 'toPlayer',from: ["enemy","none"],to: 'player'},
            {name: 'toEnemy',from: "player",to: 'enemy'},
        ],
        methods:{
            onInit(){
                console.log("turnFsm init")
                fsm.init()
            },
            onToPlayer(){
                console.log("turnFsm toPlayer")
            },
            onToEnemy(){
                turnFsm.manager.enemyAttack()
            },
            onLeaveState(){
                //离开状态调用
            },
            onEnterState(){
                //进入状态调用
            },
            onLeaveToPlayer(){
                //离开player状态调用
            }
        }
})
```

###### 参数含义

    init:初始状态(可选)
    data:需要传入的数据(可选)
    transitions:转移
        e.g:从"node"到"player"状态的名字是"init"
    methods:方法 这些方法中写一些你需要处理，使结构清晰透明
        每一转移都有一个方法对应，on开头，比如init=>onInit
        methods:还有一些生命周期的方法，可查阅使用
            onLeaveState:离开状态调用
            onEnterState:进入状态调用
            ...
            还可以对特定的状态调用
            onLeaveToPlayer:离开player状态调用
            onEnterToPlayer:进入player状态调用
            ...
            method的第一个参数lifecycle对象,后面是参数
            onFun(lifecycle,args)
            onToPlayer(lifecycle,args)

    fsm中包含很多其他方法：
        fsm.is(s)//判断传入状态是否是当前状态
        fsm.can(t)///判断传入状态可从当前状态转变
        ...

###### 状态机的使用

```javascript
        turnFsm.toPlayer()
        turnFsm.state  //状态是'player'
        turnFsm.toEnemy()
        turnFsm.state  //状态是'enemy'
```

    使用很简单，调用turnFsm中的方法转换，具体的操作可以看我的demo
    https://github.com/KylePeace/CCCPractise/tree/master/fsm