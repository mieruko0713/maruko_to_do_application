;(function(){
    'use strict';
    
    //alert(1);
    var $form_add_task = $(".add-task")
       ,$delete_task
       ,$detail_task
       ,new_task = {}
       ,task_list = []
       ,$task_detail = $(".task-detail")
       ,$task_detail_mask = $(".task-detail-mask")
       ,$update_form
       ,$checkbox_complete
       ,$msg = $(".msg")
       ,$msg_content = $(".msg-content")
       ,$msg_confirm = $msg.find("button")
       ,$alerter = $(".alerter")
       ;
    
    //console.log($update_form);
    
    // 初始化状态
    init();

    // 为添加一条新todo的按钮绑定一个task
    $form_add_task.on("submit",on_add_task_form_submit);
    // 为遮罩层添加一个点击后隐藏的事件
    $task_detail_mask.on("click", hide_task_detail);
    
    function listen_msg_event() {
      $msg_confirm.on("click", function() {
        hide_msg();
      });
    }
    
    // 提交时添加
    function on_add_task_form_submit(e) {
      // 禁用默认行为
      e.preventDefault();
      // 获取新task的值
      new_task.content = $(this).find('input[name=content]').val();
      // 如果新task值为空 直接返回 否则继续执行
      if(!new_task.content) return;
      if(add_task(new_task)) {
        render_task_list();
      }
      // 存入新task
      console.log("new_task",new_task);
    }

    // 初始化
    function init() {
      listen_msg_event();
      task_list = store.get("task_list") || [];
      if(task_list.length){
        render_task_list();
        task_remind_check();
      }
    }

    function task_remind_check() {
      var current_timestamp;
      var itl = setInterval(function(){
          for(var i=0;i<task_list.length;i++) {
          var item = task_list[i], task_timestamp;
          if(!item || !item.remind_date || item.informed) {
            continue;
          } else {
            current_timestamp = (new Date()).getTime();
            task_timestamp = (new Date(item.remind_date)).getTime();
            if(current_timestamp - task_timestamp >= 1) {
              update_task(i, {informed: true});
              notify(item.content);
            }
          }
        }  
      },300);
    }
    
    function notify(content) {
      if(!content) return;
      $msg_content.html(content);
      $alerter.get(0).play();
      $msg.show();
    }

    function hide_msg() {
      $alerter.get(0)
      $(".msg").hide();
    }


    // 添加任务
    function add_task(new_task) {
    	task_list.push(new_task);
    	//  更新localStorage
    	refresh_task_list();
    	return true;
    }
    
    // 刷新localStorage并更新view
    function refresh_task_list() {
      store.set("task_list", task_list);
      render_task_list();
    }
    
    // 删除任务
    function delete_task(index) {
      // 如果没有index或者index不存在
      if(index === undefined || !task_list[index]) return; 

      delete task_list[index];

      // 更新localStorage
      refresh_task_list();
    }
    
    // 渲染全部模版
    function render_task_list() {
    	var $task_list = $(".task-list");
    	$task_list.html("");
      var complete_items = [];
    	for(var i = 0; i < task_list.length; i++) {
    		if(task_list[i]&&task_list[i].complete) {
          complete_items[i] = task_list[i];
        } else {
          var $task = render_task_tpl(task_list[i], i);
          $task_list.prepend($task);
        }
    	}

      for(var j=0; j<complete_items.length; j++) {
        $task = render_task_tpl(complete_items[j], j);
        if(!$task) continue;
        $task.addClass("complete");
        $task_list.append($task);
      }

    
      $delete_task = $(".action.delete");
      $detail_task = $(".action.detail");
      $checkbox_complete = $(".task-list .complete");
      listen_task_delete();
      listen_task_detail();
      listen_task_complete();
    }

    // 监听打开task详情的页面
    function listen_task_detail() {
        var index;
        $(".task-item").on("dblclick",function() {
          index = $(this).data("index");
          show_task_detail(index);
        });
        $detail_task.on("click", function(){
          var $this = $(this);
          var $item = $this.parent().parent();
          var index = $item.data("index");
          show_task_detail(index);
          $update_form = $task_detail.find("form");
        });
    }


    // 监听删除task的事件
    function listen_task_delete() {
      $delete_task.on("click", function(){
        var $this = $(this);
        var $item = $this.parent().parent();
        var tmp = confirm("确定删除?"); 
        tmp ? delete_task($item.data("index")) : null;
      });
    }

    // 监听事物完成的事件
    function listen_task_complete() {
      $checkbox_complete.on("click", function() {
        var $this = $(this);
        var is_complete = $(this).is(":checked");
        console.log(is_complete);
        var index = $this.parent().parent().data("index");
        var item = store.get("task_list")[index];
        update_task(index, {complete: is_complete});
      });
    }

    // 查看Task详情
    function show_task_detail(index) {
      // 生成详情模版
      render_task_detail(index);
      // 显示详情模版(默认隐藏)
      $task_detail.show();
      // 显示详情模版mask(默认隐藏)
      $task_detail_mask.show();
    }

    
    // 更新task
    function update_task(index, data) {
      if(!index || !task_list[index]) return;
      task_list[index] = $.extend({}, task_list[index], data);
      refresh_task_list();
      hide_task_detail();
    }
    
    // 渲染指定task的详细信息
    function render_task_detail(index) {
      var item = task_list[index];
      var tpl = '<form>' + 
      '<input name="content" value="' +
      item.content +
      '"><!-- 任务标题 -->' + 
      '<div><!-- 任务描述 -->' + 
      '<div class="desc">' + 
      '<textarea name="desc">' + (item.desc || "") + '</textarea>' +
      '</div>' + 
      '</div><!-- 任务详情结束 -->' + 
      '<div class="remind input-item"><!-- 定时提醒 -->' + 
      '<label>提醒时间</label>' +
      '<input class="datetime" type="text" name="remind_date" value="' + (item.remind_date || "")+ 
      '"><button type="submit">更新</button>' + 
      '</div>' + 
      '</form>';

      // 用新模版替换旧模版
      $task_detail.html(null);
      $task_detail.html(tpl);
      $(".datetime").datetimepicker();
      $update_form = $task_detail.find("form");
      $update_form.on("submit", function(e) {
        e.preventDefault();
        var d = {};
        // 获取新的数据
        d.content = $(this).find("[name=content]").val();
        d.desc = $(this).find("[name=desc]").val();
        d.remind_date = $(this).find("[name=remind_date]").val();
        // 把新的数据用于更新
        update_task(index, d);
      });
    }


    // 隐藏task
    function hide_task_detail() {
      $task_detail.hide();
      $task_detail_mask.hide();
    }
    
    // 生成模版
    function render_task_tpl(data, index) {
      if( !data || !index) return;
    	var list_item_tpl = 
      '<div class="task-item" data-index="' + index +
      '"><span><input class="complete"' + (data.complete ? "checked" : "") +' type="checkbox"></span>' +
      '<span class="task-content">' + data.content + '</span>' + 
      '<span class="fr">' + 
          '<span class="action delete">删除</span> ' + 
          '<span class="action detail">详细</span>' + 
      '</span>' +
      '</div>';

      return $(list_item_tpl);
    }
})();