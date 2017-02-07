# 利用jQuery开发一个todo小应用   
   
## 技术点
- HTML5 & CSS3
- jQuery
- jQuery插件jQuery-datetimepicker
- indexdb实现使用store.js库
- 样式重置使用normalize.css
    
## 功能点
- 待办事项的增加，删除和修改
- 待办事项详情的查看
- 待办事项提醒时间的设置
- 提醒时间到的时候，会弹出提醒框，并响铃提醒（响铃这里用了五月天的一首歌哈哈哈）
- 自定义实现了一个alert弹出框
   
## 浏览器的支持情况
支持在safari, firefox和chrome下显示(pc)。    
其它的还没有测试过，不过应该也没差啦。    
  
## 使用情况
一开始打开的时候，从indexdb里面取出数据，在我的chrome里打开大概是这样:    
![概览](http://7xl4oh.com1.z0.glb.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-02-07%20%E4%B8%8B%E5%8D%883.13.43.png)    
    
点击详情，可以看到具体的内容，并且可以修改，日期这一栏使用了jQuery的datetimepicker插件，可以选择比较精确的时间：    
![详情测试](http://7xl4oh.com1.z0.glb.clouddn.com/%E8%AF%A6%E6%83%85%E6%B5%8B%E8%AF%95.png)
    
点击删除，会提示你是不是真的要删除，这里自定义了一个alert:    
![删除测试](http://7xl4oh.com1.z0.glb.clouddn.com/%E5%88%A0%E9%99%A4%E7%95%8C%E9%9D%A2.png)   
等到你设定的时间到的时候，设定的背景音乐会响起，同时弹出一个蓝色的弹框提醒你要记得这个事情:    
![提醒](http://7xl4oh.com1.z0.glb.clouddn.com/%E6%8F%90%E9%86%92%E6%B5%8B%E8%AF%95.png)   
点击"知道了"，音乐停止，弹框消失。    
   
## 自己玩一下
克隆项目到本地:    
   
```
git clone https://github.com/maruko0713/TODO_APPLICATION.git todo_application
```

进入项目:    
   
```
cd todo_application
```

安装依赖：   
   
```js
npm install
```

然后就可以在地址栏里输入index文件地址访问了。    
    
## 知识点扫盲
这一个demo从头到尾都是jQuery，也是为了能够更熟悉jQuery的每个点。   
当然仍旧没有能够完全覆盖。。。不过也算找到了自己不太熟悉的一块。   
就是在自定义alert的时候，用到了***deffered***对象。   
它是从jQuery 1.5.0版本开始引入的一个新功能，deferred对象就是jQuery的回调函数解决方案。在英语中，defer的意思是"延迟"，所以deferred对象的含义就是"延迟"到未来某个点再执行。   
这个让我想到了node里面的promise,嗯。。。我还是写篇博客吧。（挖坑）。    
    


